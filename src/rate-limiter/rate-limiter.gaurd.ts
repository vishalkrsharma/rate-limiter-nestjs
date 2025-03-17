import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { Request } from 'express';

@Injectable()
export class RateLimiterGaurd implements CanActivate {
  private readonly maxReqauests = 5;
  private readonly timeWindow = 60;

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip;
    const key = `rate-limit:${ip}`;

    const requests = await this.redisService.incrementKey(key);

    if (requests === 1) {
      await this.redisService.expireKey(key, this.timeWindow);
    }

    if (requests > this.maxReqauests) {
      throw new ForbiddenException('Too many requests');
    }

    return true;
  }
}
