#!/usr/bin/env node
/**
 * convert-commonjs-to-cjs.js
 *
 * Scans the repo for old-style CommonJS .js files (using require/module.exports, not import/export),
 * renames them to .cjs, and updates all import/export statements that reference them.
 * Supports dry-run via --dry CLI flag.
 *
 * Usage:
 *   node scripts/convert-commonjs-to-cjs.js
 *   node scripts/convert-commonjs-to-cjs.js --dry
 */

const { globby } = require("globby");
const fs = require("fs");
const path = require("path");

const DRY_RUN = process.argv.includes('--dry');
const ignoreDirs = [
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/.augment/**',
  '**/.vscode/**',
  '**/__tests__/**',
  '**/.husky/**'
];

(async () => {
  // 1. Scan for .js files, ignoring common output/vendor dirs
  const jsFiles = await globby(['**/*.js'], { ignore: ignoreDirs });

  // 2. Find CommonJS files (require/module.exports, but not import/export)
  const commonJsFiles = [];
  for (const file of jsFiles) {
    const src = fs.readFileSync(file, 'utf8');
    if (
      (/\brequire\s*\(/.test(src) || /module\.exports\b/.test(src)) &&
      !(/\bimport\b/.test(src) || /\bexport\b/.test(src))
    ) {
      commonJsFiles.push(file);
    }
  }

  // 3. Rename to .cjs
  const renameMap = {};
  for (const oldPath of commonJsFiles) {
    const newPath = oldPath.replace(/\.js$/, '.cjs');
    renameMap[oldPath] = newPath;
    if (!DRY_RUN) {
      fs.renameSync(oldPath, newPath);
    }
  }

  // 4. Update imports in all .js, .ts, .ts*, .cjs files
  const allFiles = await globby([
    '**/*.{js,ts,tsx,jsx,cjs,mjs}',
    '!node_modules/**',
    '!dist/**',
    '!build/**',
    '!coverage/**',
    '!.git/**',
    '!.augment/**'
  ]);
  let importUpdates = 0;

  for (const file of allFiles) {
    let src = fs.readFileSync(file, 'utf8');
    let changed = false;

    Object.entries(renameMap).forEach(([jsPath, cjsPath]) => {
      const jsBase = path.basename(jsPath, '.js');
      // Replace 'require("./foo.js")' or 'from "./foo.js"' or './foo' → './foo.cjs'
      // 1. Imports with .js extension
      const regex1 = new RegExp(`(['"\`])((?:\\.\\.?\\/|\\w.*?/)${jsBase})\\.js(['"\`])`, 'g');
      src = src.replace(regex1, `$1$2.cjs$3`);

      // 2. Imports without extension that match the renamed file
      const regex2 = new RegExp(
        `(['"\`])((?:\\.\\.?\\/|\\w.*?/)${jsBase})(['"\`])`, 'g'
      );
      src = src.replace(regex2, (match, p1, p2, p3) => {
        // Only update if the resolved path matches the renamed .js file
        const dir = path.dirname(file);
        let resolved = path.resolve(dir, p2 + '.js');
        if (renameMap[resolved] || jsPath === path.relative(process.cwd(), resolved)) {
          importUpdates++;
          changed = true;
          return `${p1}${p2}.cjs${p3}`;
        }
        return match;
      });
    });

    if (changed && !DRY_RUN) {
      fs.writeFileSync(file, src, 'utf8');
    }
  }

  // 5. Summary
  console.log(DRY_RUN ? '[DRY RUN] ' : '', `Renamed ${commonJsFiles.length} files to .cjs`);
  console.log(DRY_RUN ? '[DRY RUN] ' : '', `Patched imports in ${importUpdates} locations`);
  if (DRY_RUN) {
    console.log('No files were actually changed. Run without --dry to modify files.');
  }
})().catch(err => {
  console.error('Error during CommonJS-to-CJS conversion:', err);
  process.exit(1);
});