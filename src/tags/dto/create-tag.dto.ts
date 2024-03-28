import { Prisma } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: Prisma.ColorCreateNestedOneWithoutTagsInput;


}