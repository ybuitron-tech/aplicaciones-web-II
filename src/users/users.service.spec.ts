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
});
