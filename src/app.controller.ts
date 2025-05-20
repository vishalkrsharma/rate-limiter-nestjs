import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenBucketGaurd } from 'src/rate-limiter/token-bucket.gaurd';
// import { LeakyBucketGuard } from 'src/rate-limiter/leaky-bucket.gaurd';
// import { FixedWindowCounterGaurd } from 'src/rate-limiter/fixed-window-counter.gaurd';
// import { SlidingWindowLogGuard } from 'src/rate-limiter/sliding-window-log.gaurd';
// import { SlidingWindowCounterGuard } from 'src/rate-limiter/sliding-window-counter.gaurd';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(TokenBucketGaurd)
  // @UseGuards(LeakyBucketGuard)
  // @UseGuards(FixedWindowCounterGaurd)
  // @UseGuards(SlidingWindowLogGuard)
  // @UseGuards(SlidingWindowCounterGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
