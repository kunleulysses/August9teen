const crypto = require('crypto');

let adapterInstance = null;

function getAdapter() {
  if (!adapterInstance) {
    const { PostgresSigilAdapter } = require('../consciousness/persistence/PostgresSigilAdapter.cjs');
    adapterInstance = new PostgresSigilAdapter();
  }
  return adapterInstance;
}

function computeProgramId(tenantId, programmingRequest) {
  const hasher = crypto.createHash('sha256');
  hasher.update(String(tenantId || 'public'));
  hasher.update('|');
  hasher.update(JSON.stringify(programmingRequest || {}));
  return hasher.digest('hex').slice(0, 32);
}

async function saveCompiledArtifact(tenantId, programId, artifact) {
  const storage = getAdapter();
  await storage.open();
  // reuse sigil table as generic JSON store
  await storage.setSigilRecord(tenantId, 'cnpl', programId, { artifact, storedAt: Date.now() });
}

async function loadCompiledArtifact(tenantId, programId) {
  const storage = getAdapter();
  await storage.open();
  const rec = await storage.getSigilRecord(tenantId, 'cnpl', programId);
  return rec?.artifact;
}

module.exports = { computeProgramId, saveCompiledArtifact, loadCompiledArtifact };

