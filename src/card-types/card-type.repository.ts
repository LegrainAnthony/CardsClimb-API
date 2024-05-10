import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class CardTypesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findOneById(id: number) {
    return this.prismaService.cardType.findUnique({
      where: { id },
    });
  }

  findMany() {
    return this.prismaService.cardType.findMany();
  }
}
