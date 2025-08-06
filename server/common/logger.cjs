// Logger setup using pino and config (CommonJS)
const pino = require('pino');
const config = require('./config.cjs');
const { Pool } = require('pg');

const logger = pino({
  level: config.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: true }
      }
    : undefined,
});

let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

async function writeAuditLog({ actor, action, details }) {
  if (!pool) return;
  try {
    await pool.query(
      'INSERT INTO postgres.audit_log (actor, action, details) VALUES ($1, $2, $3)',
      [actor || null, action, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    logger.error({ err }, 'failed to write audit log');
  }
}

logger.audit = async function (action, { actor, details } = {}) {
  logger.info({ actor, details }, action);
  await writeAuditLog({ actor, action, details });
};

async function writeRealityAccessLog({ sceneId, userId, action }) {
  if (!pool) return;
  try {
    await pool.query(
      'INSERT INTO postgres.reality_access_log (scene_id, user_id, action) VALUES ($1, $2, $3)',
      [sceneId, userId || null, action]
    );
  } catch (err) {
    logger.error({ err }, 'failed to write reality access log');
  }
}

logger.realityAccess = async function (sceneId, action, { userId } = {}) {
  logger.info({ sceneId, userId }, `reality_access:${action}`);
  await writeRealityAccessLog({ sceneId, userId, action });
};

module.exports = logger;
