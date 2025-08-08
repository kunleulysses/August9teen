#!/usr/bin/env node
/* Pilot readiness validation for Spiral Memory + SelfCoding */
const path = require('path');
const { EventEmitter } = require('events');

function log(step, ok, extra) {
  const status = ok ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${step}${extra ? ' :: ' + extra : ''}`);
}

async function validateSpiral() {
  const { spiralMemory } = require(path.resolve(process.cwd(), 'FlappyJournal/server/architect-4.0-spiral-memory.cjs'));
  // Encode + recall
  const beforeSize = spiralMemory.memorySpiral.size;
  const entry = spiralMemory.encode({ content: 'pilot_validation' }, 0.8, { source: 'pilot' });
  const recall = await spiralMemory.recall('pilot_validation', { maxResults: 5 });
  const recallOk = recall && Array.isArray(recall.results) && recall.results.find(r => r.id === entry.id);
  log('Spiral encode/recall', !!recallOk, `size=${beforeSize}→${spiralMemory.memorySpiral.size}`);

  // Snapshot + restore (Fake S3)
  const SnapshotService = require(path.resolve(process.cwd(), 'server/consciousness/persistence/SnapshotService.cjs'));
  class FakeS3 { constructor() { this.store = new Map(); }
    async send(cmd) {
      const n = cmd.constructor.name;
      if (n === 'PutObjectCommand') { this.store.set(cmd.input.Key, cmd.input.Body); return {}; }
      if (n === 'ListObjectsV2Command') { return { Contents: Array.from(this.store.keys()).map(k => ({ Key: k, LastModified: new Date() })) }; }
      if (n === 'GetObjectCommand') { return { Body: require('stream').Readable.from(this.store.get(cmd.input.Key)) }; }
      throw new Error('Unknown cmd ' + n);
    }
  }
  process.env.SPIRAL_KMS_KEY = Buffer.alloc(32, 7).toString('base64');
  process.env.SPIRAL_EVENT_SECRET = 'pilot_secret';
  const s3 = new FakeS3();
  const svc = new SnapshotService(spiralMemory.memorySpiral, null, { bucket: 'pilot', s3Client: s3, intervalMs: 1000 });
  const key = await svc.snapshot();
  const snapOk = typeof key === 'string';
  const saved = spiralMemory.memorySpiral.size;
  spiralMemory.memorySpiral.clear();
  const restored = await svc.restoreLatest();
  if (typeof spiralMemory.rebuildResonanceIndex === 'function') spiralMemory.rebuildResonanceIndex();
  const restoreOk = restored && spiralMemory.memorySpiral.size === saved;
  log('Snapshot encrypt+HMAC + restore', snapOk && restoreOk, `size=${saved}`);
}

async function validateSelfCoding() {
  const SelfCodingModule = require(path.resolve(process.cwd(), 'FlappyJournal/server/consciousness/modules/SelfCodingModule.cjs'));
  const bus = new EventEmitter();
  const mod = new SelfCodingModule();
  mod.setEventBus(bus);

  // Gate approvals
  process.env.SELFCODING_REQUIRE_APPROVAL = 'true';
  process.env.SELF_IMPROVE_AUTO = '1';
  const targetPath = path.resolve(process.cwd(), 'FlappyJournal/server/generated/pilot-test.cjs');

  const id = `pv_${Date.now()}`;
  let approvalRequested = false;
  let integrated = false;
  let rollbackDone = false;

  bus.on('code:approval:required', (info) => {
    if (info && info.id === id) {
      approvalRequested = true;
      // grant approval immediately
      bus.emit('code:approval:grant', { id });
    }
  });
  bus.on('code:integrated', (p) => {
    integrated = true;
    // trigger rollback if we have a target
    bus.emit('autonomy:regression', { target: targetPath, reason: 'pilot_validation' });
  });
  bus.on('autonomy:rollback:done', () => { rollbackDone = true; });

  // Request generation
  bus.emit('code:generation:request', {
    id,
    purpose: 'pilot_validation',
    description: 'Generate simple module for pilot validation',
    selfImprove: true,
    targetPath
  });

  // Wait a bit for async pipeline
  await new Promise(r => setTimeout(r, 800));
  log('SelfCoding approval required → granted', approvalRequested && integrated, `id=${id}`);
  // Give rollback watcher a bit
  await new Promise(r => setTimeout(r, 400));
  log('SelfCoding rollback', rollbackDone);

  // Metrics
  if (typeof mod.getPilotMetrics === 'function') {
    const m = mod.getPilotMetrics();
    log('SelfCoding metrics available', !!m, JSON.stringify(m));
  }
}

(async () => {
  console.log('--- Pilot Validation Start ---');
  try {
    await validateSpiral();
    await validateSelfCoding();
  } catch (e) {
    console.error('Validation error:', e);
    process.exitCode = 1;
  }
  console.log('--- Pilot Validation End ---');
})();

