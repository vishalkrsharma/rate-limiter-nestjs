// src/strategies/leaky-bucket.strategy.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  IRateLimiterStrategy,
  RateLimiterOptions,
} from '../interfaces/rate-limiter.interface';

@Injectable()
export class LeakyBucketStrategy implements IRateLimiterStrategy {
  constructor(private readonly redisService: RedisService) {}

  async allowRequest({
    key,
    capacity = 10,
    leakInterval = 1000,
  }: RateLimiterOptions): Promise<boolean> {
    const bucketKey = `rate-limit:leaky:${key}`;
    const lastLeakKey = `rate-limit:leaky:last:${key}`;

    const now = Date.now();
    const [countStr, lastStr] = await this.redisService.mGetKeys([
      bucketKey,
      lastLeakKey,
    ]);

    let count = parseInt(countStr ?? '0');
    let lastLeak = parseInt(lastStr ?? `${now}`);

    const delta = now - lastLeak;
    const leaked = Math.floor(delta / leakInterval);
    count = Math.max(0, count - leaked);
    lastLeak = now;

    if (count >= capacity) return false;
    count += 1;

    await this.redisService.setKey(bucketKey, count.toString(), 60);
    await this.redisService.setKey(lastLeakKey, lastLeak.toString(), 60);

    return true;
  }
}
