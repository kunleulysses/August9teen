/**
 * Spawns N worker processes each with a different SHARD_ID for cluster demo.
 * Usage: node scripts/spiral-launch-cluster.js 4
 */
const { fork } = require('child_process');
const os = require('os');
const path = require('path');

const num = Number(process.argv[2] || 4);

for (let i = 0; i < num; ++i) {
  const env = { ...process.env, SHARD_ID: i };
  fork(path.join(__dirname, '../FlappyJournal/server/consciousness/core/spiral-metrics-server.cjs'), [], { env });
  console.log(`Launched spiral-metrics-server for shard ${i}`);
}