#!/usr/bin/env node
// Throttled CommonJS (.js) → .cjs converter.
//
// Usage:
//   node tools/fix-modules.mjs [--dry]
//
// When executed through the npm script defined in package.json this script will
// rename every .js file (excluding those in node_modules) to .cjs and patch
// occurrences of "filename.js" in require/import paths inside project files.
//
// To avoid running into the OS open-file descriptor limit the actual I/O work
// is performed with a small, configurable concurrency (20 by default).

import fg from 'fast-glob';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import pLimit from 'p-limit';

// -------------------- configuration -------------------- //
const CONCURRENCY = 20; // max files handled in parallel
const EXTENSION = '.js';
const TARGET_EXTENSION = '.cjs';
const IGNORE_GLOBS = ['**/node_modules/**'];

// --------------------- CLI parsing --------------------- //
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry') || args.has('-d');

// ---------------------- helpers ------------------------ //
const limit = pLimit(CONCURRENCY);

function toCjsFilename(file) {
  return file.endsWith(EXTENSION) ? file.slice(0, -EXTENSION.length) + TARGET_EXTENSION : file;
}

// Replace "something.js" → "something.cjs" inside JS/CJS/TS files.
function patchImportPaths(code) {
  return code.replace(/(["'`])([^"'`]+?)\.js\1/g, (_, quote, body) => `${quote}${body}${TARGET_EXTENSION}${quote}`);
}

async function processFile(file) {
  const newName = toCjsFilename(file);

  // Guard against repeatedly processing already converted files.
  if (file === newName) return { renamed: false, patched: false };

  const originalCode = await fs.readFile(file, 'utf8');
  const patchedCode = patchImportPaths(originalCode);

  const codeChanged = patchedCode !== originalCode;

  if (!dryRun) {
    if (codeChanged) {
      await fs.writeFile(file, patchedCode);
    }
    await fs.rename(file, newName);
  }

  return { renamed: true, patched: codeChanged };
}

async function main() {
  const patterns = [`**/*${EXTENSION}`];
  const files = await fg(patterns, { dot: false, ignore: IGNORE_GLOBS });

  let renamedCount = 0;
  let patchedCount = 0;

  await Promise.all(
    files.map((f) =>
      limit(async () => {
        const { renamed, patched } = await processFile(f);
        if (renamed) renamedCount += 1;
        if (patched) patchedCount += 1;
      }),
    ),
  );

  const prefix = dryRun ? '[dry-run] ' : '';
  console.log(`${prefix}${renamedCount} file(s) renamed (.js → .cjs)`);
  console.log(`${patchedCount} file(s) had import/require specifiers patched`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

