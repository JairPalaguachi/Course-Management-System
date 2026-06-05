# Course Management System

Sistema web para la gestión de cursos, desarrollado por el equipo **Tech Solution**.

El sistema permitirá administrar cursos educativos mediante distintos roles de usuario: visitantes, estudiantes, tutores y administradores. Su objetivo principal es facilitar la creación, publicación, aprobación, visualización, búsqueda, inscripción y seguimiento de cursos dentro de una plataforma web organizada.

---

## Integrantes

* BAQUE CHOEZ DERIAN FERNANDO
* PALAGUACHI JALCA JAIR MATIAS
* PATIÑO CASTRO DHAMAR AMELIE
* GUZMAN CASTILLO GUSTAVO GIAMPIERRE
* VILLON LOOR CHRISTOPHER ROBERTO

---

## Tecnologías utilizadas

### Frontend

* React
* Vite
* React Router
* Axios
* ESLint
* Prettier

### Backend

* Python
* Django
* Django REST Framework
* Django CORS Headers
* Simple JWT
* Black
* Ruff

### Base de datos

* SQLite para desarrollo inicial
* PostgreSQL para etapas posteriores del proyecto

### Control de versiones e integración

* Git
* GitHub
* GitHub Actions

---

## Estructura del proyecto

```text
Course-Management-System/
├── backend/
│   ├── config/
│   ├── users/
│   ├── courses/
│   ├── enrollments/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── docs/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
└── README.md
```

---

## Instalación del backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Crear entorno virtual:

```bash
python -m venv venv
```

Activar entorno virtual en Windows PowerShell:

```bash
.\venv\Scripts\Activate.ps1
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Ejecutar migraciones:

```bash
python manage.py migrate
```

Verificar configuración del proyecto:

```bash
python manage.py check
```

Ejecutar pruebas:

```bash
python manage.py test
```

Ejecutar servidor de desarrollo:

```bash
python manage.py runserver
```

El backend se ejecutará por defecto en:

```text
http://localhost:8000/
```

---

## Instalación del frontend

Entrar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

El frontend se ejecutará por defecto en:

```text
http://localhost:5173/
```

Compilar proyecto para producción:

```bash
npm run build
```

Ejecutar lint:

```bash
npm run lint
```

Formatear código:

```bash
npm run format
```

---

## Módulos principales del sistema

El sistema se divide en los siguientes módulos:

* **Autenticación:** registro de estudiantes, registro de tutores, inicio de sesión y protección de rutas.
* **Usuarios:** listado de usuarios registrados para administradores.
* **Cursos públicos:** visualización, búsqueda y filtrado de cursos publicados para visitantes.
* **Tutores:** creación, edición y solicitud de publicación de cursos.
* **Administración:** aprobación, rechazo, creación y edición de cursos.
* **Estudiantes:** visualización de cursos, búsqueda, filtrado, inscripción e historial de cursos.

---

## Endpoints principales

| Método    | Endpoint                                       | Rol           | Descripción                                |
| --------- | ---------------------------------------------- | ------------- | ------------------------------------------ |
| GET       | `/api/health/`                                 | Público       | Verificar que el backend esté funcionando. |
| POST      | `/api/auth/register/student/`                  | Público       | Registrar un usuario con rol estudiante.   |
| POST      | `/api/auth/register/tutor/`                    | Público       | Registrar un usuario con rol tutor.        |
| POST      | `/api/auth/login/`                             | Público       | Iniciar sesión y obtener tokens.           |
| GET       | `/api/users/`                                  | Administrador | Listar usuarios registrados.               |
| GET       | `/api/courses/public/`                         | Público       | Consultar cursos publicados.               |
| POST      | `/api/tutor/courses/`                          | Tutor         | Crear un curso en estado borrador.         |
| PUT/PATCH | `/api/tutor/courses/{id}/`                     | Tutor         | Editar un curso propio.                    |
| POST      | `/api/tutor/courses/{id}/request-publication/` | Tutor         | Solicitar publicación de un curso.         |
| GET       | `/api/admin/courses/pending/`                  | Administrador | Listar cursos pendientes de aprobación.    |
| POST      | `/api/admin/courses/{id}/approve/`             | Administrador | Aprobar un curso.                          |
| POST      | `/api/admin/courses/{id}/reject/`              | Administrador | Rechazar un curso.                         |
| POST      | `/api/admin/courses/`                          | Administrador | Crear un curso desde administración.       |
| PUT/PATCH | `/api/admin/courses/{id}/`                     | Administrador | Editar cualquier curso.                    |
| GET       | `/api/student/courses/`                        | Estudiante    | Consultar cursos disponibles.              |
| POST      | `/api/student/courses/{id}/enroll/`            | Estudiante    | Inscribirse en un curso.                   |
| GET       | `/api/student/enrollments/`                    | Estudiante    | Consultar historial de cursos inscritos.   |

---

## Flujo de ramas

El proyecto utilizará las siguientes ramas principales:

* `main`: rama estable del proyecto.
* `develop`: rama de integración para los avances del equipo.
* `feature/...`: ramas para nuevas funcionalidades.
* `fix/...`: ramas para correcciones.
* `docs/...`: ramas para documentación.
* `setup/...`: ramas para configuración del proyecto.

Ejemplos de nombres de ramas:

```bash
feature/sprint1-student-register
feature/sprint1-login
feature/sprint2-tutor-course-create
feature/sprint3-course-approval
feature/sprint4-course-enrollment
fix/login-validation-error
docs/api-endpoints
setup/github-actions-ci
```

---

## Convención de commits

Se utilizará una convención simple basada en el tipo de cambio realizado.

Ejemplos:

```bash
feat: add student registration endpoint
feat: create public course catalog page
fix: correct login validation error
docs: update API endpoints documentation
style: format frontend components
test: add enrollment validation tests
ci: add GitHub Actions workflow
chore: update project structure
```

Tipos sugeridos:

* `feat`: nueva funcionalidad.
* `fix`: corrección de errores.
* `docs`: cambios en documentación.
* `style`: formato de código.
* `test`: pruebas.
* `ci`: configuración de integración continua.
* `chore`: tareas generales de configuración.

---

## Comandos útiles

### Backend

Verificar configuración de Django:

```bash
python manage.py check
```

Ejecutar pruebas:

```bash
python manage.py test
```

Formatear código con Black:

```bash
black .
```

Revisar código con Ruff:

```bash
ruff check .
```

Ejecutar servidor:

```bash
python manage.py runserver
```

### Frontend

Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Ejecutar lint:

```bash
npm run lint
```

Compilar proyecto:

```bash
npm run build
```

Formatear código:

```bash
npm run format
```

---

## Integración continua

El proyecto utiliza GitHub Actions para validar automáticamente el backend y el frontend antes de integrar cambios a `develop` o `main`.

El workflow ejecuta:

### Backend

```bash
pip install -r requirements.txt
python manage.py check
python manage.py test
```

### Frontend

```bash
npm ci
npm run lint
npm run build
```

Si alguno de estos pasos falla, el Pull Request no debería ser integrado hasta corregir el problema.

---
