import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { prismaClientHandler } from 'src/common/interceptor';
import { ActiveUser } from 'src/common/decorators';
import { Response } from 'express';
import { UpdateCardDto } from './dto/update-card.dto';
import { StoreInBoxParamDto } from './dto/param.dto';
import { ParseBigIntInterceptor } from 'src/common/interceptor/parse-bigint.interceptor';
import { StoreInBoxDto } from './dto/store-in-box.dto';
import { validateCardDto } from './dto/validate-card.dto';
import { CardFilterDto } from 'src/filter/dto/cards-filter.dto';

@Controller('cards')
@UseInterceptors(prismaClientHandler, ParseBigIntInterceptor)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @ActiveUser() userId: number) {
    return this.cardsService.findOneCard(id, userId);
  }

  @Post()
  create(@Body() card: CreateCardDto, @ActiveUser() userId: number) {
    return this.cardsService.createCard(card, userId);
  }

  @Patch(':id')
  updateOne(
    @Body() datas: UpdateCardDto,
    @Param('id', ParseIntPipe) id: number,

    @ActiveUser() userId: number,
  ) {
    return this.cardsService.updateOneCard(id, userId, datas);
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() userId: number,
    @Res() res: Response,
  ) {
    await this.cardsService.deleteOneCard(id, userId);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Carte supprimé',
    });
  }

  @Get()
  AllCardsFromUser(@ActiveUser() userId: number) {
    return this.cardsService.findAllFromUser(userId);
  }

  @Patch('/validate/:id')
  async validateCard(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() userId: number,
    @Body() validateCard: validateCardDto,
  ) {
    return this.cardsService.validateCard(id, userId, validateCard.status);
  }

  @Patch('store-in-box/:id')
  async storeInBox(
    @Param() { id }: StoreInBoxParamDto,
    @Body() storeInBoxData: StoreInBoxDto,
    @ActiveUser() userId: number,
  ) {
    return this.cardsService.StoreCardInBox(id, storeInBoxData, userId);
  }

  @Get('user/revision')
  listCardRevisions(@ActiveUser() userId: number) {
    return this.cardsService.listCardRevisions(userId);
  }

  @Get('/games/blitz')
  CardFilter(
    @Body() data: CardFilterDto,
    @ActiveUser() userId: number,
    @Query('randomResult', ParseBoolPipe) randomResult: boolean,
    @Query('numberOfCard', ParseIntPipe) numberOfCard: number,
  ) {
    return this.cardsService.blitz(data, userId, randomResult, numberOfCard);
  }
}
