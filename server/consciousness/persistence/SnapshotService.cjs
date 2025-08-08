const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const zlib = require('zlib');
const crypto = require('crypto');

class SnapshotService {
  constructor(spiralMemory, store, opts = {}) {
    this.spiralMemory = spiralMemory;
    this.store = store;
    this.bucket = opts.bucket || process.env.BUCKET;
    this.intervalMs = opts.intervalMs || 5 * 60 * 1000;
    this.s3 = opts.s3Client || new S3Client({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || undefined });
    this.timer = null;
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.snapshot().catch(err => console.error('Snapshot failed', err));
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  async snapshot() {
    if (!this.bucket) return;
    const key = `snapshots/${Date.now()}.gz`;
    // Build payload buffer
    const json = JSON.stringify([...this.spiralMemory]);
    const gz = zlib.gzipSync(Buffer.from(json));

    // Optional encryption and integrity
    const kmsKey = process.env.SPIRAL_KMS_KEY; // base64 or hex expected
    const eventSecret = process.env.SPIRAL_EVENT_SECRET;
    let body;
    if (kmsKey) {
      const keyBuf = this._decodeKey(kmsKey);
      if (keyBuf.length !== 32) throw new Error('SPIRAL_KMS_KEY must be 32 bytes (AES-256) in hex or base64');
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv('aes-256-gcm', keyBuf, iv);
      const enc = Buffer.concat([cipher.update(gz), cipher.final()]);
      const tag = cipher.getAuthTag();
      const envelope = {
        v: 1,
        alg: 'aes-256-gcm',
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        data: enc.toString('base64')
      };
      if (eventSecret) {
        envelope.mac = crypto.createHmac('sha256', eventSecret).update(envelope.data).digest('base64');
      }
      body = Buffer.from(JSON.stringify(envelope));
    } else if (eventSecret) {
      const mac = crypto.createHmac('sha256', eventSecret).update(gz).digest('base64');
      const envelope = { v: 1, alg: 'none', data: gz.toString('base64'), mac };
      body = Buffer.from(JSON.stringify(envelope));
    } else {
      body = gz;
    }

    try {
      await this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: 'application/octet-stream' }));
      try { const prom = require('prom-client'); new prom.Counter({ name: 'spiral_snapshot_success_total', help: 'Snapshot success' }).inc(); } catch (_) {}
    } catch (e) {
      try { const prom = require('prom-client'); new prom.Counter({ name: 'spiral_snapshot_failed_total', help: 'Snapshot failed' }).inc(); } catch (_) {}
      throw e;
    }
    return key;
  }

  async restoreLatest() {
    if (!this.bucket) return false;
    const list = await this.s3.send(new ListObjectsV2Command({ Bucket: this.bucket, Prefix: 'snapshots/' }));
    const latest = list.Contents?.sort((a, b) => (b.LastModified || 0) - (a.LastModified || 0))[0];
    if (!latest) return false;
    const { Body } = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: latest.Key }));
    const raw = await this._streamToBuffer(Body);
    let arr;
    try {
      // Try envelope first
      const env = JSON.parse(raw.toString());
      if (env && env.v === 1) {
        if (env.mac && process.env.SPIRAL_EVENT_SECRET) {
          const expected = crypto.createHmac('sha256', process.env.SPIRAL_EVENT_SECRET).update(env.data).digest('base64');
          if (env.mac !== expected) throw new Error('Snapshot MAC verification failed');
        }
        let gzBuf;
        if (env.alg === 'aes-256-gcm') {
          const kmsKey = process.env.SPIRAL_KMS_KEY;
          if (!kmsKey) throw new Error('SPIRAL_KMS_KEY required to decrypt snapshot');
          const keyBuf = this._decodeKey(kmsKey);
          const iv = Buffer.from(env.iv, 'base64');
          const tag = Buffer.from(env.tag, 'base64');
          const data = Buffer.from(env.data, 'base64');
          const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuf, iv);
          decipher.setAuthTag(tag);
          gzBuf = Buffer.concat([decipher.update(data), decipher.final()]);
        } else {
          gzBuf = Buffer.from(env.data, 'base64');
        }
        const buf = zlib.gunzipSync(gzBuf);
        arr = JSON.parse(buf.toString());
      } else {
        // Not an envelope, treat as raw gz
        const buf = zlib.gunzipSync(raw);
        arr = JSON.parse(buf.toString());
      }
    } catch (e) {
      // Fallback: raw gz json array
      try {
        const buf = zlib.gunzipSync(raw);
        arr = JSON.parse(buf.toString());
      } catch (e2) {
        throw e;
      }
    }
    const data = arr;
    for (const [k, v] of data) {
      this.spiralMemory.set(k, v);
      if (this.store && this.store.set) await this.store.set(k, v);
    }
    try { const prom = require('prom-client'); new prom.Counter({ name: 'spiral_restore_success_total', help: 'Restore success' }).inc(); } catch (_) {}
    return true;
  }

  async restoreIfEmpty() {
    if (!this.store || !this.store.all) return false;
    const existing = await this.store.all();
    if (existing.length > 0) return false;
    return await this.restoreLatest();
  }

  async _streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  _decodeKey(key) {
    // Accept base64 or hex; try base64 first
    try {
      const b = Buffer.from(key, 'base64');
      if (b.length) return b;
    } catch {}
    return Buffer.from(key, 'hex');
  }
}

module.exports = SnapshotService;
