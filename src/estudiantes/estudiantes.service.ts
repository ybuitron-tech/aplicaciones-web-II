import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../auth/password';
import { jwtExpiresIn } from '../auth/auth.config';
import {
  CreateEstudianteDto,
  LoginEstudianteDto,
  ResultadoEstudianteDto,
  UpdateEstudianteDto,
} from './dto/estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async create(dto: CreateEstudianteDto) {
    const payload: any = { ...dto };
    payload.password = await hashPassword(payload.password);
    const creado = await this.prisma.student.create({ data: payload });
    return this.sinPassword(creado);
  }

  async findAll() {
    const estudiantes = await this.prisma.student.findMany({
      orderBy: { id: 'desc' },
    });
    return estudiantes.map((est) => this.sinPassword(est));
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.student.findUnique({ where: { id } });
    if (!estudiante) throw new NotFoundException(`Estudiante #${id} no encontrado`);
    return this.sinPassword(estudiante);
  }

  async login(dto: LoginEstudianteDto) {
    const estudiante = await this.prisma.student.findUnique({
      where: { identificacion: dto.identificacion },
    });

    if (!estudiante || !(await verifyPassword(dto.password, estudiante.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const access_token = await this.jwt.signAsync({
      sub: estudiante.id,
      rol: 'ESTUDIANTE',
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: jwtExpiresIn,
      estudiante: this.sinPassword(estudiante),
    };
  }

  async guardarResultado(id: number, dto: ResultadoEstudianteDto) {
    await this.prisma.student.findUniqueOrThrow({ where: { id } });
    const actualizado = await this.prisma.student.update({
      where: { id },
      data: { nota: dto.nota, estadoResultado: dto.estadoResultado },
    });
    return this.sinPassword(actualizado);
  }

  async update(id: number, dto: UpdateEstudianteDto) {
    const payload: any = { ...dto };
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    } else {
      delete payload.password;
    }
    await this.prisma.student.findUniqueOrThrow({ where: { id } });
    const actualizado = await this.prisma.student.update({
      where: { id },
      data: payload,
    });
    return this.sinPassword(actualizado);
  }

  async remove(id: number) {
    await this.prisma.student.findUniqueOrThrow({ where: { id } });
    await this.prisma.student.delete({ where: { id } });
    return { eliminado: true, id };
  }

  private sinPassword(estudiante: any) {
    const { password, ...seguro } = estudiante;
    return seguro;
  }
}
