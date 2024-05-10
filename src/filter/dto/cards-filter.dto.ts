import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FilterOption {
  @IsString()
  @IsNotEmpty()
  operation!: 'equals' | 'in' | 'gt' | 'lt';

  @IsNumber()
  value!: number | number[];
}

export class CardFilterProperty {
  @IsString()
  @IsNotEmpty()
  property!:
    | 'reference'
    | 'created_at'
    | 'future_revision'
    | 'last_revision'
    | 'box_id'
    | 'tags';

  @IsArray()
  filterOptions!: FilterOption[];
}

export class CardFilterDto {
  @IsArray()
  filterOptions!: CardFilterProperty[];
}
