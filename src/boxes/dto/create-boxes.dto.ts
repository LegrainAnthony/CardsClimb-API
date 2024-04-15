import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateBoxDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  user: number;
}
