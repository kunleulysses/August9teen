#!/usr/bin/env node
const { SpiralMemoryArchitecture } = require('../server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { register } = require('../server/consciousness/core/secure-metrics-server.ts');
const client = require('prom-client');
const axios = require('axios');

async function run() {
  const arch = new SpiralMemoryArchitecture();
  await arch.init();

  const report = await arch.rebuildSpiralStats();
  const correctedCount = report.correctedSpirals.filter(s => s.corrected).length;

  if (process.env.SLACK_WEBHOOK_URL && correctedCount > 0) {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `Spiral Memory rebuild complete. Corrected ${correctedCount} spirals.`,
    });
  }

  const correctedTotal = new client.Counter({ name:'spiral_rebuild_corrected_total', help:'Total corrected by rebuild', registers:[register]});
  correctedTotal.inc(correctedCount);
  await register.metrics();

  if (correctedCount > 0) {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});