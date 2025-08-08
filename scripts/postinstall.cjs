#!/usr/bin/env node
const { spawnSync } = require('child_process');
try {
  const url = process.env.DATABASE_URL;
  if (!url || !String(url).trim()) {
    console.log('[postinstall] Skipping prisma db push: no DATABASE_URL');
    process.exit(0);
  }
  const isWin = process.platform === 'win32';
  const bin = isWin ? 'prisma.cmd' : 'prisma';
  const cmd = process.platform === 'win32' ? bin : `./node_modules/.bin/${bin}`;
  const result = spawnSync(cmd, ['db', 'push'], { stdio: 'inherit', shell: process.platform === 'win32' });
  process.exit(result.status || 0);
} catch (e) {
  console.error('[postinstall] Prisma push failed:', e.message);
  process.exit(1);
}