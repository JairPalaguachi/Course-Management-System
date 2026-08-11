from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from courses.models import Course
from .models import Enrollment
from .serializers import EnrollmentSerializer


class StudentCourseEnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        # Validar que el usuario sea estudiante
        if getattr(request.user, "role", None) != "student":
            return Response(
                {"detail": "Solo los estudiantes pueden inscribirse en cursos."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Buscar el curso
        course = get_object_or_404(Course, id=course_id)

        # Validar que el curso esté publicado
        if course.status != Course.Status.PUBLISHED:
            return Response(
                {"detail": "Solo puedes inscribirte en cursos publicados."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Evitar inscripción duplicada
        if Enrollment.objects.filter(
            student=request.user,
            course=course
        ).exists():
            return Response(
                {"detail": "Ya estás inscrito en este curso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Crear inscripción
        enrollment = Enrollment.objects.create(
            student=request.user,
            course=course,
            status=Enrollment.Status.ACTIVE,
        )

        serializer = EnrollmentSerializer(enrollment)

        return Response(
            {
                "message": "Inscripción realizada correctamente.",
                "enrollment": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )