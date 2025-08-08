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
    this.connectionPool = [];
    this.maxConnections = parseInt(process.env.REDIS_MAX_CONNECTIONS) || 10;
    this.currentConnections = 0;
    this.connectionQueue = [];
  }
  async init() {
    const opts = {
      connectTimeout: 5000,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableOfflineQueue: false,
      maxmemoryPolicy: 'allkeys-lru'
    };
    
    if (this.redisUrl.startsWith('rediss://')) {
      opts.tls = { rejectUnauthorized: true };
      if (this.tlsCaPath) opts.tls.ca = fs.readFileSync(this.tlsCaPath);
    } else if (!process.env.ALLOW_INSECURE_REDIS) {
      throw new Error('Insecure Redis disabled – use rediss://');
    } else {
      console.warn('Using insecure Redis URL (redis://). Set ALLOW_INSECURE_REDIS=true only for local development.');
    }
    
    this.redis = new Redis(this.redisUrl, opts);
    await this.redis.ping();
    
    // Initialize connection pool
    await this.initializeConnectionPool();
  }

  async initializeConnectionPool() {
    for (let i = 0; i < Math.min(this.maxConnections, 3); i++) {
      await this.createConnection();
    }
  }

  async createConnection() {
    if (this.currentConnections >= this.maxConnections) {
      return null;
    }

    const opts = {
      connectTimeout: 5000,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      enableOfflineQueue: false
    };

    if (this.redisUrl.startsWith('rediss://')) {
      opts.tls = { rejectUnauthorized: true };
      if (this.tlsCaPath) opts.tls.ca = fs.readFileSync(this.tlsCaPath);
    } else if (process.env.ALLOW_INSECURE_REDIS) {
      console.warn('Using insecure Redis URL (redis://) for connection pool. Not recommended for production.');
    }

    const connection = new Redis(this.redisUrl, opts);
    await connection.ping();
    
    this.connectionPool.push({
      connection,
      inUse: false,
      lastUsed: Date.now()
    });
    
    this.currentConnections++;
    return connection;
  }

  async getConnection() {
    // Find available connection
    const available = this.connectionPool.find(conn => !conn.inUse);
    if (available) {
      available.inUse = true;
      available.lastUsed = Date.now();
      return available;
    }

    // Create new connection if under limit
    if (this.currentConnections < this.maxConnections) {
      const connection = await this.createConnection();
      if (connection) {
        const poolEntry = this.connectionPool[this.connectionPool.length - 1];
        poolEntry.inUse = true;
        return poolEntry;
      }
    }

    // Wait for available connection
    return new Promise((resolve) => {
      this.connectionQueue.push(resolve);
    });
  }

  releaseConnection(poolEntry) {
    poolEntry.inUse = false;
    poolEntry.lastUsed = Date.now();
    
    // Process queue
    if (this.connectionQueue.length > 0) {
      const resolve = this.connectionQueue.shift();
      poolEntry.inUse = true;
      resolve(poolEntry);
    }
  }
  async get(key) {
    return this._callWithCB('get', async () => {
      const poolEntry = await this.getConnection();
      const t = Date.now();
      try {
        const value = await poolEntry.connection.getBuffer(key);
        this.recordLatency('get', Date.now() - t);
        if (!value) return undefined;
        const decompressed = lz4.decompress(value);
        return msgpack.decode(decompressed);
      } finally {
        this.releaseConnection(poolEntry);
      }
    });
  }
  async set(key, value) {
    return this._callWithCB('set', async () => {
      const poolEntry = await this.getConnection();
      const t = Date.now();
      try {
        const buf = msgpack.encode(value);
        const compressed = lz4.compress(buf);
        await poolEntry.connection.set(key, compressed);
        this.recordLatency('set', Date.now() - t);
      } finally {
        this.releaseConnection(poolEntry);
      }
    });
  }
  async del(key) {
    return this._callWithCB('del', async () => {
      const poolEntry = await this.getConnection();
      const t = Date.now();
      try {
        await poolEntry.connection.del(key);
        this.recordLatency('del', Date.now() - t);
      } finally {
        this.releaseConnection(poolEntry);
      }
    });
  }
  async keys(prefix = '') {
    const poolEntry = await this.getConnection();
    try {
      const keys = [];
      let cursor = '0';
      do {
        const [next, batch] = await poolEntry.connection.scan(cursor, 'MATCH', prefix + '*', 'COUNT', 1000);
        keys.push(...batch);
        cursor = next;
      } while (cursor !== '0');
      return keys;
    } finally {
      this.releaseConnection(poolEntry);
    }
  }

  async atomicIncr(key, increment = 1) {
    const poolEntry = await this.getConnection();
    try {
      return await poolEntry.connection.incrby(key, increment);
    } finally {
      this.releaseConnection(poolEntry);
    }
  }

  async batchGet(keys) {
    if (!keys.length) return [];
    const poolEntry = await this.getConnection();
    try {
      const pipeline = poolEntry.connection.pipeline();
      keys.forEach(key => pipeline.getBuffer(key));
      const results = await pipeline.exec();
      
      return results.map(([err, value]) => {
        if (err) throw err;
        if (!value) return undefined;
        const decompressed = lz4.decompress(value);
        return msgpack.decode(decompressed);
      });
    } finally {
      this.releaseConnection(poolEntry);
    }
  }

  async batchSet(keyValuePairs) {
    if (!keyValuePairs.length) return;
    const poolEntry = await this.getConnection();
    try {
      const pipeline = poolEntry.connection.pipeline();
      keyValuePairs.forEach(([key, value]) => {
        const buf = msgpack.encode(value);
        const compressed = lz4.compress(buf);
        pipeline.set(key, compressed);
      });
      await pipeline.exec();
    } finally {
      this.releaseConnection(poolEntry);
    }
  }

  async close() {
    for (const poolEntry of this.connectionPool) {
      await poolEntry.connection.quit();
    }
    this.connectionPool = [];
    this.currentConnections = 0;
    
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
  }
}

module.exports = RedisSpiralAdapter;
