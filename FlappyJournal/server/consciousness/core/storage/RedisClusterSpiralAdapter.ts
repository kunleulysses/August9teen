import { SpiralStorageAdapter } from './SpiralStorageAdapter';
import type { StorageAdapter } from '../types';
import { crc16 } from '../utils/hash';
import Redis, { Cluster } from 'ioredis';

function parseClusterUrls(): string[] {
  if (process.env.REDIS_CLUSTER_URL) {
    return process.env.REDIS_CLUSTER_URL.split(',').map(url => url.trim());
  }
  return [];
}

function shardFor(id: string): number {
  return crc16(id) % 128;
}

export default class RedisClusterSpiralAdapter extends SpiralStorageAdapter implements StorageAdapter {
  cluster: Cluster | null = null;
  urls: string[];
  constructor(urls?: string[]) {
    super();
    this.urls = urls || parseClusterUrls();
    this.cluster = null;
  }
  async init(): Promise<void> {
    if (!this.cluster) {
      this.cluster = new Redis.Cluster(this.urls.map(u => ({ host: u.split(':')[0], port: Number(u.split(':')[1]) })));
    }
  }
  keyFor(type: string, id: string): string {
    const shard = shardFor(id);
    return `spiral:${shard}:${type}:${id}`;
  }
  async get(key: string): Promise<any> {
    if (!this.cluster) throw new Error('Not initialized');
    const val = await this.cluster.get(key);
    return val ? JSON.parse(val) : undefined;
  }
  async set(key: string, value: any): Promise<void> {
    if (!this.cluster) throw new Error('Not initialized');
    await this.cluster.set(key, JSON.stringify(value));
  }
  async del(key: string): Promise<void> {
    if (!this.cluster) throw new Error('Not initialized');
    await this.cluster.del(key);
  }
  async keys(prefix = ''): Promise<string[]> {
    if (!this.cluster) throw new Error('Not initialized');
    // cluster-wide scan
    const nodes = this.cluster.nodes('master');
    let result: string[] = [];
    for (const node of nodes) {
      let cursor = '0';
      do {
        const [next, keys] = await node.scan(cursor, 'MATCH', `spiral:*:${prefix}*`, 'COUNT', 1000);
        result = result.concat(keys);
        cursor = next;
      } while (cursor !== '0');
    }
    // Remove shard prefix for logical keys
    return result.map(k => k.replace(/^spiral:\d+:/, ''));
  }
}