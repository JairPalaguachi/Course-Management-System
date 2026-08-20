from django.urls import path

from .views import StudentCourseEnrollView, StudentEnrollmentListView


urlpatterns = [
    path(
        "student/courses/<int:course_id>/enroll/",
        StudentCourseEnrollView.as_view(),
        name="student-course-enroll",
    ),
    path(
        "student/enrollments/",
        StudentEnrollmentListView.as_view(),
        name="student-enrollments-list",
    ),
]
