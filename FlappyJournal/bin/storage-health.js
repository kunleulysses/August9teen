#!/usr/bin/env node
const { SpiralMemoryArchitecture } = require('../server/consciousness/core/SpiralMemoryArchitecture.cjs');

async function run() {
  const arch = new SpiralMemoryArchitecture();
  await arch.checkStorageHealth();
  console.log('Storage health check passed!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});