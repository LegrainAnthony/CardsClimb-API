import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: Prisma.ColorCreateNestedOneWithoutTagsInput;
}
