from rest_framework import serializers

from courses.models import Course
from courses.serializers import PublicCourseSerializer
from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    course = PublicCourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "course",
            "status",
            "enrolled_at",
        ]
        read_only_fields = [
            "id",
            "course",
            "status",
            "enrolled_at",
        ]