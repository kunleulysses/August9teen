/**
 * Redis SpiralStorageAdapter implementation.
 */
const { SpiralStorageAdapter  } = require('./SpiralStorageAdapter.cjs');
const Redis = require('ioredis');

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
  async atomicIncr(key, increment = 1) {
    // Atomic increment operation for Redis
    return await this.redis.incrby(key, increment);
  }
}

module.exports = RedisSpiralAdapter;