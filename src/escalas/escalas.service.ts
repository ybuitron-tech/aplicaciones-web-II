import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEscalaDto } from './dto/escala.dto';

@Injectable()
export class EscalasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEscalaDto) {
    return this.prisma.scale.create({
      data: { nombre: dto.nombre, min: dto.min, max: dto.max },
    });
  }

  async findAll() {
    return this.prisma.scale.findMany({ orderBy: { min: 'asc' } });
  }

  async findOne(id: number) {
    const escala = await this.prisma.scale.findUnique({ where: { id } });
    if (!escala) throw new NotFoundException(`Escala #${id} no encontrada`);
    return escala;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.scale.delete({ where: { id } });
    return { eliminado: true, id };
  }
}
