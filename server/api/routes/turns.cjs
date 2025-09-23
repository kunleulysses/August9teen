const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const eventBus = require('../../consciousness/ConsciousnessEventBus.cjs');
const { validateTurnAction } = require('../../consciousness/utils/actionValidation.cjs');
const { moderateAction } = require('../../consciousness/utils/moderation.cjs');
let db, schema;
try { ({ db } = require('../../db')); schema = require('@shared/schema'); } catch (_) {}
let eq;
try { ({ eq } = require('drizzle-orm')); } catch (_) {}

// In-memory storage for quick MVP
const HISTORY = new Map(); // sessionId -> [turn]

function getSessionId(req) {
  const q = (req.query && req.query.sessionId) || (req.body && req.body.sessionId);
  if (q && typeof q === 'string' && q.length < 128) return q;
  return undefined;
}

function pushTurn(sessionId, turn) {
  if (!HISTORY.has(sessionId)) HISTORY.set(sessionId, []);
  const arr = HISTORY.get(sessionId);
  arr.unshift(turn);
  if (arr.length > 200) arr.length = 200;
}

// Wire event to collect completed turns
eventBus.on('turn:end', (e) => {
  if (!e || !e.sessionId) return;
  try { pushTurn(String(e.sessionId), e); } catch {}
});

router.post('/act', async (req, res) => {
  const action = (req.body && req.body.action) || '';
  if (!action || typeof action !== 'string') return res.status(400).json({ error: 'action required' });
  const sessionId = getSessionId(req) || crypto.randomUUID();
  const userId = (req.user && (req.user.sub || req.user.user || req.user.id)) || 'mobile';
  const turnId = crypto.randomUUID();

  try { validateTurnAction({ action, sessionId }); } catch (e) { return res.status(400).json({ error: 'invalid_action' }); }
  const mod = moderateAction(action);
  if (!mod.ok) return res.status(400).json({ error: 'moderation_block', reason: mod.reason });

  // Emit into the game loop
  eventBus.emit('player:action', { userId, sessionId, turnId, action: mod.cleaned, ts: Date.now() });
  res.json({ ok: true, turnId, sessionId });
});

router.get('/state', (req, res) => {
  const sessionId = getSessionId(req);
  const userId = (req.user && (req.user.sub || req.user.user || req.user.id)) || 'mobile';
  const state = {
    userId,
    sessionId,
    companion: {
      level: 1,
      traits: ['curious', 'attentive'],
      mood: 'calm',
      moves: ['reflect', 'guide'],
      milestones: [],
      lastUpdate: new Date().toISOString(),
    },
    lastTurn: sessionId && HISTORY.get(sessionId) ? HISTORY.get(sessionId)[0] : null
  };
  res.json(state);
});

router.get('/history', async (req, res) => {
  const sessionId = getSessionId(req);
  const cursor = Number(req.query && req.query.cursor || 0);
  try {
    if (db && schema && sessionId && eq) {
      const rows = await db.select().from(schema.turns).where(eq(schema.turns.sessionId, sessionId));
      const list = rows.sort((a,b) => (b.createdAt?.getTime?.()||0) - (a.createdAt?.getTime?.()||0));
      const items = Number.isFinite(cursor) && cursor > 0 ? list.filter((i) => (i.createdAt?.getTime?.()||0) < cursor) : list;
      const out = items.slice(0, 50);
      return res.json({ items: out, nextCursor: out.length ? (out[out.length - 1].createdAt?.getTime?.()||0) : 0 });
    }
  } catch {}
  const list = (sessionId && HISTORY.get(sessionId)) || [];
  const items = Number.isFinite(cursor) && cursor > 0 ? list.filter((i) => i.ts < cursor) : list;
  const out = items.slice(0, 50);
  res.json({ items: out, nextCursor: out.length ? out[out.length - 1].ts : 0 });
});

module.exports = router;
