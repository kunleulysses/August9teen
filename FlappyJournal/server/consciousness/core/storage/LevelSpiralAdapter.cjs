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
  }
  async init() {
    if (!this.db) this.db = new Level(this.dbPath, { valueEncoding: 'json' });
  }
  async get(key) {
    return this._callWithCB('get', async () => {
      const t = Date.now();
      try {
        const v = await this.db.get(key);
        this.recordLatency('get', Date.now() - t);
        return v;
      } catch (e) {
        if (e.notFound) return undefined;
        throw e;
      }
    });
  }
  async set(key, value) {
    return this._callWithCB('set', async () => {
      const t = Date.now();
      await this.db.put(key, value);
      this.recordLatency('set', Date.now() - t);
    });
  }
  async del(key) {
    return this._callWithCB('del', async () => {
      const t = Date.now();
      await this.db.del(key);
      this.recordLatency('del', Date.now() - t);
    });
  }
  async keys(prefix = '') {
    const keys = [];
    try {
      for await (const [key] of this.db.iterator({ gte: prefix, lte: prefix + '\xff' })) {
        keys.push(key);
      }
    } catch (error) {
      console.warn('Level keys() fallback to empty array:', error.message);
    }
    return keys;
  }
}

module.exports = LevelSpiralAdapter;
