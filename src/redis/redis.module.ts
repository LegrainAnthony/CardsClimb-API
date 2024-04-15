import { Module } from '@nestjs/common';
import { RefreshTokenIdsStorageService } from './refresh-token-ids-storage.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
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
