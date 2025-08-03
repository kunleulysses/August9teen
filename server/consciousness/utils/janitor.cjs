import fs from 'fs/promises';
import path from 'path';
import { addEntry } from './manifest.cjs';

const GENERATED_DIR = path.resolve('server/consciousness/generated');
const ARCHIVE_DIR   = path.join(GENERATED_DIR, 'archive');

export async function purgeOldTemp(hours = 6) {
  const cutoff = Date.now() - hours * 3600_000;
  const files = await fs.readdir(GENERATED_DIR);
  for (const f of files) {
    if (!f.endsWith('.js')) continue;
    const fp = path.join(GENERATED_DIR, f);
    const stat = await fs.stat(fp);
    if (stat.mtimeMs < cutoff) {
      await fs.mkdir(ARCHIVE_DIR, { recursive: true });
      await fs.rename(fp, path.join(ARCHIVE_DIR, f));
      await addEntry({ file: fp, rolled: true, ts: Date.now() });
    }
  }
}

export async function pruneManifest() {
  const manifestPath = path.resolve('server/consciousness/generated/manifest.json');
  let manifest = [];
  try { manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8')); }catch{}
  const kept = [];
  for (const entry of manifest) {
    try { await fs.access(entry.file); kept.push(entry); }catch{ /* file gone */ }
  }
  if (kept.length !== manifest.length) {
    await fs.writeFile(manifestPath, JSON.stringify(kept, null, 2));
  }
}

export async function runJanitor() {
  await purgeOldTemp();
  await pruneManifest();
}