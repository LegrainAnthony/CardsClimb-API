import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule } from 'src/db/prisma.module';
import { CardsRepository } from './cards.repository';
import { UserRepository } from 'src/users/users.repository';

@Module({
  imports: [PrismaModule],
  providers: [CardsService, CardsRepository, UserRepository],
  controllers: [CardsController],
})
export class CardsModule {}
