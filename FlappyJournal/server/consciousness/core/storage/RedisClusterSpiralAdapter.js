const { SpiralStorageAdapter } = require('./SpiralStorageAdapter');
import type { StorageAdapter } from '../types';
const { crc16 } = require('../utils/hash');
import Redis, { Cluster } from 'ioredis';

function parseClusterUrls() {
  if (process.env.REDIS_CLUSTER_URL) {
    return process.env.REDIS_CLUSTER_URL.split(',').map(url => url.trim());
  }
  return [];
}

function shardFor(id) {
  return crc16(id) % 128;
}

module.exports = class; RedisClusterSpiralAdapter extends SpiralStorageAdapter implements StorageAdapter {
  cluster | null = null;

  constructor(urls?) {
    super();
    this.urls = urls || parseClusterUrls();
    this.cluster = null;
  }
  async init() {
    if (!this.cluster) {
      this.cluster = new Redis.Cluster(this.urls.map(u => ({ host.split(':')[0], port(u.split(':')[1]) })));
    }
  }
  keyFor(type, id) {
    const shard = shardFor(id);
    return `spiral:${shard}:${type}:${id}`;
  }
  async get(key) {
    if (!this.cluster) throw new Error('Not initialized');
    const val = await this.cluster.get(key);
    return val ? JSON.parse(val) ;
  }
  async set(key, value) {
    if (!this.cluster) throw new Error('Not initialized');
    await this.cluster.set(key, JSON.stringify(value));
  }
  async del(key) {
    if (!this.cluster) throw new Error('Not initialized');
    await this.cluster.del(key);
  }
  async keys(prefix = '') {
    if (!this.cluster) throw new Error('Not initialized');
    // cluster-wide scan
    const nodes = this.cluster.nodes('master');
    let result = [];
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