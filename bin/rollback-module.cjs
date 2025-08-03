#!/usr/bin/env node
import { rollback } from '../server/consciousness/utils/manifest.cjs';
const file = process.argv[2];
if (!file) { console.error('Usage: rollback-module <filePath>'); process.exit(1);}
rollback(file)
  .then(t => console.log('Rolled back, moved to', t))
  .catch(err => { console.error(err.message); process.exit(1); });