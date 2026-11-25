import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue({ id: 'u1', username: 'admin' }),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  it('busca credenciales por username', async () => {
    const resultado = await service.findCredentialsByUsername('admin');
    expect(resultado.username).toBe('admin');
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { username: 'admin' },
    });
  });

  it('no expone passwordHash en findOne', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      username: 'admin',
      passwordHash: 'hash-secreto',
      role: 'ADMINISTRATOR',
    });
    const resultado: any = await service.findOne('u1');
    expect(resultado.passwordHash).toBeUndefined();
    expect(resultado.username).toBe('admin');
  });

  it('no expone passwordHash al crear un usuario', async () => {
    prisma.user.create.mockResolvedValue({
      id: 'u2',
      username: 'evaluador',
      passwordHash: 'hash-secreto',
      role: 'EVALUATOR',
    });
    const resultado: any = await service.create({
      username: 'evaluador',
      passwordHash: 'hash-secreto',
      role: 'EVALUATOR',
    });
    expect(resultado.passwordHash).toBeUndefined();
    expect(resultado.username).toBe('evaluador');
  });
});
