/**
 * SpiralStorageAdapter interface and fallback in-memory adapter.
 */

class SpiralStorageAdapter {
  async init() {}
  async get(key) { return undefined; }
  async set(key, value) {}
  async del(key) {}
  async keys(prefix = '') { return []; }
  recordLatency(method, ms) {}

  _callWithCB(method, fn) {
    if (!this.circuitBreaker) {
      this.circuitBreaker = {};
    }
    if (!this.circuitBreaker[method]) {
      const { withCircuitBreaker } = require('../../utils/circuitBreaker.cjs');
      this.circuitBreaker[method] = withCircuitBreaker(fn, {
        failureThreshold: process.env.CB_FAILURES || 5,
        successThreshold: 1,
        timeout: process.env.CB_TIMEOUT || 20000,
        resetTimeout: process.env.CB_WINDOW || 30000,
      });
    }
    return this.circuitBreaker[method]();
  }

  async setEntLink(from, to, link) {
    await this.set(`ent:${from}:${to}`, link);
  }

  async getEntLinks(spiralId) {
    const keys = await this.keys(`ent:${spiralId}:`);
    const links = [];
    for (const key of keys) {
      links.push(await this.get(key));
    }
    return links;
  }
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