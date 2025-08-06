const pino = require('pino');
const pinoHttp = require('pino-http');
const crypto = require('crypto');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'response.body.token']
});

logger.info('Starting server...');
const express = require('express');
const SigilBasedCodeAuthenticator = require('./consciousness/sigil-based-code-authenticator.cjs');
const sigilApiRouter = require('./sigil-api.cjs');
const promClient = require('prom-client');
promClient.collectDefaultMetrics();

const app = express();

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID(),
    customSuccessMessage: function (req, res) {
      return `${req.method} ${req.url} completed with status ${res.statusCode}`;
    }
  })
);

app.use(express.json());
const port = process.env.PORT || 3004;

const sigilAuthenticator = new SigilBasedCodeAuthenticator();

const mountPath = process.env.SIGIL_API_MOUNT_PATH || '/sigil';
app.use(mountPath, sigilApiRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/metrics', async (req, res) => {
  if (process.env.METRICS_TOKEN && req.headers['authorization'] !== `Bearer ${process.env.METRICS_TOKEN}`) {
    return res.status(401).send('Unauthorized');
  }
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get('/healthz', (req, res) => {
  req.log.info({ route: '/healthz' }, 'Health check ping');
  res.status(200).json({ status: 'ok', ts: new Date().toISOString() });
});

app.get('/readyz', async (req, res) => {
  try {
    // This is a mock implementation. A real implementation would check the
    // status of the database and other dependencies.
    await sigilAuthenticator.storage.db.get('somekey');
    req.log.info({ route: '/readyz', ready: true }, 'Readiness check ping');
    res.status(200).json({ ready: true });
  } catch (err) {
    if (err.notFound) {
      req.log.info({ route: '/readyz', ready: true }, 'Readiness check ping (db empty)');
      res.status(200).json({ ready: true });
      return;
    }
    req.log.error({ route: '/readyz', ready: false, error: err.message }, 'Readiness check failed');
    res.status(503).json({ ready: false, error: err.message });
  }
});

(async () => {
  await sigilAuthenticator.storage.open();
  await sigilAuthenticator.preload();
  await sigilAuthenticator.sigilIdentity.start();
  logger.info('Starting to listen...');
  const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
})();

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  sigilAuthenticator.sigilIdentity.stop();
  await sigilAuthenticator.storage.close();
  logger.info('Database connection closed.');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));