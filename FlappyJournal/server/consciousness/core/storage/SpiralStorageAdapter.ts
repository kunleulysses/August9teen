import type { StorageAdapter } from '../types';

export abstract class SpiralStorageAdapter implements StorageAdapter {
  abstract init(): Promise<void>;
  abstract get(key: string): Promise<any>;
  abstract set(key: string, value: any): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract keys(prefix?: string): Promise<string[]>;
}

export class InMemorySpiralAdapter extends SpiralStorageAdapter {
  private map = new Map<string, any>();
  async init(): Promise<void> {}
  async get(key: string): Promise<any> {
    return this.map.has(key) ? this.map.get(key) : undefined;
  }
  async set(key: string, value: any): Promise<void> {
    this.map.set(key, value);
  }
  async del(key: string): Promise<void> {
    this.map.delete(key);
  }
  async keys(prefix = ''): Promise<string[]> {
    return Array.from(this.map.keys()).filter(k => k.startsWith(prefix));
  }
}