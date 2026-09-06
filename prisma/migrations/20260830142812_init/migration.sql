-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('multiple', 'vf', 'abierta');

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "opcionA" TEXT,
    "opcionB" TEXT,
    "opcionC" TEXT,
    "opcionD" TEXT,
    "respuesta" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scale" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "EvaluationType" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "docenteId" INTEGER NOT NULL,
    "escalaId" INTEGER NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationQuestion" (
    "evaluationId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "EvaluationQuestion_pkey" PRIMARY KEY ("evaluationId","questionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_identificacion_key" ON "Student"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Student_correo_key" ON "Student"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_identificacion_key" ON "Teacher"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_correo_key" ON "Teacher"("correo");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_escalaId_fkey" FOREIGN KEY ("escalaId") REFERENCES "Scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationQuestion" ADD CONSTRAINT "EvaluationQuestion_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationQuestion" ADD CONSTRAINT "EvaluationQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
