const { RateLimiterMemory, RateLimiterRedis } = require('rate-limiter-flexible');
const Redis = require('ioredis');
const [points, duration] = (process.env.SPIRAL_RATE_LIMIT || '100,10').split(',').map(Number);

let limiter;
if (process.env.REDIS_URL && !process.env.DISABLE_CLUSTER_RATE_LIMIT) {
  limiter = new RateLimiterRedis({
    storeClient: new Redis(process.env.REDIS_URL),
    keyPrefix: 'spiral_rl',
    points,
    duration
  });
} else {
  limiter = new RateLimiterMemory({ points, duration });
}

module.exports.consume = async (key) => limiter.consume(key);