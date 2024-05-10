import { Module } from '@nestjs/common';
import { CardTypesService } from './card-type.services';
import { CardTypesController } from './card-type.controller';
import { CardTypesRepository } from './card-type.repository';
import { PrismaModule } from 'src/db/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CardTypesService, CardTypesRepository],
  controllers: [CardTypesController],
})
export class CardTypesModule {}
