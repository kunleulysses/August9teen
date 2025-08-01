import { SpiralStorageAdapter } from './SpiralStorageAdapter';
import level from 'level';

class LevelSpiralAdapter extends SpiralStorageAdapter {
  private dbPath: string;
  private db: any;
  constructor(dbPath = process.env.SPIRAL_DB_PATH || './spiraldb') {
    super();
    this.dbPath = dbPath;
    this.db = null;
  }
  async init(): Promise<void> {
    if (!this.db) this.db = level(this.dbPath, { valueEncoding: 'json' });
  }
  async get(key: string): Promise<any> {
    try {
      return await this.db.get(key);
    } catch (e: any) {
      if (e.notFound) return undefined;
      throw e;
    }
  }
  async set(key: string, value: any): Promise<void> {
    await this.db.put(key, value);
  }
  async del(key: string): Promise<void> {
    await this.db.del(key);
  }
  async keys(prefix = ''): Promise<string[]> {
    const keys: string[] = [];
    for await (const k of this.db.createKeyStream({ gte: prefix, lte: prefix + '\xff' })) {
      keys.push(k);
    }
    return keys;
  }
}

export default LevelSpiralAdapter;