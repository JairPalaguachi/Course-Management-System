import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from courses.models import Category, Course, Material, Enrollment

# Users
admin = User.objects.create_user(email='admin@cms.com', password='admin1234', nombre='Admin', apellido='Sistema', role='admin', is_staff=True, is_superuser=True)
tutor1 = User.objects.create_user(email='tutor@cms.com', password='tutor1234', nombre='Carlos', apellido='Mendoza', role='tutor')
student1 = User.objects.create_user(email='estudiante@cms.com', password='est1234', nombre='Ana', apellido='García', role='estudiante')

# Categories
prog = Category.objects.create(nombre='Programación', descripcion='Desarrollo de software')
diseno = Category.objects.create(nombre='Diseño', descripcion='Diseño gráfico y UX')
data = Category.objects.create(nombre='Datos', descripcion='Ciencia de datos e IA')

# Courses
c1 = Course.objects.create(titulo='Python desde cero', descripcion='Aprende Python paso a paso desde lo más básico hasta programación orientada a objetos.', tutor=tutor1, estado='publicado', nivel='basico', duracion_horas=20, aprobado_por=admin)
c1.categorias.add(prog)
c2 = Course.objects.create(titulo='React para principiantes', descripcion='Construye interfaces modernas con React, hooks y manejo de estado.', tutor=tutor1, estado='publicado', nivel='intermedio', duracion_horas=30, aprobado_por=admin)
c2.categorias.add(prog, diseno)
c3 = Course.objects.create(titulo='Introducción a Machine Learning', descripcion='Fundamentos de ML con Python, scikit-learn y visualización de datos.', tutor=tutor1, estado='pendiente', nivel='avanzado', duracion_horas=40)
c3.categorias.add(data, prog)

# Materials
Material.objects.create(curso=c1, titulo='Introducción a Python', tipo='pdf', url='https://docs.python.org', orden=1)
Material.objects.create(curso=c1, titulo='Variables y tipos de datos', tipo='enlace', url='https://realpython.com', orden=2)
Material.objects.create(curso=c2, titulo='Introducción a React', tipo='enlace', url='https://react.dev', orden=1)

# Enrollment
Enrollment.objects.create(estudiante=student1, curso=c1)

print("✅ Datos de prueba creados:")
print(f"   Admin:      admin@cms.com / admin1234")
print(f"   Tutor:      tutor@cms.com / tutor1234")
print(f"   Estudiante: estudiante@cms.com / est1234")
