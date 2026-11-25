import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateEscalaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsInt()
  @Min(0)
  min!: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  max!: number;
}

export class UpdateEscalaDto extends PartialType(CreateEscalaDto) {}
