import { Module } from '@nestjs/common';
import { RefreshTokenIdsStorageService } from './refresh-token-ids-storage.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (config: ConfigType<typeof appConfig>) => {
        if (process.env.NODE_ENV === 'test') {
          return { store: 'memory' };
        }
        const store = await redisStore({
          database: config.redis.db,
          socket: {
            host: config.redis.host,
            port: config.redis.port,
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
