import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/auth/password';

const adapter = new PrismaPg({
  connectionString: process.env.PROYECTO5_DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const docentes = [
  {
    nombre: 'Juan Perez',
    identificacion: '12345',
    correo: 'juan@gmail.com',
    titulo: 'Ingeniero',
    estado: 'activo',
  },
  {
    nombre: 'Maria Lopez',
    identificacion: '67890',
    correo: 'maria@gmail.com',
    titulo: 'Licenciada',
    estado: 'inactivo',
  },
];

const escalas = [
  { nombre: '0 - 5', min: 0, max: 5 },
  { nombre: '0 - 3', min: 0, max: 3 },
];

const preguntas = [
  {
    enunciado: '¿NestJS está basado en Angular?',
    opcionA: 'Sí',
    opcionB: 'No',
    respuesta: 'Sí',
  },
  {
    enunciado: '¿Prisma es un ORM para TypeScript?',
    opcionA: 'Verdadero',
    opcionB: 'Falso',
    respuesta: 'Verdadero',
  },
];

async function main() {
  if ((await prisma.scale.count()) === 0) {
    await prisma.scale.createMany({ data: escalas });
    console.log(`Escala(s) creadas: ${escalas.length}`);
  }

  for (const docente of docentes) {
    await prisma.teacher.upsert({
      where: { identificacion: docente.identificacion },
      update: {},
      create: { ...docente, password: await hashPassword('123456') },
    });
  }
  console.log(`Docentes verificados: ${docentes.length}`);

  if ((await prisma.question.count()) === 0) {
    await prisma.question.createMany({ data: preguntas });
    console.log(`Preguntas creadas: ${preguntas.length}`);
  }

  if ((await prisma.evaluation.count()) === 0) {
    const docente = await prisma.teacher.findUniqueOrThrow({
      where: { identificacion: '12345' },
    });
    const escala = await prisma.scale.findFirstOrThrow({
      where: { nombre: '0 - 5' },
    });
    const evaluacion = await prisma.evaluation.create({
      data: {
        nombre: 'Evaluación Demo',
        tipo: 'vf',
        cantidad: 2,
        docenteId: docente.id,
        escalaId: escala.id,
      },
    });
    const preguntasGuardadas = await prisma.question.findMany({ take: 2 });
    await prisma.evaluationQuestion.createMany({
      data: preguntasGuardadas.map((pregunta) => ({
        evaluationId: evaluacion.id,
        questionId: pregunta.id,
      })),
      skipDuplicates: true,
    });
    console.log('Evaluación demo creada');
  }

  console.log('Seed terminado');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
