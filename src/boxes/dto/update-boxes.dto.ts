import { PartialType } from '@nestjs/mapped-types';
import { CreateBoxDto } from './create-boxes.dto';

export class UpdateBoxDto extends PartialType(CreateBoxDto) {}
