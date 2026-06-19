from rest_framework import serializers
from .models import Course


class CourseEditSerializer(serializers.ModelSerializer):
    """
    Serializer para edición de curso por tutor.
    Solo permite modificar title, description y category.
    status es de solo lectura — el tutor no puede cambiarlo directamente.
    Solo se puede editar si el curso está en 'draft' o 'rejected'.
    """

    class Meta:
        model = Course
        fields = [
            "id", "title", "description", "category",
            "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]

    def validate(self, attrs):
        course = self.instance
        editable_statuses = [Course.Status.DRAFT, Course.Status.REJECTED]

        if course and course.status not in editable_statuses:
            raise serializers.ValidationError(
                "Solo puedes editar cursos en estado 'borrador' o 'rechazado'."
            )

        return attrs
