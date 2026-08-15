from django.urls import path

from .views import StudentCourseEnrollView, StudentEnrollmentsView


urlpatterns = [
    path(
        "student/courses/<int:course_id>/enroll/",
        StudentCourseEnrollView.as_view(),
        name="student-course-enroll",
    ),
     path(
        "student/enrollments/",
        StudentEnrollmentsView.as_view(),
        name="student-enrollments",
    ),
]