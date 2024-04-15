import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { BoxStepsModule } from './box-steps/box-steps.module';
import { BoxesModule } from './boxes/boxes.module';
import { CardsModule } from './cards/cards.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './db/prisma.module';
import { ColorsModule } from './colors/colors.module';

@Module({
  imports: [
    AuthenticationModule,
    BoxStepsModule,
    BoxesModule,
    CardsModule,
    TagsModule,
    ColorsModule,
    UsersModule,
    CommonModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
