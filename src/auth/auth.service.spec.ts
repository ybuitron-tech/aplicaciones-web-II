import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from './password';

describe('AuthService', () => {
  let service: AuthService;
  let users: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { findCredentialsByUsername: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            decode: jest.fn().mockReturnValue({ exp: 86400, iat: 0 }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    users = module.get(UsersService);
  });

  it('devuelve token con credenciales válidas', async () => {
    users.findCredentialsByUsername.mockResolvedValue({
      id: 'user-1',
      username: 'admin',
      passwordHash: await hashPassword('12345678'),
      role: 'ADMINISTRATOR',
    });

    const resultado = await service.login('admin', '12345678');
    expect(resultado.access_token).toBe('token');
  });

  it('lanza Unauthorized con contraseña incorrecta', async () => {
    users.findCredentialsByUsername.mockResolvedValue({
      id: 'user-1',
      username: 'admin',
      passwordHash: await hashPassword('12345678'),
    });

    await expect(service.login('admin', 'mala')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
