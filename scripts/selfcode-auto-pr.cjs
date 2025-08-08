#!/usr/bin/env node
process.env.SANDBOX_VERIFY = process.env.SANDBOX_VERIFY || '1';
process.env.DRY_RUN = '0';
process.env.AUTO_PR = '1';
console.log('[selfcode] AUTO_PR=1 DRY_RUN=0 starting demo');
require('./demo-selfcoding.cjs');