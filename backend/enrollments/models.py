from django.conf import settings
from django.db import models


class Enrollment(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Activa'
        COMPLETED = 'completed', 'Completada'
        CANCELLED = 'cancelled', 'Cancelada'

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Inscripción'
        verbose_name_plural = 'Inscripciones'
        ordering = ['-enrolled_at']
        unique_together = ('student', 'course')

    def __str__(self):
        return f'{self.student.username} - {self.course.title}'