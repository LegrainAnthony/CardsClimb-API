import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateBoxDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  user!: number;
}
