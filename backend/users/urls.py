from django.urls import path
from .views import LoginView, TutorRegisterView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/tutor/", TutorRegisterView.as_view(), name="register-tutor"),
]