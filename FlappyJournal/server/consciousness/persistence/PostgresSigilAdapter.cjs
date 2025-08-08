const { Pool } = require('pg');

class PostgresSigilAdapter {
  constructor(connectionString = process.env.DATABASE_URL) {
    if (!connectionString) throw new Error('DATABASE_URL is required for PostgresSigilAdapter');
    this.pool = new Pool({ connectionString });
    this.defaultTenant = process.env.DEFAULT_TENANT || 'public';
    this.ready = this._init();
  }

  async _init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS tenant_sigil_auth (
        tenant_id TEXT NOT NULL,
        sigil_symbol TEXT NOT NULL,
        auth_hash TEXT NOT NULL,
        record JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (tenant_id, sigil_symbol, auth_hash)
      );
    `);
  }

  async open() {
    await this.ready;
  }

  async getHealth() {
    try {
      await this.ready;
      await this.pool.query('SELECT 1');
      return { status: 'healthy' };
    } catch (e) {
      return { status: 'degraded', error: e.message };
    }
  }

  async setSigilRecord(tenantId, symbol, authHash, record) {
    tenantId = tenantId || this.defaultTenant;
    await this.ready;
    await this.pool.query(
      `INSERT INTO tenant_sigil_auth (tenant_id, sigil_symbol, auth_hash, record, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (tenant_id, sigil_symbol, auth_hash)
       DO UPDATE SET record = EXCLUDED.record, updated_at = NOW()`,
      [tenantId, symbol, authHash, record]
    );
  }

  async getSigilRecord(tenantId, symbol, authHash) {
    tenantId = tenantId || this.defaultTenant;
    await this.ready;
    const { rows } = await this.pool.query(
      `SELECT record FROM tenant_sigil_auth WHERE tenant_id = $1 AND sigil_symbol = $2 AND auth_hash = $3`,
      [tenantId, symbol, authHash]
    );
    return rows[0]?.record;
  }

  async allSigilRecords(tenantId) {
    tenantId = tenantId || this.defaultTenant;
    await this.ready;
    const { rows } = await this.pool.query(
      `SELECT record FROM tenant_sigil_auth WHERE tenant_id = $1 ORDER BY updated_at DESC`,
      [tenantId]
    );
    return rows.map(r => r.record);
  }

  async deleteSigilRecord(tenantId, symbol, authHash) {
    tenantId = tenantId || this.defaultTenant;
    await this.ready;
    await this.pool.query(
      `DELETE FROM tenant_sigil_auth WHERE tenant_id = $1 AND sigil_symbol = $2 AND auth_hash = $3`,
      [tenantId, symbol, authHash]
    );
  }

  async countSigilRecords(tenantId) {
    tenantId = tenantId || this.defaultTenant;
    await this.ready;
    const { rows } = await this.pool.query(
      `SELECT COUNT(*)::int AS c FROM tenant_sigil_auth WHERE tenant_id = $1`,
      [tenantId]
    );
    return rows[0]?.c || 0;
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = { PostgresSigilAdapter };

