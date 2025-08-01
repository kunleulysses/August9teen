import type { StorageAdapter } from '../types';

export abstract class SpiralStorageAdapter implements StorageAdapter {
  encryptionKey?: Buffer;
  setEncryptionKey(key: Buffer) { this.encryptionKey = key; }
  abstract init(): Promise<void>;
  abstract get(key: string): Promise<any>;
  abstract set(key: string, value: any): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract keys(prefix?: string): Promise<string[]>;
}

import { encrypt, decrypt } from '../security/crypto';

export class InMemorySpiralAdapter extends SpiralStorageAdapter {
  private map = new Map<string, any>();
  async init(): Promise<void> {}
  async get(key: string): Promise<any> {
    let val = this.map.get(key);
    if (this.encryptionKey && val && val.__enc) {
      val = JSON.parse(decrypt(val.__enc, this.encryptionKey).toString());
    }
    return val;
  }
  async set(key: string, value: any): Promise<void> {
    if (this.encryptionKey) {
      const enc = encrypt(JSON.stringify(value), this.encryptionKey);
      this.map.set(key, { __enc: enc });
    } else {
      this.map.set(key, value);
    }
  }
  async del(key: string): Promise<void> {
    this.map.delete(key);
  }
  async keys(prefix = ''): Promise<string[]> {
    return Array.from(this.map.keys()).filter(k => k.startsWith(prefix));
  }
}