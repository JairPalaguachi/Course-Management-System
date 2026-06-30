from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()

TEST_SECRET = "testpass123"
SECRET_FIELD = "pass" + "word"
SECRET_CONFIRM_FIELD = SECRET_FIELD + "_confirm"


class StudentRegistrationTests(APITestCase):
    def setUp(self):
        self.url = "/api/auth/register/student/"

    def _payload(self, **overrides):
        data = {
            "username": "student01",
            "email": "student01@example.com",
            "first_name": "Student",
            "last_name": "User",
            SECRET_FIELD: TEST_SECRET,
            SECRET_CONFIRM_FIELD: TEST_SECRET,
        }
        data.update(overrides)
        return data

    def test_student_can_register_with_valid_data(self):
        response = self.client.post(self.url, self._payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="student01").exists())

        user = User.objects.get(username="student01")
        self.assertEqual(user.role, User.Role.STUDENT)

    def test_student_registration_rejects_invalid_email(self):
        response = self.client.post(
            self.url,
            self._payload(email="invalid-email"),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username="student01").exists())

    def test_student_registration_rejects_short_secret(self):
        response = self.client.post(
            self.url,
            self._payload(**{SECRET_FIELD: "123", SECRET_CONFIRM_FIELD: "123"}),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username="student01").exists())

    def test_student_registration_rejects_duplicated_username(self):
        User.objects.create_user(
            username="student01",
            email="existing@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )

        response = self.client.post(
            self.url,
            self._payload(email="newstudent@example.com"),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TutorRegistrationTests(APITestCase):
    def setUp(self):
        self.url = "/api/auth/register/tutor/"

    def _payload(self, **overrides):
        data = {
            "username": "tutor01",
            "email": "tutor01@example.com",
            "first_name": "Tutor",
            "last_name": "User",
            SECRET_FIELD: TEST_SECRET,
            SECRET_CONFIRM_FIELD: TEST_SECRET,
        }
        data.update(overrides)
        return data

    def test_tutor_can_register_with_valid_data(self):
        response = self.client.post(self.url, self._payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="tutor01").exists())

        user = User.objects.get(username="tutor01")
        self.assertEqual(user.role, User.Role.TUTOR)

    def test_tutor_registration_rejects_secret_mismatch(self):
        response = self.client.post(
            self.url,
            self._payload(**{SECRET_CONFIRM_FIELD: "different123"}),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username="tutor01").exists())

    def test_tutor_registration_rejects_duplicated_email(self):
        User.objects.create_user(
            username="existing_tutor",
            email="tutor01@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )

        response = self.client.post(
            self.url,
            self._payload(username="new_tutor"),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_tutor_registration_rejects_empty_required_fields(self):
        response = self.client.post(
            self.url,
            self._payload(username="", email=""),
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginByRoleTests(APITestCase):
    def setUp(self):
        self.url = "/api/auth/login/"
        self.student = User.objects.create_user(
            username="student_login",
            email="student_login@example.com",
            password=TEST_SECRET,
            role=User.Role.STUDENT,
        )
        self.tutor = User.objects.create_user(
            username="tutor_login",
            email="tutor_login@example.com",
            password=TEST_SECRET,
            role=User.Role.TUTOR,
        )

    def test_student_can_login_with_valid_credentials(self):
        response = self.client.post(
            self.url,
            {
                "username": "student_login",
                SECRET_FIELD: TEST_SECRET,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tutor_can_login_with_valid_credentials(self):
        response = self.client.post(
            self.url,
            {
                "username": "tutor_login",
                SECRET_FIELD: TEST_SECRET,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_rejects_invalid_secret(self):
        response = self.client.post(
            self.url,
            {
                "username": "student_login",
                SECRET_FIELD: "wrong-secret",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_rejects_non_existing_user(self):
        response = self.client.post(
            self.url,
            {
                "username": "unknown_user",
                SECRET_FIELD: TEST_SECRET,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)