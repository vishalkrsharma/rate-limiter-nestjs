# rate-limiter-nestjs

[![npm version](https://badge.fury.io/js/rate-limiter-nestjs.svg)](https://badge.fury.io/js/rate-limiter-nestjs)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A flexible and pluggable rate limiter module for NestJS applications powered by Redis. Supports multiple algorithms with simple configuration:

- **Fixed Window Counter**
- **Sliding Window Counter**
- **Sliding Window Log**
- **Token Bucket**
- **Leaky Bucket**

Perfect for APIs, microservices, and distributed systems.

---

## Installation

```bash
npm install rate-limiter-nestjs
```

> **Note:** Make sure Redis is running and accessible.

## Usage

### 1. Import the Module

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RateLimiterModule } from 'rate-limiter-nestjs';

@Module({
  imports: [RateLimiterModule],
})
export class AppModule {}
```

### 2. Use in Controller/Service

```ts
// app.controller.ts
import { Controller, Get, Req, ForbiddenException } from '@nestjs/common';
import { RateLimiterService } from 'rate-limiter-nestjs';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private rateLimiter: RateLimiterService) {}

  @Get()
  async handle(@Req() req: Request) {
    const allowed = await this.rateLimiter.allowRequest('token-bucket', {
      key: req.ip,
      capacity: 5,
      refillRate: 1,
    });

    if (!allowed) throw new ForbiddenException('Too many requests');

    return 'Request allowed ✅';
  }
}
```

## API

### `RateLimiterService.allowRequest(strategy: string, options: RateLimiterOptions): Promise<boolean>`

- `strategy`: One of `'fixed-window' | 'sliding-counter' | 'sliding-log' | 'token-bucket' | 'leaky-bucket'`
- `options`: See below for per-strategy options

#### `RateLimiterOptions` interface

```
interface RateLimiterOptions {
  key: string; // IP or user ID
  windowSize?: number; // e.g., 60 seconds
  maxRequests?: number; // for window-based strategies
  refillRate?: number; // for token bucket
  capacity?: number; // for token bucket/leaky bucket
  leakInterval?: number; // for leaky bucket
}
```

## Available Strategies & Examples

### Token Bucket

```ts
await rateLimiter.allowRequest('token-bucket', {
  key: 'user-ip',
  capacity: 10,
  refillRate: 2,
});
```

### Leaky Bucket

```ts
await rateLimiter.allowRequest('leaky-bucket', {
  key: 'user-ip',
  capacity: 10,
  leakInterval: 1000, // ms
  windowSize: 60, // seconds
});
```

### Fixed Window Counter

```ts
await rateLimiter.allowRequest('fixed-window', {
  key: 'user-ip',
  windowSize: 60, // seconds
  maxRequests: 10,
});
```

### Sliding Window Log

```ts
await rateLimiter.allowRequest('sliding-log', {
  key: 'user-ip',
  windowSize: 60, // seconds
  maxRequests: 10,
});
```

### Sliding Window Counter

```ts
await rateLimiter.allowRequest('sliding-counter', {
  key: 'user-ip',
  windowSize: 60, // seconds
  maxRequests: 10,
});
```

## Redis Configuration

Set the `REDIS_URL` and `REDIS_TLS` in a `.env` file or environment variables. **`REDIS_URL` is required for the module to connect to Redis.**

```
REDIS_URL=redis://localhost:6379
REDIS_TLS=false
```

## Contributing

Contributions, issues and feature requests are welcome! Feel free to open an issue or submit a pull request.

## Author

- **vishalkrsharma**

## License

This project is [MIT](LICENSE) licensed.
