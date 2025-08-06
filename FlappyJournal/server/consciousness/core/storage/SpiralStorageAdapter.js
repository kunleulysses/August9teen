import type { StorageAdapter } from '../types';

export abstract class SpiralStorageAdapter implements StorageAdapter {
  encryptionKey?;
  setEncryptionKey(key) { this.encryptionKey = key; }
  abstract init();
  abstract get(key);
  abstract set(key, value);
  abstract del(key);
  abstract keys(prefix?);
}

const { encrypt, decrypt } = require('../security/crypto');

class InMemorySpiralAdapter extends SpiralStorageAdapter {
  map = new Map();
  async init() {}
  async get(key) {
    let val = this.map.get(key);
    if (this.encryptionKey && val && val.__enc) {
      val = JSON.parse(decrypt(val.__enc, this.encryptionKey).toString());
    }
    return val;
  }
  async set(key, value) {
    if (this.encryptionKey) {
      const enc = encrypt(JSON.stringify(value), this.encryptionKey);
      this.map.set(key, { __enc });
    } else {
      this.map.set(key, value);
    }
  }
  async del(key) {
    this.map.delete(key);
  }
  async keys(prefix = '') {
    return Array.from(this.map.keys()).filter(k => k.startsWith(prefix));
  }
}

module.exports.SpiralStorageAdapter = SpiralStorageAdapter;