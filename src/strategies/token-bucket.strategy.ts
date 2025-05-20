import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  IRateLimiterStrategy,
  RateLimiterOptions,
} from '../interfaces/rate-limiter.interface';

@Injectable()
export class TokenBucketStrategy implements IRateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async allowRequest({
    key,
    capacity = 10,
    refillRate = 1,
  }: RateLimiterOptions): Promise<boolean> {
    const tokenKey = `rate-limit:bucket:${key}`;
    const lastRefillKey = `rate-limit:bucket:last:${key}`;

    const now = Date.now();
    const [tokenStr, lastStr] = await this.redisService.mGetKeys([
      tokenKey,
      lastRefillKey,
    ]);

    let tokens = parseFloat(tokenStr ?? `${capacity}`);
    let lastRefill = parseInt(lastStr ?? `${now}`);

    const delta = now - lastRefill;
    const refillAmount = Math.floor((delta / 1000) * refillRate);
    tokens = Math.min(capacity, tokens + refillAmount);
    lastRefill = now;

    if (tokens < 1) return false;
    tokens -= 1;

    await this.redisService.setKey(tokenKey, tokens.toString(), 60);
    await this.redisService.setKey(lastRefillKey, lastRefill.toString(), 60);

    return true;
  }
}
