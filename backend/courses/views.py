from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Course
from .serializers import CourseEditSerializer
from .permissions import IsTutor, IsCourseOwner


class TutorCourseUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET   /api/tutor/courses/{id}/  → precarga datos del curso en el formulario
    PUT   /api/tutor/courses/{id}/  → edición completa
    PATCH /api/tutor/courses/{id}/  → edición parcial

    Reglas:
    - Solo tutores autenticados.
    - Solo el tutor dueño del curso puede editarlo (cursos ajenos devuelven 404).
    - Solo se puede editar si el curso está en 'draft' o 'rejected'.
    """

    serializer_class = CourseEditSerializer
    permission_classes = [IsAuthenticated, IsTutor, IsCourseOwner]

    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user)
