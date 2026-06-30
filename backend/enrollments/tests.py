from django.contrib.auth import get_user_model
from django.test import TestCase

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