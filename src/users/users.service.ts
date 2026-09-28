import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { username: string; password: string; role?: any }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: data.username },
      });

      if (existingUser) {
        throw new ConflictException('El nombre de usuario ya existe');
      }

      const hashedPassword = await hashPassword(data.password);

      const user = await this.prisma.user.create({
        data: {
          username: data.username,
          passwordHash: hashedPassword,
          role: data.role || 'USER',
        },
      });

      const { passwordHash, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException(error.message || 'Error al crear usuario');
    }
  }

  async findByUsernameForAuth(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    const { passwordHash, ...result } = user;
    return result;
  }
}