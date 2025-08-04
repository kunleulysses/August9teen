/**
 * Quota Store — wraps PostgresStore selfcoding_quota table for atomic increments
 */
import { PostgresStore } from '../persistence/PostgresStore.cjs';

const store = new PostgresStore();

const DEFAULT_MAX = 100;
const HOUR_MS = 3600000;

// increments and returns true if within quota, else false
export async function incrWithinHour(id = 'default', step = 1, maxAllowed = DEFAULT_MAX) {
  await store.ready;
  const now = Date.now();
  let { used = 0, reset_ts = now + HOUR_MS } = (await store.getQuota(id)) || {};
  if (now > reset_ts) {
    used = step;
    reset_ts = now + HOUR_MS;
  } else {
    used += step;
  }
  await store.setQuota(id, used, reset_ts);
  return used <= maxAllowed;
}

export async function getQuota(id = 'default') {
  return await store.getQuota(id);
}

export async function resetQuota(id = 'default') {
  const now = Date.now();
  await store.setQuota(id, 0, now + HOUR_MS);
}