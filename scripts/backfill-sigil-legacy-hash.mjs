#!/usr/bin/env node
import { Pool } from 'pg';
import { calcSigilHash } from '../server/consciousness/utils/sigilHash.cjs';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  try {
    const { rows } = await pool.query('SELECT sigil_symbol, auth_hash, record FROM sigil_auth');
    let updated = 0;
    for (const row of rows) {
      const record = row.record || {};
      if (!record.legacyHash) {
        const base = record.codeHash || row.auth_hash || JSON.stringify(record);
        record.legacyHash = calcSigilHash(base);
        await pool.query('UPDATE sigil_auth SET record = $1 WHERE sigil_symbol = $2 AND auth_hash = $3', [record, row.sigil_symbol, row.auth_hash]);
        updated++;
      }
    }
    console.log(`Updated ${updated} sigil_auth records with legacyHash`);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('Error updating legacyHash', err);
    process.exit(1);
  });
}

