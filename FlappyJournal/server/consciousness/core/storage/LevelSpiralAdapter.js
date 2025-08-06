const { SpiralStorageAdapter } = require('./SpiralStorageAdapter');
const level = require('level');

const { encrypt, decrypt } = require('../security/crypto');

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
      let val = await this.db.get(key);
      if (this.encryptionKey && val && val.__enc) {
        val = JSON.parse(decrypt(val.__enc, this.encryptionKey).toString());
      }
      return val;
    } catch (e) {
      if (e.notFound) return undefined;
      throw e;
    }
  }
  async set(key, value) {
    if (this.encryptionKey) {
      const enc = encrypt(JSON.stringify(value), this.encryptionKey);
      await this.db.put(key, { __enc });
    } else {
      await this.db.put(key, value);
    }
  }
  async del(key) {
    await this.db.del(key);
  }
  async keys(prefix = '') {
    const keys = [];
    for await (const k of this.db.createKeyStream({ gte, lte + '\xff' })) {
      keys.push(k);
    }
    return keys;
  }
}

module.exports = LevelSpiralAdapter;