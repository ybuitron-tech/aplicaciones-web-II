import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluacionesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { nombre: string; tipo: any; cantidad: number; docenteId: number; escalaId: number }) {
    return this.prisma.evaluation.create({ data });
  }

  async findAll() {
    return this.prisma.evaluation.findMany({
      include: {
        docente: true,
        escala: true,
        preguntas: { include: { question: true } },
      },
    });
  }

  async findOne(id: number) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        docente: true,
        escala: true,
        preguntas: { include: { question: true } },
      },
    });
    if (!evaluation) throw new NotFoundException(`Evaluación #${id} no encontrada`);
    return evaluation;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.evaluation.delete({ where: { id } });
  }
}