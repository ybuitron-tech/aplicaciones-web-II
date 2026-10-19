import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EvaluacionesService } from './evaluaciones.service';

@Controller('api/v1/evaluaciones')
export class EvaluacionesController {
  constructor(private readonly evaluacionesService: EvaluacionesService) {}

  @Post()
  create(@Body() body: any) {
    return this.evaluacionesService.create(body);
  }

  @Get()
  findAll() {
    return this.evaluacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evaluacionesService.remove(id);
  }
}