#!/usr/bin/env node
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');
const jwt = require('jsonwebtoken');

function parseArgs(argv) {
  const out = {}; const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const [k, v] = a.split('=');
      const key = k.replace(/^--/, '');
      if (v !== undefined) out[key] = v; else if (i + 1 < args.length && !args[i+1].startsWith('--')) { out[key] = args[++i]; } else { out[key] = true; }
    }
  }
  return out;
}

(async function main() {
  try {
    const args = parseArgs(process.argv);
    const company = args.company || args.org || args.tenant;
    const adminEmail = args['admin-email'] || args.email || null;
    const skipDb = args['no-db'] === '1' || args['no-db'] === true;

    if (!company || !/^[A-Za-z0-9._-]+$/.test(company)) {
      console.error('[provision] --company is required (alphanumeric, dot, underscore, dash).');
      process.exit(1);
    }

    const dbUrl = process.env.DATABASE_URL || '';
    const secret = process.env.API_JWT_SECRET || '';
    if (!secret) {
      console.error('[provision] API_JWT_SECRET is required in env.');
      process.exit(1);
    }

    if (!skipDb && dbUrl && dbUrl.trim()) {
      const isWin = process.platform === 'win32';
      const bin = isWin ? 'prisma.cmd' : 'prisma';
      const cmd = isWin ? bin : `./node_modules/.bin/${bin}`;
      console.log('[provision] Applying prisma schema (db push)...');
      const res = spawnSync(cmd, ['db', 'push'], { stdio: 'inherit', shell: isWin });
      if (res.status !== 0) {
        console.error('[provision] prisma db push failed');
        process.exit(res.status || 1);
      }
    } else {
      console.log('[provision] Skipping prisma db push (no DATABASE_URL or --no-db).');
    }

    const expiresIn = '30d';
    const payload = { company, scope: ['pilot','admin'] };
    const token = jwt.sign(payload, secret, { expiresIn });

    const outDir = path.resolve(process.cwd(), 'artifacts', 'pilots', company);
    await fsp.mkdir(outDir, { recursive: true });
    const meta = {
      company,
      adminEmail,
      token,
      expiresIn,
      createdAt: new Date().toISOString(),
      hasDatabaseUrl: !!dbUrl,
      notes: 'Use this token as a Bearer token against this isolated instance.'
    };
    await fsp.writeFile(path.join(outDir, 'provision.json'), JSON.stringify(meta, null, 2), 'utf8');

    console.log('\n[provision] ✅ Pilot provisioned for company:', company);
    console.log('[provision] PILOT_TOKEN=' + token);
    console.log('[provision] Artifacts:', outDir);
    console.log('\nNext steps:');
    console.log('- Set DATABASE_URL to this company\'s dedicated DB (isolation)');
    console.log('- Start API: npm start or docker compose up --build');
    console.log('- Use token as Authorization: Bearer <token>');
  } catch (e) {
    console.error('[provision] Failed:', e.message);
    process.exit(1);
  }
})();