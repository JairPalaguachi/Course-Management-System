from django.urls import path
from .views import (
    CategoryListView,
    PublicCourseListView, PublicCourseDetailView,
    TutorCourseListView, TutorCourseDetailView, PublishCourseView,
    AdminCourseListView, AdminCourseDetailView, ApproveCourseView,
    MaterialListView, MaterialDetailView,
    EnrollView, MyEnrollmentsView, StudentCourseListView,
)

urlpatterns = [
    path('categories/', CategoryListView.as_view()),
    # Public
    path('courses/', PublicCourseListView.as_view()),
    path('courses/<int:pk>/', PublicCourseDetailView.as_view()),
    # Tutor
    path('tutor/courses/', TutorCourseListView.as_view()),
    path('tutor/courses/<int:pk>/', TutorCourseDetailView.as_view()),
    path('tutor/courses/<int:pk>/publish/', PublishCourseView.as_view()),
    path('tutor/courses/<int:course_pk>/materials/', MaterialListView.as_view()),
    path('tutor/courses/<int:course_pk>/materials/<int:pk>/', MaterialDetailView.as_view()),
    # Admin
    path('admin/courses/', AdminCourseListView.as_view()),
    path('admin/courses/<int:pk>/', AdminCourseDetailView.as_view()),
    path('admin/courses/<int:pk>/approve/', ApproveCourseView.as_view()),
    # Student
    path('student/courses/', StudentCourseListView.as_view()),
    path('student/enroll/<int:pk>/', EnrollView.as_view()),
    path('student/enrollments/', MyEnrollmentsView.as_view()),
]
