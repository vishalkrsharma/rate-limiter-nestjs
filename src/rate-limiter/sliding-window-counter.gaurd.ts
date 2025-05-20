import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SlidingWindowCounterGuard implements CanActivate {
  private readonly WINDOW_SIZE = 60;
  private readonly MAX_REQUESTS = 5;

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip;

    const now = Math.floor(Date.now() / 1000);
    const currentWindow = Math.floor(now / this.WINDOW_SIZE) * this.WINDOW_SIZE;
    const previousWindow = currentWindow - this.WINDOW_SIZE;
    const elapsed = now - currentWindow;

    const currentKey = `rate-limit:${ip}:${currentWindow}`;
    const prevKey = `rate-limit:${ip}:${previousWindow}`;

    // Get counts from both windows
    const [currCountStr, prevCountStr] = await this.redisService.mGetKeys([
      currentKey,
      prevKey,
    ]);
    const currCount = parseInt(currCountStr || '0');
    const prevCount = parseInt(prevCountStr || '0');

    // Weighted sum of requests (interpolated)
    const weight = (this.WINDOW_SIZE - elapsed) / this.WINDOW_SIZE;
    const estimatedCount = currCount + prevCount * weight;

    if (estimatedCount >= this.MAX_REQUESTS) {
      throw new ForbiddenException(
        'Too many requests - Sliding window counter limit exceeded',
      );
    }

    await this.redisService.incrementKey(currentKey);
    await this.redisService.expireKey(currentKey, this.WINDOW_SIZE * 2);

    return true;
  }
}
