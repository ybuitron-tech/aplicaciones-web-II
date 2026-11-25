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
import { PreguntasService } from './preguntas.service';
import {
  CreatePreguntaDto,
  UpdatePreguntaDto,
} from './dto/pregunta.dto';

@Controller('api/v1/preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}

  @Post()
  create(@Body() dto: CreatePreguntaDto) {
    return this.preguntasService.create(dto);
  }

  @Get()
  findAll() {
    return this.preguntasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preguntasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePreguntaDto) {
    return this.preguntasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preguntasService.remove(id);
  }
}
