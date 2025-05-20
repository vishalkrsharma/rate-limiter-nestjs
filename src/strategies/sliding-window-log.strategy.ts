// src/strategies/sliding-window-log.strategy.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  IRateLimiterStrategy,
  RateLimiterOptions,
} from '../interfaces/rate-limiter.interface';

@Injectable()
export class SlidingWindowLogStrategy implements IRateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async allowRequest({
    key,
    windowSize = 60,
    maxRequests = 5,
  }: RateLimiterOptions): Promise<boolean> {
    const now = Date.now();
    const redisKey = `rate-limit:log:${key}`;

    const windowStart = now - windowSize * 1000;
    await this.redisService.zRemRangeByScore(redisKey, 0, windowStart);

    const count = await this.redisService.zCard(redisKey);
    if (count >= maxRequests) return false;

    await this.redisService.zAdd(redisKey, now, `${now}`);
    await this.redisService.expireKey(redisKey, windowSize);

    return true;
  }
}
