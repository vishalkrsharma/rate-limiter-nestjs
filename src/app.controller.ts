import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimiterGaurd } from 'src/rate-limiter/rate-limiter.gaurd';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(RateLimiterGaurd)
  getHello(): string {
    return this.appService.getHello();
  }
}
