import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionesService } from './evaluaciones.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EvaluacionesService', () => {
  let service: EvaluacionesService;
  let prisma: any;

  const docentePublico = {
    id: 1,
    nombre: 'Juan Perez',
    identificacion: '12345',
    correo: 'juan@gmail.com',
    titulo: 'Ingeniero',
    estado: 'activo',
  };

  const evaluacion = {
    id: 1,
    nombre: 'Evaluación Demo',
    docente: { ...docentePublico, password: 'hash-secreto' },
    escala: { id: 1, nombre: '0 - 5', min: 0, max: 5 },
    preguntas: [],
  };

  const proyectar = (args: any) => ({
    ...evaluacion,
    docente: Object.fromEntries(
      Object.keys(args.include.docente.select).map((campo) => [
        campo,
        evaluacion.docente[campo as keyof typeof evaluacion.docente],
      ]),
    ),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionesService,
        {
          provide: PrismaService,
          useValue: {
            evaluation: {
              findMany: jest.fn().mockImplementation((args) => Promise.resolve([proyectar(args)])),
              findUnique: jest.fn().mockImplementation((args) => Promise.resolve(proyectar(args))),
              findUniqueOrThrow: jest.fn().mockResolvedValue(evaluacion),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            evaluationQuestion: {
              deleteMany: jest.fn(),
              createMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EvaluacionesService>(EvaluacionesService);
    prisma = module.get(PrismaService);
  });

  it('no expone la contraseña del docente en findAll', async () => {
    const resultado: any[] = await service.findAll();
    expect(resultado[0].docente.password).toBeUndefined();
    expect(resultado[0].docente.nombre).toBe('Juan Perez');
  });

  it('no expone la contraseña del docente en findOne', async () => {
    const resultado: any = await service.findOne(1);
    expect(resultado.docente.password).toBeUndefined();
  });

  it('pide a Prisma solo los campos públicos del docente', async () => {
    await service.findAll();
    expect(prisma.evaluation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          docente: {
            select: {
              id: true,
              nombre: true,
              identificacion: true,
              correo: true,
              titulo: true,
              estado: true,
            },
          },
        }),
      }),
    );
  });
});
