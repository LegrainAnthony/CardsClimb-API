import { Prisma } from '@prisma/client';
import { IsAlphanumeric, IsArray, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  name: string;

  @IsAlphanumeric()
  color: Prisma.ColorUpdateOneRequiredWithoutTagsNestedInput;

  @IsArray()
  cards: Prisma.CardUpdateManyWithoutTagsNestedInput;
}
