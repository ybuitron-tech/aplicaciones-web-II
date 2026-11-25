# Despliegue del backend (NestJS + Prisma + Supabase)

Arquitectura acordada: **Angular en Vercel**, **API NestJS en Render**, **PostgreSQL en Supabase**.

## 1. Crear la base de datos en Supabase

1. Crea un proyecto en <https://supabase.com/dashboard>.
2. Guarda la contraseña del usuario `postgres` (no se vuelve a mostrar).
3. En **SQL Editor**, crea el esquema usado por Prisma:

   ```sql
   CREATE SCHEMA IF NOT EXISTS proyecto5;
   ```

4. Copia dos cadenas de conexión desde **Project Settings > Database > Connection string**:

   | Variable | Panel de Supabase | Puerto | Uso |
   | --- | --- | --- | --- |
   | `PROYECTO5_DATABASE_URL` | **Transaction pooler** | `6543` | API en runtime (Render) |
   | `DIRECT_URL` | **URI** / conexión directa | `5432` | Prisma CLI y migraciones |

   La del pooler debe llevar `?pgbouncer=true`. Ejemplos en `.env.example`.

## 2. Variables de entorno

Copia `.env.example` como `.env` para trabajo local:

```bash
cp .env.example .env
```

| Variable | Uso |
| --- | --- |
| `PROYECTO5_DATABASE_URL` | Pooler de Supabase usado por la API |
| `DIRECT_URL` | Conexión directa usada por `prisma migrate` |
| `JWT_SECRET` | Firma de tokens. **Obligatorio en producción** |
| `JWT_EXPIRES_IN` | Vigencia en segundos (por defecto 86400) |
| `FRONTEND_ORIGIN` | Origen(es) permitidos por CORS, separados por coma. **Obligatorio en producción** |
| `PORT` | Puerto del backend (por defecto 3000) |

Si falta `JWT_SECRET` o `FRONTEND_ORIGIN` con `NODE_ENV=production`, el backend falla al arrancar a propósito.

## 3. Desplegar en Render

1. En Render, crea un **Blueprint** desde el repositorio
   `https://github.com/ybuitron-tech/aplicaciones-web-II.git` usando la rama
   `deploy-render-supabase`. Render detectará `render.yaml`.
2. Rellena las variables marcadas como `sync: false`:
   - `PROYECTO5_DATABASE_URL` → pooler de Supabase (6543).
   - `DIRECT_URL` → conexión directa (5432).
   - `FRONTEND_ORIGIN` → la URL de Vercel, sin barra final.
   - `JWT_SECRET` se genera automáticamente; guárdala en un lugar seguro si quieres reutilizarla.
3. El `buildCommand` instala dependencias, compila y ejecuta `prisma migrate deploy`.
   Las migraciones se aplican solas en cada despliegue.
4. El `healthCheckPath` es `/` y es público (devuelve 200).
5. Tras el primer despliegue, ejecuta el seed una única vez desde la consola de Render
   (**Shell** del servicio), o en local apuntando a Supabase:

   ```bash
   npm run db:seed
   ```

   El seed crea escalas, dos docentes, preguntas de ejemplo y una evaluación demo.
   Los docentes se crean con contraseña `123456` (hasheada).

## 4. Ejecutar en local

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run start:dev
```

El backend quedará en `http://localhost:3000/api/v1`.

## 5. Seguridad

- Todas las rutas requieren JWT **excepto**:
  - `GET /` (health check)
  - `POST /api/v1/auth/login`
  - `POST /api/v1/estudiantes/login`
  - `POST /api/v1/estudiantes` (registro público)
  - `GET /api/v1/estudiantes/existe/:identificacion` (validación de duplicados)
  - `POST /api/v1/profesores/login`
- El token se envía como `Authorization: Bearer <token>`.
- Las respuestas nunca incluyen hashes de contraseña.

## 6. Endpoints

| Método | Ruta | Público |
| --- | --- | --- |
| GET | `/` | ✅ |
| POST | `/api/v1/auth/login` | ✅ |
| GET | `/api/v1/auth/me` | ❌ |
| POST | `/api/v1/estudiantes/login` | ✅ |
| POST | `/api/v1/estudiantes` | ✅ |
| GET | `/api/v1/estudiantes/existe/:identificacion` | ✅ |
| GET | `/api/v1/estudiantes` | ❌ |
| GET/PATCH/DELETE | `/api/v1/estudiantes/:id` | ❌ |
| PATCH | `/api/v1/estudiantes/:id/resultado` | ❌ |
| POST | `/api/v1/profesores/login` | ✅ |
| GET/POST | `/api/v1/profesores` | ❌ |
| PATCH/DELETE | `/api/v1/profesores/:id` | ❌ |
| GET/POST/PATCH/DELETE | `/api/v1/escalas` | ❌ |
| GET/POST/PATCH/DELETE | `/api/v1/evaluaciones` | ❌ |
| POST | `/api/v1/evaluaciones/:id/preguntas` | ❌ |
| GET/POST/PATCH/DELETE | `/api/v1/preguntas` | ❌ |

## 7. Pruebas

```bash
npm run build
npm test -- --runInBand
```

## 8. Estado de las ramas

- `integracion-frontend`: integración y pruebas (6 suites, 10 tests).
- `deploy-render-supabase`: configuración de Render/Supabase (esta rama).
- `main`: estructura inicial; no compila. Pendiente de PR/merge.
