import { IsNotEmpty, IsString, IsInt } from 'class-validator';
import { Prisma } from '@prisma/client';
export class CreateBoxDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  user: Prisma.UserCreateNestedOneWithoutBoxesInput;

  @IsNotEmpty()
  @IsInt()
  user_id: number;
}
