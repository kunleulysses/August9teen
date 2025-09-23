let Redis, redis;
try { Redis = require('ioredis'); } catch (_) {}

const memQueue = [];
let lastTopUpAt = 0;
let lastError = null;
let targetSize = parseInt(process.env.PREGEN_TARGET || '20', 10) || 20;
const REDIS_URL = process.env.REDIS_URL;
let rclient = null;
if (Redis && REDIS_URL) {
  try { rclient = new Redis(REDIS_URL); } catch (_) {}
}

async function enqueueScene(text) {
  if (rclient) { try { await rclient.lpush('pregen:sanctuary:scenes', text); return; } catch (_) {} }
  memQueue.unshift(text);
}

async function fetchScene() {
  if (rclient) {
    try { const v = await rclient.rpop('pregen:sanctuary:scenes'); return v; } catch (_) {}
  }
  return memQueue.pop() || null;
}

let _genInstance = null;
async function getGenerator() {
  if (_genInstance) return _genInstance;
  try {
    const Gen = require('../../../../FlappyJournal/server/consciousness/holographic-consciousness-reality-generator.cjs');
    const Cls = Gen?.HolographicConsciousnessRealityGenerator || Gen?.default || Gen;
    _genInstance = new Cls();
    return _genInstance;
  } catch {
    return null;
  }
}

function formatSceneFromResult(result) {
  const t = new Date().toLocaleTimeString();
  try {
    const hc = result?.holographicConsciousnessReality;
    if (hc?.consciousnessRealityProjection) {
      const proj = hc.consciousnessRealityProjection;
      const p = proj?.projectionParameters || {};
      const dims = p.projectionDimensions || {};
      const projType = p.projectionType?.projectionType || 'holographic';
      const coherence = Math.round((proj?.realityCoherence || 0.9) * 100);
      const integration = Math.round(((hc.consciousnessRealityField?.consciousnessIntegration) || 0.85) * 100);
      const sd = dims.spatialDimensions ?? 3;
      const td = dims.temporalDimensions ?? 1;
      const hd = dims.holographicDimensions ?? 8;
      return `At ${t}, the Sanctuary resonates with a ${projType.replace(/_/g,' ')} field ` +
             `(spatial ${sd}, temporal ${td}, holographic ${hd}). Coherence ${coherence}%, integration ${integration}%.`;
    }
  } catch {}
  if (result?.minimalScene?.embeddedReality) {
    return `At ${t}, a recursive reality thread shimmers into view within the Sanctuary.`;
  }
  return `The Sanctuary breathes quietly at ${t}.`;
}

async function realityGen() {
  try {
    const instance = await getGenerator();
    if (!instance) return null;
    const realityRequest = {
      description: 'Sanctuary turn scene',
      parameters: { context: 'sanctuary_mobile_turn' },
      seed: Date.now()
    };
    const consciousnessState = {
      awareness: 0.82,
      phi: 0.86,
      coherence: 0.84
    };
    // Prefer method if present
    let result;
    if (typeof instance.generateHolographicConsciousnessReality === 'function') {
      result = await instance.generateHolographicConsciousnessReality(realityRequest, consciousnessState);
    } else if (typeof instance.generateScene === 'function') {
      // fallback to minimal generator
      const scene = await instance.generateScene(realityRequest, 1, {});
      result = { success: true, minimalScene: scene };
    } else {
      return null;
    }
    return formatSceneFromResult(result);
  } catch (e) {
    lastError = e?.message || String(e);
    return null;
  }
}

async function getDepth() {
  if (rclient) { try { return parseInt(await rclient.llen('pregen:sanctuary:scenes'), 10) || 0; } catch (_) { return 0; } }
  return memQueue.length;
}

async function topUp(to = targetSize) {
  // Optional global budget for pregen
  try {
    const { PostgresStore } = require('../persistence/PostgresStore.cjs');
    const store = new PostgresStore();
    await store.ready;
    const HOUR_MS = 60 * 60 * 1000;
    const now = Date.now();
    const key = 'pregen:global';
    const entry = (await store.getQuota(key)) || { used: 0, reset_ts: now + HOUR_MS };
    let { used, reset_ts } = entry;
    if (now > reset_ts) { used = 0; reset_ts = now + HOUR_MS; }
    const max = parseInt(process.env.PREGEN_MAX_PER_HOUR || '240', 10);
    if (used >= max) return { ok: false, reason: 'budget', depth: await getDepth() };
    // we'll increment per generated item below
    var incr = async () => { used += 1; await store.setQuota(key, used, reset_ts); };
  } catch (_) { var incr = async () => {}; }
  const current = await getDepth();
  if (current >= to) return { ok: true, depth: current };
  for (let i = current; i < to; i++) {
    const txt = await realityGen();
    await enqueueScene(txt || `The Sanctuary breathes quietly at ${new Date().toLocaleTimeString()}.`);
    await incr();
  }
  lastTopUpAt = Date.now();
  return { ok: true, depth: await getDepth() };
}

function startScheduler() {
  setInterval(async () => {
    try {
      // Top up to 20 items
      const length = await getDepth();
      if (length < targetSize) await topUp(targetSize);
    } catch (_) {}
  }, 15000);
}

function getStatus() {
  return getDepth().then((depth) => ({ depth, backend: rclient ? 'redis' : 'memory', lastTopUpAt, lastError, targetSize }));
}

function setTargetSize(n) { targetSize = n && Number.isFinite(n) ? n : targetSize; }

module.exports = { enqueueScene, fetchScene, startScheduler, getStatus, topUp, setTargetSize };
