from django.urls import path
from .views import LoginView, SuperUserSetPasswordView, SuperUserUserDetailView, SuperUserUserListCreateView, UserListView, StudentRegisterView, TutorRegisterView

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("users/", UserListView.as_view(), name="user-list"),
]


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
        "users/",
        UserListView.as_view(),
        name="user-list"
    ),
    path(
        "auth/register/tutor/",
        TutorRegisterView.as_view(),
        name="register-tutor"
    ),

    path("superuser/users/", SuperUserUserListCreateView.as_view(), name="superuser-user-list-create"),
    path("superuser/users/<int:pk>/", SuperUserUserDetailView.as_view(), name="superuser-user-detail"),
    path("superuser/users/<int:pk>/set-password/", SuperUserSetPasswordView.as_view(), name="superuser-user-set-password"),
]
