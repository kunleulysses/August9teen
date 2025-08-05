import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const wsRateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ws-rate',
  points: 100, // messages
  duration: 10, // per 10 seconds
  blockDuration: 5 // block for 5 seconds on abuse
});