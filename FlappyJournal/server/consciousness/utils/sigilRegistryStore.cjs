/**
 * SigilRegistryStore – CRUD helpers over sigil_auth table
 *
 * Table: sigil_auth (sigil_symbol TEXT, auth_hash TEXT, record JSONB, PK(sigil_symbol,auth_hash))
 */
const { PostgresStore } = require('../persistence/PostgresStore.cjs');

const store = new PostgresStore();

async function addSigilRecord(symbol, authHash, record) {
  return await store.setSigilRecord(symbol, authHash, record);
}

async function getSigilRecord(symbol, authHash) {
  return await store.getSigilRecord(symbol, authHash);
}

async function allSigilRecords() {
  return await store.allSigilRecords();
}

module.exports = { addSigilRecord, getSigilRecord, allSigilRecords };
