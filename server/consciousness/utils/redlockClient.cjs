import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { redis } from './redisClient.cjs';
export const redlock = new Redlock([redis]);