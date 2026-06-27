from django.urls import path

from .views import CourseDetailView, RequestCoursePublicationView

urlpatterns = [
    path(
        "tutor/courses/<int:pk>/",
        CourseDetailView.as_view(),
        name="tutor-course-detail",
    ),
    path(
        "tutor/courses/<int:pk>/request-publication/",
        RequestCoursePublicationView.as_view(),
        name="tutor-course-request-publication",
    ),
]