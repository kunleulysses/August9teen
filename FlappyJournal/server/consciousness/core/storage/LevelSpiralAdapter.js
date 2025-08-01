/**
 * LevelDB SpiralStorageAdapter implementation.
 */
import { SpiralStorageAdapter } from './SpiralStorageAdapter.js';
import level from 'level';

class LevelSpiralAdapter extends SpiralStorageAdapter {
  constructor(dbPath = process.env.SPIRAL_DB_PATH || './spiraldb') {
    super();
    this.dbPath = dbPath;
    this.db = null;
  }
  async init() {
    if (!this.db) this.db = level(this.dbPath, { valueEncoding: 'json' });
  }
  async get(key) {
    try {
      return await this.db.get(key);
    } catch (e) {
      if (e.notFound) return undefined;
      throw e;
    }
  }
  async set(key, value) {
    await this.db.put(key, value);
  }
  async del(key) {
    await this.db.del(key);
  }
  async keys(prefix = '') {
    const keys = [];
    for await (const k of this.db.createKeyStream({ gte: prefix, lte: prefix + '\xff' })) {
      keys.push(k);
    }
    return keys;
  }
}

export default LevelSpiralAdapter;