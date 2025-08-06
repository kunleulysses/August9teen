/**
 * Prometheus metrics for Holographic Reality Generator
 */
const promClient = require('prom-client');
const register = new promClient.Registry();

// --- Counters ---
const sceneGenTotal = new promClient.Counter({
  name: 'holo_scene_gen_total',
  help: 'Total scenes generated',
  labelNames: ['success']
});
const frameDropTotal = new promClient.Counter({
  name: 'holo_frame_drop_total',
  help: 'Total frames dropped'
});

// --- Gauges ---
const broadcastQueueLen = new promClient.Gauge({
  name: 'holo_broadcast_queue_len',
  help: 'Current broadcast queue length'
});
const broadcastFps = new promClient.Gauge({
  name: 'holo_broadcast_fps',
  help: 'Holographic reality broadcast FPS'
});
const wsBacklogBytes = new promClient.Gauge({
  name: 'holo_ws_backlog_bytes',
  help: 'Sum of bufferedAmount for all connected sockets'
});

// --- Histogram ---
const sceneGenLatency = new promClient.Histogram({
  name: 'holo_scene_gen_latency_ms',
  help: 'Scene generation latency (ms)',
  buckets: [50,100,200,500,1000,2000]
});

register.registerMetric(sceneGenTotal);
register.registerMetric(frameDropTotal);
register.registerMetric(broadcastQueueLen);
register.registerMetric(broadcastFps);
register.registerMetric(wsBacklogBytes);
register.registerMetric(sceneGenLatency);

module.exports = {
  register,
  sceneGenTotal,
  frameDropTotal,
  broadcastQueueLen,
  broadcastFps,
  wsBacklogBytes,
  sceneGenLatency
};