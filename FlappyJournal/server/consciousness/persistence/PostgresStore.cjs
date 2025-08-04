/**
 * PostgresStore: Implements the same interface as InMemoryStore, using a single JSONB table.
 *
 * Table schema:
 *   CREATE TABLE IF NOT EXISTS consciousness_kv (
 *     id TEXT PRIMARY KEY,
 *     value JSONB NOT NULL
 *   );
 */

const pkg = require('pg');
const { Pool } = pkg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

class PostgresStore {
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
    
    // Create sigil_auth table for sigil persistence
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS sigil_auth (
        sigil_symbol TEXT NOT NULL,
        auth_hash TEXT NOT NULL,
        record JSONB NOT NULL,
        PRIMARY KEY (sigil_symbol, auth_hash)
      );`
    );
    
    // Create selfcoding_quota table for quota tracking
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS selfcoding_quota (
        id TEXT PRIMARY KEY,
        used INTEGER NOT NULL DEFAULT 0,
        reset_ts BIGINT NOT NULL
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

  async update(id, updaterFn) {
    const prev = await this.get(id);
    const next = updaterFn(prev);
    await this.set(id, next);
    return next;
  }

  async pushToList(key, item) {
    const arr = (await this.get(key)) || [];
    arr.push(item);
    await this.set(key, arr);
    return arr;
  }

  async list(key) {
    return (await this.get(key)) || [];
  }

  // ── Sigil Registry Methods ──────────────────────────────────
  async setSigilRecord(symbol, authHash, record) {
    await this.ready;
    await this.pool.query(
      'INSERT INTO sigil_auth (sigil_symbol, auth_hash, record) VALUES ($1, $2, $3) ON CONFLICT (sigil_symbol, auth_hash) DO UPDATE SET record = EXCLUDED.record',
      [symbol, authHash, record]
    );
  }

  async getSigilRecord(symbol, authHash) {
    await this.ready;
    const { rows } = await this.pool.query('SELECT record FROM sigil_auth WHERE sigil_symbol = $1 AND auth_hash = $2', [symbol, authHash]);
    return rows[0]?.record ?? undefined;
  }

  async allSigilRecords() {
    await this.ready;
    const { rows } = await this.pool.query('SELECT record FROM sigil_auth');
    return rows.map(r => r.record);
  }

  // ── Quota Methods ───────────────────────────────────────────
  async setQuota(id, used, reset_ts) {
    await this.ready;
    await this.pool.query(
      'INSERT INTO selfcoding_quota (id, used, reset_ts) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET used = EXCLUDED.used, reset_ts = EXCLUDED.reset_ts',
      [id, used, reset_ts]
    );
  }

  async getQuota(id) {
    await this.ready;
    const { rows } = await this.pool.query('SELECT used, reset_ts FROM selfcoding_quota WHERE id = $1', [id]);
    return rows[0] ?? undefined;
  }
}

module.exports = { PostgresStore };
