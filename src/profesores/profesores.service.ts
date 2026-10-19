import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password';

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return this.prisma.teacher.create({ data });
  }

  async findAll() {
    return this.prisma.teacher.findMany();
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException(`Profesor #${id} no encontrado`);
    return teacher;
  }

  async update(id: number, data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    await this.findOne(id);
    return this.prisma.teacher.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.teacher.delete({ where: { id } });
  }
}