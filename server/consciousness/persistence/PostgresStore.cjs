/**
 * PostgresStore: Implements the same interface as InMemoryStore, using a single JSONB table.
 *
 * Table schema:
 *   CREATE TABLE IF NOT EXISTS consciousness_kv (
 *     id TEXT PRIMARY KEY,
 *     value JSONB NOT NULL
 *   );
 */

require('../../common/tracing.cjs');
const { trace } = require('@opentelemetry/api');
const pkg = require('pg');
const { Pool } = pkg;
const { scenesCache, pathsCache, fieldsCache } = require('../utils/cache.cjs');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

class PostgresStore {
  constructor() {
    this.pool = new Pool({ connectionString: DATABASE_URL });
    this.tracer = trace.getTracer('postgres-store');
    this.ready = this._init();
  }

  _withSpan(name, fn) {
    return this.tracer.startActiveSpan(name, async span => {
      try {
        return await fn();
      } finally {
        span.end();
      }
    });
  }

  async _init() {
    return this._withSpan('PostgresStore.init', async () => {
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
    });
  }

  async get(id) {
    return this._withSpan('PostgresStore.get', async () => {
      await this.ready;
      const cache = this._selectCache(id);
      if (cache) {
        const cached = cache.get(id);
        if (cached !== undefined) return cached;
      }

      const { rows } = await this.pool.query('SELECT value FROM consciousness_kv WHERE id = $1', [id]);
      const value = rows[0]?.value ?? undefined;
      if (cache && value !== undefined) cache.set(id, value);
      return value;
    });
  }

  async set(id, value) {
    return this._withSpan('PostgresStore.set', async () => {
      await this.ready;
      const cache = this._selectCache(id);
      if (cache) cache.set(id, value);

      await this.pool.query(
        'INSERT INTO consciousness_kv (id, value) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value',
        [id, value]
      );
    });
  }

  _selectCache(id) {
    if (id.startsWith('scene:')) return scenesCache;
    if (id.startsWith('path:')) return pathsCache;
    if (id.startsWith('field:')) return fieldsCache;
    return null;
  }

  async delete(id) {
    return this._withSpan('PostgresStore.delete', async () => {
      await this.ready;
      await this.pool.query('DELETE FROM consciousness_kv WHERE id = $1', [id]);
    });
  }

  async has(id) {
    return this._withSpan('PostgresStore.has', async () => {
      await this.ready;
      const { rowCount } = await this.pool.query('SELECT 1 FROM consciousness_kv WHERE id = $1', [id]);
      return rowCount > 0;
    });
  }

  async all() {
    return this._withSpan('PostgresStore.all', async () => {
      await this.ready;
      const { rows } = await this.pool.query('SELECT value FROM consciousness_kv');
      return rows.map((r) => r.value);
    });
  }

  async close() {
    return this._withSpan('PostgresStore.close', async () => {
      await this.pool.end();
    });
  }

  async update(id, updaterFn) {
    return this._withSpan('PostgresStore.update', async () => {
      const prev = await this.get(id);
      const next = updaterFn(prev);
      await this.set(id, next);
      return next;
    });
  }

  async pushToList(key, item) {
    return this._withSpan('PostgresStore.pushToList', async () => {
      const arr = (await this.get(key)) || [];
      arr.push(item);
      await this.set(key, arr);
      return arr;
    });
  }

  async list(key) {
    return this._withSpan('PostgresStore.list', async () => {
      return (await this.get(key)) || [];
    });
  }

  // ── Sigil Registry Methods ──────────────────────────────────
  async setSigilRecord(symbol, authHash, record) {
    return this._withSpan('PostgresStore.setSigilRecord', async () => {
      await this.ready;
      await this.pool.query(
        'INSERT INTO sigil_auth (sigil_symbol, auth_hash, record) VALUES ($1, $2, $3) ON CONFLICT (sigil_symbol, auth_hash) DO UPDATE SET record = EXCLUDED.record',
        [symbol, authHash, record]
      );
    });
  }

  async getSigilRecord(symbol, authHash) {
    return this._withSpan('PostgresStore.getSigilRecord', async () => {
      await this.ready;
      const { rows } = await this.pool.query('SELECT record FROM sigil_auth WHERE sigil_symbol = $1 AND auth_hash = $2', [symbol, authHash]);
      return rows[0]?.record ?? undefined;
    });
  }

  async allSigilRecords() {
    return this._withSpan('PostgresStore.allSigilRecords', async () => {
      await this.ready;
      const { rows } = await this.pool.query('SELECT record FROM sigil_auth');
      return rows.map((r) => r.record);
    });
  }

  // ── Quota Methods ───────────────────────────────────────────
  async setQuota(id, used, reset_ts) {
    return this._withSpan('PostgresStore.setQuota', async () => {
      await this.ready;
      await this.pool.query(
        'INSERT INTO selfcoding_quota (id, used, reset_ts) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET used = EXCLUDED.used, reset_ts = EXCLUDED.reset_ts',
        [id, used, reset_ts]
      );
    });
  }

  async getQuota(id) {
    return this._withSpan('PostgresStore.getQuota', async () => {
      await this.ready;
      const { rows } = await this.pool.query('SELECT used, reset_ts FROM selfcoding_quota WHERE id = $1', [id]);
      return rows[0] ?? undefined;
    });
  }
}

module.exports = { PostgresStore };
