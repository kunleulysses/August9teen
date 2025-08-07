const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');

// Configuration
const RATE_LIMIT = parseInt(process.env.SIGIL_RATE_LIMIT) || 200;
const RATE_WINDOW = parseInt(process.env.SIGIL_RATE_WINDOW) || 10;
const REDIS_URL = process.env.REDIS_URL;

// Create appropriate limiter based on Redis availability
let limiter;
if (REDIS_URL) {
  try {
    const redis = new Redis(REDIS_URL, {
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryDelayOnFailover: 100,
      lazyConnect: true
    });
    
    limiter = new RateLimiterRedis({
      storeClient: redis,
      points: RATE_LIMIT,
      duration: RATE_WINDOW,
      blockDuration: RATE_WINDOW,
      execEvenly: true
    });
    
    console.log(`Rate limiter using Redis: ${RATE_LIMIT} requests per ${RATE_WINDOW}s`);
  } catch (error) {
    console.warn('Redis unavailable, falling back to memory rate limiter:', error.message);
    limiter = new RateLimiterMemory({
      points: RATE_LIMIT,
      duration: RATE_WINDOW,
      blockDuration: RATE_WINDOW,
      execEvenly: true
    });
  }
} else {
  limiter = new RateLimiterMemory({
    points: RATE_LIMIT,
    duration: RATE_WINDOW,
    blockDuration: RATE_WINDOW,
    execEvenly: true
  });
  console.log(`Rate limiter using memory: ${RATE_LIMIT} requests per ${RATE_WINDOW}s`);
}

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

// Export both the middleware and limiter for testing
module.exports = { rateLimiter, limiter, RATE_LIMIT, RATE_WINDOW };