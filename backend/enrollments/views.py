<<<<<<< HEAD
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

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
=======
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Course
from .models import Enrollment
from .serializers import EnrollmentSerializer

class StudentCourseEnrollView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, course_id):
        # Verificar que el usuario sea estudiante
        if request.user.role != "student":
            return Response(
                {"detail": "Solo los estudiantes pueden inscribirse en cursos."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Buscar el curso
        try:
            course = Course.objects.get(
                id=course_id,
                status=Course.Status.PUBLISHED,
                is_active=True,
            )
        except Course.DoesNotExist:
            return Response(
                {"detail": "El curso no existe o no está disponible."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Evitar una inscripción duplicada
        if Enrollment.objects.filter(
            student=request.user,
            course=course,
        ).exists():
            return Response(
                {"detail": "Ya estás inscrito en este curso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Crear la inscripción
        enrollment = Enrollment.objects.create(
            student=request.user,
            course=course,
        )

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

class StudentEnrollmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verificar que el usuario sea estudiante
        if request.user.role != "student":
            return Response(
                {"detail": "Solo los estudiantes pueden consultar sus inscripciones."},
                status=status.HTTP_403_FORBIDDEN,
            )

        enrollments = (
            Enrollment.objects
            .filter(student=request.user)
            .select_related("course", "course__category", "course__tutor")
        )

        serializer = EnrollmentSerializer(enrollments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
>>>>>>> origin/develop
