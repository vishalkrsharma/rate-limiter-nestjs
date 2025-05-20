import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SlidingWindowLogGuard implements CanActivate {
  private readonly WINDOW_SIZE = 60;
  private readonly MAX_REQUESTS = 5;

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip;
    const key = `rate-limit:${ip}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - this.WINDOW_SIZE;

    await this.redisService.zRemRangeByScore(key, 0, windowStart);

    const reqCount = await this.redisService.zCard(key);

    if (reqCount >= this.MAX_REQUESTS) {
      throw new ForbiddenException(
        'Too many requests - Sliding window rate limit exceeded',
      );
    }

    await this.redisService.zAdd(key, now, `${now}`);

    await this.redisService.expireKey(key, this.WINDOW_SIZE);

    return true;
  }
}
