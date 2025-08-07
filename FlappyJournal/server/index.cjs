const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pino = require('pino');
const pinoHttp = require('pino-http');
const promClient = require('prom-client');

// Import our components
const createSigilRouter = require('./sigil-api.cjs');
const { validateSigilCreatePayload } = require('./middleware/validateSchema');

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty'
  } : undefined
});

// Initialize Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const app = express();
const port = process.env.SIGIL_PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Request logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health endpoints
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/readyz', async (req, res) => {
  const checks = [];
  
  // Check storage
  try {
    const { LevelDBSigilAdapter } = require('./consciousness/persistence/LevelDBSigilAdapter.cjs');
    const storage = new LevelDBSigilAdapter();
    await storage.getHealth();
    checks.push({ name: 'storage', status: 'ok' });
    await storage.close();
  } catch (error) {
    checks.push({ name: 'storage', status: 'error', error: error.message });
  }
  
  // Check eventSign
  try {
    const { sign, verify } = require('./consciousness/core/security/eventSign.cjs');
    const testPayload = { test: Date.now() };
    const signature = sign(testPayload);
    if (!verify(testPayload, signature)) throw new Error('Verification failed');
    checks.push({ name: 'eventSign', status: 'ok' });
  } catch (error) {
    checks.push({ name: 'eventSign', status: 'error', error: error.message });
  }
  
  const allHealthy = checks.every(check => check.status === 'ok');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'not ready',
    checks,
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Mount sigil API
const sigilRouter = createSigilRouter();
app.use('/', sigilRouter);

// Error handling
app.use((err, req, res, next) => {
  req.log.error({ err }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(port, () => {
  logger.info({ port }, 'Sigil-DNA server started');
});

module.exports = app;