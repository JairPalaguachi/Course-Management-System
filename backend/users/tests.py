from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


class LoginViewTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser@gmail.com",
            password="testpass123",
            role=User.Role.STUDENT
        )

    def test_login_success(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "testuser@gmail.com",
                "password": "testpass123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(
            response.data["user"]["role"],
            User.Role.STUDENT
        )

    def test_login_invalid_password(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "testuser@gmail.com",
                "password": "wrongpassword"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_login_nonexistent_user(self):
        response = self.client.post(
            "/api/auth/login/",
            {
                "username": "nouser@gmail.co",
                "password": "123456"
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )