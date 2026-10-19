import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EscalasService } from './escalas.service';

@Controller('api/v1/escalas')
export class EscalasController {
  constructor(private readonly escalasService: EscalasService) {}

  @Post()
  create(@Body() body: { nombre: string; min: number; max: number }) {
    return this.escalasService.create(body);
  }

  @Get()
  findAll() {
    return this.escalasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.escalasService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.escalasService.remove(id);
  }
}