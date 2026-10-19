import { Controller, Post, Get, Param, ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { hashPassword } from '../auth/password';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('seed')
  async createSeedUser() {
    try {
      const hashedPassword = await hashPassword('12345678');
      const user = await this.usersService.create({
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'ADMINISTRATOR',
      });
      return { mensaje: 'Usuario creado exitosamente', user };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return { mensaje: 'El usuario admin ya existe en la base de datos' };
      }
      return {
        error: 'Detalle de la base de datos',
        codigoPrisma: error?.code || 'SIN_CODIGO',
        mensaje: error?.message || String(error),
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}