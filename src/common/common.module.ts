import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtInterceptor,
    },
  ],
  exports: [],
})
export class CommonModule {}
