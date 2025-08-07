#!/usr/bin/env node
// Create a branch + PR/MR from the latest (or given) selfcoding PR artifact
const fs = require('fs');
const path = require('path');
const { createPRFromArtifact } = require('../server/consciousness/utils/prCreator.cjs');

function findLatestArtifact(root) {
  if (!fs.existsSync(root)) return null;
  const entries = fs.readdirSync(root).filter((d) => /\d+/.test(d)).sort((a,b) => Number(b)-Number(a));
  if (!entries.length) return null;
  return path.join(root, entries[0]);
}

(async () => {
  const explicit = process.argv[2];
  const artifactsRoot = path.resolve(process.cwd(), 'artifacts', 'selfcoding-pr');
  const dir = explicit ? path.resolve(process.cwd(), explicit) : findLatestArtifact(artifactsRoot);
  if (!dir) {
    console.error('No artifact directory found');
    process.exit(2);
  }
  const res = await createPRFromArtifact(dir, {});
  console.log(JSON.stringify(res, null, 2));
})().catch((e) => { console.error(e); process.exit(1); });

