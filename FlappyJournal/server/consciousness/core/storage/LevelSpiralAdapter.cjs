/**
 * LevelDB SpiralStorageAdapter implementation.
 */
const { SpiralStorageAdapter  } = require('./SpiralStorageAdapter.cjs');
const { Level } = require('level');

class LevelSpiralAdapter extends SpiralStorageAdapter {
  constructor(dbPath = process.env.SPIRAL_DB_PATH || './spiraldb') {
    super();
    this.dbPath = dbPath;
    this.db = null;
    this.connectionPool = [];
    this.maxConnections = parseInt(process.env.LEVEL_MAX_CONNECTIONS) || 5;
    this.currentConnections = 0;
    this.connectionQueue = [];
  }
  async init() {
    if (!this.db) {
      this.db = new Level(this.dbPath, { 
        valueEncoding: 'json',
        cacheSize: 32 * 1024 * 1024,
        writeBufferSize: 16 * 1024 * 1024,
        maxOpenFiles: 1000
      });
      
      // Initialize connection pool for batch operations
      await this.initializeConnectionPool();
    }
  }

  async initializeConnectionPool() {
    // LevelDB doesn't need multiple connections like Redis, but we can simulate
    // connection pooling for batch operations and concurrent access patterns
    for (let i = 0; i < Math.min(this.maxConnections, 3); i++) {
      this.connectionPool.push({
        id: i,
        inUse: false,
        lastUsed: Date.now(),
        batchQueue: []
      });
      this.currentConnections++;
    }
  }

  async getConnection() {
    const available = this.connectionPool.find(conn => !conn.inUse);
    if (available) {
      available.inUse = true;
      available.lastUsed = Date.now();
      return available;
    }

    return new Promise((resolve) => {
      this.connectionQueue.push(resolve);
    });
  }

  releaseConnection(poolEntry) {
    poolEntry.inUse = false;
    poolEntry.lastUsed = Date.now();
    
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
        const v = await this.db.get(key);
        this.recordLatency('get', Date.now() - t);
        return v;
      } catch (e) {
        this.recordLatency('get', Date.now() - t);
        if (e.notFound) return undefined;
        throw e;
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
        await this.db.put(key, value);
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
        await this.db.del(key);
        this.recordLatency('del', Date.now() - t);
      } finally {
        this.releaseConnection(poolEntry);
      }
    });
  }
  async keys(prefix = '') {
    const poolEntry = await this.getConnection();
    const keys = [];
    try {
      for await (const [key] of this.db.iterator({ gte: prefix, lte: prefix + '\xff' })) {
        keys.push(key);
      }
    } catch (error) {
      console.warn('Level keys() fallback to empty array:', error.message);
    } finally {
      this.releaseConnection(poolEntry);
    }
    return keys;
  }

  async batchGet(keys) {
    if (!keys.length) return [];
    const poolEntry = await this.getConnection();
    try {
      const results = [];
      for (const key of keys) {
        try {
          const value = await this.db.get(key);
          results.push(value);
        } catch (e) {
          if (e.notFound) {
            results.push(undefined);
          } else {
            throw e;
          }
        }
      }
      return results;
    } finally {
      this.releaseConnection(poolEntry);
    }
  }

  async batchSet(keyValuePairs) {
    if (!keyValuePairs.length) return;
    const poolEntry = await this.getConnection();
    try {
      const batch = this.db.batch();
      keyValuePairs.forEach(([key, value]) => {
        batch.put(key, value);
      });
      await batch.write();
    } finally {
      this.releaseConnection(poolEntry);
    }
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
    this.connectionPool = [];
    this.currentConnections = 0;
  }
}

module.exports = LevelSpiralAdapter;
