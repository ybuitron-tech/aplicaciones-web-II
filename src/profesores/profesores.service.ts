import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../auth/password';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const payload = this.sanitizar(data);
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    return this.prisma.teacher.create({ data: payload });
  }

  async findAll() {
    const profesores = await this.prisma.teacher.findMany();
    return profesores.map(({ password, ...seguro }) => seguro);
  }

  async findOne(id: number) {
    const profesor = await this.prisma.teacher.findUnique({ where: { id } });
    if (!profesor) throw new NotFoundException(`Profesor #${id} no encontrado`);
    const { password, ...seguro } = profesor;
    return seguro;
  }

  async login(identificacion: string, password: string) {
    if (!identificacion || !password) {
      throw new UnauthorizedException('Credenciales incompletas');
    }

    const profesor = await this.prisma.teacher.findUnique({
      where: { identificacion },
    });

    if (!profesor || !(await verifyPassword(password, profesor.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _hash, ...seguro } = profesor;
    return seguro;
  }

  async update(id: number, data: any) {
    const payload = this.sanitizar(data);
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    await this.prisma.teacher.findUniqueOrThrow({ where: { id } });
    const actualizado = await this.prisma.teacher.update({ where: { id }, data: payload });
    const { password, ...seguro } = actualizado;
    return seguro;
  }

  async remove(id: number) {
    await this.prisma.teacher.findUniqueOrThrow({ where: { id } });
    return this.prisma.teacher.delete({ where: { id } });
  }

  private sanitizar(data: any) {
    const permitidos = ['nombre', 'identificacion', 'correo', 'titulo', 'password', 'estado'];
    return permitidos.reduce((acc, key) => {
      if (data?.[key] !== undefined && data[key] !== '') acc[key] = data[key];
      return acc;
    }, {} as any);
  }
}
