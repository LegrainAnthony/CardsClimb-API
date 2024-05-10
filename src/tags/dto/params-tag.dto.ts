import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class ParamsDto {
  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  id!: number;
}
