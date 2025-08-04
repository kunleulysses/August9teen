/**
 * SpiralStorageAdapter interface and fallback in-memory adapter.
 */

class SpiralStorageAdapter {
  async init() {}
  async get(key) { return undefined; }
  async set(key, value) {}
  async del(key) {}
  async keys(prefix = '') { return []; }
}

// Default in-memory fallback
class InMemorySpiralAdapter extends SpiralStorageAdapter {
  constructor() {
    super();
    this.map = new Map();
  }
  async init() {}
  async get(key) {
    return this.map.has(key) ? this.map.get(key) : undefined;
  }
  async set(key, value) {
    this.map.set(key, value);
  }
  async del(key) {
    this.map.delete(key);
  }
  async keys(prefix = '') {
    return Array.from(this.map.keys()).filter(k => k.startsWith(prefix));
  }
}

module.exports.SpiralStorageAdapter = SpiralStorageAdapter;
module.exports.InMemorySpiralAdapter = InMemorySpiralAdapter;