/**
 * AutoTuner – Adjusts game flags gently based on runtime metrics.
 * Safe ranges only; records changes to history.
 */

const { enhancedGameWS } = require('./EnhancedGameWebSocket.cjs');
const { pool } = require('../../db');

const MIN_PACING = 10000; // 10s
const MAX_PACING = 120000; // 120s
const MIN_HZ = 0.5;
const MAX_HZ = 2.0;

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

async function recordHistory(flags, note) {
  try { await pool.query('INSERT INTO game_flags_history (flags, applied_by, note) VALUES ($1,$2,$3)', [JSON.stringify(flags), 'auto', note || '']); } catch {}
}

function snapshotMetrics() {
  try {
    const m = enhancedGameWS.getEnhancedMetrics();
    return m || {};
  } catch { return {}; }
}

function recommendAdjustments() {
  const m = snapshotMetrics();
  const clients = Number(m.activeConnections || 0);
  const memory = process.memoryUsage();
  const heapRatio = memory.heapUsed / (memory.heapTotal || 1);
  const avgSessionSec = Number(m.avgSessionSec || 0);
  const now = Date.now();
  const disconnects = Array.isArray(m.recentDisconnects) ? m.recentDisconnects.filter((t) => now - t <= 5 * 60 * 1000).length : 0;
  const base = {
    eventPacingMs: enhancedGameWS.eventPacingMs,
    contentDensity: enhancedGameWS.contentDensity,
    mobileHeartbeatHz: enhancedGameWS.mobileHeartbeatHz,
  };
  let pacing = base.eventPacingMs;
  let density = base.contentDensity;
  let hz = base.mobileHeartbeatHz;
  // Simple heuristics
  if (heapRatio > 0.8 || clients > 200 || disconnects > 50) {
    pacing = clamp(pacing + 5000, MIN_PACING, MAX_PACING);
    density = 'low';
    hz = clamp(hz - 0.1, MIN_HZ, MAX_HZ);
  } else if (heapRatio < 0.6 && clients < 100 && avgSessionSec >= 600) {
    pacing = clamp(pacing - 5000, MIN_PACING, MAX_PACING);
    density = 'high';
    hz = clamp(hz + 0.1, MIN_HZ, MAX_HZ);
  } else {
    // moderate – keep medium density
    density = 'medium';
  }
  return { pacing, density, hz };
}

function applyFlags(flags) {
  const patch = {};
  if (typeof flags.pacing === 'number') enhancedGameWS.eventPacingMs = flags.pacing, patch.eventPacingMs = flags.pacing;
  if (typeof flags.hz === 'number') enhancedGameWS.mobileHeartbeatHz = flags.hz, enhancedGameWS.mobileHeartbeatMinInterval = Math.max(250, Math.floor(1000 / enhancedGameWS.mobileHeartbeatHz)), patch.mobileHeartbeatHz = flags.hz;
  if (flags.density) enhancedGameWS.contentDensity = flags.density, patch.contentDensity = flags.density;
  try { enhancedGameWS.rescheduleWorldEventTimer(); } catch {}
  return patch;
}

function maybeCanary(flags) {
  const canaryPct = Number(enhancedGameWS.canaryPct || 0);
  if (!canaryPct || canaryPct <= 0) return null;
  // For now, only pacing/density canary; store trial values and schedule a canary timer
  enhancedGameWS.trialEventPacingMs = flags.pacing;
  enhancedGameWS.trialContentDensity = flags.density;
  enhancedGameWS.trialStartAvgSessionSec = Number(snapshotMetrics().avgSessionSec || 0);
  const now = Date.now();
  enhancedGameWS.trialActiveUntil = now + Number(process.env.TRIAL_WINDOW_MS || 15 * 60 * 1000);
  try { enhancedGameWS.rescheduleWorldEventTimer(); } catch {}
  return { eventPacingMs: flags.pacing, contentDensity: flags.density, note: 'trial-canary' };
}

function commitTrialIfDue() {
  const now = Date.now();
  if (enhancedGameWS.trialActiveUntil && now >= enhancedGameWS.trialActiveUntil) {
    const currentAvg = Number(snapshotMetrics().avgSessionSec || 0);
    const startAvg = Number(enhancedGameWS.trialStartAvgSessionSec || 0);
    const improved = startAvg <= 0 ? true : (currentAvg >= startAvg * 0.9);
    if (improved) {
      const patch = {};
      if (enhancedGameWS.trialEventPacingMs) { enhancedGameWS.eventPacingMs = enhancedGameWS.trialEventPacingMs; patch.eventPacingMs = enhancedGameWS.eventPacingMs; }
      if (enhancedGameWS.trialContentDensity) { enhancedGameWS.contentDensity = enhancedGameWS.trialContentDensity; patch.contentDensity = enhancedGameWS.contentDensity; }
      try {
        const pct = Number(enhancedGameWS.canaryPct || 0);
        let next = pct < 0.1 ? 0.1 : (pct < 0.5 ? 0.5 : 1.0);
        enhancedGameWS.canaryPct = next;
        patch.canaryPct = next;
      } catch {}
      try { enhancedGameWS.rescheduleWorldEventTimer(); } catch {}
      recordHistory(patch, 'trial-commit').catch(() => {});
    } else {
      enhancedGameWS.trialEventPacingMs = null;
      enhancedGameWS.trialContentDensity = null;
      try { enhancedGameWS.rescheduleWorldEventTimer(); } catch {}
      recordHistory({}, 'trial-rollback').catch(() => {});
    }
    enhancedGameWS.trialActiveUntil = null;
    enhancedGameWS.trialStartAvgSessionSec = null;
  }
}

function startAutoTuner() {
  setInterval(() => {
    try {
      commitTrialIfDue();
      const rec = recommendAdjustments();
      if (!rec) return;
      const { pacing, density, hz } = rec;
      const canary = maybeCanary(rec);
      if (canary) { recordHistory(canary, 'auto-trial').catch(() => {}); return; }
      const patch = applyFlags(rec);
      if (Object.keys(patch).length) recordHistory(patch, 'auto').catch(() => {});
    } catch {}
  }, 60 * 1000);

  // PvP fairness/ladder variance adjustments every 5 minutes
  setInterval(async () => {
    try {
      const p = await analyzePvpAndLadder();
      if (!p) return;
      applyPvpPatch(p);
    } catch {}
  }, 5 * 60 * 1000);
}

startAutoTuner();

module.exports = {};

async function analyzePvpAndLadder() {
  try {
    const recent = await pool.query(`SELECT winner_session, loser_session, xp_transferred, created_at FROM game_battles WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC LIMIT 200`);
    const battles = recent.rows || [];
    if (!battles.length) return null;
    const total = battles.length;
    const avgTransfer = battles.reduce((s, b) => s + Number(b.xp_transferred || 0), 0) / total;
    const wins = new Map();
    for (const b of battles) wins.set(b.winner_session, (wins.get(b.winner_session) || 0) + 1);
    const sorted = Array.from(wins.values()).sort((a, b) => b - a);
    const topShare = sorted.length ? (sorted[0] / total) : 0;

    const tops = await pool.query(`SELECT level FROM game_sanctuaries WHERE level IS NOT NULL ORDER BY level DESC LIMIT 20`);
    const levels = (tops.rows || []).map(r => Number(r.level || 1));
    const mean = levels.reduce((s, v) => s + v, 0) / Math.max(1, levels.length);
    const variance = levels.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / Math.max(1, levels.length);
    const stddev = Math.sqrt(variance);

    const out: any = { avgTransfer, topShare, stddev };
    return out;
  } catch { return null; }
}

function applyPvpPatch(metrics) {
  const { avgTransfer, topShare, stddev } = metrics || {};
  const curPct = Number(enhancedGameWS.battleXpTransferPct || 0.2);
  const curCd = Number(enhancedGameWS.battleCooldownMs || 60000);
  let pct = curPct;
  let cd = curCd;
  // If ladder is very unequal or topShare large, reduce transfer and increase cooldown
  if ((stddev || 0) > 4 || (topShare || 0) > 0.35 || (avgTransfer || 0) > 50) {
    pct = clamp(curPct - 0.02, 0.1, 0.3);
    cd = clamp(curCd + 5000, 30000, 180000);
  } else if ((stddev || 0) < 1.5 && (avgTransfer || 0) < 30) {
    pct = clamp(curPct + 0.02, 0.1, 0.3);
    cd = clamp(curCd - 5000, 30000, 180000);
  } else {
    return;
  }
  enhancedGameWS.battleXpTransferPct = pct;
  enhancedGameWS.battleCooldownMs = cd;
  recordHistory({ battleXpTransferPct: pct, battleCooldownMs: cd }, 'auto-pvp').catch(() => {});
}
