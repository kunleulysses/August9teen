#!/usr/bin/env node
import fs from 'fs';
import { getStore } from '../server/common/storeFactory.js';

// Tiny CLI arg parser
function parseArgs() {
  const args = process.argv.slice(2);
  const out = { _: [] };
  for (let i = 0; i < args.length; ++i) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[++i] : true;
      out[key] = val;
    } else {
      out._.push(args[i]);
    }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const mode = args._[0];
  const backendArg = args.backend || process.env.STORE_BACKEND || 'memory';
  let store;
  if (backendArg === 'postgres') {
    process.env.STORE_BACKEND = 'postgres';
    store = getStore();
  } else {
    process.env.STORE_BACKEND = 'memory';
    store = getStore();
  }

  if (mode === 'export') {
    const all = await store.all();
    const output = args.output || 'dump.json';
    fs.writeFileSync(output, JSON.stringify(all, null, 2));
    console.log(`Exported ${all.length} objects to ${output}`);
  } else if (mode === 'import') {
    const input = args.input;
    if (!input) throw new Error('--input required for import');
    const arr = JSON.parse(fs.readFileSync(input, 'utf8'));
    let n = 0;
    for (const obj of arr) {
      if (obj && obj.id) {
        await store.set(obj.id, obj);
        n++;
      }
    }
    console.log(`Imported ${n} objects from ${input}`);
  } else {
    console.log('Usage: node scripts/store-migrator.js export --backend memory --output dump.json');
    console.log('       node scripts/store-migrator.js import --backend postgres --input dump.json');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}