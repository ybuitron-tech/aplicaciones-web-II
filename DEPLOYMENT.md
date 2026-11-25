# Despliegue del backend (NestJS + Prisma)

## 1. Requisitos
- Node.js 20+
- PostgreSQL con un esquema `proyecto5` disponible

## 2. Variables de entorno
Copia `.env.example` como `.env` y ajusta:

```bash
cp .env.example .env
```

- `PROYECTO5_DATABASE_URL`: cadena de conexión PostgreSQL.
- `JWT_SECRET`: **obligatorio cambiarlo** en producción (el código tiene un valor por defecto inseguro).
- `PORT`: lo usa `src/main.ts` (por defecto 3000).

## 3. Base de datos
```bash
npx prisma generate
npx prisma migrate deploy
```

Si `migrate deploy` falla porque no existe el esquema, créalo primero con tu usuario de BD:

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

## 5. Endpoints conectados con el frontend
| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/api/v1/estudiantes` | Listar estudiantes |
| POST | `/api/v1/estudiantes` | Crear estudiante |
| POST | `/api/v1/estudiantes/login` | Login estudiante |
| PATCH | `/api/v1/estudiantes/:id` | Editar estudiante |
| DELETE | `/api/v1/estudiantes/:id` | Eliminar estudiante |
| GET | `/api/v1/profesores` | Listar docentes |
| POST | `/api/v1/profesores` | Crear docente |
| POST | `/api/v1/profesores/login` | Login docente |
| PATCH | `/api/v1/profesores/:id` | Editar docente |
| DELETE | `/api/v1/profesores/:id` | Eliminar docente |

> Nota: las respuestas ya no incluyen el hash de la contraseña.

## 6. CORS
`src/main.ts` tiene `app.enableCors()` sin restricciones. En producción conviene limitarlo:

```ts
app.enableCors({ origin: 'https://URL_DEL_FRONTEND' });
```
