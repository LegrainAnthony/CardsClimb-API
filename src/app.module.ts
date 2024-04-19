import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { BoxStepsModule } from './box-steps/box-steps.module';
import { BoxesModule } from './boxes/boxes.module';
import { CardsModule } from './cards/cards.module';
import { CardTypesModule } from './card-types/cardType.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './db/prisma.module';
import { ColorsModule } from './colors/colors.module';
import { ConfigModule } from '@nestjs/config';
import { configClassValidator } from './lib/config-class-validator';
import { Environment } from './env.validation';
import { FilterModule } from './filter/filter.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate:
        process.env.NODE_ENV !== 'test'
          ? configClassValidator(Environment)
          : undefined,
      load: [appConfig],
    }),
    AuthenticationModule,
    BoxStepsModule,
    BoxesModule,
    CardsModule,
    TagsModule,
    CardTypesModule,
    ColorsModule,
    UsersModule,
    CommonModule,
    PrismaModule,
    FilterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
