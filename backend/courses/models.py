from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Course(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Borrador"
        PENDING_APPROVAL = "pending", "Pendiente de aprobación"
        PUBLISHED = "published", "Publicado"
        REJECTED = "rejected", "Rechazado"

    title = models.CharField(max_length=200)
    description = models.TextField()

    cover_image = models.ImageField(
        upload_to="courses/covers/", null=True, blank=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="courses",
    )
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_courses",
    )
    duration = models.PositiveIntegerField(
        help_text="Duración del curso en horas"
    )
    initial_content = models.TextField()
    
    objectives = models.TextField(blank=True)
    preview_video = models.URLField(blank=True)
    language = models.CharField(max_length=30, default="Español")
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.DRAFT
    )
    rejection_reason = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    level = models.CharField(
        max_length=20,
        choices=(
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ),
        default='beginner',
    )
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class CourseSection(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="sections"
    )
    name = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Sección"
        verbose_name_plural = "Secciones"
        ordering = ["order"]

    def __str__(self):
        return f"{self.course.title} — {self.name}"


def content_upload_path(instance, filename):
    """
    Guarda los archivos organizados por curso y sección:
    media/courses/<course_id>/sections/<section_id>/<filename>
    """
    return (
        f"courses/{instance.section.course_id}/"
        f"sections/{instance.section_id}/{filename}"
    )


class SectionContent(models.Model):
    class ContentType(models.TextChoices):
        VIDEO = "video", "Video"
        PDF = "pdf", "PDF"
        IMAGE = "image", "Imagen"
        TEXT = "text", "Texto"
        QUIZ = "quiz", "Evaluación"

    # Extensiones permitidas por tipo
    ALLOWED_EXTENSIONS = {
        "video": [".mp4", ".webm", ".mov", ".avi"],
        "pdf": [".pdf"],
        "image": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
        "text": [],  # texto plano, sin archivo
        "quiz": [],  # sin archivo
    }

    section = models.ForeignKey(
        CourseSection, on_delete=models.CASCADE, related_name="contents"
    )
    type = models.CharField(max_length=20, choices=ContentType.choices)
    label = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    file = models.FileField(
        upload_to=content_upload_path, blank=True, null=True
    )

    body = models.TextField(blank=True)

    class Meta:
        verbose_name = "Contenido"
        verbose_name_plural = "Contenidos"
        ordering = ["order"]

    def __str__(self):
        return f"{self.section.name} — {self.label}"

    @property
    def file_url(self):
        if self.file:
            return self.file.url
        return None


class SectionEvaluation(models.Model):
    section = models.OneToOneField(
        CourseSection, on_delete=models.CASCADE, related_name="evaluation"
    )
    name = models.CharField(max_length=200)
    max_score = models.PositiveIntegerField(default=100)
    min_score = models.PositiveIntegerField(default=60)
    attempts = models.CharField(max_length=20, default="1")
    instructions = models.TextField(blank=True)

    class Meta:
        verbose_name = "Evaluación de sección"
        verbose_name_plural = "Evaluaciones de sección"

    def __str__(self):
        return f"Evaluación: {self.section.name}"