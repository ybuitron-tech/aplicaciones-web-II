import { IsEnum, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}