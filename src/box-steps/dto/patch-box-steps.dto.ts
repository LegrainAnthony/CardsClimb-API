import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class PatchBoxStepsDto {
  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
