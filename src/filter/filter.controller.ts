import {
  Body,
  Controller,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FilterService } from './filter.service';
import { ActiveUser } from 'src/common/decorators';
import { CardFilterDto } from './dto/cards-filter.dto';
import { ParseBigIntInterceptor } from 'src/common/interceptor/parse-bigint.interceptor';
import { prismaClientHandler } from 'src/common/interceptor';

@Controller('filter')
@UseInterceptors(prismaClientHandler, ParseBigIntInterceptor)
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  // ! à supprimé

  @Get('blitz')
  CardFilter(
    @Body() data: CardFilterDto,
    @ActiveUser() userId: number,
    @Query('randomResult', ParseBoolPipe) randomResult: boolean,
    @Query('numberOfCard', ParseIntPipe) numberOfCard: number,
  ) {
    return this.filterService.cardFilter(
      data,
      userId,
      randomResult,
      numberOfCard,
    );
  }
}
