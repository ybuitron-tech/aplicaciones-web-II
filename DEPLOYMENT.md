# Despliegue del backend (NestJS + Prisma)

## 1. Requisitos
- Node.js 20+
- PostgreSQL con un esquema `proyecto5` disponible

## 2. Variables de entorno
Copia `.env.example` como `.env` y ajusta:

```bash
cp .env.example .env
```

| Variable | Uso |
| --- | --- |
| `PROYECTO5_DATABASE_URL` | Cadena de conexión PostgreSQL |
| `JWT_SECRET` | Firma de tokens. **Obligatorio en producción** |
| `JWT_EXPIRES_IN` | Vigencia en segundos (por defecto 86400) |
| `FRONTEND_ORIGIN` | Origen(es) permitidos por CORS, separados por coma. **Obligatorio en producción** |
| `PORT` | Puerto del backend (por defecto 3000) |

Si falta `JWT_SECRET` o `FRONTEND_ORIGIN` con `NODE_ENV=production`, el backend falla al arrancar a propósito.

## 3. Base de datos
```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

El seed crea escalas, dos docentes, preguntas de ejemplo y una evaluación demo.
Los docentes se crean con contraseña `123456` (hasheada).

Si `migrate deploy` falla porque no existe el esquema, créalo primero:

```sql
CREATE SCHEMA IF NOT EXISTS proyecto5;
```

## 4. Ejecutar
```bash
npm install
npm run build
npm run start:prod
```

El backend quedará en `http://<HOST>:<PORT>/api/v1`.

## 5. Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/v1/estudiantes/login` | Login estudiante (devuelve JWT) |
| GET | `/api/v1/estudiantes` | Listar estudiantes |
| POST | `/api/v1/estudiantes` | Crear estudiante |
| GET | `/api/v1/estudiantes/:id` | Ver estudiante |
| PATCH | `/api/v1/estudiantes/:id` | Editar estudiante |
| PATCH | `/api/v1/estudiantes/:id/resultado` | Guardar nota/estado |
| DELETE | `/api/v1/estudiantes/:id` | Eliminar estudiante |
| POST | `/api/v1/profesores/login` | Login docente (devuelve JWT) |
| GET/POST | `/api/v1/profesores` | Listar/crear docentes |
| PATCH/DELETE | `/api/v1/profesores/:id` | Editar/eliminar docente |
| GET/POST | `/api/v1/escalas` | Escalas de calificación |
| GET/POST | `/api/v1/evaluaciones` | Evaluaciones |
| POST | `/api/v1/evaluaciones/:id/preguntas` | Asignar preguntas |
| GET/POST | `/api/v1/preguntas` | Banco de preguntas |
| POST | `/api/v1/auth/login` | Login con tabla `User` (JWT) |
| GET | `/api/v1/auth/me` | Perfil del token |

Todos los bodies se validan con `class-validator` y las respuestas nunca incluyen hashes de contraseña.

## 6. Pruebas
```bash
npm test
```

## 7. Alinear ramas
La rama `estudiantes` contiene el código real (auth, usuarios y modelos). `main` quedó en la estructura inicial y no compila. Este branch está listo para hacer merge en `main`.
