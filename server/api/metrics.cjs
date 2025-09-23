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
const consciousnessResonanceCoherence = new client.Gauge({
  name: 'consciousness_resonance_coherence',
  help: 'Latest universal resonance network coherence metric'
});
const consciousnessResonanceFieldStrength = new client.Gauge({
  name: 'consciousness_resonance_field_strength',
  help: 'Latest universal resonance field strength metric'
});
const consciousnessHeartCoherence = new client.Gauge({
  name: 'consciousness_heart_coherence_ratio',
  help: 'Heart-centered consciousness coherence ratio'
});
const consciousnessHeartEmpathy = new client.Gauge({
  name: 'consciousness_heart_empathy_average',
  help: 'Average empathy as reported by the heart engine'
});
const consciousnessEmotionEntanglement = new client.Gauge({
  name: 'consciousness_emotion_entanglement_strength',
  help: 'Emotional quantum entanglement strength'
});
const consciousnessEmotionQuantumCoherence = new client.Gauge({
  name: 'consciousness_emotion_quantum_coherence',
  help: 'Emotional quantum coherence metric'
});
const consciousnessMetricsTimestamp = new client.Gauge({
  name: 'consciousness_metrics_timestamp_ms',
  help: 'Unix milliseconds of the latest consciousness metrics snapshot'
});

// Spiral memory gauges
const spiralShardsTotal = new client.Gauge({
  name: 'spiral_shards_total',
  help: 'Total entries in spiral memory map'
});
const spiralLastSnapshotTs = new client.Gauge({
  name: 'spiral_last_snapshot_ts',
  help: 'Unix ms of last successful spiral snapshot'
});
try { spiralShardsTotal.set(0); } catch (_) {}
try { spiralLastSnapshotTs.set(0); } catch (_) {}

// Initialize with 0 so the metrics are visible immediately
try { consciousnessActiveModules.set(0); } catch (_) {}
try { consciousnessMemoryTotalShards.set(0); } catch (_) {}
try { consciousnessStateQuality.set(0); } catch (_) {}
try { consciousnessResonanceCoherence.set(0); } catch (_) {}
try { consciousnessResonanceFieldStrength.set(0); } catch (_) {}
try { consciousnessHeartCoherence.set(0); } catch (_) {}
try { consciousnessHeartEmpathy.set(0); } catch (_) {}
try { consciousnessEmotionEntanglement.set(0); } catch (_) {}
try { consciousnessEmotionQuantumCoherence.set(0); } catch (_) {}
try { consciousnessMetricsTimestamp.set(0); } catch (_) {}
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
  consciousnessMemoryConsolidationsTotal,
  consciousnessResonanceCoherence,
  consciousnessResonanceFieldStrength,
  consciousnessHeartCoherence,
  consciousnessHeartEmpathy,
  consciousnessEmotionEntanglement,
  consciousnessEmotionQuantumCoherence,
  consciousnessMetricsTimestamp,
  spiralShardsTotal,
  spiralLastSnapshotTs
};
