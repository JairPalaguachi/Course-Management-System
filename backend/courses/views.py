import os
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Course, CourseSection, SectionContent
from enrollments.models import Enrollment
from .pagination import CourseCatalogPagination
from .permissions import IsCourseOwner, IsTutor, IsAdmin
from .serializers import (
    CategorySerializer,
    CourseEditSerializer,
    PublicCourseSerializer,
    TutorCourseCreateSerializer,
    AdminCourseEditSerializer,
)
from users.permissions import IsStaffUser

class PublicCourseListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PublicCourseSerializer
    pagination_class = CourseCatalogPagination

    def get_queryset(self):
        queryset = (
            Course.objects.filter(status=Course.Status.PUBLISHED)
            .select_related('category', 'tutor')
            .order_by('-published_at', '-created_at')
        )
		
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
		
        # filter by category name or id
        category = self.request.query_params.get('category', None)
        if category:
            if category.isdigit():
                queryset = queryset.filter(category__id=int(category))
            else:
                queryset = queryset.filter(category__name__iexact=category)
		
        # filter by level
        level = self.request.query_params.get('level', None)
        if level:
            queryset = queryset.filter(level__iexact=level)
		
        # filter by duration range (minutes)
        # filter by duration range (hours)
        min_dur = self.request.query_params.get('min_duration', None)
        max_dur = self.request.query_params.get('max_duration', None)

        if min_dur and min_dur.isdigit():
            queryset = queryset.filter(duration__gte=int(min_dur))

        if max_dur and max_dur.isdigit():
            queryset = queryset.filter(duration__lte=int(max_dur))
            
        return queryset



class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class TutorCourseCreateView(APIView):
    permission_classes = [IsAuthenticated, IsTutor]

    def post(self, request):
        serializer = TutorCourseCreateSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        course = serializer.save()

        return Response(
            {
                "message": "Curso creado exitosamente como borrador.",
                "course": {
                    "id": course.id,
                    "status": course.status,
                    "sections": [
                        {
                            "id": sec.id,
                            "name": sec.name,
                            "contents": [
                                {"id": c.id, "type": c.type, "label": c.label}
                                for c in sec.contents.all()
                            ],
                        }
                        for sec in course.sections.prefetch_related("contents").all()
                    ],
                },
            },
            status=status.HTTP_201_CREATED,
        )


class SectionContentUploadView(APIView):
    """
    POST /api/tutor/contents/<content_id>/upload/

    Sube o reemplaza el archivo de un SectionContent.
    Solo el tutor dueño del curso puede operar sobre sus propios contenidos.
    """

    permission_classes = [IsAuthenticated, IsTutor]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, content_id):
        content = get_object_or_404(
            SectionContent,
            id=content_id,
            section__course__tutor=request.user,
        )

        if "file" not in request.FILES:
            return Response(
                {"error": "No se ha proporcionado ningún archivo bajo la clave 'file'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        content.file = request.FILES["file"]
        content.save()

        return Response(
            {
                "message": "Archivo subido exitosamente.",
                "content_id": content.id,
                "file_url": request.build_absolute_uri(content.file.url) if content.file else None,
            },
            status=status.HTTP_200_OK,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_course_cover(request, pk):
    try:
        course = Course.objects.get(pk=pk, tutor=request.user)
    except Course.DoesNotExist:
        return Response({"error": "Curso no encontrado"}, status=404)

    if "cover" not in request.FILES:
        return Response({"error": "No se envió ninguna imagen"}, status=400)

    course.cover_image = request.FILES["cover"]
    course.save()

    return Response(
        {
            "message": "Portada subida exitosamente",
            "cover_url": course.cover_image.url,
        }
    )


class TutorCourseDetailView(APIView):
    """
    Garantiza lectura (GET) detallada con metadatos completos y actualización (PUT)
    manual de la estructura interna del curso (Secciones y Contenidos).
    """

    permission_classes = [IsAuthenticated, IsTutor]

    def get(self, request, pk):
        course = get_object_or_404(Course, pk=pk, tutor=request.user)
        return Response(
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "status": course.status,
                "category": course.category_id,
                "category_name": course.category.name if course.category else None,
                "duration": course.duration,
                "level": course.level,
                "objectives": course.objectives,
                "preview_video": course.preview_video,
                "language": course.language,
                "created_at": course.created_at,
                "published_at": course.published_at,
                "rejection_reason": course.rejection_reason,
                "cover_image": (
                    request.build_absolute_uri(course.cover_image.url)
                    if course.cover_image
                    else None
                ),
                "sections": [
                    {
                        "id": section.id,
                        "name": section.name,
                        "contents": [
                            {
                                "id": content.id,
                                "type": content.type,
                                "label": content.label,
                                "file_url": (
                                    request.build_absolute_uri(content.file.url)
                                    if content.file
                                    else None
                                ),
                            }
                            for content in section.contents.all()
                        ],
                    }
                    for section in course.sections.prefetch_related("contents").all()
                ],
            }
        )

    def put(self, request, pk):
        course = get_object_or_404(
            Course,
            pk=pk,
            tutor=request.user
        )

        editable_statuses = [
            Course.Status.DRAFT,
            Course.Status.REJECTED,
        ]

        if course.status not in editable_statuses:
            return Response(
                {
                    "detail": (
                        "Solo puedes editar cursos en estado "
                        "'borrador' o 'rechazado'."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():

            # ─────────────────────────────────────────────
            # 1. Actualizar información principal del curso
            # ─────────────────────────────────────────────

            course.title = request.data.get(
                "title",
                course.title
            )

            course.description = request.data.get(
                "description",
                course.description
            )

            if request.data.get("category"):
                course.category_id = request.data.get("category")

            course.duration = request.data.get(
                "duration",
                course.duration
            )

            course.level = request.data.get(
                "level",
                course.level
            )

            course.objectives = request.data.get(
                "objectives",
                course.objectives
            )

            course.preview_video = request.data.get(
                "preview_video",
                course.preview_video
            )

            course.language = request.data.get(
                "language",
                course.language
            )

            course.initial_content = request.data.get(
                "initial_content",
                course.initial_content
            )

            course.status = request.data.get(
                "status",
                course.status
            )

            course.save()

            # ─────────────────────────────────────────────
            # 2. Sincronizar secciones y contenidos
            # ─────────────────────────────────────────────

            sections_data = request.data.get(
                "sections_meta",
                []
            )

            # IDs de secciones que siguen existiendo
            incoming_section_ids = []

            for sec_idx, sec_data in enumerate(sections_data):

                section_id = sec_data.get("id")

                # -----------------------------------------
                # Sección existente
                # -----------------------------------------

                if section_id:
                    try:
                        section = CourseSection.objects.get(
                            id=section_id,
                            course=course,
                        )

                        section.name = sec_data.get(
                            "name",
                            section.name
                        )

                        section.order = sec_idx
                        section.save(
                            update_fields=[
                                "name",
                                "order",
                            ]
                        )

                    except CourseSection.DoesNotExist:
                        section = CourseSection.objects.create(
                            course=course,
                            name=sec_data.get(
                                "name",
                                f"Sección {sec_idx + 1}"
                            ),
                            order=sec_idx,
                        )

                # -----------------------------------------
                # Sección nueva
                # -----------------------------------------

                else:
                    section = CourseSection.objects.create(
                        course=course,
                        name=sec_data.get(
                            "name",
                            f"Sección {sec_idx + 1}"
                        ),
                        order=sec_idx,
                    )

                incoming_section_ids.append(section.id)

                # ─────────────────────────────────────────
                # 3. Sincronizar contenidos de la sección
                # ─────────────────────────────────────────

                contents_data = sec_data.get(
                    "contents",
                    []
                )

                incoming_content_ids = []

                for content_idx, content_data in enumerate(
                    contents_data
                ):

                    content_id = content_data.get("id")

                    # -------------------------------------
                    # Contenido existente
                    # -------------------------------------

                    if content_id:
                        try:
                            content = SectionContent.objects.get(
                                id=content_id,
                                section=section,
                            )

                            content.type = content_data.get(
                                "type",
                                content.type
                            )

                            content.label = content_data.get(
                                "label",
                                content.label
                            )

                            content.body = content_data.get(
                                "body",
                                content.body
                            )

                            content.order = content_idx

                            content.save(
                                update_fields=[
                                    "type",
                                    "label",
                                    "body",
                                    "order",
                                ]
                            )

                        except SectionContent.DoesNotExist:
                            content = SectionContent.objects.create(
                                section=section,
                                type=content_data.get(
                                    "type",
                                    SectionContent.ContentType.TEXT,
                                ),
                                label=content_data.get(
                                    "label",
                                    "Contenido",
                                ),
                                body=content_data.get(
                                    "body",
                                    "",
                                ),
                                order=content_idx,
                            )

                    # -------------------------------------
                    # Contenido nuevo
                    # -------------------------------------

                    else:
                        content = SectionContent.objects.create(
                            section=section,
                            type=content_data.get(
                                "type",
                                SectionContent.ContentType.TEXT,
                            ),
                            label=content_data.get(
                                "label",
                                "Contenido",
                            ),
                            body=content_data.get(
                                "body",
                                "",
                            ),
                            order=content_idx,
                        )

                    incoming_content_ids.append(content.id)

                # -----------------------------------------
                # Eliminar contenidos que el tutor quitó
                # -----------------------------------------

                SectionContent.objects.filter(
                    section=section
                ).exclude(
                    id__in=incoming_content_ids
                ).delete()

            # ─────────────────────────────────────────────
            # 4. Eliminar secciones que el tutor quitó
            # ─────────────────────────────────────────────

            CourseSection.objects.filter(
                course=course
            ).exclude(
                id__in=incoming_section_ids
            ).delete()

        # ─────────────────────────────────────────────────
        # 5. Devolver el curso actualizado
        # ─────────────────────────────────────────────────

        course.refresh_from_db()

        return Response(
            {
                "message": "Curso actualizado exitosamente.",
                "course": {
                    "id": course.id,
                    "status": course.status,
                    "cover_image": (
                        request.build_absolute_uri(
                            course.cover_image.url
                        )
                        if course.cover_image
                        else None
                    ),
                    "sections": [
                        {
                            "id": section.id,
                            "name": section.name,
                            "contents": [
                                {
                                    "id": content.id,
                                    "type": content.type,
                                    "label": content.label,
                                    "body": content.body,
                                    "file_url": (
                                        request.build_absolute_uri(
                                            content.file.url
                                        )
                                        if content.file
                                        else None
                                    ),
                                }
                                for content in section.contents.all()
                            ],
                        }
                        for section in course.sections.prefetch_related(
                            "contents"
                        ).all()
                    ],
                },
            },
            status=status.HTTP_200_OK,
        )

class StudentCourseDetailView(APIView):
    """
    GET /api/student/courses/<id>/

    Permite a un estudiante autenticado ver la estructura
    de un curso publicado, activo y en el que está inscrito.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # 1. Verificar que el usuario sea estudiante
        if request.user.role != "student":
            return Response(
                {"detail": "Solo los estudiantes pueden acceder a los cursos."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 2. Buscar únicamente cursos publicados y activos
        course = get_object_or_404(
            Course.objects.select_related("category", "tutor"),
            pk=pk,
            status=Course.Status.PUBLISHED,
            is_active=True,
        )

        # 3. Verificar que el estudiante esté inscrito en este curso
        enrollment_exists = Enrollment.objects.filter(
            student=request.user,
            course=course,
        ).exists()

        if not enrollment_exists:
            return Response(
                {"detail": "No estás inscrito en este curso."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 4. Devolver la estructura del curso
        return Response(
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "duration": course.duration,
                "level": course.level,
                "language": course.language,
                "objectives": course.objectives,
                "cover_image": (
                    request.build_absolute_uri(course.cover_image.url)
                    if course.cover_image
                    else None
                ),
                "sections": [
                    {
                        "id": section.id,
                        "name": section.name,
                        "order": section.order,
                        "contents": [
                            {
                                "id": content.id,
                                "type": content.type,
                                "label": content.label,
                                "order": content.order,
                                "file_url": (
                                    request.build_absolute_uri(content.file.url)
                                    if content.file
                                    else None
                                ),
                                "file_name": (
                                    os.path.basename(content.file.name)
                                    if content.file
                                    else None
                                ),
                                "body": content.body,
                            }
                            for content in section.contents.all()
                        ],
                    }
                    for section in course.sections.prefetch_related(
                        "contents"
                    ).all()
                ],
            },
            status=status.HTTP_200_OK,
        )

class TutorCoursesListView(APIView):
    permission_classes = [IsAuthenticated, IsTutor]

    def get(self, request):
        courses = Course.objects.filter(tutor=request.user).order_by("-created_at")
        return Response(
            [
                {
                    "id": course.id,
                    "title": course.title,
                    "description": course.description,
                    "status": course.status,
                    "category": course.category.name if course.category else None,
                    "created_at": course.created_at,
                    "cover_image": (
                        request.build_absolute_uri(course.cover_image.url)
                        if course.cover_image
                        else None
                    ),
                }
                for course in courses
            ]
        )


class TutorCourseUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/tutor/courses/{id}/  → precarga datos del curso usando serializadores estables
    PUT   /api/tutor/courses/{id}/  → edición completa
    PATCH /api/tutor/courses/{id}/  → edición parcial
    """

    serializer_class = CourseEditSerializer
    permission_classes = [IsAuthenticated, IsTutor, IsCourseOwner]

    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user)


class RequestCoursePublicationView(APIView):
    """
    POST /api/tutor/courses/{id}/publish/
    Cambia el estado del curso a 'PENDING_APPROVAL' tras validar los campos mandatorios.
    """

    permission_classes = [IsAuthenticated, IsTutor]

    def _get_missing_minimum_fields(self, course):
        missing_fields = []
        if not course.title or not course.title.strip():
            missing_fields.append("title")
        if not course.description or not course.description.strip():
            missing_fields.append("description")
        if not course.category_id:
            missing_fields.append("category")
        return missing_fields

    def post(self, request, pk):
        with transaction.atomic():
            course = get_object_or_404(
                Course.objects.select_for_update(),
                pk=pk,
                tutor=request.user,
            )
            missing_fields = self._get_missing_minimum_fields(course)

            if missing_fields:
                return Response(
                    {
                        "detail": "El curso no tiene la información mínima completa para solicitar publicación.",
                        "missing_fields": missing_fields,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if course.status == Course.Status.PUBLISHED:
                return Response(
                    {"detail": "El curso ya está publicado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if course.status == Course.Status.PENDING_APPROVAL:
                return Response(
                    {"detail": "El curso ya tiene una solicitud de publicación pendiente."},
                    status=status.HTTP_409_CONFLICT,
                )

            course.status = Course.Status.PENDING_APPROVAL
            course.rejection_reason = ""
            course.save(update_fields=["status", "rejection_reason", "updated_at"])

        return Response(
            {
                "detail": "Solicitud de publicación enviada correctamente.",
                "course": {
                    "id": course.id,
                    "status": course.status,
                },
            },
            status=status.HTTP_200_OK,
        )
    
class AdminCourseUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET    /api/admin/courses/{id}/
    PUT    /api/admin/courses/{id}/
    PATCH  /api/admin/courses/{id}/

    El admin solo puede ver/editar cursos en revisión o ya publicados.
    Los borradores son responsabilidad exclusiva del tutor.
    """

    serializer_class = AdminCourseEditSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

    queryset = Course.objects.filter(
        status__in=[Course.Status.PENDING_APPROVAL, Course.Status.PUBLISHED]
    )


class AdminCourseListView(generics.ListAPIView):
    """
    GET /api/admin/courses/
    Lista solo cursos pendientes o publicados.
    """
    serializer_class = AdminCourseEditSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    queryset = Course.objects.filter(
        status__in=[Course.Status.PENDING_APPROVAL, Course.Status.PUBLISHED]
    ).order_by('-updated_at')
    

class AdminCourseApproveView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        with transaction.atomic():
            course = get_object_or_404(
                Course.objects.select_for_update(),
                pk=pk,
            )

            if course.status != Course.Status.PENDING_APPROVAL:
                return Response(
                    {
                        "detail": "Solo se pueden aprobar cursos pendientes de aprobación."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            course.status = Course.Status.PUBLISHED
            course.save(update_fields=["status", "published_at", "updated_at"])

        return Response(
            {
                "detail": "Curso aprobado correctamente.",
                "course": {
                    "id": course.id,
                    "status": course.status,
                },
            },
            status=status.HTTP_200_OK,
        )


class AdminCourseRejectView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        with transaction.atomic():
            course = get_object_or_404(
                Course.objects.select_for_update(),
                pk=pk,
            )

            if course.status != Course.Status.PENDING_APPROVAL:
                return Response(
                    {
                        "detail": "Solo se pueden rechazar cursos pendientes de aprobación."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            course.status = Course.Status.REJECTED
            course.rejection_reason = request.data.get(
                "rejection_reason",
                "Curso rechazado por el administrador.",
            )
            course.save(
                update_fields=[
                    "status",
                    "rejection_reason",
                    "updated_at",
                ]
            )

        return Response(
            {
                "detail": "Curso rechazado correctamente.",
                "course": {
                    "id": course.id,
                    "status": course.status,
                },
            },
            status=status.HTTP_200_OK,
        )

class AdminSectionContentUploadView(APIView):
    """
    POST /api/admin/contents/<content_id>/upload/
    El admin puede subir/reemplazar el archivo de cualquier contenido.
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, content_id):
        content = get_object_or_404(SectionContent, id=content_id)

        if "file" not in request.FILES:
            return Response(
                {"error": "No se ha proporcionado ningún archivo bajo la clave 'file'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        content.file = request.FILES["file"]
        content.save()

        return Response(
            {
                "message": "Archivo subido exitosamente.",
                "content_id": content.id,
                "file_url": request.build_absolute_uri(content.file.url) if content.file else None,
            },
            status=status.HTTP_200_OK,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def admin_upload_course_cover(request, pk):
    course = get_object_or_404(Course, pk=pk)

    if "cover" not in request.FILES:
        return Response({"error": "No se envió ninguna imagen"}, status=400)

    course.cover_image = request.FILES["cover"]
    course.save()

    return Response({
        "message": "Portada subida exitosamente",
        "cover_url": request.build_absolute_uri(course.cover_image.url),
    })

class AdminCategoryListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/admin/categories/  → listar todas las categorías
    POST /api/admin/categories/  → crear una categoría nueva
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Category.objects.all().order_by('name')


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/admin/categories/{id}/
    PUT    /api/admin/categories/{id}/
    PATCH  /api/admin/categories/{id}/
    DELETE /api/admin/categories/{id}/
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsStaffUser]
    queryset = Category.objects.all()