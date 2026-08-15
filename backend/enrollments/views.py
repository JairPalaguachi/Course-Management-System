from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Course

from .models import Enrollment
from .permissions import IsStudent
from .serializers import StudentEnrollmentSerializer


class StudentEnrollmentListView(ListAPIView):
    """
    GET /api/student/enrollments/
    Retorna las inscripciones del estudiante autenticado.
    """

    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return (
            Enrollment.objects.filter(student=self.request.user)
            .select_related("course", "course__tutor")
            .order_by("-enrolled_at")
        )


class StudentCourseEnrollView(APIView):
    """
    POST /api/student/courses/<course_id>/enroll/
    Inscribe al estudiante autenticado en un curso publicado.
    """

    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request, course_id):
        course = Course.objects.filter(
            id=course_id,
            status=Course.Status.PUBLISHED,
            is_active=True,
        ).first()

        if not course:
            return Response(
                {"detail": "El curso no existe o no está disponible."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response(
                {"detail": "Ya estás inscrito en este curso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        enrollment = Enrollment.objects.create(student=request.user, course=course)

        return Response(
            {
                "message": "Inscripción realizada correctamente.",
                "enrollment_id": enrollment.id,
                "course_id": course.id,
                "course_title": course.title,
                "status": enrollment.status,
            },
            status=status.HTTP_201_CREATED,
        )
