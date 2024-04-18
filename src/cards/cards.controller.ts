import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ActiveUser } from 'src/common/decorators';
import { Response } from 'express';
import { UpdateCardDto } from './dto/update-card.dto';
import { StoreInBoxParamDto } from './dto/param.dto';

@Controller('cards')
@UseInterceptors(prismaClientHandler)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @ActiveUser() userId: number) {
    return this.cardsService.findOneCard(id, userId);
  }

  @Post()
  create(
    @Body() card: CreateCardDto,
    @Query('cardTypeId', ParseIntPipe) cardTypeId: number,
    @ActiveUser() userId: number,
  ) {
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

  @Get('/validate/:id')
  async validateCard(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() userId: number,
    @Query('status') status: 'failled' | 'passed',
  ) {
    return this.cardsService.validateCard(id, userId, status);
  }

  @Get('store-in-box/:id')
  async storeInBox(
    @Param() { id, boxId, boxStepId }: StoreInBoxParamDto,
    @ActiveUser() userId: number,
  ) {
    return this.cardsService.StoreCardInBox(id, boxId, boxStepId, userId);
  }
}
