import { Controller, Get, Post, Patch, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EscalasService } from './escalas.service';
import { CreateEscalaDto, UpdateEscalaDto } from './dto/escala.dto';

@Controller('api/v1/escalas')
export class EscalasController {
  constructor(private readonly escalasService: EscalasService) {}

  @Post()
  create(@Body() dto: CreateEscalaDto) {
    return this.escalasService.create(dto);
  }

  @Get()
  findAll() {
    return this.escalasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.escalasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEscalaDto) {
    return this.escalasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.escalasService.remove(id);
  }
}
