const SnapshotService = require('../persistence/SnapshotService.cjs');

class FakeS3 {
  constructor() { this.store = new Map(); }
  async send(cmd) {
    const name = cmd.constructor.name;
    if (name === 'PutObjectCommand') {
      this.store.set(cmd.input.Key, cmd.input.Body);
      return {};
    }
    if (name === 'ListObjectsV2Command') {
      const keys = Array.from(this.store.keys());
      return { Contents: keys.map(k => ({ Key: k, LastModified: new Date() })) };
    }
    if (name === 'GetObjectCommand') {
      const body = this.store.get(cmd.input.Key);
      // Emulate stream interface
      return { Body: require('stream').Readable.from(body) };
    }
    throw new Error('Unknown command ' + name);
  }
}

test('snapshot + restore with encryption and HMAC', async () => {
  process.env.SPIRAL_KMS_KEY = Buffer.alloc(32, 1).toString('base64');
  process.env.SPIRAL_EVENT_SECRET = 'secret';
  const s3 = new FakeS3();
  const map = new Map([['a', { id: 'a', timestamp: Date.now() }]]);
  const svc = new SnapshotService(map, null, { bucket: 'test', s3Client: s3, intervalMs: 1000 });
  const key = await svc.snapshot();
  expect(typeof key).toBe('string');
  // Clear and restore
  map.clear();
  const ok = await svc.restoreLatest();
  expect(ok).toBe(true);
  expect(map.size).toBe(1);
  const val = map.get('a');
  expect(val && val.id).toBe('a');
});

