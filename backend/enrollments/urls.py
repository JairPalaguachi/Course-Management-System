from django.urls import path

<<<<<<< HEAD
from .views import StudentEnrollmentListView
=======
from .views import StudentCourseEnrollView, StudentEnrollmentsView
>>>>>>> origin/develop


urlpatterns = [
    path(
<<<<<<< HEAD
        "student/enrollments/",
        StudentEnrollmentListView.as_view(),
        name="student-enrollments-list",
=======
        "student/courses/<int:course_id>/enroll/",
        StudentCourseEnrollView.as_view(),
        name="student-course-enroll",
    ),
     path(
        "student/enrollments/",
        StudentEnrollmentsView.as_view(),
        name="student-enrollments",
>>>>>>> origin/develop
    ),
]