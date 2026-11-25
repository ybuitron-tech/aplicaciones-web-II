import { PartialType } from '@nestjs/mapped-types';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

export class CreateEvaluacionDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsIn(['multiple', 'vf', 'abierta'])
  tipo!: string;

  @IsInt()
  @Min(1)
  cantidad!: number;

  @IsInt()
  docenteId!: number;

  @IsInt()
  escalaId!: number;
}

export class UpdateEvaluacionDto extends PartialType(CreateEvaluacionDto) {}

export class AsignarPreguntasDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  preguntas!: number[];
}
