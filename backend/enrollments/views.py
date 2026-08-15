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
