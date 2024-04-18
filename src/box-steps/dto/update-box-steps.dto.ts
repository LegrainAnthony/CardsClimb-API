import {
  IsOptional,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class UpdateBoxStepsDto {
  @IsOptional()
  @IsNumber()
  interval: number;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}

export class UpdateIntervalBoxStepsDto {
  @IsOptional()
  @IsInt()
  interval: number;

  // @IsOptional()
  // @IsInt()
  // order: number;
}
