import jwt from 'jsonwebtoken';
import config from '../common/config.cjs';
import logger from '../common/logger.cjs';
import { authErrors } from './metrics.cjs';

import fs from 'fs';
const { generateKeyPairSync } = await import('crypto');

const privateEnv = process.env.API_JWT_PRIVATE_KEY;
const publicEnv  = process.env.API_JWT_PUBLIC_KEY;
let PRIVATE_KEY = privateEnv;
let PUBLIC_KEY  = publicEnv;
if (!PRIVATE_KEY || !PUBLIC_KEY) {
  try {
    PRIVATE_KEY = fs.readFileSync('./keys/jwtRS256.key','utf8');
    PUBLIC_KEY  = fs.readFileSync('./keys/jwtRS256.key.pub','utf8');
  } catch (_) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    PRIVATE_KEY = privateKey.export({ type:'pkcs1', format:'pem' });
    PUBLIC_KEY  = publicKey.export({ type:'pkcs1', format:'pem' });
  }
}

function authMiddleware(req, res, next) {
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
    req.user = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    next();
  } catch (err) {
    logger.warn({ err }, 'JWT error');
    authErrors.inc();
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function loginRoute(req, res) {
  const { user } = req.body || {};
  if (!user || typeof user !== 'string') {
    return res.status(400).json({ error: 'Missing user' });
  }
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1h', algorithm: 'RS256' });
  res.json({ token });
}

module.exports = { authMiddleware, loginRoute };