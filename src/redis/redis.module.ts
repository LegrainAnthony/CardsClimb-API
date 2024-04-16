import { Module } from '@nestjs/common';
import { RefreshTokenIdsStorageService } from './refresh-token-ids-storage.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (process.env.NODE_ENV === 'test') {
          return { store: 'memory' };
        }
        const store = await redisStore({
          database: parseInt(process.env.REDIS_DB, 10),
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
          },
        });
        return { store } as unknown as CacheStore;
      },
    }),
  ],
  providers: [RefreshTokenIdsStorageService],
  controllers: [],
  exports: [RefreshTokenIdsStorageService],
})
export class RedisModule {}
