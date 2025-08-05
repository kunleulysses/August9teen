import http from 'http';
import { Registry, Gauge, Counter } from 'prom-client';

// --- Create a Registry to register the metrics ---
const register = new Registry();
register.setDefaultLabels({
  app: 'holographic-reality-server'
});

// --- Define the metrics ---
const holograph_fps = new Gauge({
  name: 'holograph_fps',
  help: 'Frames per second of the holographic reality engine',
  registers: [register],
});

const holograph_scene_node_count = new Gauge({
  name: 'holograph_scene_node_count',
  help: 'Number of nodes in the current scene',
  registers: [register],
});

const holograph_gpu_memory_bytes = new Gauge({
  name: 'holograph_gpu_memory_bytes',
  help: 'GPU memory usage in bytes',
  registers: [register],
});

export const holo_ws_rate_limited_total = new Counter({
  name: 'holo_ws_rate_limited_total',
  help: 'Total number of rate-limited WebSocket connections',
  registers: [register],
});

export const wsConnectionsGauge = new Gauge({
  name: 'holo_ws_connections',
  help: 'Open WebSocket connections',
  registers: [register],
});

export const framesOverBudget = new Counter({
  name: 'holograph_frames_over_budget_total',
  help: 'Total frames exceeding time budget',
  registers: [register],
});

export const holograph_scene_max_depth = new Gauge({
  name: 'holograph_scene_max_depth',
  help: 'Deepest scene graph',
  registers: [register],
});

export const holograph_scene_nodes_depth = new Gauge({
  name: 'holograph_scene_nodes_depth',
  help: 'Node count by depth',
  labelNames: ['level'],
  registers: [register],
});

// --- Expose the metrics endpoint ---
const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.env.METRICS_PORT || 9091;
server.listen(port, () => {
  console.log(`Metrics server listening on port ${port}`);
});

// --- Simulate metric changes (replace with actual data from your application) ---
setInterval(() => {
  holograph_fps.set(Math.random() * 60);
  holograph_scene_node_count.set(Math.floor(Math.random() * 1000));
  holograph_gpu_memory_bytes.set(Math.random() * 1024 * 1024 * 1024);
}, 5000);