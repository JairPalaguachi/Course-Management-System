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

* PostgreSQL
* Docker
* Docker Compose

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
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Base de datos con PostgreSQL y Docker

El proyecto utiliza **PostgreSQL mediante Docker Compose**.
El archivo `docker-compose.yml` levanta un contenedor de PostgreSQL con una base de datos local para desarrollo.

### Levantar PostgreSQL

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar que el contenedor esté ejecutándose:

```bash
docker ps
```

Debería aparecer un contenedor similar a:

```text
cms_postgres
```

Ver logs del contenedor:

```bash
docker compose logs db
```

Detener PostgreSQL:

```bash
docker compose down
```

Detener PostgreSQL y eliminar el volumen de datos:

```bash
docker compose down -v
```

> Nota: `docker compose down -v` elimina la base de datos local. Se recomienda usarlo solo cuando sea necesario reiniciar completamente la base de datos de desarrollo.

---

## Instalación del backend

Antes de ejecutar el backend, asegúrate de que Docker Desktop esté abierto y PostgreSQL esté levantado:

```bash
docker compose up -d
```

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

Crear migraciones, si se agregaron o modificaron modelos:

```bash
python manage.py makemigrations
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

Endpoint de prueba del backend:

```text
http://localhost:8000/api/health/
```

---

## Panel administrativo de Django

Para acceder al panel administrativo, primero crear un superusuario:

```bash
python manage.py createsuperuser
```

Luego ejecutar el servidor:

```bash
python manage.py runserver
```

Abrir en el navegador:

```text
http://localhost:8000/admin/
```

Desde el panel administrativo se pueden gestionar los modelos principales del sistema:

* Usuarios
* Categorías
* Cursos
* Inscripciones

---

## Modelos principales de base de datos

El sistema cuenta con los siguientes modelos principales:

### User

Modelo personalizado de usuario basado en `AbstractUser`.

Roles disponibles:

* `student`: estudiante
* `tutor`: tutor
* `admin`: administrador

### Category

Modelo opcional para clasificar cursos por categoría.

### Course

Modelo principal para representar los cursos del sistema.

Estados disponibles del curso:

* `draft`: borrador
* `pending`: pendiente de aprobación
* `published`: publicado
* `rejected`: rechazado

Cada curso está asociado a un tutor y puede pertenecer a una categoría.

### Enrollment

Modelo que representa la inscripción de un estudiante a un curso.

Permite relacionar:

* estudiante
* curso
* estado de inscripción
* fecha de inscripción

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

El proyecto utiliza las siguientes ramas principales:

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
feature/database-models
fix/login-validation-error
docs/api-endpoints
setup/github-actions-ci
setup/backend-base
```

---

## Convención de commits

Se utiliza una convención simple basada en el tipo de cambio realizado.

Ejemplos:

```bash
feat: add student registration endpoint
feat: create public course catalog page
feat: define core database models
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

### Docker y PostgreSQL

Levantar PostgreSQL:

```bash
docker compose up -d
```

Ver contenedores activos:

```bash
docker ps
```

Ver logs de PostgreSQL:

```bash
docker compose logs db
```

Detener contenedores:

```bash
docker compose down
```

Eliminar contenedores y volumen de la base de datos:

```bash
docker compose down -v
```

### Backend

Verificar configuración de Django:

```bash
python manage.py check
```

Crear migraciones:

```bash
python manage.py makemigrations
```

Ejecutar migraciones:

```bash
python manage.py migrate
```

Ejecutar pruebas:

```bash
python manage.py test
```

Crear superusuario:

```bash
python manage.py createsuperuser
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

El workflow ejecuta validaciones para el backend usando un servicio temporal de PostgreSQL dentro de GitHub Actions.

### Backend

```bash
pip install -r requirements.txt
python manage.py check
python manage.py migrate
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
