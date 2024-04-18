import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthTokenGuard } from './guards';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
  ],
  exports: [],
})
export class CommonModule {}
