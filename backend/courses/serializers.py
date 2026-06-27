from rest_framework import serializers

from .models import Course


class PublicCourseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    tutor_username = serializers.CharField(source='tutor.username', read_only=True)

    class Meta:
        model = Course
        fields = (
            'id',
            'title',
            'description',
            'category_name',
            'tutor_username',
            'level',
            'duration_minutes',
            'created_at',
            'published_at',
        )