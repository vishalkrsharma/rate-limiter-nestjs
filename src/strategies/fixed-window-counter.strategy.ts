import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  IRateLimiterStrategy,
  RateLimiterOptions,
} from '../interfaces/rate-limiter.interface';

@Injectable()
export class FixedWindowCounterStrategy implements IRateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async allowRequest({
    key,
    windowSize = 60,
    maxRequests = 5,
  }: RateLimiterOptions): Promise<boolean> {
    const window = Math.floor(Date.now() / 1000 / windowSize);
    const redisKey = `rate-limit:fixed:${key}:${window}`;

    const currentCount = await this.redisService.incrementKey(redisKey);
    if (currentCount === 1) {
      await this.redisService.expireKey(redisKey, windowSize);
    }

    return currentCount <= maxRequests;
  }
}
