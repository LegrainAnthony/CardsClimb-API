import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthTokenGuard } from './guards';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';

@Module({
  imports: [ConfigModule.forFeature(jwtConfig)],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
  ],
  exports: [],
})
export class CommonModule {}
