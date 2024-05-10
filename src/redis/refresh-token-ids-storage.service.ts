import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenIdsStorageService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async insert(userId: number, tokenId: string, ttl: number): Promise<void> {
    const key = this.getKey(userId);
    const tokens: string[] = (await this.cacheManager.get<string[]>(key)) || [];

    if (!tokens.includes(tokenId)) {
      tokens.push(tokenId);
    }

    await this.cacheManager.set(key, tokens, ttl);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const key = this.getKey(userId);
    const tokens: string[] = (await this.cacheManager.get<string[]>(key)) || [];
    return tokens.includes(tokenId);
  }

  async invalidate(userId: number, tokenId?: string): Promise<void> {
    const key = this.getKey(userId);

    if (tokenId) {
      let tokens: string[] = (await this.cacheManager.get<string[]>(key)) || [];
      tokens = tokens.filter((token) => token !== tokenId);

      if (tokens.length > 0) {
        await this.cacheManager.set(key, tokens);
      } else {
        await this.cacheManager.del(key);
      }
    } else {
      await this.cacheManager.del(key);
    }
  }

  private getKey(userId: number): string {
    return `user-${userId}-tokens`;
  }
}
