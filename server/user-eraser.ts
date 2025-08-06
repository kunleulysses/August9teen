import { pool } from './db';
import fs from 'fs/promises';
import path from 'path';

const ERASE_INTERVAL_MS = 60_000; // 1 minute

async function eraseUser(userId: number): Promise<void> {
  await pool.query('BEGIN');
  try {
    const tables = [
      'journal_entries',
      'emails',
      'sms_messages',
      'payment_methods',
      'billing_transactions',
      'conversation_memories'
    ];
    for (const table of tables) {
      await pool.query(`DELETE FROM ${table} WHERE user_id = $1`, [userId]);
    }
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    await pool.query('COMMIT');
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Failed to erase user', userId, err);
    return;
  }

  const dirs = [
    path.join(process.cwd(), 'uploads', String(userId)),
    path.join(process.cwd(), 'backups', `user-${userId}`)
  ];
  for (const dir of dirs) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

export function startUserEraseWorker(): void {
  // Periodically erase users marked as pending. The operation is idempotent;
  // running multiple times has no effect once a user is removed.
  setInterval(async () => {
    try {
      const result = await pool.query('SELECT id FROM users WHERE pending_erase = TRUE');
      for (const row of result.rows) {
        await eraseUser(row.id);
      }
    } catch (err) {
      console.error('User erase worker error', err);
    }
  }, ERASE_INTERVAL_MS);
}
