import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEvaluacionDto,
  UpdateEvaluacionDto,
} from './dto/evaluacion.dto';

@Injectable()
export class EvaluacionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEvaluacionDto) {
    return this.prisma.evaluation.create({
      data: {
        nombre: dto.nombre,
        tipo: dto.tipo as any,
        cantidad: dto.cantidad,
        docenteId: dto.docenteId,
        escalaId: dto.escalaId,
      },
    });
  }

  async findAll() {
    return this.prisma.evaluation.findMany({
      include: {
        docente: true,
        escala: true,
        preguntas: { include: { question: true } },
      },
      orderBy: { id: 'desc' },
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

  async asignarPreguntas(id: number, preguntas: number[]) {
    await this.findOne(id);
    await this.prisma.evaluationQuestion.deleteMany({ where: { evaluationId: id } });
    await this.prisma.evaluationQuestion.createMany({
      data: preguntas.map((questionId) => ({ evaluationId: id, questionId })),
      skipDuplicates: true,
    });
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateEvaluacionDto) {
    await this.prisma.evaluation.findUniqueOrThrow({ where: { id } });
    return this.prisma.evaluation.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        tipo: dto.tipo as any,
        cantidad: dto.cantidad,
        docenteId: dto.docenteId,
        escalaId: dto.escalaId,
      },
    });
  }

  async remove(id: number) {
    await this.prisma.evaluation.findUniqueOrThrow({ where: { id } });
    await this.prisma.evaluation.delete({ where: { id } });
    return { eliminado: true, id };
  }
}
