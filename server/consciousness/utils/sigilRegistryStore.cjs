/**
 * SigilRegistryStore – CRUD helpers over sigil_auth table
 *
 * Table: sigil_auth (sigil_symbol TEXT, auth_hash TEXT, record JSONB, PK(sigil_symbol,auth_hash))
 */
import { PostgresStore } from '../persistence/PostgresStore.cjs';

const store = new PostgresStore();

export async function addSigilRecord(symbol, authHash, record) {
  return await store.setSigilRecord(symbol, authHash, record);
}

export async function getSigilRecord(symbol, authHash) {
  return await store.getSigilRecord(symbol, authHash);
}

export async function allSigilRecords() {
  return await store.allSigilRecords();
}
