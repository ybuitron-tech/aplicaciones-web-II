-- Campos de resultados usados por la pantalla de resultados del frontend
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "nota" DOUBLE PRECISION;
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "estadoResultado" TEXT DEFAULT 'pendiente';
