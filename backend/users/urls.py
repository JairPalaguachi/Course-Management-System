from django.urls import path

from .views import LoginView, StudentRegisterView

urlpatterns = [
    path(
        "auth/login/",
        LoginView.as_view(),
        name="login"
    ),
    path(
        "auth/register/student/",
        StudentRegisterView.as_view(),
        name="register-student"
    ),
]