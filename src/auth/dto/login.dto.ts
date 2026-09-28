import { IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^\S*$/, { message: 'El nombre de usuario no debe contener espacios' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^\S*$/, { message: 'La contraseña no debe contener espacios' })
  password: string;
}