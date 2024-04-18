import { IsNotEmpty, IsString } from 'class-validator';
export class CreateBoxDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
