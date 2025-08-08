const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');
const fs = require('fs');

// Configuration
const RATE_LIMIT = parseInt(process.env.SIGIL_RATE_LIMIT) || 200;
const RATE_WINDOW = parseInt(process.env.SIGIL_RATE_WINDOW) || 10;
const REDIS_URL = process.env.REDIS_URL;
const REDIS_CA = process.env.REDIS_CA;

// Helper to build a limiter (Redis if available and secure, else memory)
function buildLimiter(points, windowSeconds) {
  if (!REDIS_URL) {
    console.log(`Rate limiter using memory: ${points} requests per ${windowSeconds}s`);
    return new RateLimiterMemory({ points, duration: windowSeconds, blockDuration: windowSeconds, execEvenly: true });
  }

  let useRedis = true;
  const redisOptions = {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    retryDelayOnFailover: 100,
    lazyConnect: true
  };

  if (REDIS_URL.startsWith('rediss://')) {
    redisOptions.tls = { rejectUnauthorized: true };
    if (REDIS_CA) {
      try { redisOptions.tls.ca = fs.readFileSync(REDIS_CA); } catch (e) { console.warn(`Failed to read REDIS_CA at ${REDIS_CA}: ${e.message}`); }
    }
  } else if (!process.env.ALLOW_INSECURE_REDIS) {
    console.warn('Insecure Redis URL detected and ALLOW_INSECURE_REDIS is not set. Falling back to in-memory rate limiter.');
    useRedis = false;
  } else {
    console.warn('Using insecure Redis URL (redis://). Do not use in production. Set REDIS_URL to rediss:// and REDIS_CA.');
  }

  if (!useRedis) {
    return new RateLimiterMemory({ points, duration: windowSeconds, blockDuration: windowSeconds, execEvenly: true });
  }

  try {
    const redis = new Redis(REDIS_URL, redisOptions);
    console.log(`Rate limiter using Redis: ${points} requests per ${windowSeconds}s`);
    return new RateLimiterRedis({
      storeClient: redis,
      points,
      duration: windowSeconds,
      blockDuration: windowSeconds,
      execEvenly: true
    });
  } catch (error) {
    console.warn('Redis unavailable, falling back to memory rate limiter:', error.message);
    return new RateLimiterMemory({ points, duration: windowSeconds, blockDuration: windowSeconds, execEvenly: true });
  }
}

// Default limiter from env
let limiter = buildLimiter(RATE_LIMIT, RATE_WINDOW);

function rateLimiter(req, res, next) {
  // Create composite key from user and tenant for proper isolation
  let userKey;
  if (req.user) {
    userKey = `${req.user.tenantId || 'public'}:${req.user.sub}`;
  } else {
    // Fallback to IP if no user context (shouldn't happen with JWT middleware)
    userKey = `ip:${req.ip}`;
  }
  
  limiter.consume(userKey)
    .then((resRateLimiter) => {
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': RATE_LIMIT,
        'X-RateLimit-Remaining': resRateLimiter.remainingPoints,
        'X-RateLimit-Reset': new Date(Date.now() + resRateLimiter.msBeforeNext).toISOString()
      });
      next();
    })
    .catch((rejRes) => {
      // Rate limit exceeded
      const retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 1;
      
      res.set({
        'Retry-After': retryAfter,
        'X-RateLimit-Limit': RATE_LIMIT,
        'X-RateLimit-Remaining': 0,
        'X-RateLimit-Reset': new Date(Date.now() + rejRes.msBeforeNext).toISOString()
      });
      
      // Log rate limit violation
      req.log && req.log.warn({ 
        userKey, 
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        method: req.method,
        retryAfter
      }, 'Rate limit exceeded');
      
      res.status(429).json({ 
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
        limit: RATE_LIMIT,
        window: RATE_WINDOW,
        code: 'RATE_LIMIT_EXCEEDED'
      });
    });
}

// Factory to create a per-route limiter with custom limits
function createRateLimiter({ limit, window }) {
  const customLimiter = buildLimiter(
    parseInt(limit || RATE_LIMIT, 10),
    parseInt(window || RATE_WINDOW, 10)
  );
  return function scopedRateLimiter(req, res, next) {
    let userKey;
    if (req.user) {
      userKey = `${req.user.tenantId || 'public'}:${req.user.sub}`;
    } else {
      userKey = `ip:${req.ip}`;
    }
    customLimiter.consume(userKey)
      .then((resRateLimiter) => {
        res.set({
          'X-RateLimit-Limit': limit || RATE_LIMIT,
          'X-RateLimit-Remaining': resRateLimiter.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + resRateLimiter.msBeforeNext).toISOString()
        });
        next();
      })
      .catch((rejRes) => {
        const retryAfter = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set({
          'Retry-After': retryAfter,
          'X-RateLimit-Limit': limit || RATE_LIMIT,
          'X-RateLimit-Remaining': 0,
          'X-RateLimit-Reset': new Date(Date.now() + rejRes.msBeforeNext).toISOString()
        });
        req.log && req.log.warn({ userKey, ip: req.ip, userAgent: req.get('User-Agent'), endpoint: req.path, method: req.method, retryAfter }, 'Rate limit exceeded');
        res.status(429).json({ 
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
          limit: limit || RATE_LIMIT,
          window: window || RATE_WINDOW,
          code: 'RATE_LIMIT_EXCEEDED'
        });
      });
  };
}

module.exports = { rateLimiter, limiter, RATE_LIMIT, RATE_WINDOW, createRateLimiter };

