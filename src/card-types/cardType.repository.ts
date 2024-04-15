import { Injectable, UseInterceptors } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CardTypesRepository {
    constructor(private readonly prismaService: PrismaService) {}

    findOne(CardTypeWhereUniqueInput: Prisma.CardTypeWhereUniqueInput) {
        return this.prismaService.cardType.findUnique({
            where: CardTypeWhereUniqueInput,
        });
    }

    findMany() {
        return this.prismaService.cardType.findMany();
    }
}