from rest_framework import generics, status, permissions, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Course, Material, Enrollment, Category
from .serializers import (CourseSerializer, CourseCreateSerializer,
                           MaterialSerializer, EnrollmentSerializer, CategorySerializer)
from users.permissions import IsAdmin, IsTutor, IsEstudiante

# --- CATEGORIES ---
class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsAdmin()]

# --- COURSES (public) ---
class PublicCourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Course.objects.filter(estado='publicado')
        q = self.request.query_params.get('q')
        categoria = self.request.query_params.get('categoria')
        nivel = self.request.query_params.get('nivel')
        if q:
            qs = qs.filter(Q(titulo__icontains=q) | Q(descripcion__icontains=q))
        if categoria:
            qs = qs.filter(categorias__id=categoria)
        if nivel:
            qs = qs.filter(nivel=nivel)
        return qs.distinct()

class PublicCourseDetailView(generics.RetrieveAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Course.objects.filter(estado='publicado')

# --- COURSES (tutor) ---
class TutorCourseListView(generics.ListCreateAPIView):
    permission_classes = [IsTutor]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateSerializer
        return CourseSerializer

    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)

class TutorCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsTutor]

    def get_serializer_class(self):
        if self.request.method in ['PUT','PATCH']:
            return CourseCreateSerializer
        return CourseSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Course.objects.all()
        return Course.objects.filter(tutor=user)

class PublishCourseView(APIView):
    permission_classes = [IsTutor]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, tutor=request.user)
        except Course.DoesNotExist:
            return Response({'error': 'Curso no encontrado.'}, status=404)
        if course.estado not in ['borrador', 'rechazado']:
            return Response({'error': f'No se puede publicar un curso en estado: {course.estado}'}, status=400)
        course.estado = 'pendiente'
        course.save()
        return Response({'message': 'Curso enviado para aprobación.', 'estado': course.estado})

# --- COURSES (admin) ---
class AdminCourseListView(generics.ListCreateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = Course.objects.all()
        estado = self.request.query_params.get('estado')
        if estado:
            qs = qs.filter(estado=estado)
        return qs

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateSerializer
        return CourseSerializer

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user, estado='publicado')

class ApproveCourseView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Curso no encontrado.'}, status=404)
        action = request.data.get('action')  # 'aprobar' o 'rechazar'
        if action == 'aprobar':
            course.estado = 'publicado'
            course.aprobado_por = request.user
            course.fecha_aprobacion = timezone.now()
            course.save()
            return Response({'message': 'Curso aprobado y publicado.', 'estado': course.estado})
        elif action == 'rechazar':
            course.estado = 'rechazado'
            course.save()
            return Response({'message': 'Curso rechazado.', 'estado': course.estado})
        return Response({'error': 'Acción inválida. Use "aprobar" o "rechazar".'}, status=400)

class AdminCourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdmin]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

# --- MATERIALS ---
class MaterialListView(generics.ListCreateAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [IsTutor]

    def get_queryset(self):
        return Material.objects.filter(curso__id=self.kwargs['course_pk'])

    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'])
        serializer.save(curso=course)

class MaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MaterialSerializer
    permission_classes = [IsTutor]

    def get_queryset(self):
        return Material.objects.filter(curso__id=self.kwargs['course_pk'])

# --- ENROLLMENTS ---
class EnrollView(APIView):
    permission_classes = [IsEstudiante]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk, estado='publicado')
        except Course.DoesNotExist:
            return Response({'error': 'Curso no disponible.'}, status=404)
        if Enrollment.objects.filter(estudiante=request.user, curso=course).exists():
            return Response({'error': 'Ya estás inscrito en este curso.'}, status=400)
        enrollment = Enrollment.objects.create(estudiante=request.user, curso=course)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

class MyEnrollmentsView(generics.ListAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsEstudiante]

    def get_queryset(self):
        return Enrollment.objects.filter(estudiante=self.request.user).select_related('curso')

class StudentCourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsEstudiante]

    def get_queryset(self):
        enrolled_ids = Enrollment.objects.filter(
            estudiante=self.request.user, estado='activo').values_list('curso_id', flat=True)
        qs = Course.objects.filter(id__in=enrolled_ids)
        q = self.request.query_params.get('q')
        nivel = self.request.query_params.get('nivel')
        categoria = self.request.query_params.get('categoria')
        if q:
            qs = qs.filter(Q(titulo__icontains=q) | Q(descripcion__icontains=q))
        if nivel:
            qs = qs.filter(nivel=nivel)
        if categoria:
            qs = qs.filter(categorias__id=categoria)
        return qs.distinct()
