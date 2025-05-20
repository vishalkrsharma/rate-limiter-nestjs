import { Module } from '@nestjs/common';
import { RateLimiterService } from 'src/rate-limiter/rate-limiter.service';
import { RedisService } from 'src/redis/redis.service';
import { FixedWindowCounterStrategy } from 'src/strategies/fixed-window-counter.strategy';
import { LeakyBucketStrategy } from 'src/strategies/leaky-bucket.strategy';
import { SlidingWindowCounterStrategy } from 'src/strategies/sliding-window-counter.strategy';
import { SlidingWindowLogStrategy } from 'src/strategies/sliding-window-log.strategy';
import { TokenBucketStrategy } from 'src/strategies/token-bucket.strategy';

@Module({
  providers: [
    RedisService,
    RateLimiterService,
    SlidingWindowCounterStrategy,
    TokenBucketStrategy,
    LeakyBucketStrategy,
    FixedWindowCounterStrategy,
    SlidingWindowLogStrategy,
  ],
  exports: [RateLimiterService],
})
export class RateLimiterModule {}
