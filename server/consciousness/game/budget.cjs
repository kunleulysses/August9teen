const { PostgresStore } = require('../persistence/PostgresStore.cjs');

const store = new PostgresStore();
const HOUR_MS = 60 * 60 * 1000;

function keyForUser(userSub) { return `turngen:user:${String(userSub || 'anon')}`; }
function keyForSession(sessionId) { return `turngen:session:${String(sessionId || 'none')}`; }
function keyForGlobal() { return `turngen:global`; }

async function incrQuota(key, step, maxAllowed) {
  await store.ready;
  const now = Date.now();
  const entry = (await store.getQuota(key)) || { used: 0, reset_ts: now + HOUR_MS };
  let { used, reset_ts } = entry;
  if (now > reset_ts) { used = step; reset_ts = now + HOUR_MS; } else { used += step; }
  await store.setQuota(key, used, reset_ts);
  return { ok: used <= maxAllowed, used, reset_ts };
}

async function consumeTurnBudget(userSub, sessionId, step = 1) {
  const perUserMax = parseInt(process.env.TURN_MAX_PER_HOUR || '60', 10);
  const perSessionMax = parseInt(process.env.TURN_SESSION_MAX_PER_HOUR || '120', 10);
  const globalMax = parseInt(process.env.TURN_GLOBAL_MAX_PER_HOUR || '10000', 10);
  const g = await incrQuota(keyForGlobal(), step, globalMax);
  const u = await incrQuota(keyForUser(userSub), step, perUserMax);
  const s = await incrQuota(keyForSession(sessionId), step, perSessionMax);
  return { ok: g.ok && u.ok && s.ok, global: g, user: u, session: s };
}

module.exports = { consumeTurnBudget };

