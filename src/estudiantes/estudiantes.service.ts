import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEstudianteDto: CreateEstudianteDto) {
    return this.prisma.student.create({
      data: createEstudianteDto,
    });
  }

  findAll() {
    return this.prisma.student.findMany();
  }

  findOne(id: number) {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }

  update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    return this.prisma.student.update({
      where: { id },
      data: updateEstudianteDto,
    });
  }

  remove(id: number) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}