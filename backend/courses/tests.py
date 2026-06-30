from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import Category, Course

User = get_user_model()
TEST_SECRET = "testpass123"


class PublicCourseListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tutor = User.objects.create(username="tutor1", role=User.Role.TUTOR)
        self.tutor.set_unusable_password()
        self.tutor.save()

        self.category = Category.objects.create(
            name="Programación",
            description="Cursos",
        )

        Course.objects.create(
            title="Django básico",
            description="Curso público",
            category=self.category,
            tutor=self.tutor,
            status=Course.Status.PUBLISHED,
            is_active=True,
            level="beginner",
            duration=120,
            initial_content="Contenido",
        )

        Course.objects.create(
            title="Borrador privado",
            description="No debe salir",
            category=self.category,
            tutor=self.tutor,
            status=Course.Status.DRAFT,
            is_active=True,
            duration=90,
            initial_content="Contenido",
        )

        Course.objects.create(
            title="Publicado inactivo",
            description="No debe salir",
            category=self.category,
            tutor=self.tutor,
            status=Course.Status.PUBLISHED,
            is_active=False,
            level="advanced",
            duration=180,
            initial_content="Contenido",
        )

    def test_public_courses_only_returns_published_courses(self):
        response = self.client.get(reverse("public-courses"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_titles = [course["title"] for course in response.data["results"]]
        self.assertIn("Django básico", result_titles)
        self.assertNotIn("Borrador privado", result_titles)

    def test_public_catalog_allows_search_by_title(self):
        response = self.client.get(reverse("public-courses"), {"search": "Django"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_titles = [course["title"] for course in response.data["results"]]
        self.assertIn("Django básico", result_titles)

    def test_public_catalog_allows_filter_by_level(self):
        response = self.client.get(reverse("public-courses"), {"level": "beginner"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        result_titles = [course["title"] for course in response.data["results"]]
        self.assertIn("Django básico", result_titles)


class TutorCourseCreationTests(APITestCase):
    def setUp(self):
        self.url = "/api/tutor/courses/"
        self.category = Category.objects.create(
            name="Tecnología",
            description="Cursos de tecnología",
        )
        self.tutor = User.objects.create_user(
            username="tutor_create",
            email="tutor_create@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.student = User.objects.create_user(
            username="student_create",
            email="student_create@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )

    def _valid_payload(self, **overrides):
        data = {
            "title": "Curso de Django REST Framework",
            "description": "Curso introductorio para construir APIs con Django.",
            "category": self.category.id,
            "duration": 120,
            "level": "beginner",
            "objectives": "Aprender conceptos base de APIs REST.",
            "preview_video": "",
            "language": "es",
            "sections_meta": [
                {
                    "name": "Introducción",
                    "contents": [
                        {
                            "type": "text",
                            "label": "Bienvenida",
                            "body": "Contenido inicial del curso.",
                        }
                    ],
                }
            ],
        }
        data.update(overrides)
        return data

    def test_tutor_can_create_course_with_valid_data(self):
        self.client.force_authenticate(user=self.tutor)

        response = self.client.post(self.url, self._valid_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Course.objects.filter(title="Curso de Django REST Framework").exists()
        )

        course = Course.objects.get(title="Curso de Django REST Framework")
        self.assertEqual(course.tutor, self.tutor)
        self.assertEqual(course.status, Course.Status.DRAFT)

    def test_course_creation_rejects_missing_title(self):
        self.client.force_authenticate(user=self.tutor)

        response = self.client.post(
            self.url,
            self._valid_payload(title=""),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_course_creation_rejects_invalid_duration_zero(self):
        self.client.force_authenticate(user=self.tutor)

        response = self.client.post(
            self.url,
            self._valid_payload(duration=0),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_student_cannot_create_course(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.post(self.url, self._valid_payload(), format="json")

        self.assertIn(
            response.status_code,
            [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED],
        )


class TutorCourseEditingTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Backend",
            description="Cursos backend",
        )
        self.tutor = User.objects.create_user(
            username="owner_tutor",
            email="owner_tutor@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.other_tutor = User.objects.create_user(
            username="other_tutor",
            email="other_tutor@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.student = User.objects.create_user(
            username="student_editor",
            email="student_editor@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )
        self.course = Course.objects.create(
            title="Curso editable",
            description="Descripción inicial",
            category=self.category,
            tutor=self.tutor,
            duration=90,
            level="beginner",
            initial_content="Contenido",
            status=Course.Status.DRAFT,
        )

    def _url(self, course_id=None):
        course_id = course_id or self.course.id
        return f"/api/tutor/courses/{course_id}/"

    def _payload(self, **overrides):
        data = {
            "title": "Curso actualizado",
            "description": "Nueva descripción del curso.",
            "category": self.category.id,
            "duration": 150,
            "level": "intermediate",
            "objectives": "Actualizar el contenido del curso.",
            "preview_video": "",
            "language": "es",
            "sections_meta": [],
        }
        data.update(overrides)
        return data

    def test_tutor_can_edit_own_draft_course(self):
        self.client.force_authenticate(user=self.tutor)

        response = self.client.put(
            self._url(),
            self._payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.course.refresh_from_db()
        self.assertEqual(self.course.title, "Curso actualizado")
        self.assertEqual(self.course.duration, 150)

    def test_tutor_cannot_edit_course_owned_by_another_tutor(self):
        self.client.force_authenticate(user=self.other_tutor)

        response = self.client.put(
            self._url(),
            self._payload(),
            format="json",
        )

        self.assertIn(
            response.status_code,
            [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND],
        )

    def test_tutor_cannot_edit_non_editable_course(self):
        self.course.status = Course.Status.PUBLISHED
        self.course.save(update_fields=["status"])

        self.client.force_authenticate(user=self.tutor)

        response = self.client.put(
            self._url(),
            self._payload(),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_student_cannot_edit_course(self):
        self.client.force_authenticate(user=self.student)

        response = self.client.put(
            self._url(),
            self._payload(),
            format="json",
        )

        self.assertIn(
            response.status_code,
            [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED],
        )


class RequestCoursePublicationViewTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name="Tecnología",
            description="Tecnología",
        )
        self.tutor = User.objects.create_user(
            username="tutor_publish",
            email="tutor_publish@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.course = Course.objects.create(
            title="Curso de prueba",
            description="Descripción",
            category=self.category,
            tutor=self.tutor,
            duration=120,
            initial_content="Contenido",
            status=Course.Status.DRAFT,
        )
        self.client.force_authenticate(user=self.tutor)

    def _url(self, course_id=None):
        course_id = course_id or self.course.id
        return reverse("tutor-course-request-publication", args=[course_id])

    def test_tutor_can_request_publication_for_complete_draft_course(self):
        response = self.client.post(self._url())

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.course.refresh_from_db()
        self.assertEqual(self.course.status, Course.Status.PENDING_APPROVAL)

    def test_publication_request_rejects_incomplete_course(self):
        self.course.title = ""
        self.course.save(update_fields=["title"])

        response = self.client.post(self._url())

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.course.refresh_from_db()
        self.assertEqual(self.course.status, Course.Status.DRAFT)

    def test_publication_request_rejects_already_pending_course(self):
        self.course.status = Course.Status.PENDING_APPROVAL
        self.course.save(update_fields=["status"])

        response = self.client.post(self._url())

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_publication_request_rejects_already_published_course(self):
        self.course.status = Course.Status.PUBLISHED
        self.course.save(update_fields=["status"])

        response = self.client.post(self._url())

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CourseDurationBoundaryTests(APITestCase):
    def setUp(self):
        self.url = "/api/tutor/courses/"
        self.category = Category.objects.create(
            name="Duración",
            description="Cursos para validar duración",
        )
        self.tutor = User.objects.create_user(
            username="duration_tutor",
            email="duration_tutor@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )
        self.client.force_authenticate(user=self.tutor)

    def _payload(self, duration):
        return {
            "title": f"Curso duración {duration}",
            "description": "Curso para validar límites de duración.",
            "category": self.category.id,
            "duration": duration,
            "level": "beginner",
            "objectives": "Validar duración.",
            "preview_video": "",
            "language": "es",
            "sections_meta": [],
        }

    def test_duration_minimum_valid_value_is_accepted(self):
        response = self.client.post(
            self.url,
            self._payload(1),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_duration_zero_is_rejected(self):
        response = self.client.post(
            self.url,
            self._payload(0),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duration_negative_value_is_rejected(self):
        response = self.client.post(
            self.url,
            self._payload(-1),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duration_typical_valid_value_is_accepted(self):
        response = self.client.post(
            self.url,
            self._payload(120),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)