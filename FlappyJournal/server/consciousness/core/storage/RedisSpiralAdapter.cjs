/**
 * Redis SpiralStorageAdapter implementation.
 */
import { SpiralStorageAdapter } from './SpiralStorageAdapter.cjs';
import Redis from 'ioredis';

class RedisSpiralAdapter extends SpiralStorageAdapter {
  constructor(redisUrl = process.env.REDIS_URL) {
    super();
    this.redisUrl = redisUrl;
    this.redis = null;
  }
  async init() {
    this.redis = new Redis(this.redisUrl);
  }
  async get(key) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : undefined;
  }
  async set(key, value) {
    await this.redis.set(key, JSON.stringify(value));
  }
  async del(key) {
    await this.redis.del(key);
  }
  async keys(prefix = '') {
    // Use SCAN for production (here, KEYS for simplicity)
    return await this.redis.keys(prefix + '*');
  }
}

export default RedisSpiralAdapter;