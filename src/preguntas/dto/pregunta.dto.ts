import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePreguntaDto {
  @IsString()
  @IsNotEmpty()
  enunciado!: string;

  @IsOptional()
  @IsString()
  opcionA?: string;

  @IsOptional()
  @IsString()
  opcionB?: string;

  @IsOptional()
  @IsString()
  opcionC?: string;

  @IsOptional()
  @IsString()
  opcionD?: string;

  @IsString()
  @IsNotEmpty()
  respuesta!: string;
}

export class UpdatePreguntaDto extends PartialType(CreatePreguntaDto) {}
