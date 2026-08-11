from rest_framework import serializers

from .models import Enrollment


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "course",
            "status",
            "enrolled_at",
        ]
        read_only_fields = [
            "id",
            "student",
            "status",
            "enrolled_at",
        ]