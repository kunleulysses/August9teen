/**
 * PostgresStore: Implements the same interface as InMemoryStore, using a single JSONB table.
 *
 * Table schema:
 *   CREATE TABLE IF NOT EXISTS consciousness_kv (
 *     id TEXT PRIMARY KEY,
 *     value JSONB NOT NULL
 *   );
 */

import pkg from 'pg';
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

export class PostgresStore {
  constructor() {
    this.pool = new Pool({ connectionString: DATABASE_URL });
    this.ready = this._init();
  }

  async _init() {
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS consciousness_kv (
        id TEXT PRIMARY KEY,
        value JSONB NOT NULL
      );`
    );
  }

  async get(id) {
    await this.ready;
    const { rows } = await this.pool.query('SELECT value FROM consciousness_kv WHERE id = $1', [id]);
    return rows[0]?.value ?? undefined;
  }

  async set(id, value) {
    await this.ready;
    await this.pool.query(
      'INSERT INTO consciousness_kv (id, value) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value',
      [id, value]
    );
  }

  async delete(id) {
    await this.ready;
    await this.pool.query('DELETE FROM consciousness_kv WHERE id = $1', [id]);
  }

  async has(id) {
    await this.ready;
    const { rowCount } = await this.pool.query('SELECT 1 FROM consciousness_kv WHERE id = $1', [id]);
    return rowCount > 0;
  }

  async all() {
    await this.ready;
    const { rows } = await this.pool.query('SELECT value FROM consciousness_kv');
    return rows.map(r => r.value);
  }

  async close() {
    await this.pool.end();
  }
}