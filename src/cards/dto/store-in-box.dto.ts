import { IsNumber } from 'class-validator';

export class StoreInBoxDto {
  @IsNumber()
  boxId!: number;

  @IsNumber()
  boxStepId!: number;
}
