'use strict';
const { EventEmitter } = require('events');
const fs = require('fs/promises');
const path = require('path');
const SelfCodingModule = require('/opt/featherweight/shared-consciousness/main-server/consciousness/modules/SelfCodingModuleConsolidated.cjs');

const bus = new EventEmitter();
// Consciousness state responder
bus.on('consciousness:state:request', (cb) => { try { cb({ phi: 1.618, timestamp: Date.now(), mode: 'canary' }); } catch (_) {} });

// Simple logger
function log(...args){ try{ console.log('[autopilot]', ...args); }catch(_){} }

// Surface key events
for (const evt of ['code:approval:required','code:pr:created','code:integrated','code:generation:error','autonomy:rollback:done']) {
  bus.on(evt, (p)=>{ try { log(evt, JSON.stringify(p || {})); } catch (_) { log(evt); } });
}

// Persist pending approvals mapping for CLI
const approvalsRoot = path.resolve('/opt/featherweight', 'artifacts', 'autopilot-approvals');
const processedRoot = path.join(approvalsRoot, 'processed');
async function ensureApprovalDirs(){ await fs.mkdir(approvalsRoot, { recursive: true }); await fs.mkdir(processedRoot, { recursive: true }); }

bus.on('code:approval:required', async (msg = {}) => {
  try{
    await ensureApprovalDirs();
    const id = msg.id || `pending_${Date.now()}`;
    const file = path.join(approvalsRoot, `pending-${id}.json`);
    await fs.writeFile(file, JSON.stringify({ id, reason: msg.reason || 'approval_required', createdAt: Date.now() }, null, 2), 'utf8');
    log('pending recorded', id);
  }catch(e){ log('pending record error', e.message); }
});

// Watcher to process approve-* files
async function pollApprovals(){
  try{
    await ensureApprovalDirs();
    const files = await fs.readdir(approvalsRoot);
    for (const f of files){
      if (!/^approve-.*\.json$/.test(f)) continue;
      const full = path.join(approvalsRoot, f);
      let id = null;
      try{ const data = JSON.parse(await fs.readFile(full, 'utf8')); id = data.id || null; }catch(_){ /* ignore */ }
      if (!id){
        // Fallback: extract from filename approve-<id>.json
        id = f.replace(/^approve-/, '').replace(/\.json$/, '');
      }
      if (id){
        try{ bus.emit('code:approval:grant', { id }); log('approval grant emitted', id); }catch(e){ log('emit error', e.message); }
        const target = path.join(processedRoot, f.replace(/\.json$/, '') + '-' + Date.now() + '.json');
        try{ await fs.rename(full, target); }catch(e){ try{ await fs.unlink(full); }catch(_){} }
        const pendingFile = path.join(approvalsRoot, `pending-${id}.json`);
        try{ await fs.unlink(pendingFile); }catch(_){ /* ok */ }
      }
    }
  }catch(e){ /* ignore */ }
}
setInterval(pollApprovals, 3000);

(async () => {
  const mod = new SelfCodingModule();
  mod.setEventBus(bus);
  await mod.initialize(bus);
  log('Canary online', JSON.stringify({
    FULLY_AUTONOMOUS: process.env.FULLY_AUTONOMOUS,
    DRY_RUN: process.env.DRY_RUN,
    SELF_IMPROVE_AUTO: process.env.SELF_IMPROVE_AUTO,
    REQUIRE_APPROVAL: process.env.SELFCODING_REQUIRE_APPROVAL,
    INTERVAL_MIN: process.env.AUTONOMY_INTERVAL_MIN,
    WRITE_ROOT: process.env.SELFCODING_WRITE_ROOT,
    CANARY_APPLY_RATE: process.env.CANARY_APPLY_RATE,
    CANARY_MAX_APPLIES_PER_DAY: process.env.CANARY_MAX_APPLIES_PER_DAY
  }));
  if (process.env.RUN_ON_START === '1') {
    try { const r = await mod.runAutonomyCycle(); log('one-shot', r && r.success !== false ? 'ok' : 'fail'); } catch (e) { log('one-shot error', e.message); }
  }
  setInterval(()=>{}, 3600*1000);
})();
