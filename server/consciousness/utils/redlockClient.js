import { Redis } from 'ioredis';
import Redlock from 'redlock';
import { redis } from './redisClient.js';
export const redlock = new Redlock([redis]);