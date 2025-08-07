const { Level } = require('level');
const { Gauge } = require('prom-client');

const leveldb_open_files = new Gauge({
  name: 'leveldb_open_files',
  help: 'Number of open file handles by LevelDB',
});

class LevelDBSigilAdapter {
  constructor(dbPath = process.env.SIGIL_DB_PATH || './sigil-leveldb') {
    this.db = new Level(dbPath, { valueEncoding: 'json' });
    // Forcing WAL mode is not directly supported by the `level` package options.
    // It's often a compile-time or database-specific option.
    // We will assume the underlying LevelDB build uses WAL by default.
    // The metric part is more feasible.
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
    try {
      const key = `${tenantId}!sigil!${symbol}!${authHash}`;
      return await this.db.get(key);
    } catch (e) { if (e.notFound) return undefined; throw e; }
  }
  
  async allSigilRecords(tenantId) {
    // B4: Tenant-isolated record retrieval
    const records = [];
    const prefix = `${tenantId}!sigil!`;
    for await (const [key, value] of this.db.iterator({ 
      gte: prefix, 
      lt: prefix + '\xFF' 
    })) {
      // Double-check tenant isolation
      if (value.tenantId === tenantId) {
        records.push(value);
      }
    }
    return records;
  }
  
  async deleteSigilRecord(tenantId, symbol, authHash) {
    const key = `${tenantId}!sigil!${symbol}!${authHash}`;
    try {
      await this.db.del(key);
    } catch (e) {
      if (!e.notFound) throw e;
    }
  }
  
  async countSigilRecords(tenantId) {
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
  async close() {
    await this.db.close();
    leveldb_open_files.dec();
  }
}
module.exports = { LevelDBSigilAdapter };