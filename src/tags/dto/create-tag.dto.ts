import { PartialType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  color_id: number;
}
