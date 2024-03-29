import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { prismaClientHandler } from 'src/common/interceptor/prisma-client-handler.interceptor';

@Controller('cards')
@UseInterceptors(prismaClientHandler)
export class CardsController {
    constructor(private readonly cardsService: CardsService){}

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.cardsService.findOneCard(id)
    }

    @Post()
    create(@Body() card: CreateCardDto, @Query('cardTypeId') cardTypeId: string) {
        return this.cardsService.createCard(card, cardTypeId)
    }
}
