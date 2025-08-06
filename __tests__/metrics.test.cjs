/**
 * Minimal test of Prometheus metrics (register exposes all metric names)
 */
const {
  register,
  sceneGenTotal,
  frameDropTotal,
  broadcastQueueLen,
  broadcastFps,
  wsBacklogBytes,
  sceneGenLatency
} = require('../server/common/metrics.cjs');

describe('Prometheus metrics', () => {
  it('should increment and expose metrics', async () => {
    sceneGenTotal.inc({ success: 'true' });
    sceneGenTotal.inc({ success: 'false' });
    frameDropTotal.inc();
    broadcastQueueLen.set(5);
    broadcastFps.set(7);
    wsBacklogBytes.set(12345);
    sceneGenLatency.observe(123);
    const out = await register.metrics();
    expect(out).toMatch(/holo_scene_gen_total/);
    expect(out).toMatch(/holo_frame_drop_total/);
    expect(out).toMatch(/holo_broadcast_queue_len/);
    expect(out).toMatch(/holo_broadcast_fps/);
    expect(out).toMatch(/holo_ws_backlog_bytes/);
    expect(out).toMatch(/holo_scene_gen_latency_ms/);
  });
});