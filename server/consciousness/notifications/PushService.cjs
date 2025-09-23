/**
 * PushService – Minimal Expo push integration via fetch.
 * Stores tokens in Postgres and listens for notify:push events on the EventBus.
 */

const { pool } = require('../../db');
const eventBus = require('../core/ConsciousnessEventBus.cjs');

async function registerToken(sessionId, token, platform) {
  if (!sessionId || !token) return false;
  try {
    await pool.query(
      `INSERT INTO push_tokens (session_id, token, platform, updated_at) VALUES ($1,$2,$3,NOW())
       ON CONFLICT (session_id) DO UPDATE SET token = EXCLUDED.token, platform = EXCLUDED.platform, updated_at = NOW()`,
      [sessionId, token, platform || null]
    );
    return true;
  } catch (e) {
    return false;
  }
}

async function getTokenBySession(sessionId) {
  try {
    const { rows } = await pool.query('SELECT token FROM push_tokens WHERE session_id = $1', [sessionId]);
    return rows[0]?.token || null;
  } catch { return null; }
}

async function sendExpoPush(token, title, body, data) {
  try {
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: token, title, body, data })
    });
    return res.ok;
  } catch { return false; }
}

// Listen for notify:push events: { kind, sessionId, title, body, data }
eventBus.on('notify:push', async (msg) => {
  if (!msg || !msg.sessionId) return;
  const token = await getTokenBySession(msg.sessionId);
  if (!token) return;
  const payload = { kind: msg.kind, ...(msg.data || {}) };
  await sendExpoPush(token, msg.title || 'Notification', msg.body || '', payload);
});

module.exports = { registerToken, getTokenBySession, sendExpoPush };

