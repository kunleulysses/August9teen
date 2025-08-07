#!/usr/bin/env node
// Demo script for Platform/DevEx leaders: runs a safe DRY_RUN or AUTO_PR flow.
const path = require('path');

(async () => {
  process.env.SANDBOX_VERIFY = process.env.SANDBOX_VERIFY || '1';
  process.env.DRY_RUN = process.env.DRY_RUN || '1';
  const Consolidated = require('../shared-consciousness/main-server/consciousness/modules/SelfCodingModuleConsolidated.cjs');
  const m = new Consolidated();
  const req = {
    moduleId: `demo_${Date.now()}`,
    template: 'function',
    purpose: 'demo-autointegration',
    language: 'javascript',
    description: 'Generate a simple hello world demo function',
    authContext: { authorized: true, permissions: ['self-coding'], userId: 'demo' },
    targetPath: 'FlappyJournal/server/generated/demo.cjs'
  };
  console.log('Running demo with DRY_RUN=%s AUTO_PR=%s', process.env.DRY_RUN, process.env.AUTO_PR || '0');
  const res = await m.generateWithAutoIntegration(req);
  console.log('Demo result:', res && res.success !== false ? 'success' : ('failed: ' + (res && res.error)));
  console.log('Check artifacts:', path.resolve(process.cwd(), 'artifacts', 'selfcoding-pr'));
})().catch((e) => { console.error(e); process.exit(1); });

