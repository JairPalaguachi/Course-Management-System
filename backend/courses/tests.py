from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category
from users.models import User
from .models import Course


class RequestCoursePublicationViewTests(APITestCase):
	def setUp(self):
		self.category = Category.objects.create(
			name="Tecnología",
			description="Cursos de tecnología",
		)
		self.tutor = User.objects.create_user(
			username="tutor1",
			password="testpass123",
			role=User.Role.TUTOR,
		)
		self.course = Course.objects.create(
			title="Curso de prueba",
			description="Descripción del curso",
			category=self.category,
			tutor=self.tutor,
		)
		self.client.force_authenticate(user=self.tutor)

	def test_tutor_can_request_publication(self):
		url = reverse("tutor-course-request-publication", args=[self.course.id])

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.course.refresh_from_db()
		self.assertEqual(self.course.status, Course.Status.PENDING_APPROVAL)
		self.assertEqual(response.data["course"]["status"], Course.Status.PENDING_APPROVAL)

		duplicate_response = self.client.post(url)

		self.assertEqual(duplicate_response.status_code, status.HTTP_409_CONFLICT)
		self.assertEqual(duplicate_response.data["detail"], "El curso ya tiene una solicitud de publicación pendiente.")

	def test_cannot_request_publication_for_published_course(self):
		self.course.status = Course.Status.PUBLISHED
		self.course.save(update_fields=["status"])

		url = reverse("tutor-course-request-publication", args=[self.course.id])

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

	def test_cannot_request_publication_when_course_is_missing_category(self):
		self.course.category = None
		self.course.save(update_fields=["category"])

		url = reverse("tutor-course-request-publication", args=[self.course.id])

		response = self.client.post(url)

		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertIn("category", response.data["missing_fields"])

