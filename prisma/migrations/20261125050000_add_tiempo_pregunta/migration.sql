-- Tiempo opcional por pregunta (segundos)
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "tiempo" INTEGER;
