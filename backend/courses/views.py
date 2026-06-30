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
from .pagination import CourseCatalogPagination
from .permissions import IsCourseOwner, IsTutor
from .serializers import (
    CategorySerializer,
    CourseEditSerializer,
    PublicCourseSerializer,
    TutorCourseCreateSerializer,
)


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
        min_dur = self.request.query_params.get('min_duration', None)
        max_dur = self.request.query_params.get('max_duration', None)
        if min_dur and min_dur.isdigit():
            queryset = queryset.filter(duration_minutes__gte=int(min_dur))
        if max_dur and max_dur.isdigit():
            queryset = queryset.filter(duration_minutes__lte=int(max_dur))
		
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
        course = get_object_or_404(Course, pk=pk, tutor=request.user)
        editable_statuses = [Course.Status.DRAFT, Course.Status.REJECTED]

        if course.status not in editable_statuses:
            return Response(
                {
                    "detail": "Solo puedes editar cursos en estado 'borrador' o 'rechazado'."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        course.title = request.data.get("title", course.title)
        course.description = request.data.get("description", course.description)
        if request.data.get("category"):
            course.category_id = request.data.get("category")
        course.duration = request.data.get("duration", course.duration)
        course.level = request.data.get("level", course.level)
        course.objectives = request.data.get("objectives", course.objectives)
        course.preview_video = request.data.get("preview_video", course.preview_video)
        course.language = request.data.get("language", course.language)
        course.initial_content = request.data.get("initial_content", course.initial_content)
        course.status = request.data.get("status", course.status)
        course.save()

        sections_data = request.data.get("sections_meta", [])

        for sec_idx, sec_data in enumerate(sections_data):
            section, _ = CourseSection.objects.get_or_create(
                course=course,
                name=sec_data.get("name", f"Sección {sec_idx+1}"),
                defaults={"order": sec_idx},
            )

            for idx, content_data in enumerate(sec_data.get("contents", [])):
                SectionContent.objects.get_or_create(
                    section=section,
                    type=content_data.get("type"),
                    label=content_data.get("label"),
                    defaults={"order": idx},
                )

        return Response(
            {
                "message": "Curso actualizado exitosamente.",
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