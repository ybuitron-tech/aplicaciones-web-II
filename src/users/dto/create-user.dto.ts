import { IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  EVALUATOR = 'EVALUATOR',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'El usuario no puede contener solo espacios' })
  username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/\S/, { message: 'La contraseña no puede contener solo espacios' })
  password!: string;

  @IsEnum(UserRole, { message: 'El rol debe ser ADMINISTRATOR o EVALUATOR' })
  role!: UserRole;
}