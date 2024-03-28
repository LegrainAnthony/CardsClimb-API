import { Prisma } from '@prisma/client';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UpdateTagDto {
  @IsString()
  name: string;

  @IsNumber()
  color_id: number;
  
  color: Prisma.ColorUpdateOneRequiredWithoutTagsNestedInput;
}
