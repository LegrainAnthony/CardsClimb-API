import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { UserId } from 'src/common/decorators';
import { UpdateCardDto } from './dto/update-card.dto';
import { Response } from 'express';

@Controller('cards')
@UseInterceptors(prismaClientHandler)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.cardsService.findOneCard(id, userId);
  }

  @Post()
  create(
    @Body() card: CreateCardDto,
    @Query('cardTypeId', ParseIntPipe) cardTypeId: number,
    @UserId() userId: number,
  ) {
    return this.cardsService.createCard(card, cardTypeId, userId);
  }

  @Patch(':id')
  updateOne(
    @Body() datas: UpdateCardDto,
    @Param('id', ParseIntPipe) id: number,
    @Query('cardTypeId', ParseIntPipe) cardTypeId: number,
    @UserId() userId: number,
  ) {
    return this.cardsService.updateOneCard(id, cardTypeId, userId, datas);
  }

  @Delete(':id')
  async deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @Res() res: Response,
  ) {
    await this.cardsService.deleteOneCard(id, userId);
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Carte supprimé',
    });
  }

  @Get()
  AllCardsFromAUser(@UserId() userId: number) {
    return this.cardsService.findManyCards(userId);
  }
}
