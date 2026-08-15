<<<<<<< HEAD
from courses.models import Course
from rest_framework import serializers

from .models import Enrollment


class EnrolledCourseSerializer(serializers.ModelSerializer):
    tutor_name = serializers.CharField(source="tutor.username", read_only=True)
    cover_image = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ("id", "title", "description", "tutor_name", "cover_image", "level")

    def get_cover_image(self, obj):
        request = self.context.get("request")
        if not obj.cover_image:
            return None
        if request:
            return request.build_absolute_uri(obj.cover_image.url)
        return obj.cover_image.url


class StudentEnrollmentSerializer(serializers.ModelSerializer):
    course = EnrolledCourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ("id", "status", "enrolled_at", "course")
=======
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
>>>>>>> origin/develop
