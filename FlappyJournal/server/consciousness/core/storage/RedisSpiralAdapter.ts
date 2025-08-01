import { SpiralStorageAdapter } from './SpiralStorageAdapter';
import Redis from 'ioredis';

class RedisSpiralAdapter extends SpiralStorageAdapter {
  private redisUrl: string | undefined;
  private redis: any;
  constructor(redisUrl = process.env.REDIS_URL) {
    super();
    this.redisUrl = redisUrl;
    this.redis = null;
  }
  async init(): Promise<void> {
    this.redis = new Redis(this.redisUrl);
  }
  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : undefined;
  }
  async set(key: string, value: any): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
  async keys(prefix = ''): Promise<string[]> {
    return await this.redis.keys(prefix + '*');
  }
}

export default RedisSpiralAdapter;