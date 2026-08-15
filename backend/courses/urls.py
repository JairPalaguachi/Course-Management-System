from django.urls import path
from .views import (
    AdminCourseListView,
    AdminSectionContentUploadView,
    PublicCourseListView,
    TutorCourseCreateView,
    SectionContentUploadView,
    CategoryListView,
    admin_upload_course_cover,
    upload_course_cover,
    TutorCourseDetailView,
    TutorCoursesListView,
    AdminCourseUpdateView,
    StudentCourseDetailView,
)

urlpatterns = [
    path(
        "public/",
        PublicCourseListView.as_view(),
        name="public-courses",
    ),

    path(
        "student/courses/<int:pk>/",
        StudentCourseDetailView.as_view(),
        name="student-course-detail",
    ),
    
    path(
        "tutor/courses/",
        TutorCourseCreateView.as_view(),
        name="tutor-course-create",
    ),

    path(
        "tutor/courses/<int:pk>/",
        TutorCourseDetailView.as_view(),
        name="tutor-course-detail",
    ),

    path(
        "tutor/contents/<int:content_id>/upload/",
        SectionContentUploadView.as_view(),
        name="section-content-upload",
    ),

    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list",
    ),

    path(
        "tutor/courses/<int:pk>/upload-cover/",
        upload_course_cover,
        name="upload-course-cover",
    ),

    path(
        "tutor/courses/list/",
        TutorCoursesListView.as_view(),
        name="tutor-courses-list",
    ),

    path(
        "admin/courses/<int:pk>/",
        AdminCourseUpdateView.as_view(),
        name="admin-course-update",
    ),

    path('admin/courses/', AdminCourseListView.as_view(), name='admin-course-list'),
    path('admin/contents/<int:content_id>/upload/', AdminSectionContentUploadView.as_view()),
    path('admin/courses/<int:pk>/upload-cover/', admin_upload_course_cover),
]