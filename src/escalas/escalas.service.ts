import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EscalasService {
  constructor(private prisma: PrismaService) {}

  async create(data: { nombre: string; min: number; max: number }) {
    return this.prisma.scale.create({ data });
  }

  async findAll() {
    return this.prisma.scale.findMany();
  }

  async findOne(id: number) {
    const scale = await this.prisma.scale.findUnique({ where: { id } });
    if (!scale) throw new NotFoundException(`Escala #${id} no encontrada`);
    return scale;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.scale.delete({ where: { id } });
  }
}