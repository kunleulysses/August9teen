const { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const zlib = require('zlib');
const { PassThrough } = require('stream');

class SnapshotService {
  constructor(spiralMemory, store, opts = {}) {
    this.spiralMemory = spiralMemory;
    this.store = store;
    this.bucket = opts.bucket || process.env.BUCKET;
    this.intervalMs = opts.intervalMs || 5 * 60 * 1000;
    this.s3 = opts.s3Client || new S3Client({});
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
    const pass = new PassThrough();
    const putPromise = this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: pass }));
    const gzip = zlib.createGzip();
    gzip.pipe(pass);
    gzip.end(JSON.stringify([...this.spiralMemory]));
    await putPromise;
    return key;
  }

  async restoreLatest() {
    if (!this.bucket) return false;
    const list = await this.s3.send(new ListObjectsV2Command({ Bucket: this.bucket, Prefix: 'snapshots/' }));
    const latest = list.Contents?.sort((a, b) => (b.LastModified || 0) - (a.LastModified || 0))[0];
    if (!latest) return false;
    const { Body } = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: latest.Key }));
    const unzip = Body.pipe(zlib.createGunzip());
    const buf = await this._streamToBuffer(unzip);
    const data = JSON.parse(buf.toString());
    for (const [k, v] of data) {
      this.spiralMemory.set(k, v);
      if (this.store && this.store.set) await this.store.set(k, v);
    }
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
}

module.exports = SnapshotService;
