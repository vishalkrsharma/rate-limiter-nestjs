import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TokenBucketGaurd } from 'src/rate-limiter/token-bucket.gaurd';
// import { FixedWindowCounterGaurd } from 'src/rate-limiter/fixed-window-counter.gaurd';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // @UseGuards(FixedWindowCounterGaurd)
  @UseGuards(TokenBucketGaurd)
  getHello(): string {
    return this.appService.getHello();
  }
}
