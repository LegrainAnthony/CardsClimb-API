import { IsNotEmpty, IsString } from 'class-validator';

export class validateCardDto {
  @IsString()
  @IsNotEmpty()
  status!: 'failled' | 'passed';
}
