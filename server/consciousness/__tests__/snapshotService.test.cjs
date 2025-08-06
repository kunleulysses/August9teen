const SnapshotService = require('../persistence/SnapshotService.cjs');
const { InMemoryStore } = require('../persistence/InMemoryStore.cjs');
const { PutObjectCommand, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');

class FakeS3 {
  constructor() {
    this.objects = new Map();
  }

  async send(command) {
    if (command instanceof PutObjectCommand) {
      const buffer = await streamToBuffer(command.input.Body);
      this.objects.set(command.input.Key, buffer);
      return {};
    }
    if (command instanceof ListObjectsV2Command) {
      return { Contents: Array.from(this.objects.keys()).map(k => ({ Key: k, LastModified: new Date() })) };
    }
    if (command instanceof GetObjectCommand) {
      const buf = this.objects.get(command.input.Key);
      return { Body: Readable.from(buf) };
    }
    throw new Error('Unknown command');
  }
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

describe('SnapshotService', () => {
  test('restores from snapshot when store empty', async () => {
    const spiralMemory = new Map([
      ['a', { msg: 'one' }],
      ['b', { msg: 'two' }],
    ]);
    const store = new InMemoryStore();
    await store.set('a', { msg: 'one' });
    await store.set('b', { msg: 'two' });

    const s3 = new FakeS3();
    const service = new SnapshotService(spiralMemory, store, { bucket: 'test', s3Client: s3, intervalMs: 1000 });

    await service.snapshot();

    // simulate loss
    spiralMemory.clear();
    await store.delete('a');
    await store.delete('b');

    const restored = await service.restoreIfEmpty();

    expect(restored).toBe(true);
    expect(spiralMemory.size).toBe(2);
    const stored = await store.get('a');
    expect(stored).toEqual({ msg: 'one' });
  });
});
