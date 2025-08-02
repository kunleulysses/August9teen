import fs from 'fs';
import path from 'path';

const cache: Record<string, string | undefined> = {};
export function loadSecret(name: string): string | undefined {
  if (cache[name] !== undefined) return cache[name];
  const direct = process.env[name];
  if (direct && direct.trim() !== '' && !direct.startsWith('/run/secrets/')) {
    cache[name] = direct;
    return direct;
  }
  // support *_FILE variant or value that looks like a path
  const fileEnv = process.env[`${name}_FILE`] || direct;
  if (fileEnv && fs.existsSync(fileEnv)) {
    const value = fs.readFileSync(fileEnv, 'utf8').trim();
    // populate env for consumers expecting variable
    process.env[name] = value;
    cache[name] = value;
    return value;
  }
  cache[name] = direct;
  return direct;
}