import './metrics/extraMetrics.cjs';
import './metrics/extraMetrics.cjs';
import http from 'http';
import { metricsMiddleware } from './utils/metrics.cjs';
const port = process.env.METRICS_PORT || 9100;
http.createServer(metricsMiddleware).listen(port);