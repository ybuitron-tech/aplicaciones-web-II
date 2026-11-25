import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../auth/password';
import { jwtExpiresIn } from '../auth/auth.config';
import {
  CreateProfesorDto,
  LoginProfesorDto,
  UpdateProfesorDto,
} from './dto/profesor.dto';

@Injectable()
export class ProfesoresService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async create(dto: CreateProfesorDto) {
    const payload: any = { ...dto };
    payload.password = await hashPassword(payload.password);
    const creado = await this.prisma.teacher.create({ data: payload });
    return this.sinPassword(creado);
  }

  async findAll() {
    const profesores = await this.prisma.teacher.findMany({
      orderBy: { id: 'desc' },
    });
    return profesores.map((profesor) => this.sinPassword(profesor));
  }

  async findOne(id: number) {
    const profesor = await this.prisma.teacher.findUnique({ where: { id } });
    if (!profesor) throw new NotFoundException(`Profesor #${id} no encontrado`);
    return this.sinPassword(profesor);
  }

  async login(dto: LoginProfesorDto) {
    const profesor = await this.prisma.teacher.findUnique({
      where: { identificacion: dto.identificacion },
    });

    if (!profesor || !(await verifyPassword(dto.password, profesor.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const access_token = await this.jwt.signAsync({
      sub: profesor.id,
      rol: 'DOCENTE',
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: jwtExpiresIn,
      docente: this.sinPassword(profesor),
    };
  }

  async update(id: number, dto: UpdateProfesorDto) {
    const payload: any = { ...dto };
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    } else {
      delete payload.password;
    }
    await this.prisma.teacher.findUniqueOrThrow({ where: { id } });
    const actualizado = await this.prisma.teacher.update({
      where: { id },
      data: payload,
    });
    return this.sinPassword(actualizado);
  }

  async remove(id: number) {
    await this.prisma.teacher.findUniqueOrThrow({ where: { id } });
    await this.prisma.teacher.delete({ where: { id } });
    return { eliminado: true, id };
  }

  private sinPassword(profesor: any) {
    const { password, ...seguro } = profesor;
    return seguro;
  }
}
