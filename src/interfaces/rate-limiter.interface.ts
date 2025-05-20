export interface RateLimiterOptions {
  key: string; // IP or user ID
  windowSize?: number; // e.g., 60 seconds
  maxRequests?: number; // default: 5
  refillRate?: number; // for token bucket
  capacity?: number; // for token bucket
  leakInterval?: number; // for leaky bucket
}

export interface IRateLimiterStrategy {
  allowRequest(options: RateLimiterOptions): Promise<boolean>;
}
