import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEstudianteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  apellido!: string;

  @IsString()
  @Matches(/^\d{5,20}$/, { message: 'La identificación debe tener entre 5 y 20 dígitos' })
  identificacion!: string;

  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsIn(['activo', 'inactivo'])
  estado!: string;
}

export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {}

export class LoginEstudianteDto {
  @IsString()
  @IsNotEmpty()
  identificacion!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class ResultadoEstudianteDto {
  @IsNumber({}, { message: 'La nota debe ser un número' })
  @Min(0)
  @Max(1000)
  nota!: number;

  @IsIn(['aprobado', 'reprobado', 'pendiente'])
  estadoResultado!: string;
}
