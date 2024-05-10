import {
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { FilterService } from './filter.service';
import { Public } from 'src/common/decorators';
import { ParseBigIntInterceptor } from 'src/common/interceptor/parse-bigint.interceptor';
import { prismaClientHandler } from 'src/common/interceptor';

@Controller('filter')
@UseInterceptors(prismaClientHandler, ParseBigIntInterceptor)
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Public()
  @Get('card-properties')
  cardsFilterProperties() {
    return this.filterService.CardFilterProperties();
  }
}
