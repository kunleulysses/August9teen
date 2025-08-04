/**
 * Sigil Registry Store — wraps PostgresStore sigil_auth table
 */
import { PostgresStore } from '../persistence/PostgresStore.cjs';

const store = new PostgresStore();

export async function addSigilRecord(sigil_symbol, auth_hash, record) {
  return await store.setSigilRecord(sigil_symbol, auth_hash, record);
}

export async function getSigilRecord(sigil_symbol, auth_hash) {
  return await store.getSigilRecord(sigil_symbol, auth_hash);
}

export async function allSigilRecords() {
  return await store.allSigilRecords();
}