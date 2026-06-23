from django.urls import path
from .views import LoginView, UserListView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("users/", UserListView.as_view(), name="user-list"),
]
