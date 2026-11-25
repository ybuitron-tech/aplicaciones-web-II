import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

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

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(300)
  tiempo?: number;
}

export class UpdatePreguntaDto extends PartialType(CreatePreguntaDto) {}
