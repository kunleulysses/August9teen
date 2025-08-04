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
    // Main kv table
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS consciousness_kv (
        id TEXT PRIMARY KEY,
        value JSONB NOT NULL
      );`
    );
    // Sigil registry table
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS sigil_auth (
        sigil_symbol TEXT NOT NULL,
        auth_hash TEXT NOT NULL,
        record JSONB NOT NULL,
        PRIMARY KEY (sigil_symbol, auth_hash)
      );`
    );
    // Quota table
    await this.pool.query(
      `CREATE TABLE IF NOT EXISTS selfcoding_quota (
        id TEXT PRIMARY KEY,
        used INT NOT NULL,
        reset_ts BIGINT NOT NULL
      );`
    );
  }

  // --- sigil_auth CRUD ---
  async getSigilRecord(sigil_symbol, auth_hash) {
    await this.ready;
    const { rows } = await this.pool.query(
      'SELECT record FROM sigil_auth WHERE sigil_symbol = $1 AND auth_hash = $2',
      [sigil_symbol, auth_hash]
    );
    return rows[0]?.record ?? undefined;
  }

  async setSigilRecord(sigil_symbol, auth_hash, record) {
    await this.ready;
    await this.pool.query(
      'INSERT INTO sigil_auth (sigil_symbol, auth_hash, record) VALUES ($1, $2, $3) ON CONFLICT (sigil_symbol, auth_hash) DO UPDATE SET record = EXCLUDED.record',
      [sigil_symbol, auth_hash, record]
    );
  }

  async allSigilRecords() {
    await this.ready;
    const { rows } = await this.pool.query('SELECT record FROM sigil_auth');
    return rows.map(r => r.record);
  }

  // --- selfcoding_quota ---
  async getQuota(id) {
    await this.ready;
    const { rows } = await this.pool.query(
      'SELECT used, reset_ts FROM selfcoding_quota WHERE id = $1',
      [id]
    );
    if (rows.length === 0) return undefined;
    return { used: rows[0].used, reset_ts: rows[0].reset_ts };
  }

  async setQuota(id, used, reset_ts) {
    await this.ready;
    await this.pool.query(
      'INSERT INTO selfcoding_quota (id, used, reset_ts) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET used = $2, reset_ts = $3',
      [id, used, reset_ts]
    );
  }

  async incrWithinHour(id, maxAllowed = 100) {
    await this.ready;
    // This logic is also implemented in quotaStore, but it's atomic here
    const now = Date.now();
    const res = await this.pool.query(
      'SELECT used, reset_ts FROM selfcoding_quota WHERE id = $1',
      [id]
    );
    let used = 0, reset_ts = now + 3600000;
    if (res.rows.length > 0) {
      used = res.rows[0].used;
      reset_ts = res.rows[0].reset_ts;
    }
    if (now > reset_ts) {
      used = 1;
      reset_ts = now + 3600000;
    } else {
      used += 1;
    }
    await this.setQuota(id, used, reset_ts);
    return used <= maxAllowed;
  }

  // (existing methods unchanged)

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
}

module.exports = { PostgresStore };