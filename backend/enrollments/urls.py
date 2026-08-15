from django.urls import path

from .views import StudentEnrollmentListView


urlpatterns = [
    path(
        "student/enrollments/",
        StudentEnrollmentListView.as_view(),
        name="student-enrollments-list",
    ),
]