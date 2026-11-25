import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';
import {
  AsignarPreguntasDto,
  CreateEvaluacionDto,
  UpdateEvaluacionDto,
} from './dto/evaluacion.dto';

@Controller('api/v1/evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Post()
  create(@Body() dto: CreateEvaluacionDto) {
    return this.evaluacionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.evaluacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionesService.findOne(id);
  }

  @Post(':id/preguntas')
  asignarPreguntas(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarPreguntasDto,
  ) {
    return this.evaluacionesService.asignarPreguntas(id, dto.preguntas);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluacionDto) {
    return this.evaluacionesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionesService.remove(id);
  }
}
