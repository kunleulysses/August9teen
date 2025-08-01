import 'express-async-errors';
import express from 'express';
import bodyParser from 'body-parser';
import logger from '../common/logger.js';
import config from '../common/config.js';
import { generateId } from '../common/id.js';
import routes from './routes/index.js';

const app = express();

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
app.use(routes);

app.get('/health', (req, res) => {
  if (config.NODE_ENV !== 'production') {
    logger.debug({ uptime: process.uptime(), memory: process.memoryUsage() }, 'Health metrics');
  }
  res.json({ status: 'ok', backend: config.STORE_BACKEND });
});

app.use((err, req, res, next) => {
  logger.error({ reqId: req.id, err }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    logger.info(`API listening on port ${config.PORT}`);
  });
}

export default app;