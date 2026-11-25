import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import {
  CreateEstudianteDto,
  LoginEstudianteDto,
  ResultadoEstudianteDto,
  UpdateEstudianteDto,
} from './dto/estudiante.dto';

@Controller('api/v1/estudiantes')
export class EstudiantesController {
  constructor(private readonly estudiantesService: EstudiantesService) {}

  @Post('login')
  login(@Body() dto: LoginEstudianteDto) {
    return this.estudiantesService.login(dto);
  }

  @Post()
  create(@Body() dto: CreateEstudianteDto) {
    return this.estudiantesService.create(dto);
  }

  @Get()
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.findOne(id);
  }

  @Patch(':id/resultado')
  guardarResultado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResultadoEstudianteDto,
  ) {
    return this.estudiantesService.guardarResultado(id, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEstudianteDto) {
    return this.estudiantesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estudiantesService.remove(id);
  }
}
