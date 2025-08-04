/**
 * QuotaStore – persistent generation-quota tracking
 *
 * Tables: selfcoding_quota (id TEXT PK, used INT, reset_ts BIGINT)
 */
import { PostgresStore } from '../persistence/PostgresStore.cjs';

const store = new PostgresStore();
const HOUR_MS = 60 * 60 * 1000;
const DEFAULT_MAX = 100;

/**
 * Increment quota; return true if still within limit, else false.
 */
export async function incrWithinHour(id = 'default', step = 1, maxAllowed = DEFAULT_MAX) {
  await store.ready;
  const now = Date.now();

  const entry = (await store.getQuota(id)) || { used: 0, reset_ts: now + HOUR_MS };
  let { used, reset_ts } = entry;

  if (now > reset_ts) {
    used = step;                 // hour window reset
    reset_ts = now + HOUR_MS;
  } else {
    used += step;
  }

  await store.setQuota(id, used, reset_ts);
  return used <= maxAllowed;
}

export async function resetQuota(id = 'default') {
  await store.ready;
  await store.setQuota(id, 0, Date.now() + HOUR_MS);
}

export async function getQuota(id = 'default') {
  return await store.getQuota(id);
}
