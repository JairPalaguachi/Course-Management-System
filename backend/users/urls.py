from django.urls import path
from .views import LoginView, UserListView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("users/", UserListView.as_view(), name="user-list"),
]

from .views import LoginView, StudentRegisterView, TutorRegisterView

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
    path(
        "auth/register/tutor/",
        TutorRegisterView.as_view(),
        name="register-tutor"
    ),
]
