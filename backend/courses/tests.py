from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from .models import Category, Course
from users.models import User

User = get_user_model()

class PublicCourseListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tutor = User.objects.create(username='tutor1', role=User.Role.TUTOR)
        self.tutor.set_unusable_password()
        self.tutor.save()

        self.category = Category.objects.create(name='Programación', description='Cursos')

        self.published_course = Course.objects.create(
            title='Django básico',
            description='Curso público',
            category=self.category,
            tutor=self.tutor,
            status=Course.Status.PUBLISHED,
            is_active=True,
            level='beginner',
            duration=1,
            initial_content="Contenido"
        )

        Course.objects.create(
            title='Borrador privado',
            description='No debe salir',
            category=self.category,
            tutor=self.tutor,
            status=Course.Status.DRAFT,
            is_active=True,
            duration=1,
            initial_content="Contenido"
        )

        Course.objects.create(
            title='Publicado inactivo',
            description='No debe salir',
            category=self.category,
            tutor=self.tutor,
            status=Course.Status.PUBLISHED,
            is_active=False,
            level='advanced',
            duration=2,
            initial_content="Contenido"
        )

    def test_public_courses_only_returns_published_courses(self):
        response = self.client.get(reverse('public-courses'))
        self.assertEqual(response.status_code, 200)
        result_titles = [c['title'] for c in response.data['results']]
        self.assertIn('Django básico', result_titles)
        self.assertNotIn('Borrador privado', result_titles)

class RequestCoursePublicationViewTests(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Tecnología", description="Tecnología")
        self.tutor = User.objects.create_user(username="tutor1", password="testpass123", role=User.Role.TUTOR)
        self.course = Course.objects.create(
            title="Curso de prueba",
            description="Descripción",
            category=self.category,
            tutor=self.tutor,
            duration=1,
            initial_content="Contenido"
        )
        self.client.force_authenticate(user=self.tutor)

    def test_tutor_can_request_publication(self):
        url = reverse("tutor-course-request-publication", args=[self.course.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.status, Course.Status.PENDING_APPROVAL)