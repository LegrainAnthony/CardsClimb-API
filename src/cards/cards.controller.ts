import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { prismaClientHandler } from 'src/common/interceptor/prisma-client-handler.interceptor';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('cards')
@UseInterceptors(prismaClientHandler)
export class CardsController {
    constructor(private readonly cardsService: CardsService){}

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
        return this.cardsService.findOneCard(id, userId)
    }

    @Post()
    create(@Body() card: CreateCardDto, @Query('cardTypeId') cardTypeId: string,  @UserId() userId: number) {
        return this.cardsService.createCard(card, cardTypeId, userId)
    }
}
