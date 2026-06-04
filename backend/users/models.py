from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault('role', 'admin')
        extra.setdefault('is_staff', True)
        extra.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra)

class User(AbstractBaseUser, PermissionsMixin):
    ROLES = [
        ('estudiante', 'Estudiante'),
        ('tutor', 'Tutor'),
        ('admin', 'Administrador'),
    ]
    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    role = models.CharField(max_length=20, choices=ROLES, default='estudiante')
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    activo = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']
    objects = UserManager()

    def __str__(self):
        return f'{self.nombre} {self.apellido} ({self.role})'

    @property
    def full_name(self):
        return f'{self.nombre} {self.apellido}'
