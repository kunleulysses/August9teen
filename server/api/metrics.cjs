const client = require('prom-client');

client.collectDefaultMetrics();

const register = client.register;
const realitiesCreated = new client.Counter({
  name: 'realities_created_total',
  help: 'Total realities created'
});
const authErrors = new client.Counter({
  name: 'jwt_unauthorized_total',
  help: 'Total JWT unauthorized errors'
});
const crnTicks = new client.Counter({
  name: 'crn_ticks_total',
  help: 'Total CRN tick executions'
});
const saqrnTicks = new client.Counter({
  name: 'saqrn_ticks_total',
  help: 'Total SAQRN tick executions'
});

// Consciousness gauges (mirrors from WS runtime)
const consciousnessActiveModules = new client.Gauge({
  name: 'consciousness_active_modules',
  help: 'Active consciousness modules'
});
const consciousnessMemoryTotalShards = new client.Gauge({
  name: 'consciousness_memory_total_shards',
  help: 'Total memory shards in Unified Memory System'
});
const consciousnessStateQuality = new client.Gauge({
  name: 'consciousness_state_quality',
  help: 'Overall consciousness state quality score'
});
const consciousnessMemoryConsolidationsTotal = new client.Counter({
  name: 'consciousness_memory_consolidations_total',
  help: 'Total memory consolidation operations'
});

// Initialize with 0 so the metrics are visible immediately
try { consciousnessActiveModules.set(0); } catch (_) {}
try { consciousnessMemoryTotalShards.set(0); } catch (_) {}
try { consciousnessStateQuality.set(0); } catch (_) {}
// Counters default to 0 when created, but ensure exposure by a no-op inc(0)
try { consciousnessMemoryConsolidationsTotal.inc(0); } catch (_) {}

module.exports = {
  register,
  realitiesCreated,
  authErrors,
  crnTicks,
  saqrnTicks,
  consciousnessActiveModules,
  consciousnessMemoryTotalShards,
  consciousnessStateQuality,
  consciousnessMemoryConsolidationsTotal
};