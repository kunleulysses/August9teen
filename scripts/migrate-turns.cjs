#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function main() {
  const dir = path.resolve(process.cwd(), 'drizzle', 'turns');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const f of files) {
      const full = path.join(dir, f);
      const sql = fs.readFileSync(full, 'utf8');
      process.stdout.write(`Applying ${f}... `);
      await pool.query(sql);
      console.log('ok');
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

