const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Pool } = require('pg');
const fs = require('fs');

class S3Snapshotter {
  constructor(opts = {}) {
    this.bucket = opts.bucket || process.env.BUCKET;
    this.intervalMs = opts.intervalMs || 5 * 60 * 1000;
    this.s3 = opts.s3Client || new S3Client({});
    this.pool = opts.pool || null;
    this.timer = null;
  }

  start() {
    if (this.timer || !this.bucket) return;
    this.timer = setInterval(() => {
      this.snapshot().catch(err => console.error('S3 snapshot failed', err));
    }, this.intervalMs);
  }

  async stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async snapshot() {
    if (!this.bucket) return;
    if (!this.pool) {
      this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    }
    const tmpFile = '/tmp/ts.dump.gz';
    await this.pool.query("COPY (SELECT * FROM reality_scene) TO PROGRAM 'gzip > /tmp/ts.dump.gz'");
    const fileStream = fs.createReadStream(tmpFile);
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: 'reality-snapshots/ts.dump.gz',
      Body: fileStream
    }));
  }
}

module.exports = S3Snapshotter;
