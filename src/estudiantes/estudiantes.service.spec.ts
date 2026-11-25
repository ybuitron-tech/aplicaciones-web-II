jest.mock('@nestjs/jwt', () => ({ JwtService: class JwtService {} }));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password';

describe('EstudiantesService', () => {
  let service: EstudiantesService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudiantesService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token-de-prueba') },
        },
      ],
    }).compile();

    service = module.get(EstudiantesService);
    prisma = module.get(PrismaService);
  });

  it('hashea la contraseña al crear y nunca la devuelve', async () => {
    prisma.student.create.mockImplementation(async ({ data }) => ({ id: 1, ...data }));

    const resultado = await service.create({
      nombre: 'Ana',
      apellido: 'Perez',
      identificacion: '123456',
      correo: 'ana@test.com',
      password: '123456',
      estado: 'activo',
    });

    expect(resultado.password).toBeUndefined();
    expect(prisma.student.create.mock.calls[0][0].data.password).not.toBe('123456');
  });

  it('login devuelve un JWT cuando las credenciales son correctas', async () => {
    const password = await hashPassword('123456');
    prisma.student.findUnique.mockResolvedValue({
      id: 7,
      nombre: 'Ana',
      identificacion: '123456',
      password,
      estado: 'activo',
    });

    const resultado: any = await service.login({
      identificacion: '123456',
      password: '123456',
    });

    expect(resultado.access_token).toBe('token-de-prueba');
    expect(resultado.estudiante.password).toBeUndefined();
  });

  it('login rechaza una contraseña incorrecta', async () => {
    const password = await hashPassword('123456');
    prisma.student.findUnique.mockResolvedValue({
      id: 7,
      identificacion: '123456',
      password,
    });

    await expect(
      service.login({ identificacion: '123456', password: 'mala' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
