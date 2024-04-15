import { CardType, Prisma, User } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  answer: string;
}
