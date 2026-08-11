from django.urls import path

from .views import StudentCourseEnrollView


urlpatterns = [
    path(
        "student/courses/<int:course_id>/enroll/",
        StudentCourseEnrollView.as_view(),
        name="student-course-enroll",
    ),
]