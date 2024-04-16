import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CardTypesService } from './cardType.services'
import { prismaClientHandler } from 'src/common/interceptor';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('cardTypes')
@UseInterceptors(prismaClientHandler)
export class CardTypesController {
    constructor(private readonly cardTypesService: CardTypesService) {}

    @Public()
    @Get()
    findAllCardsTypes() {
        return this.cardTypesService.findAll();
    }

    @Public()
    @Get(':id')
    findOneCardsTypes(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.cardTypesService.findOneCardType(id);
    }
}
