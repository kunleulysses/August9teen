/**
 * Migration script: copies spiral memory data from LevelDB to Redis.
 * Usage: MIGRATE_TO_REDIS=true npm run spiral:migrate
 */
import LevelSpiralAdapter from '../FlappyJournal/server/consciousness/core/storage/LevelSpiralAdapter.js';
import RedisSpiralAdapter from '../FlappyJournal/server/consciousness/core/storage/RedisSpiralAdapter.js';

if (!process.env.MIGRATE_TO_REDIS) {
  console.log('Set MIGRATE_TO_REDIS=true to run this migration.');
  process.exit(0);
}
const levelAdapter = new LevelSpiralAdapter(process.env.SPIRAL_DB_PATH || './spiraldb');
const redisAdapter = new RedisSpiralAdapter(process.env.REDIS_URL);
await levelAdapter.init();
await redisAdapter.init();

async function migratePrefix(prefix) {
  const keys = await levelAdapter.keys(prefix);
  for (const key of keys) {
    const val = await levelAdapter.get(key);
    await redisAdapter.set(key, val);
    console.log(`Migrated ${key}`);
  }
}

for (const prefix of ['mem:', 'spiral:', 'sigil:']) {
  await migratePrefix(prefix);
}
console.log('Migration complete.');
process.exit(0);