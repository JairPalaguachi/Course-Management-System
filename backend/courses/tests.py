from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from .models import Category, Course


User = get_user_model()


class PublicCourseListViewTest(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.tutor = User.objects.create(
			username='tutor1',
			role=User.Role.TUTOR,
		)
		self.tutor.set_unusable_password()
		self.tutor.save(update_fields=['password'])

		self.category = Category.objects.create(
			name='Programación',
			description='Cursos de programación',
		)

		self.published_course = Course.objects.create(
			title='Django básico',
			description='Curso público',
			category=self.category,
			tutor=self.tutor,
			status=Course.Status.PUBLISHED,
			is_active=True,
			level='beginner',
			duration_minutes=60,
		)

		Course.objects.create(
			title='Borrador privado',
			description='No debe salir',
			category=self.category,
			tutor=self.tutor,
			status=Course.Status.DRAFT,
			is_active=True,
		)

		Course.objects.create(
			title='Publicado inactivo',
			description='No debe salir',
			category=self.category,
			tutor=self.tutor,
			status=Course.Status.PUBLISHED,
			is_active=False,
			level='advanced',
			duration_minutes=120,
		)

	def test_public_courses_only_returns_published_courses(self):
		response = self.client.get(reverse('public-courses'))

		self.assertEqual(response.status_code, 200)
		self.assertIn('results', response.data)

		result_ids = [course['id'] for course in response.data['results']]
		result_titles = [course['title'] for course in response.data['results']]

		self.assertIn(self.published_course.id, result_ids)
		self.assertIn('Django básico', result_titles)
		self.assertIn('Publicado inactivo', result_titles)
		self.assertNotIn('Borrador privado', result_titles)

	def test_public_courses_search_by_title(self):
		response = self.client.get(reverse('public-courses'), {'search': 'Django'})

		self.assertEqual(response.status_code, 200)
		result_titles = [course['title'] for course in response.data['results']]
		
		self.assertIn('Django básico', result_titles)
		self.assertNotIn('Publicado inactivo', result_titles)

	def test_public_courses_search_by_description(self):
		response = self.client.get(reverse('public-courses'), {'search': 'público'})

		self.assertEqual(response.status_code, 200)
		result_titles = [course['title'] for course in response.data['results']]
		
		self.assertIn('Django básico', result_titles)

	def test_public_courses_search_no_results(self):
		response = self.client.get(reverse('public-courses'), {'search': 'NoExiste'})

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data['results']), 0)

	def test_filter_by_category_name(self):
		response = self.client.get(reverse('public-courses'), {'category': 'Programación'})

		self.assertEqual(response.status_code, 200)
		result_titles = [c['title'] for c in response.data['results']]
		self.assertIn('Django básico', result_titles)

	def test_filter_by_level(self):
		response = self.client.get(reverse('public-courses'), {'level': 'advanced'})

		self.assertEqual(response.status_code, 200)
		result_titles = [c['title'] for c in response.data['results']]
		self.assertIn('Publicado inactivo', result_titles)
		self.assertNotIn('Django básico', result_titles)

	def test_filter_by_duration_range(self):
		response = self.client.get(reverse('public-courses'), {'min_duration': '90'})

		self.assertEqual(response.status_code, 200)
		result_titles = [c['title'] for c in response.data['results']]
		self.assertIn('Publicado inactivo', result_titles)
		self.assertNotIn('Django básico', result_titles)
