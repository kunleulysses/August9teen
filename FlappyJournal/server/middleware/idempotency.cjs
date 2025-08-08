const Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL;
const IDEMPOTENCY_TTL_SECONDS = parseInt(process.env.IDEMPOTENCY_TTL_SECONDS || '600', 10);

let redisClient = null;
let memoryStore = new Map();

function getRedis() {
  if (!REDIS_URL) return null;
  if (redisClient) return redisClient;
  const options = { enableOfflineQueue: false, lazyConnect: true };
  if (REDIS_URL.startsWith('rediss://')) {
    options.tls = { rejectUnauthorized: true };
  }
  try {
    redisClient = new Redis(REDIS_URL, options);
    return redisClient;
  } catch (_) {
    return null;
  }
}

async function isDuplicate(key) {
  const redis = getRedis();
  const ttl = IDEMPOTENCY_TTL_SECONDS;
  if (redis) {
    const res = await redis.set(`idem:${key}`, '1', 'EX', ttl, 'NX');
    return res !== 'OK';
  }
  const now = Date.now();
  const existing = memoryStore.get(key);
  if (existing && existing > now) return true;
  memoryStore.set(key, now + ttl * 1000);
  return false;
}

function idempotencyMiddleware(req, res, next) {
  const key = req.get('Idempotency-Key');
  if (!key) return next();
  isDuplicate(key)
    .then((dup) => {
      if (dup) {
        return res.status(409).json({ error: 'Duplicate request', code: 'IDEMPOTENT_REPLAY' });
      }
      next();
    })
    .catch(() => next());
}

module.exports = { idempotencyMiddleware };

