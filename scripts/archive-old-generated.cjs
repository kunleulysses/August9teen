#!/usr/bin/env node

/**
 * Archive old auto-generated timestamped consciousness modules.
 *
 * Usage:
 *   node scripts/archive-old-generated.js [--dry-run] [--verbose]
 */

const fs = require('fs');
const path = require('path');

const GENERATED_DIR = path.join(__dirname, '..', 'server', 'consciousness', 'generated');
const ARCHIVE_DIR = path.join(GENERATED_DIR, 'archive');

// Regex for debris files (must have 13-digit timestamp at end, .js extension)
const DEBRIS_REGEX = /^(consciousness-(enhancement|feature)|performance-optimization|phi-calculation-optimization)-\d{13}\.js$/;

// These files must never be archived:
const LEGIT_FILES = new Set(['string-utils.cjs', 'test-module.cjs']);

function parseArgs() {
    const argv = process.argv.slice(2);
    return {
        dryRun: argv.includes('--dry-run'),
        verbose: argv.includes('--verbose'),
    };
}

function ensureArchiveDir() {
    if (!fs.existsSync(ARCHIVE_DIR)) {
        fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
        // Ensure .gitkeep exists if directory is empty
        const files = fs.readdirSync(ARCHIVE_DIR);
        if (!files.includes('.gitkeep')) {
            fs.writeFileSync(path.join(ARCHIVE_DIR, '.gitkeep'), '# keep this directory in git even if empty\n');
        }
    }
}

function main() {
    const { dryRun, verbose } = parseArgs();
    ensureArchiveDir();

    const allFiles = fs.readdirSync(GENERATED_DIR).filter(
        f => fs.statSync(path.join(GENERATED_DIR, f)).isFile()
    );

    let moved = 0;
    let untouched = 0;

    for (const file of allFiles) {
        if (LEGIT_FILES.has(file)) {
            if (verbose) console.log(`[skip] Legitimate: ${file}`);
            untouched++;
            continue;
        }
        if (DEBRIS_REGEX.test(file)) {
            const src = path.join(GENERATED_DIR, file);
            const dst = path.join(ARCHIVE_DIR, file);
            if (dryRun) {
                console.log(`[dry-run] Would move: ${file} -> archive/`);
            } else {
                fs.renameSync(src, dst);
                if (verbose) console.log(`[moved] ${file} -> archive/`);
            }
            moved++;
        } else {
            if (verbose) console.log(`[skip] Unmatched: ${file}`);
            untouched++;
        }
    }

    console.log(`\nArchive summary:`);
    console.log(`  Files moved to archive/: ${moved}`);
    console.log(`  Files left untouched:  ${untouched}`);
    if (dryRun) {
        console.log('Dry run: no files actually moved.');
    }
}

if (require.main === module) {
    main();
}