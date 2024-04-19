import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { CardsRepository } from './cards.repository';
import { UsersRepository } from 'src/users/users.repository';
import { BoxesModule } from 'src/boxes/boxes.module';
import { FilterModule } from 'src/filter/filter.module';

@Module({
  imports: [PrismaModule, BoxesModule, FilterModule],
  providers: [CardsService, CardsRepository, UsersRepository],
  controllers: [CardsController],
})
export class CardsModule {}
