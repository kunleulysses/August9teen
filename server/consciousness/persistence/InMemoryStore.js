/**
 * Persistence interface (future):
 *   async get(id)
 *   async set(id, value)
 *   async delete(id)
 *   async has(id)
 *   async all()
 * 
 * This is a stub implementation using a local Map. 
 * Replace with Postgres/other backend by following the same shape.
 */
export class InMemoryStore {
  constructor() {
    this.map = new Map();
  }
  async get(id) { return this.map.get(id); }
  async set(id, value) { this.map.set(id, value); }
  async delete(id) { this.map.delete(id); }
  async has(id) { return this.map.has(id); }
  async all() { return Array.from(this.map.values()); }
}