import http from 'http';
import { metricsMiddleware } from './utils/metrics.js';
const port = process.env.METRICS_PORT || 9100;
http.createServer(metricsMiddleware).listen(port);