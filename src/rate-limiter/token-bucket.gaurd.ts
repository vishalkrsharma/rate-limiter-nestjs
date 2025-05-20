import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { Request } from 'express';

@Injectable()
export class TokenBucketGaurd implements CanActivate {
  private readonly BUCKET_SIZE = 10;
  private readonly REFILL_INTERVAL = 20;

  constructor(private readonly redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = request.ip;
    const tokenKey = `tokens:${ip}`;
    const lastRefullKey = `tokens:last_refill:${ip}`;

    const now = Math.floor(Date.now() / 1000);
    const [currentTokenStr, lastRefillStr] = await this.redisService.mGetKeys([
      tokenKey,
      lastRefullKey,
    ]);

    let currentTokens = parseInt(currentTokenStr || `${this.BUCKET_SIZE}`);
    let lastRefill = parseInt(lastRefillStr || `${now}`);

    const timePassed = now - lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.REFILL_INTERVAL);

    if (tokensToAdd > 0) {
      currentTokens = Math.min(this.BUCKET_SIZE, currentTokens + tokensToAdd);
      lastRefill = now;
    }

    if (currentTokens <= 0) {
      throw new ForbiddenException('Rate limit exceeded - Token bucket empty');
    }

    currentTokens--;

    await this.redisService.setKey(tokenKey, `${currentTokens}`, 3600);
    await this.redisService.setKey(lastRefullKey, `${lastRefill}`, 3600);

    return true;
  }
}
