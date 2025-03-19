import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        tls: process.env.REDIS_TLS === 'true',
      },
    });

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis Connection Error:', err);
    });

    try {
      await this.client.connect();
      console.log('✅ Connected to Redis');
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
    }
  }

  async setKey(key: string, value: string, ttl: number) {
    await this.client.setEx(key, ttl, value);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async incrementKey(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async expireKey(key: string, ttl: number) {
    await this.client.expire(key, ttl);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
