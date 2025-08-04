import { SpiralStorageAdapter } from './SpiralStorageAdapter';
import Redis from 'ioredis';
import { encrypt, decrypt } from '../security/crypto';

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
    if (!value) return undefined;
    let val: any;
    try {
      val = JSON.parse(value);
    } catch { return undefined; }
    if (this.encryptionKey && val && val.__enc) {
      val = JSON.parse(decrypt(val.__enc, this.encryptionKey).toString());
    }
    return val;
  }
  async set(key: string, value: any): Promise<void> {
    if (this.encryptionKey) {
      const enc = encrypt(JSON.stringify(value), this.encryptionKey);
      await this.redis.set(key, JSON.stringify({ __enc: enc }));
    } else {
      await this.redis.set(key, JSON.stringify(value));
    }
  }
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
  async keys(prefix = ''): Promise<string[]> {
    return await this.redis.keys(prefix + '*');
  }
  async atomicIncr(key: string, increment: number = 1): Promise<number> {
    // Atomic increment operation for Redis
    return await this.redis.incrby(key, increment);
  }
}

export default RedisSpiralAdapter;