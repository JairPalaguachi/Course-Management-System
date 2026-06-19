from django.urls import path
from .views import TutorCourseUpdateView

urlpatterns = [
    path("courses/<int:pk>/", TutorCourseUpdateView.as_view(), name="tutor-course-edit"),
]
