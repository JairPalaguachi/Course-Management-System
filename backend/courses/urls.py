from django.urls import path

from .views import PublicCourseListView


urlpatterns = [
    path('public/', PublicCourseListView.as_view(), name='public-courses'),
]