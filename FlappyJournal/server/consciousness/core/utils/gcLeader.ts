import Redlock from 'redlock';
import Redis, { Cluster } from 'ioredis';
import EventEmitter from 'events';
import logger from './logger';

const events = new EventEmitter();
let redlock: Redlock | null = null;
let isLeaderCache: Record<string, boolean> = {};

function getRedisCluster(): Cluster | null {
  if (!process.env.REDIS_CLUSTER_URL) return null;
  const urls = process.env.REDIS_CLUSTER_URL.split(',').map(u => u.trim());
  return new Redis.Cluster(urls.map(u => ({ host: u.split(':')[0], port: Number(u.split(':')[1]) })));
}

export async function isLeader(shardId: number): Promise<boolean> {
  if (!process.env.REDIS_CLUSTER_URL) return true; // dev fallback
  if (!redlock) {
    const cluster = getRedisCluster();
    redlock = new Redlock([cluster!], { retryCount: 0, retryDelay: 200 });
  }
  const key = `spiral:gc:leader:${shardId}`;
  try {
    const lock = await redlock!.acquire([key], 30000);
    isLeaderCache[shardId] = true;
    events.emit('gc:leader', { shardId, leader: true });
    // Renew lock every 20s
    setTimeout(async () => {
      try {
        await lock.extend(30000);
        isLeaderCache[shardId] = true;
      } catch {
        isLeaderCache[shardId] = false;
        events.emit('gc:leader', { shardId, leader: false });
      }
    }, 20000);
    return true;
  } catch {
    isLeaderCache[shardId] = false;
    events.emit('gc:leader', { shardId, leader: false });
    return false;
  }
}
export function onLeader(fn: (info: { shardId: number; leader: boolean }) => void) {
  events.on('gc:leader', fn);
}