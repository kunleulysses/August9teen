import jwt from 'jsonwebtoken';
import config from '../common/config.js';
import logger from '../common/logger.js';
import { authErrors } from './metrics.js';

const JWT_SECRET = process.env.API_JWT_SECRET || 'changeme';

export function authMiddleware(req, res, next) {
  if (
    (req.method === 'GET' && req.path === '/health') ||
    (req.method === 'GET' && req.path.startsWith('/docs'))
  ) {
    return next();
  }
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    authErrors.inc();
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice('Bearer '.length);
  try {
    req.user = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch (err) {
    logger.warn({ err }, 'JWT error');
    authErrors.inc();
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function loginRoute(req, res) {
  const { user } = req.body || {};
  if (!user || typeof user !== 'string') {
    return res.status(400).json({ error: 'Missing user' });
  }
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
  res.json({ token });
}