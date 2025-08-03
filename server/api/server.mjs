import '../../shared/secretBootstrap.cjs';
import 'express-async-errors';
import '../../common/tracing.cjs';
import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import logger from '../common/logger.cjs';
import config from '../common/config.cjs';
import { generateId } from '../common/id.cjs';
import routes from './routes/index.cjs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import auth from './auth.cjs';
const { authMiddleware, loginRoute } = auth;
import storePkg from '../common/storeFactory.cjs';
const { getStore, closeStore } = storePkg;
import { register as metricsRegister } from './metrics.cjs';

const app = express();
let httpServer = null;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"]
    }
  }
}));

// global rate limiter (for all routes)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, rate limit exceeded' },
  })
);

// Per-route rate limiters
const loginLimiter = rateLimit({ windowMs: 15*60*1000, max:10, message:{error:'Too many logins'} });
const createLimiter = rateLimit({ windowMs: 15*60*1000, max:30, message:{error:'Rate limit'} });

app.use(bodyParser.json());

const openApiDocument = YAML.load(new URL('./openapi.yaml', import.meta.url).pathname);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Auth routes and middleware
app.post('/login', loginLimiter, loginRoute);
app.use(authMiddleware);

// Apply createLimiter specifically to /realities
import routesRealities from './routes/realities.cjs';
app.use('/realities', createLimiter, routesRealities);

// Mount all other routes
app.use(routes);

app.use((req, res, next) => {
  req.id = generateId();
  req.startTime = Date.now();
  logger.info({ reqId: req.id, method: req.method, url: req.url }, 'Request start');
  res.on('finish', () => {
    logger.info({ reqId: req.id, status: res.statusCode, duration: Date.now() - req.startTime }, 'Request finish');
  });
  next();
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', metricsRegister.contentType);
  res.end(await metricsRegister.metrics());
});

app.get('/health', (req, res) => {
  if (config.NODE_ENV !== 'production') {
    logger.debug({ uptime: process.uptime(), memory: process.memoryUsage() }, 'Health metrics');
  }
  res.json({ status: 'ok', backend: config.STORE_BACKEND });
});

app.use((err, req, res, next) => {
  logger.error({ reqId: req.id, err }, 'Unhandled error');
  if (err && err.validation) {
    res.status(400).json({ error: 'validation', details: err.details });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    logger.info(`API listening on port ${config.PORT}`);
  });
}

export default app;