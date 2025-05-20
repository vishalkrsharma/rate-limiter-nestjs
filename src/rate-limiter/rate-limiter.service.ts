import { Injectable } from '@nestjs/common';
import {
  IRateLimiterStrategy,
  RateLimiterOptions,
} from 'src/interfaces/rate-limiter.interface';
import { FixedWindowCounterStrategy } from 'src/strategies/fixed-window-counter.strategy';
import { LeakyBucketStrategy } from 'src/strategies/leaky-bucket.strategy';
import { SlidingWindowCounterStrategy } from 'src/strategies/sliding-window-counter.strategy';
import { SlidingWindowLogStrategy } from 'src/strategies/sliding-window-log.strategy';
import { TokenBucketStrategy } from 'src/strategies/token-bucket.strategy';

@Injectable()
export class RateLimiterService {
  constructor(
    private readonly slidingWindowCounter: SlidingWindowCounterStrategy,
    private readonly tokenBucket: TokenBucketStrategy,
    private readonly leakyBucket: LeakyBucketStrategy,
    private readonly fixedWindowCounter: FixedWindowCounterStrategy,
    private readonly slidingWindowLog: SlidingWindowLogStrategy,
  ) {}

  private strategies: Record<string, IRateLimiterStrategy> = {};

  onModuleInit() {
    this.strategies = {
      'sliding-counter': this.slidingWindowCounter,
      'token-bucket': this.tokenBucket,
      'leaky-bucket': this.leakyBucket,
      'fixed-window': this.fixedWindowCounter,
      'sliding-log': this.slidingWindowLog,
    };
  }

  async allowRequest(
    strategy: string,
    options: RateLimiterOptions,
  ): Promise<boolean> {
    const strat = this.strategies[strategy];
    if (!strat) throw new Error(`Invalid strategy: ${strategy}`);
    return strat.allowRequest(options);
  }
}
