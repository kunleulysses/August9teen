const { SpiralStorageAdapter } = require('./SpiralStorageAdapter');
const Redis = require('ioredis');
const { encrypt, decrypt } = require('../security/crypto');

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
    if (!value) return undefined;
    let val;
    try {
      val = JSON.parse(value);
    } catch { return undefined; }
    if (this.encryptionKey && val && val.__enc) {
      val = JSON.parse(decrypt(val.__enc, this.encryptionKey).toString());
    }
    return val;
  }
  async set(key, value) {
    if (this.encryptionKey) {
      const enc = encrypt(JSON.stringify(value), this.encryptionKey);
      await this.redis.set(key, JSON.stringify({ __enc: enc }));
    } else {
      await this.redis.set(key, JSON.stringify(value));
    }
  }
  async del(key) {
    await this.redis.del(key);
  }
  async keys(prefix = '') {
    return await this.redis.keys(prefix + '*');
  }
  async atomicIncr(key, increment = 1) {
    // Atomic increment operation for Redis
    return await this.redis.incrby(key, increment);
  }
}

module.exports = RedisSpiralAdapter;