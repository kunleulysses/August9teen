/**
 * Persistence interface (future):
 *   async get(id)
 *   async set(id, value)
 *   async delete(id)
 *   async has(id)
 *   async all()
 *   async close()
 * 
 * This is a stub implementation using a local Map. 
 * Replace with Postgres/other backend by following the same shape.
 */
class InMemoryStore {
  constructor() {
    this.map = new Map();
  }
  async get(id) { return this.map.get(id); }
  async set(id, value) { this.map.set(id, value); }
  async delete(id) { this.map.delete(id); }
  async has(id) { return this.map.has(id); }
  async all() { return Array.from(this.map.values()); }
  async close() {} // no-op for in-memory

  async update(id, updaterFn) {
    const prev = this.map.get(id);
    const next = updaterFn(prev);
    this.map.set(id, next);
    return next;
  }

  async pushToList(key, item) {
    const arr = this.map.get(key) || [];
    arr.push(item);
    this.map.set(key, arr);
    return arr;
  }

  async list(key) {
    return this.map.get(key) || [];
  }
}

module.exports = { InMemoryStore };