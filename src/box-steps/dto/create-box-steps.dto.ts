import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBoxStepsDto {
  @IsNotEmpty()
  @IsNumber()
  interval: number;

  @IsNotEmpty()
  @IsNumber()
  boxId: number;
}
