const { Level } = require('level');
const { Gauge } = require('prom-client');

const leveldb_open_files = new Gauge({
  name: 'leveldb_open_files',
  help: 'Number of open file handles by LevelDB',
});

class LevelDBSigilAdapter {
  constructor(dbPath = process.env.SIGIL_DB_PATH || './sigil-leveldb') {
    this.db = new Level(dbPath, { valueEncoding: 'json' });
    this.defaultTenant = process.env.DEFAULT_TENANT || 'public';
    this.trackOpenFiles();
  }

  async open() {
    // Explicitly open the database to ensure it's ready before use.
    await this.db.open();
    console.log('[LevelDBSigilAdapter] Database opened successfully.');
  }

  trackOpenFiles() {
    // This is a mock implementation. Actually tracking open file handles
    // would require deeper integration with LevelDB's internal state,
    // possibly through native bindings or debug features not exposed
    // by the `level` package.
    // As a proxy, we can increment on open and decrement on close.
    leveldb_open_files.inc();
  }

  async setSigilRecord(tenantId, symbol, authHash, record) {
    // Backward-compatibility overload:
    // - 4 args: (tenantId, symbol, authHash, record) → sigil registry
    // - 3 args: (namespace='sigil-memory', id, recordObj) → memory record
    if (record === undefined && authHash && typeof authHash === 'object') {
      const id = symbol;
      const value = authHash;
      const ns = tenantId || 'sigil-memory';
      const key = `sigil:${ns}:${id}`;
      await this.db.put(key, value);
      return;
    }

    tenantId = tenantId || this.defaultTenant;
    // B4: Tenant namespace key schema
    const key = `${tenantId}!sigil!${symbol}!${authHash}`;
    const enrichedRecord = {
      ...record,
      tenantId,
      symbol,
      authHash,
      updatedAt: new Date().toISOString()
    };
    await this.db.put(key, enrichedRecord);
  }
  
  async getSigilRecord(tenantId, symbol, authHash) {
    tenantId = tenantId || this.defaultTenant;
    try {
      const key = `${tenantId}!sigil!${symbol}!${authHash}`;
      return await this.db.get(key);
    } catch (e) { if (e.notFound) return undefined; throw e; }
  }
  
  async allSigilRecords(tenantId) {
    // If tenantId provided, return tenant-isolated sigil records.
    if (tenantId) {
      const records = [];
      const prefix = `${tenantId}!sigil!`;
      for await (const [key, value] of this.db.iterator({
        gte: prefix,
        lt: prefix + '\xFF'
      })) {
        if (value.tenantId === tenantId) {
          records.push(value);
        }
      }
      return records;
    }

    // Backward-compatibility: when called without tenant, return memory records
    const memPrefix = `sigil:sigil-memory:`;
    const memRecords = [];
    for await (const [key, value] of this.db.iterator({ gte: memPrefix, lt: memPrefix + '\xFF' })) {
      memRecords.push(value);
    }
    return memRecords;
  }
  
  async deleteSigilRecord(tenantId, symbol, authHash) {
    tenantId = tenantId || this.defaultTenant;
    const key = `${tenantId}!sigil!${symbol}!${authHash}`;
    try {
      await this.db.del(key);
    } catch (e) {
      if (!e.notFound) throw e;
    }
  }
  
  async countSigilRecords(tenantId) {
    tenantId = tenantId || this.defaultTenant;
    let count = 0;
    const prefix = `${tenantId}!sigil!`;
    for await (const [key] of this.db.iterator({ 
      gte: prefix, 
      lt: prefix + '\xFF',
      values: false 
    })) {
      count++;
    }
    return count;
  }

  async getHealth() {
    try {
      // Simple write/read health probe for default tenant
      const probeKey = `${this.defaultTenant}!health!probe`;
      await this.db.put(probeKey, { t: Date.now() });
      await this.db.get(probeKey);
      return { status: 'healthy', tenant: this.defaultTenant };
    } catch (e) {
      return { status: 'degraded', error: e.message };
    }
  }
  async close() {
    await this.db.close();
    leveldb_open_files.dec();
  }
}
module.exports = { LevelDBSigilAdapter };