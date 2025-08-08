#!/usr/bin/env node
process.env.SANDBOX_VERIFY = process.env.SANDBOX_VERIFY || '1';
process.env.DRY_RUN = '1';
console.log('[selfcode] DRY_RUN=1 starting demo');
require('./demo-selfcoding.cjs');