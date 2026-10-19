import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return this.prisma.student.create({ data });
  }

  async findAll() {
    return this.prisma.student.findMany();
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException(`Estudiante #${id} no encontrado`);
    return student;
  }

  async update(id: number, data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    await this.findOne(id);
    return this.prisma.student.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.student.delete({ where: { id } });
  }
}