from django.db import models
from users.models import User

class Category(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre

class Course(models.Model):
    ESTADOS = [
        ('borrador', 'Borrador'),
        ('pendiente', 'Pendiente de aprobación'),
        ('publicado', 'Publicado'),
        ('rechazado', 'Rechazado'),
    ]
    NIVELES = [
        ('basico', 'Básico'),
        ('intermedio', 'Intermedio'),
        ('avanzado', 'Avanzado'),
    ]
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='courses/', null=True, blank=True)
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cursos_creados',
                              limit_choices_to={'role__in': ['tutor', 'admin']})
    categorias = models.ManyToManyField(Category, blank=True, related_name='cursos')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='borrador')
    nivel = models.CharField(max_length=20, choices=NIVELES, default='basico')
    duracion_horas = models.PositiveIntegerField(default=0)
    aprobado_por = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL,
                                     related_name='cursos_aprobados')
    fecha_aprobacion = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo

    @property
    def total_inscritos(self):
        return self.inscripciones.count()

class Material(models.Model):
    TIPOS = [
        ('pdf', 'PDF'),
        ('video', 'Video'),
        ('enlace', 'Enlace'),
        ('imagen', 'Imagen'),
        ('documento', 'Documento'),
    ]
    curso = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='materiales')
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPOS)
    archivo = models.FileField(upload_to='materiales/', null=True, blank=True)
    url = models.URLField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f'{self.titulo} ({self.tipo})'

class Enrollment(models.Model):
    ESTADOS = [
        ('activo', 'Activo'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    estudiante = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscripciones',
                                   limit_choices_to={'role': 'estudiante'})
    curso = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='inscripciones')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='activo')
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)
    fecha_completado = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('estudiante', 'curso')

    def __str__(self):
        return f'{self.estudiante} → {self.curso}'
