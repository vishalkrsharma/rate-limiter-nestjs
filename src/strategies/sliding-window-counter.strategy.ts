// src/strategies/sliding-window-counter.strategy.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  IRateLimiterStrategy,
  RateLimiterOptions,
} from '../interfaces/rate-limiter.interface';

@Injectable()
export class SlidingWindowCounterStrategy implements IRateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async allowRequest({
    key,
    windowSize = 60,
    maxRequests = 5,
  }: RateLimiterOptions): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    const currentWindow = Math.floor(now / windowSize) * windowSize;
    const previousWindow = currentWindow - windowSize;
    const elapsed = now - currentWindow;

    const currentKey = `rate-limit:${key}:${currentWindow}`;
    const prevKey = `rate-limit:${key}:${previousWindow}`;

    const [currCountStr, prevCountStr] = await this.redisService.mGetKeys([
      currentKey,
      prevKey,
    ]);
    const currCount = parseInt(currCountStr || '0');
    const prevCount = parseInt(prevCountStr || '0');

    const weight = (windowSize - elapsed) / windowSize;
    const estimated = currCount + prevCount * weight;

    if (estimated >= maxRequests) return false;

    await this.redisService.incrementKey(currentKey);
    await this.redisService.expireKey(currentKey, windowSize * 2);

    return true;
  }
}
