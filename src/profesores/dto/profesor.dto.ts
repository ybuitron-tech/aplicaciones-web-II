import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateProfesorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nombre!: string;

  @IsString()
  @Matches(/^\d{5,20}$/, { message: 'La identificación debe tener entre 5 y 20 dígitos' })
  identificacion!: string;

  @IsEmail({}, { message: 'Correo electrónico inválido' })
  correo!: string;

  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsIn(['activo', 'inactivo'])
  estado!: string;
}

export class UpdateProfesorDto extends PartialType(CreateProfesorDto) {}

export class LoginProfesorDto {
  @IsString()
  @IsNotEmpty()
  identificacion!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
