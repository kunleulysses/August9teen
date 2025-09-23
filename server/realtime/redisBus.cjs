const Redis = require('ioredis');

const url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const pub = new Redis(url);
const sub = new Redis(url);

async function publish(channel, message) {
  const payload = typeof message === 'string' ? message : JSON.stringify(message);
  return pub.publish(channel, payload);
}

function psubscribe(pattern, handler) {
  sub.psubscribe(pattern, (err) => {
    if (err) console.error('[redisBus] psubscribe error:', err.message);
  });
  sub.on('pmessage', (p, channel, msg) => {
    if (p !== pattern) return;
    let body = msg;
    try { body = JSON.parse(msg); } catch { /* keep as string */ }
    try { handler(channel, body); } catch (e) { console.error('[redisBus] handler error:', e); }
  });
}

module.exports = { pub, sub, publish, psubscribe };

