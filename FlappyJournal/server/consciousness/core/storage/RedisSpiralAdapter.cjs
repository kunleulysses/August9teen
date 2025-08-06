/**
 * Redis SpiralStorageAdapter implementation.
 */
const { SpiralStorageAdapter  } = require('./SpiralStorageAdapter.cjs');
const Redis = require('ioredis');
const fs = require('fs');
const msgpack = require('msgpack5')();
const lz4 = require('lz4js');

class RedisSpiralAdapter extends SpiralStorageAdapter {
  constructor(redisUrl = process.env.REDIS_URL, tlsCaPath = process.env.REDIS_CA) {
    super();
    this.redisUrl = redisUrl;
    this.tlsCaPath = tlsCaPath;
    this.redis = null;
  }
  async init() {
    const opts = {};
    if (this.redisUrl.startsWith('rediss://')) {
      opts.tls = { rejectUnauthorized: true };
      if (this.tlsCaPath) opts.tls.ca = fs.readFileSync(this.tlsCaPath);
    } else if (!process.env.ALLOW_INSECURE_REDIS) {
      throw new Error('Insecure Redis disabled – use rediss://');
    }
    this.redis = new Redis(this.redisUrl, opts);
    await this.redis.ping();
  }
  async get(key) {
    return this._callWithCB('get', async () => {
      const t = Date.now();
      const value = await this.redis.getBuffer(key); // Use getBuffer for binary data
      this.recordLatency('get', Date.now() - t);
      if (!value) return undefined;
      const decompressed = lz4.decompress(value);
      return msgpack.decode(decompressed);
    });
  }
  async set(key, value) {
    return this._callWithCB('set', async () => {
      const t = Date.now();
      const buf = msgpack.encode(value);
      const compressed = lz4.compress(buf);
      await this.redis.set(key, compressed);
      this.recordLatency('set', Date.now() - t);
    });
  }
  async del(key) {
    return this._callWithCB('del', async () => {
      const t = Date.now();
      await this.redis.del(key);
      this.recordLatency('del', Date.now() - t);
    });
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