from django.urls import path
from .views import TutorCourseCreateView, SectionContentUploadView, CategoryListView, upload_course_cover, TutorCourseDetailView, TutorCoursesListView

urlpatterns = [
    path(
        'tutor/courses/',
        TutorCourseCreateView.as_view(),
        name='tutor-course-create'
    ),

    path(
        'tutor/courses/<int:pk>/', 
        TutorCourseDetailView.as_view(), 
        name='tutor-course-detail'
    ),
    
    path(
        'tutor/contents/<int:content_id>/upload/',
        SectionContentUploadView.as_view(),
        name='section-content-upload'
    ),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('tutor/courses/<int:pk>/upload-cover/', upload_course_cover, name='upload-course-cover'),
    path('tutor/courses/list/', TutorCoursesListView.as_view(), name='tutor-courses-list'),
]