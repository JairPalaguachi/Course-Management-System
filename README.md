# Course Management System
**Cliente:** Vicky Pinto | **Empresa:** Tech Solution

## Stack
- Backend: Python + Django + Django REST Framework + JWT
- Frontend: React + React Router
- Base de datos: SQLite (dev) / PostgreSQL (producción)

## Credenciales de prueba
| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@cms.com | admin1234 |
| Tutor | tutor@cms.com | tutor1234 |
| Estudiante | estudiante@cms.com | est1234 |

## Cómo ejecutar

### Backend (Django)
```bash
cd backend
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers psycopg2-binary Pillow
python manage.py migrate
python seed.py          # Carga datos de prueba
python manage.py runserver
# API disponible en: http://localhost:8000/api/
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
# App disponible en: http://localhost:3000
```

## Endpoints principales de la API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login/ | Iniciar sesión |
| POST | /api/auth/register/ | Registrarse |
| POST | /api/auth/refresh/ | Renovar token |

### Cursos (públicos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/courses/ | Listar cursos publicados |
| GET | /api/courses/?q=python | Buscar cursos |
| GET | /api/courses/?nivel=basico | Filtrar por nivel |
| GET | /api/courses/?categoria=1 | Filtrar por categoría |

### Tutor
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/POST | /api/tutor/courses/ | Mis cursos / Crear curso |
| PATCH | /api/tutor/courses/{id}/ | Editar curso |
| POST | /api/tutor/courses/{id}/publish/ | Enviar a aprobación |
| POST/GET | /api/tutor/courses/{id}/materials/ | Gestionar materiales |

### Administrador
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/admin/courses/ | Todos los cursos |
| POST | /api/admin/courses/{id}/approve/ | Aprobar/rechazar curso |
| GET | /api/admin/users/ | Listado de usuarios |

### Estudiante
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/student/enroll/{id}/ | Inscribirse en curso |
| GET | /api/student/enrollments/ | Historial de cursos |
| GET | /api/student/courses/ | Cursos inscritos (con filtros) |

## Estructura del proyecto
```
cms/
├── backend/
│   ├── backend/          # Config Django
│   ├── users/            # App usuarios (modelos, vistas, auth)
│   ├── courses/          # App cursos (modelos, vistas)
│   └── seed.py           # Datos de prueba
└── frontend/
    └── src/
        ├── api/           # Cliente axios
        ├── context/       # AuthContext (JWT)
        ├── components/    # Layout, CourseCard
        └── pages/
            ├── auth/      # Login, Register
            ├── student/   # Dashboard, Catálogo
            ├── tutor/     # Dashboard, CourseForm
            └── admin/     # Dashboard, UserList
```
