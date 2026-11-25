import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from '../auth/password';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const payload = this.sanitizar(data);
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    return this.prisma.student.create({ data: payload });
  }

  async findAll() {
    const estudiantes = await this.prisma.student.findMany();
    return estudiantes.map(({ password, ...seguro }) => seguro);
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.student.findUnique({ where: { id } });
    if (!estudiante) throw new NotFoundException(`Estudiante #${id} no encontrado`);
    const { password, ...seguro } = estudiante;
    return seguro;
  }

  async login(identificacion: string, password: string) {
    if (!identificacion || !password) {
      throw new UnauthorizedException('Credenciales incompletas');
    }

    const estudiante = await this.prisma.student.findUnique({
      where: { identificacion },
    });

    if (!estudiante || !(await verifyPassword(password, estudiante.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const { password: _hash, ...seguro } = estudiante;
    return seguro;
  }

  async update(id: number, data: any) {
    const payload = this.sanitizar(data);
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    await this.prisma.student.findUniqueOrThrow({ where: { id } });
    const actualizado = await this.prisma.student.update({ where: { id }, data: payload });
    const { password, ...seguro } = actualizado;
    return seguro;
  }

  async remove(id: number) {
    await this.prisma.student.findUniqueOrThrow({ where: { id } });
    return this.prisma.student.delete({ where: { id } });
  }

  // El frontend tiene campos solo de UI (nota, estadoResultado). Prisma los rechaza.
  private sanitizar(data: any) {
    const permitidos = ['nombre', 'apellido', 'identificacion', 'correo', 'password', 'estado'];
    return permitidos.reduce((acc, key) => {
      if (data?.[key] !== undefined && data[key] !== '') acc[key] = data[key];
      return acc;
    }, {} as any);
  }
}
