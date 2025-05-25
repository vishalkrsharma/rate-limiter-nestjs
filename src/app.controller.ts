import { Controller, Get, Req, ForbiddenException } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimiterService } from './rate-limiter/rate-limiter.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

  @Get()
  async getHello(@Req() req: Request): Promise<string> {
    const allowed = await this.rateLimiterService.allowRequest('token-bucket', {
      key: req.ip || 'default',
      capacity: 5,
      refillRate: 1,
    });

    if (!allowed) {
      throw new ForbiddenException('Too many requests');
    }

    return this.appService.getHello();
  }
}
