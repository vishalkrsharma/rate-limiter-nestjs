import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LeakyBucketGuard implements CanActivate {
  private readonly BUCKET_CAPACITY = 5;
  private readonly LEAK_INTERVAL = 10;

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip;
    const bucketKey = `leaky-bucket:count:${ip}`;
    const lastLeakKey = `leaky-bucket:lastLeak:${ip}`;

    const now = Math.floor(Date.now() / 1000); // seconds
    const [countStr, lastLeakStr] = await this.redisService.mGetKeys([
      bucketKey,
      lastLeakKey,
    ]);

    let currentCount = parseInt(countStr || '0');
    let lastLeak = parseInt(lastLeakStr || `${now}`);

    const timePassed = now - lastLeak;
    const leaked = Math.floor(timePassed / this.LEAK_INTERVAL);
    currentCount = Math.max(0, currentCount - leaked);
    lastLeak = leaked > 0 ? now : lastLeak;

    if (currentCount >= this.BUCKET_CAPACITY) {
      throw new ForbiddenException('Rate limit exceeded (leaky bucket full)');
    }

    currentCount++;

    const ttl = 3600;
    await this.redisService.setKey(bucketKey, `${currentCount}`, ttl);
    await this.redisService.setKey(lastLeakKey, `${lastLeak}`, ttl);

    return true;
  }
}
