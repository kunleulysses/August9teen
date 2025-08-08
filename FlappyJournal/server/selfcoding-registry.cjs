const { EventEmitter } = require('events');

const eventBuses = new Set();
const modules = new Set();
let lastMetrics = null;

function register(eventBus, module) {
  if (eventBus && typeof eventBus.on === 'function') eventBuses.add(eventBus);
  if (module) modules.add(module);
}

function setMetrics(metrics) {
  lastMetrics = metrics || lastMetrics;
}

function getMetrics() {
  // Aggregate metrics across modules if possible
  let agg = { successCount: 0, errorCount: 0, integratedCount: 0, rollbackCount: 0, avgIntegrationMs: 0, samples: 0 };
  let count = 0;
  for (const m of modules) {
    try {
      if (typeof m.getPilotMetrics === 'function') {
        const pm = m.getPilotMetrics();
        if (pm) {
          agg.successCount += Number(pm.successCount || 0);
          agg.errorCount += Number(pm.errorCount || 0);
          agg.integratedCount += Number(pm.integratedCount || 0);
          agg.rollbackCount += Number(pm.rollbackCount || 0);
          agg.avgIntegrationMs += Number(pm.avgIntegrationMs || 0);
          agg.samples += Number(pm.samples || 0);
          count++;
        }
      }
    } catch (_) {}
  }
  if (count > 0) {
    agg.avgIntegrationMs = Math.round(agg.avgIntegrationMs / count);
    return agg;
  }
  return lastMetrics || agg;
}

function approve(id) {
  let sent = 0;
  if (!id) return sent;
  for (const bus of eventBuses) {
    try { bus.emit('code:approval:grant', { id }); sent++; } catch (_) {}
  }
  return sent;
}

function regress(target, reason) {
  let sent = 0;
  if (!target) return sent;
  for (const bus of eventBuses) {
    try { bus.emit('autonomy:regression', { target, reason }); sent++; } catch (_) {}
  }
  return sent;
}

function listPending() {
  const out = [];
  for (const m of modules) {
    try {
      const pend = m.pendingApprovals;
      if (pend && typeof pend.forEach === 'function') {
        pend.forEach((val, key) => {
          out.push({ id: key, createdAt: val && val.createdAt, purpose: val?.request?.purpose, description: val?.request?.description });
        });
      }
    } catch (_) {}
  }
  return out;
}

module.exports = {
  register,
  setMetrics,
  getMetrics,
  approve,
  regress,
  listPending,
  _debug: { eventBuses, modules }
};
