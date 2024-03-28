import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService){}

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.cardsService.findOneCard(id)
    }

    @Post()
    create(@Body() card: CreateCardDto){
        return this.cardsService.createCard(card)
    }
}
