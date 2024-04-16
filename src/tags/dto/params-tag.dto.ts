import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class ParamsDto {
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  id: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  colorId: number;
}
