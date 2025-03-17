import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });
    await this.client.connect();
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
