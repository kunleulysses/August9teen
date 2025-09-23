#!/usr/bin/env node
// Starts API (REST) and WS (turn engine) together with friendly defaults
const { spawn } = require('child_process');

function run(cmd, args, env, name) {
  const child = spawn(cmd, args, { env: { ...process.env, ...env }, stdio: 'pipe' });
  child.stdout.on('data', d => process.stdout.write(`[${name}] ${d}`));
  child.stderr.on('data', d => process.stderr.write(`[${name}] ${d}`));
  child.on('exit', (code) => console.log(`[${name}] exited with code ${code}`));
  return child;
}

const apiEnv = {
  WS_JWT_REQUIRED: process.env.WS_JWT_REQUIRED || 'false',
  PROM_API_KEY: process.env.PROM_API_KEY || 'dev',
  HOLOGRAPH_WORKER_ENABLED: process.env.HOLOGRAPH_WORKER_ENABLED || 'false',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

console.log('Launching API (port 3000) and WS (port 3015)...');
console.log('Tip: export DATABASE_URL for Postgres; REDIS_URL optional.');
console.log('Dev defaults: WS_JWT_REQUIRED=false, PROM_API_KEY=dev');

const api = run('npm', ['run', 'start:api'], apiEnv, 'api');

setTimeout(() => {
  const ws = run('npm', ['run', 'start:ws'], {}, 'ws');
  console.log('\nPlay now:');
  console.log(' - WS turns: ws://localhost:3015/ws/unified-chat');
  console.log(' - Pre-gen status: GET http://localhost:3000/api/v1/pregen/status');
  console.log(' - Spiral health: GET http://localhost:3000/api/v1/spiral/health');
  console.log(' - Metrics (x-api-key: dev): GET http://localhost:3000/metrics');

  process.on('SIGINT', () => { api.kill('SIGINT'); ws.kill('SIGINT'); process.exit(0); });
  process.on('SIGTERM', () => { api.kill('SIGTERM'); ws.kill('SIGTERM'); process.exit(0); });
}, 1500);

