import {
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  reference!: string;

  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsOptional()
  answer!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  tagIds!: number[];

  @IsNumber()
  @IsNotEmpty()
  cardTypeId!: number;
}
