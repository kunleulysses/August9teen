import 'express-async-errors';
import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import logger from '../common/logger.js';
import config from '../common/config.js';
import { generateId } from '../common/id.js';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { authMiddleware, loginRoute } from './auth.js';
import { storeFactory } from '../common/storeFactory.js';

const app = express();
let httpServer = null;

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, rate limit exceeded' },
  })
);

app.use((req, res, next) => {
  req.id = generateId();
  req.startTime = Date.now();
  logger.info({ reqId: req.id, method: req.method, url: req.url }, 'Request start');
  res.on('finish', () => {
    logger.info({ reqId: req.id, status: res.statusCode, duration: Date.now() - req.startTime }, 'Request finish');
  });
  next();
});

app.use(bodyParser.json());

const openApiDocument = YAML.load(new URL('./openapi.yaml', import.meta.url).pathname);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(routes);

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