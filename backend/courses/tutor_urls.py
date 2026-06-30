from django.urls import path
from .views import (
    TutorCourseUpdateView,
    RequestCoursePublicationView,
)

urlpatterns = [
    path(
        "courses/<int:pk>/",
        TutorCourseUpdateView.as_view(),
        name="tutor-course-edit",
    ),

    path(
        "courses/<int:pk>/request-publication/",
        RequestCoursePublicationView.as_view(),
        name="tutor-course-request-publication",
    ),
]
