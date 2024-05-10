import { UpdateCardDto } from '../dto/update-card.dto';

export interface ValidateCard extends UpdateCardDto {
  boxId: number | null;
  boxStepId: number | null;
  future_revision: number | null;
  last_revision: number;
}
