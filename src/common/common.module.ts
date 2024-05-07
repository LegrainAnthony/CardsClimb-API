import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthTokenGuard } from './guards';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [ConfigModule.forFeature(appConfig), RedisModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
  ],
  exports: [],
})
export class CommonModule {}
