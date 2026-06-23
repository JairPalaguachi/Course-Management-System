import os
from rest_framework import serializers

from .models import Category, Course, CourseSection, SectionContent, SectionEvaluation

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


# ── Serializers de secciones (solo lectura, para el detalle de curso) ──────────

class SectionContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionContent
        fields = ["id", "type", "label", "order"]


class SectionEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionEvaluation
        fields = ["id", "name", "max_score", "min_score", "attempts", "instructions"]


class CourseSectionSerializer(serializers.ModelSerializer):
    contents   = SectionContentSerializer(many=True, read_only=True)
    evaluation = SectionEvaluationSerializer(read_only=True)

    class Meta:
        model = CourseSection
        fields = ["id", "name", "order", "contents", "evaluation"]


# ── Serializers de escritura anidada (para el input del frontend) ──────────────

class SectionEvaluationInputSerializer(serializers.Serializer):
    name         = serializers.CharField(max_length=200)
    max_score    = serializers.IntegerField(default=100, min_value=1)
    min_score    = serializers.IntegerField(default=60,  min_value=0)
    attempts     = serializers.CharField(max_length=20, default="1")
    instructions = serializers.CharField(allow_blank=True, default="")

    def validate(self, data):
        if data["min_score"] > data["max_score"]:
            raise serializers.ValidationError(
                "El puntaje mínimo no puede ser mayor al máximo."
            )
        return data


class SectionContentInputSerializer(serializers.Serializer):
    VALID_TYPES = {"video", "pdf", "image", "text", "quiz"}

    type  = serializers.CharField(max_length=20)
    label = serializers.CharField(max_length=200)

    def validate_type(self, value):
        if value not in self.VALID_TYPES:
            raise serializers.ValidationError(
                f"Tipo inválido. Opciones: {', '.join(self.VALID_TYPES)}"
            )
        return value


class SectionInputSerializer(serializers.Serializer):
    name       = serializers.CharField(max_length=200)
    contents   = SectionContentInputSerializer(many=True, default=list)
    evaluation = SectionEvaluationInputSerializer(required=False, allow_null=True)


# ── Serializer principal ───────────────────────────────────────────────────────

class TutorCourseCreateSerializer(serializers.ModelSerializer):
    category      = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    sections_meta = SectionInputSerializer(many=True, write_only=True, default=list)

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "category",
            "duration",
            "initial_content",
            "level",
            "objectives",
            "preview_video",
            "language",
            "sections_meta",   # entrada del frontend, no se guarda en Course directamente
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    # ── validaciones de campos ─────────────────────────────────────────────────

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("El título del curso es obligatorio.")
        return value

    def validate_description(self, value):
        if not value.strip():
            raise serializers.ValidationError("La descripción del curso es obligatoria.")
        return value

    def validate_initial_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("El contenido inicial del curso es obligatorio.")
        return value

    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError("La duración debe ser mayor a 0.")
        return value

    # ── creación con secciones anidadas ───────────────────────────────────────

    def create(self, validated_data):
        sections_data = validated_data.pop("sections_meta", [])
        request       = self.context["request"]

        status = validated_data.pop(
            "status",
            Course.Status.DRAFT
        )

        course = Course.objects.create(
            **validated_data,
            tutor=request.user,
            status=status,
        )

        for order, section_data in enumerate(sections_data):
            contents_data  = section_data.pop("contents", [])
            evaluation_data = section_data.pop("evaluation", None)

            section = CourseSection.objects.create(
                course=course,
                name=section_data["name"],
                order=order,
            )

            for content_order, content_data in enumerate(contents_data):
                SectionContent.objects.create(
                    section=section,
                    type=content_data["type"],
                    label=content_data["label"],
                    order=content_order,
                )

            if evaluation_data:
                SectionEvaluation.objects.create(
                    section=section,
                    **evaluation_data,
                )

        return course

# ── Subida de archivo a un SectionContent ────────────────────────────────────

ALLOWED_EXTENSIONS = {
    'video': ['.mp4', '.webm', '.mov', '.avi'],
    'pdf':   ['.pdf'],
    'image': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
}

MAX_SIZE_BYTES = {
    'video': 500 * 1024 * 1024,   # 500 MB
    'pdf':   20  * 1024 * 1024,   # 20 MB
    'image': 10  * 1024 * 1024,   # 10 MB
}


class SectionContentUploadSerializer(serializers.Serializer):
    """
    Recibe un archivo y lo asocia a un SectionContent existente.
    El content_id viene en la URL, no en el body.
    """
    file = serializers.FileField()

    def validate(self, data):
        content  = self.context['content']    # instancia de SectionContent
        file     = data['file']
        ext      = os.path.splitext(file.name)[1].lower()
        ctype    = content.type

        # Tipos sin archivo
        if ctype in ('text', 'quiz'):
            raise serializers.ValidationError(
                'Este tipo de contenido no admite archivos.'
            )

        # Extensión permitida
        allowed = ALLOWED_EXTENSIONS.get(ctype, [])
        if ext not in allowed:
            raise serializers.ValidationError(
                f'Extensión no permitida para {ctype}. '
                f'Permitidas: {", ".join(allowed)}'
            )

        # Tamaño máximo
        max_size = MAX_SIZE_BYTES.get(ctype, 0)
        if file.size > max_size:
            mb = max_size // (1024 * 1024)
            raise serializers.ValidationError(
                f'El archivo supera el tamaño máximo permitido ({mb} MB).'
            )

        return data

    def save(self):
        content      = self.context['content']
        # Eliminar archivo anterior si existía
        if content.file:
            content.file.delete(save=False)
        content.file = self.validated_data['file']
        content.save(update_fields=['file'])
        return content
    
