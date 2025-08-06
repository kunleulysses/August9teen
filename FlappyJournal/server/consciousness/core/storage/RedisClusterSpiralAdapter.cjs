const { SpiralStorageAdapter } = require('./SpiralStorageAdapter.cjs');
const Redis = require('ioredis');
const crypto = require('crypto');

function parseClusterUrls() {
  if (process.env.REDIS_CLUSTER_URL) {
    return process.env.REDIS_CLUSTER_URL.split(',').map(url => {
      const trimmed = url.trim();
      if (trimmed.includes('://')) {
        const parsed = new URL(trimmed);
        return { host: parsed.hostname, port: parseInt(parsed.port) || 6379 };
      } else {
        const [host, port] = trimmed.split(':');
        return { host, port: parseInt(port) || 6379 };
      }
    });
  }
  return [{ host: 'localhost', port: 6379 }];
}

function crc16(data) {
  let crc = 0x0000;
  const polynomial = 0x1021;
  
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc;
}

function shardFor(id) {
  return crc16(id) % 128;
}

class RedisClusterSpiralAdapter extends SpiralStorageAdapter {
  constructor(urls) {
    super();
    this.urls = urls || parseClusterUrls();
    this.cluster = null;
    this.connectionPool = new Map();
    this.maxConnections = parseInt(process.env.REDIS_CLUSTER_MAX_CONNECTIONS) || 10;
    this.connectionTimeout = parseInt(process.env.REDIS_CLUSTER_TIMEOUT) || 5000;
  }

  async init() {
    if (!this.cluster) {
      try {
        this.cluster = new Redis.Cluster(this.urls, {
          redisOptions: {
            connectTimeout: this.connectionTimeout,
            lazyConnect: true,
            maxRetriesPerRequest: 3,
            retryDelayOnFailover: 100,
            enableOfflineQueue: false,
            maxmemoryPolicy: 'allkeys-lru'
          },
          enableReadyCheck: true,
          maxRetriesPerRequest: 3,
          retryDelayOnFailover: 100,
          scaleReads: 'slave'
        });

        await this.cluster.ping();
        console.log('✅ Redis cluster connected successfully');
      } catch (error) {
        console.error('❌ Failed to connect to Redis cluster:', error.message);
        throw error;
      }
    }
  }

  keyFor(type, id) {
    const shard = shardFor(id);
    return `spiral:${shard}:${type}:${id}`;
  }

  async get(key) {
    return this._callWithCB('get', async () => {
      if (!this.cluster) throw new Error('Cluster not initialized');
      const t = Date.now();
      try {
        const val = await this.cluster.get(key);
        this.recordLatency('get', Date.now() - t);
        return val ? JSON.parse(val) : undefined;
      } catch (error) {
        this.recordLatency('get', Date.now() - t);
        throw error;
      }
    });
  }

  async set(key, value) {
    return this._callWithCB('set', async () => {
      if (!this.cluster) throw new Error('Cluster not initialized');
      const t = Date.now();
      try {
        await this.cluster.set(key, JSON.stringify(value));
        this.recordLatency('set', Date.now() - t);
      } catch (error) {
        this.recordLatency('set', Date.now() - t);
        throw error;
      }
    });
  }

  async del(key) {
    return this._callWithCB('del', async () => {
      if (!this.cluster) throw new Error('Cluster not initialized');
      const t = Date.now();
      try {
        await this.cluster.del(key);
        this.recordLatency('del', Date.now() - t);
      } catch (error) {
        this.recordLatency('del', Date.now() - t);
        throw error;
      }
    });
  }

  async keys(prefix = '') {
    if (!this.cluster) throw new Error('Cluster not initialized');
    
    const nodes = this.cluster.nodes('master');
    let result = [];
    
    for (const node of nodes) {
      let cursor = '0';
      do {
        try {
          const [next, keys] = await node.scan(cursor, 'MATCH', `spiral:*:${prefix}*`, 'COUNT', 1000);
          result = result.concat(keys);
          cursor = next;
        } catch (error) {
          console.warn('Scan error on node:', error.message);
          break;
        }
      } while (cursor !== '0');
    }
    
    return result.map(k => k.replace(/^spiral:\d+:/, ''));
  }

  async atomicIncr(key, increment = 1) {
    if (!this.cluster) throw new Error('Cluster not initialized');
    return await this.cluster.incrby(key, increment);
  }

  async batchGet(keys) {
    if (!this.cluster) throw new Error('Cluster not initialized');
    if (!keys.length) return [];
    
    const pipeline = this.cluster.pipeline();
    keys.forEach(key => pipeline.get(key));
    
    const results = await pipeline.exec();
    return results.map(([err, result]) => {
      if (err) throw err;
      return result ? JSON.parse(result) : undefined;
    });
  }

  async batchSet(keyValuePairs) {
    if (!this.cluster) throw new Error('Cluster not initialized');
    if (!keyValuePairs.length) return;
    
    const pipeline = this.cluster.pipeline();
    keyValuePairs.forEach(([key, value]) => {
      pipeline.set(key, JSON.stringify(value));
    });
    
    await pipeline.exec();
  }

  async getClusterInfo() {
    if (!this.cluster) throw new Error('Cluster not initialized');
    
    const nodes = this.cluster.nodes();
    return {
      nodeCount: nodes.length,
      masterCount: this.cluster.nodes('master').length,
      slaveCount: this.cluster.nodes('slave').length,
      status: this.cluster.status
    };
  }

  async close() {
    if (this.cluster) {
      await this.cluster.quit();
      this.cluster = null;
    }
  }
}

module.exports = RedisClusterSpiralAdapter;
