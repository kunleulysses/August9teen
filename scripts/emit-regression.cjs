#!/usr/bin/env node
// Emit a regression signal by writing a JSON trigger file the module watches.
// Usage: node scripts/emit-regression.cjs --target <path> [--reason "text"]
const fs = require('fs/promises');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--target') args.target = argv[++i];
    else if (a === '--reason') args.reason = argv[++i];
  }
  return args;
}

(async () => {
  const { target, reason } = parseArgs(process.argv);
  if (!target) {
    console.error('Missing --target <path>');
    process.exit(2);
  }
  const root = path.resolve(process.cwd(), 'artifacts', 'autonomy-regressions');
  await fs.mkdir(root, { recursive: true });
  const stamp = Date.now();
  const file = path.join(root, `regress-${stamp}.json`);
  const payload = { target, reason: reason || 'regression', timestamp: stamp };
  await fs.writeFile(file, JSON.stringify(payload, null, 2), 'utf8');
  console.log('wrote', file);
})().catch((e) => { console.error(e); process.exit(1); });

