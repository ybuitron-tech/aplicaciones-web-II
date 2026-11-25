import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePreguntaDto,
  UpdatePreguntaDto,
} from './dto/pregunta.dto';

@Injectable()
export class PreguntasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePreguntaDto) {
    return this.prisma.question.create({ data: dto });
  }

  async findAll() {
    return this.prisma.question.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const pregunta = await this.prisma.question.findUnique({ where: { id } });
    if (!pregunta) throw new NotFoundException(`Pregunta #${id} no encontrada`);
    return pregunta;
  }

  async update(id: number, dto: UpdatePreguntaDto) {
    await this.findOne(id);
    return this.prisma.question.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.question.delete({ where: { id } });
    return { eliminado: true, id };
  }
}
