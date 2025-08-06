import './metrics/extraMetrics.cjs';
import http from 'http';
import client from 'prom-client';
import { metricsMiddleware } from './utils/metrics.cjs';

export const scene_queue_depth = new client.Gauge({
  name: 'scene_queue_depth',
  help: 'Number of items waiting in the scene generation queue',
});

export const holo_worker_busy_cpu = new client.Gauge({
  name: 'holo_worker_busy_cpu',
  help: 'CPU percentage busy for holographic worker',
});

export const scene_gen_total = new client.Counter({
  name: 'scene_gen_total',
  help: 'Total number of scenes generated',
});

export const scene_gen_error_total = new client.Counter({
  name: 'scene_gen_error_total',
  help: 'Total number of scene generation errors',
});

export const frame_drop_total = new client.Counter({
  name: 'frame_drop_total',
  help: 'Total number of dropped frames',
});

export const scene_gen_latency_ms = new client.Histogram({
  name: 'scene_gen_latency_ms',
  help: 'Scene generation latency in milliseconds',
  buckets: [50, 100, 200, 500, 1000, 2000],
});

export const ws_frame_size_bytes = new client.Histogram({
  name: 'ws_frame_size_bytes',
  help: 'WebSocket frame size in bytes',
  buckets: [128, 256, 512, 1024, 2048, 4096, 8192],
});

const port = process.env.METRICS_PORT || 9100;

http
  .createServer((req, res) => {
    if (req.url === '/metrics') {
      metricsMiddleware(req, res);
      return;
    }
    res.statusCode = 404;
    res.end('Not Found');
  })
  .listen(port);