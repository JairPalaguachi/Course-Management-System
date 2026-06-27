from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course


class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        if request.user.role != request.user.Role.TUTOR:
            return Response(
                {"detail": "Solo un tutor puede consultar un curso."},
                status=status.HTTP_403_FORBIDDEN,
            )

        course = get_object_or_404(Course, pk=pk, tutor=request.user)

        return Response({
            "id": course.id,
            "title": course.title,
            "status": course.status,
            "category": course.category.name if course.category else None,
            "created_at": course.created_at,
            "published_at": course.published_at,
            "rejection_reason": course.rejection_reason,
        })


class RequestCoursePublicationView(APIView):
	permission_classes = [IsAuthenticated]

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
		if request.user.role != request.user.Role.TUTOR:
			return Response(
				{"detail": "Solo un tutor puede solicitar la publicación de un curso."},
				status=status.HTTP_403_FORBIDDEN,
			)

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
