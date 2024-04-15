import { Module } from '@nestjs/common';
import { RefreshTokenIdsStorageService } from './refresh-token-ids-storage.service';

@Module({
  imports: [],
  providers: [RefreshTokenIdsStorageService],
  controllers: [],
  exports: [RefreshTokenIdsStorageService],
})
export class RedisModule {}
