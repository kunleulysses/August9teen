const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const hashFragment = (input, length = 8) => crypto.createHash('sha1').update(String(input)).digest('hex').slice(0, length);

// In-memory ring buffer for recent moments
const MAX = 200;
const FEED = [];
const FPF = new Set(); // recent fingerprints
function pushMoment(text, tags = []) {
  const ts = Date.now();
  const fingerprint = hashFragment(`${text}:${tags.join('|')}:${FEED.length}:${ts}`, 10);
  const item = { id: `${ts}:${fingerprint}`, ts, text, tags };
  FEED.unshift(item);
  if (FEED.length > MAX) FEED.length = MAX;
}

try {
  const eventBus = require('../../consciousness/ConsciousnessEventBus.cjs');
  eventBus.on('zone:event', (e) => {
    try { pushMoment(`[zone] ${e.channel || 'event'}: ${typeof e.data === 'string' ? e.data : JSON.stringify(e.data)}`); } catch {}
  });
  eventBus.on('consciousness:update', (e) => {
    try { pushMoment(`[consciousness] update: ${JSON.stringify(e && e.metrics ? e.metrics : e)}`); } catch {}
  });
  eventBus.on('holistic_response_generated', (e) => {
    try { pushMoment(`[holistic] ${e && e.text ? e.text : 'response generated'}`); } catch {}
  });
  eventBus.on('turn:end', (e) => {
    try {
      const fp = e && e.fingerprint;
      if (fp) {
        if (FPF.has(fp)) return; // dedupe recent
        FPF.add(fp);
        if (FPF.size > MAX * 2) { // trim set
          const it = FPF.values(); it.next(); FPF.delete(it.value);
        }
      }
      const text = e && e.narrative ? e.narrative : '[turn] completed';
      pushMoment(String(text), ['turn']);
    } catch {}
  });
} catch (_) {
  // Event bus optional
}

// GET /sanctuary/feed?cursor=<ts>
router.get('/feed', (req, res) => {
  const cursor = Number(req.query.cursor || 0);
  const items = Number.isFinite(cursor) && cursor > 0 ? FEED.filter((i) => i.ts < cursor) : FEED;
  // Provide a friendly placeholder when empty
  const out = items.length
    ? items.slice(0, 100)
    : [
        { id: 'welcome', ts: Date.now(), text: 'Welcome to the Sanctuary. Your companion awaits.', tags: ['system'] },
      ];
  res.json({ items: out, nextCursor: out.length ? out[out.length - 1].ts : 0 });
});

// GET /sanctuary/companion/state
router.get('/companion/state', (_req, res) => {
  const state = {
    level: 1,
    traits: ['curious', 'attentive'],
    mood: 'calm',
    moves: ['reflect', 'guide'],
    milestones: [],
    lastUpdate: new Date().toISOString(),
  };
  res.json(state);
});

module.exports = router;
