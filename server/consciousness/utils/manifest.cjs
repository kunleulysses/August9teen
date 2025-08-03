import fs from 'fs/promises';
import path from 'path';
const manifestPath = path.resolve('server/consciousness/generated/manifest.json');
async function readManifest() {
  try { const txt = await fs.readFile(manifestPath, 'utf8'); return JSON.parse(txt); }catch{ return []; }
}
export async function addEntry(entry) {
  const data = await readManifest();
  data.push({ ...entry, ts: Date.now() });
  await fs.writeFile(manifestPath, JSON.stringify(data, null, 2));
}
export async function rollback(file) {
  const data = await readManifest();
  const idx = data.map(e=>e.file).lastIndexOf(file);
  if (idx === -1) throw new Error('file not found in manifest');
  const entry = data[idx];
  const target = path.resolve('server/consciousness/generated/archive', path.basename(file));
  await fs.rename(path.resolve(file), target);
  data.push({ file, rollback: true, ts: Date.now() });
  await fs.writeFile(manifestPath, JSON.stringify(data, null, 2));
  return target;
}