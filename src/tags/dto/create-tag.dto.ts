import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  color_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
