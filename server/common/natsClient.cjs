/**
 * NATS client (singleton) for scene queue/worker.
 * Exports: { nats, sc, connectNats }
 */
const { connect, StringCodec } = require('nats');
let nats = null;
let sc = StringCodec();

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

async function connectNats() {
  if (nats) return { nats, sc };
  let tries = 0;
  while (!nats) {
    try {
      nats = await connect({ servers: NATS_URL });
      sc = StringCodec();
      console.log('✅ Connected to NATS:', NATS_URL);
      break;
    } catch (e) {
      tries++;
      const backoff = Math.min(1000 * tries, 5000);
      console.error('❌ NATS connect failed, retrying in', backoff, 'ms');
      await new Promise(r => setTimeout(r, backoff));
    }
  }
  nats.closed().then(() => {
    console.warn('NATS connection closed');
    nats = null;
  });
  return { nats, sc };
}

module.exports = { connectNats, get nats() { return nats; }, get sc() { return sc; } };