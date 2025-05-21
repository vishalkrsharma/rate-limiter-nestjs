// src/index.ts
export * from './rate-limiter/rate-limiter.module';
export * from './rate-limiter/rate-limiter.service';
export * from './interfaces/rate-limiter.interface';

// Optionally export strategies if users want to use them directly
export * from './strategies/fixed-window-counter.strategy';
export * from './strategies/leaky-bucket.strategy';
export * from './strategies/token-bucket.strategy';
export * from './strategies/sliding-window-log.strategy';
export * from './strategies/sliding-window-counter.strategy';
