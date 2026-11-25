import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import {
  CreateProfesorDto,
  LoginProfesorDto,
  UpdateProfesorDto,
} from './dto/profesor.dto';

@Controller('api/v1/profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post('login')
  login(@Body() dto: LoginProfesorDto) {
    return this.profesoresService.login(dto);
  }

  @Post()
  create(@Body() dto: CreateProfesorDto) {
    return this.profesoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfesorDto) {
    return this.profesoresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profesoresService.remove(id);
  }
}
