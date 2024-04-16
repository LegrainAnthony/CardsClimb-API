import { Module } from '@nestjs/common';
import { CardTypesService } from './cardType.services';
import { CardTypesController } from './cardType.controller';
import { CardTypesRepository } from './cardType.repository';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CardTypesService, CardTypesRepository],
  controllers: [CardTypesController],
})
export class CardTypesModule {}
