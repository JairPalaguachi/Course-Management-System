from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from courses.models import Category, Course
from .models import Enrollment

User = get_user_model()
TEST_SECRET = "testpass123"


class EnrollmentModelTests(TestCase):
    def setUp(self):
        self.student = User.objects.create_user(
            username="student_enrollment",
            email="student_enrollment@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )
        self.tutor = User.objects.create_user(
            username="tutor_enrollment",
            email="tutor_enrollment@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.category = Category.objects.create(
            name="Programación",
            description="Cursos de programación",
        )
        self.course = Course.objects.create(
            title="Curso publicado",
            description="Curso disponible para inscripción.",
            category=self.category,
            tutor=self.tutor,
            duration=120,
            level="beginner",
            initial_content="Contenido",
            status=Course.Status.PUBLISHED,
            is_active=True,
        )

    def test_student_can_have_enrollment_record(self):
        enrollment = Enrollment.objects.create(
            student=self.student,
            course=self.course,
        )

        self.assertEqual(enrollment.student, self.student)
        self.assertEqual(enrollment.course, self.course)


class StudentEnrollmentEndpointTests(APITestCase):
    endpoint = "/api/student/enrollments/"

    def setUp(self):
        self.student = User.objects.create_user(
            username="student_api",
            email="student_api@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )
        self.other_student = User.objects.create_user(
            username="other_student_api",
            email="other_student_api@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )
        self.tutor = User.objects.create_user(
            username="tutor_api",
            email="tutor_api@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.category = Category.objects.create(
            name="Backend",
            description="Cursos backend",
        )
        self.course = Course.objects.create(
            title="Django desde cero",
            description="Curso de Django",
            category=self.category,
            tutor=self.tutor,
            duration=40,
            level="beginner",
            initial_content="Introduccion",
            status=Course.Status.PUBLISHED,
            is_active=True,
        )
        self.other_course = Course.objects.create(
            title="APIs con DRF",
            description="Curso de APIs",
            category=self.category,
            tutor=self.tutor,
            duration=35,
            level="intermediate",
            initial_content="Introduccion",
            status=Course.Status.PUBLISHED,
            is_active=True,
        )

    def _authenticate(self, user):
        token = str(RefreshToken.for_user(user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_student_can_list_only_own_enrollments(self):
        own_enrollment = Enrollment.objects.create(student=self.student, course=self.course)
        Enrollment.objects.create(student=self.other_student, course=self.other_course)

        self._authenticate(self.student)
        response = self.client.get(self.endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], own_enrollment.id)
        self.assertIn("enrolled_at", response.data[0])
        self.assertEqual(response.data[0]["course"]["id"], self.course.id)
        self.assertEqual(response.data[0]["course"]["title"], self.course.title)

    def test_non_student_user_is_forbidden(self):
        Enrollment.objects.create(student=self.student, course=self.course)

        self._authenticate(self.tutor)
        response = self.client.get(self.endpoint)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_user_is_rejected(self):
        response = self.client.get(self.endpoint)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)