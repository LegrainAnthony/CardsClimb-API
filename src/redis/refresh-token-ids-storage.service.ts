import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

// This service is responsible for storing and validating refresh token IDs in Redis
@Injectable()
export class RefreshTokenIdsStorageService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async insert(userId: number, tokenId: string, ttl: number): Promise<void> {
    const key = this.getKey(userId);
    await this.cacheManager.set(key, tokenId, ttl);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.cacheManager.get(this.getKey(userId));
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.cacheManager.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
