# UNAD Project

Plataforma web desarrollada como proyecto final académico para apoyar procesos de aprendizaje y consulta mediante videos, con autenticación, gestión de usuarios y un módulo administrativo para administrar contenido.

El repositorio está dividido en dos aplicaciones principales:

- `Front/`: cliente web construido con React, Vite y Tailwind CSS.
- `Back/`: API REST desarrollada con Spring Boot, Spring Security, JPA y PostgreSQL.

## Objetivo del proyecto

La idea central del sistema es ofrecer una plataforma de apoyo donde los usuarios puedan iniciar sesión, consultar contenido en video y, desde un panel administrativo, gestionar usuarios, roles y videos.

Actualmente el proyecto ya incluye:

- Inicio de sesión con JWT.
- Gestión de usuarios.
- Gestión de roles.
- Gestión de videos.
- Protección de rutas en frontend.
- Protección de endpoints administrativos en backend.

## Arquitectura general

El proyecto sigue una arquitectura separada por capas:

- `Front` consume la API REST del backend mediante `axios`.
- `Back` expone endpoints bajo `/api/...`.
- PostgreSQL almacena usuarios, roles y videos.
- JWT se usa para autenticar y autorizar operaciones protegidas.

Flujo general:

1. El usuario inicia sesión desde el frontend.
2. El backend valida credenciales y devuelve un token JWT.
3. El frontend guarda el token en `localStorage`.
4. Las siguientes peticiones incluyen el token en el header `Authorization`.
5. Los endpoints con permisos administrativos exigen rol `ADMIN`.

## Tecnologías usadas

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- ESLint

### Backend

- Java 21
- Spring Boot
- Spring Web MVC
- Spring Data JPA
- Spring Security
- JWT (`jjwt`)
- PostgreSQL
- Maven

## Estructura del repositorio

```text
unadproject/
|-- Back/
|   |-- src/main/java/com/unad/project_video_platform/
|   |   |-- config/
|   |   |-- controller/
|   |   |-- dto/
|   |   |-- entity/
|   |   |-- exception/
|   |   |-- repository/
|   |   |-- security/
|   |   |-- service/
|   |-- src/main/resources/
|   |   |-- application.yaml
|   |-- pom.xml
|-- Front/
|   |-- src/
|   |   |-- components/
|   |   |-- config/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- App.jsx
|   |-- package.json
|-- Documentation/
|-- docker-compose.yml
|-- README.md
```

## Módulos principales

### Frontend

Algunas pantallas y módulos visibles del cliente:

- `Login`: autenticación del usuario.
- `Main`: vista principal posterior al acceso.
- `Forum`: sección tipo foro o espacio colaborativo.
- `Profile`: perfil del usuario.
- `AdminDashboard`: panel administrativo.
- `Users`: CRUD de usuarios.
- `VideosLibrary`: biblioteca/listado de videos.
- `VideosAdmin`: formulario de creación y edición de videos.

Además, el frontend incluye:

- `ProtectedRoute` para restringir navegación a rutas autenticadas.
- Servicios API en `src/services/`.
- Configuración central de axios en `src/config/api.js`.

### Backend

La API está organizada en controladores, servicios, repositorios y entidades.

Controladores principales:

- `AuthController`
- `UserController`
- `RoleController`
- `VideoController`

Entidades principales:

- `User`
- `Role`
- `Video`

## Requisitos previos

Antes de ejecutar el proyecto, conviene tener instalado:

- Node.js 20 o superior
- npm
- Java 21
- Maven o usar el wrapper `mvnw`
- Docker Desktop (opcional, para PostgreSQL)
- PostgreSQL, si no se usará Docker

## Configuración de la base de datos

El backend está configurado para conectarse a PostgreSQL en:

- Host: `localhost`
- Puerto: `5434`
- Base de datos: `video_platform`
- Usuario: `admin`
- Contraseña: `admin123`

Eso está definido en [Back/src/main/resources/application.yaml](Back/src/main/resources/application.yaml).

El archivo [docker-compose.yml](docker-compose.yml) levanta un contenedor PostgreSQL con esa configuración.

Nota importante:

- `docker-compose.yml` hace referencia a `./init.sql`, pero ese archivo no está presente en el repositorio actual.
- Si quieres usar inicialización automática de datos, habría que crear ese archivo o quitar esa referencia del compose.

## Cómo ejecutar el proyecto

### 1. Levantar PostgreSQL

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Si prefieres una base de datos local instalada manualmente, asegúrate de replicar la misma configuración del `application.yaml`.

### 2. Ejecutar el backend

```bash
cd Back
./mvnw spring-boot:run
```

En Windows PowerShell también puedes usar:

```powershell
cd Back
.\mvnw.cmd spring-boot:run
```

El backend quedará disponible en:

- `http://localhost:8080`

### 3. Ejecutar el frontend

```bash
cd Front
npm install
npm run dev
```

Por defecto, Vite expone la aplicación en:

- `http://localhost:5173`

## Configuración del frontend

El frontend usa esta variable:

```env
VITE_API_URL=http://localhost:8080
```

Si no existe un archivo `.env`, el cliente ya tiene como fallback `http://localhost:8080` en `src/config/api.js`.

## Endpoints principales

### Autenticación

- `POST /api/auth/login`

### Usuarios

- `GET /api/users`
- `GET /api/users/{id}`
- `GET /api/users/search/email`
- `GET /api/users/search/document`
- `GET /api/users/role/{roleId}`
- `GET /api/users/exists/email`
- `GET /api/users/exists/document`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Roles

- `GET /api/roles`
- `GET /api/roles/{id}`
- `GET /api/roles/search`
- `GET /api/roles/exists`
- `POST /api/roles`
- `PUT /api/roles/{id}`
- `DELETE /api/roles/{id}`

### Videos

- `GET /api/videos`
- `GET /api/videos/{id}`
- `POST /api/videos`
- `PUT /api/videos/{id}`
- `DELETE /api/videos/{id}`

## Autenticación y seguridad

La autenticación actual funciona con:

- `email`
- `documentNumber`

Es decir, el número de documento está siendo usado como credencial de acceso. Esto puede servir para fines académicos o pruebas, pero no es lo ideal para producción.

Para un entorno real se recomendaría:

- agregar campo `password`,
- almacenar contraseñas cifradas con BCrypt,
- implementar refresh tokens,
- endurecer políticas de CORS y seguridad.

## Estado actual y observaciones

Hay varios puntos importantes para cualquier persona que continúe el desarrollo:

- El frontend y el backend ya están integrados mediante servicios API.
- Los endpoints de administración usan restricción por rol `ADMIN`.
- El backend persiste datos básicos de videos: `url`, `title`, `description`, `category` y `createdAt`.
- El frontend ya maneja campos como `visibility`, `commentsEnabled` y `tags`, pero esos campos no existen actualmente en la entidad `Video` del backend.
- En la interfaz de usuarios aparece el campo `active`, pero ese atributo no existe en la entidad `User` actual del backend.

En otras palabras, parte de la interfaz ya anticipa funcionalidades que todavía no están completamente soportadas por el modelo de datos.

## Posibles mejoras

- Implementar contraseñas reales y recuperación de acceso.
- Agregar paginación y filtros.
- Completar el modelo de videos para soportar etiquetas, visibilidad y comentarios.
- Completar el modelo de usuario si se desea manejar estado activo/inactivo.
- Añadir pruebas unitarias y de integración.
- Documentar la API con OpenAPI/Swagger.
- Crear semillas de datos iniciales para desarrollo.

## Documentación adicional

El repositorio también incluye:

- [Front/INTEGRACION.md](Front/INTEGRACION.md): notas de integración frontend-backend.
- `Documentation/`: documentación complementaria del proyecto.

## Resumen

Este repositorio contiene una base funcional para una plataforma de videos con autenticación y administración. Ya tiene una estructura clara, separación entre frontend y backend, y una integración suficiente para seguir iterando sobre nuevas funcionalidades.

Es un buen punto de partida tanto para presentar el proyecto como para continuarlo técnicamente.
