// Minimal Turn Director: listens for player actions and composes a narrative
// Uses EventBus and emits turn lifecycle events.

const eventBus = require('../core/ConsciousnessEventBus.cjs');
const { moderateAction } = require('../utils/moderation.cjs');
const { validateTurnAction } = require('../utils/actionValidation.cjs');
const { calcSigilHash } = require('../utils/sigilHash.cjs');
const { saveTurn, saveMoment } = require('./turnPersistence.cjs');

function now() { return Date.now(); }

function composeNarrative(action, context) {
  const ts = new Date().toLocaleTimeString();
  const loc = context && context.location ? context.location : 'the Sanctuary';
  const mood = context && context.mood ? context.mood : 'calm';
  return `At ${ts}, within ${loc}, in a ${mood} hush, you ${action}. A subtle shift answers back.`;
}

function pickChoices(action) {
  const base = action.toLowerCase();
  const options = [
    `Reflect on ${base}`,
    `Advance beyond ${base}`,
    `Invite your companion to guide you`,
  ];
  return options;
}

eventBus.on('player:action', async (msg) => {
  try {
    const { userId, sessionId, turnId, action } = msg || {};
    const id = turnId || String(now());
    const ts = now();
    try { validateTurnAction({ action, sessionId }); } catch (e) { return eventBus.emit('turn:error', { error: 'invalid_action', details: String(e && e.message || e) }); }
    const mod = moderateAction(action);
    if (!mod.ok) return eventBus.emit('turn:error', { error: 'moderation_block', reason: mod.reason });

    // Budgets: enforce per-user, per-session, global
    try {
      const { consumeTurnBudget } = require('./budget.cjs');
      const keyUser = userId || 'anon';
      const { ok, user, session, global } = await consumeTurnBudget(keyUser, sessionId, 1);
      if (!ok) {
        const msg = 'generation_budget_exceeded';
        // Still allow a pregenerated scene but tag deltas minimal
        eventBus.emit('turn:begin', { id, userId, sessionId, action, ts, budget: { user, session, global } });
        let narrative;
        try { const { fetchScene } = require('./preGen.cjs'); narrative = await fetchScene(); } catch {}
        narrative = narrative || composeNarrative('breathe', { location: 'the Sanctuary', mood: 'calm' });
        const choices = ['Reflect', 'Wait'];
        const deltas = { budget: 'exceeded' };
        const fingerprint = calcSigilHash(`${action}|${narrative}|${ts}`);
        const turn = { turnId: id, userId, sessionId, action, narrative, choices, deltas, ts, fingerprint };
        try { require('../utils/validation.cjs').validate('https://flappyjournal.dev/schema/game/turn.json', turn); } catch {}
        try { await saveTurn({ turnId: id, userId: Number.isFinite(userId) ? userId : null, userSub: String(userId||''), sessionId, action, narrative, choices, deltas, fingerprint }); } catch {}
        const moment = { turnId: id, sessionId, text: narrative, tags: ['turn','budget'], fingerprint, sigil: fingerprint, mintable: false };
        try { await saveMoment(moment); } catch {}
        eventBus.emit('turn:end', turn);
        return;
      }
    } catch {}

    // Begin
    eventBus.emit('turn:begin', { id, userId, sessionId, action, ts });

    // Compose
    eventBus.emit('narrative:compose', { id, userId, sessionId, action, ts });
    let narrative;
    try {
      const { fetchScene } = require('./preGen.cjs');
      const pre = await fetchScene();
      narrative = pre || composeNarrative(mod.cleaned, { location: 'the Sanctuary', mood: 'calm' });
    } catch {
      narrative = composeNarrative(mod.cleaned, { location: 'the Sanctuary', mood: 'calm' });
    }
    const choices = pickChoices(action).slice(0, 3);
    eventBus.emit('narrative:generated', { id, userId, sessionId, action, narrative, choices, ts });

    // Apply world deltas (stub)
    const deltas = { companion: { traitsDelta: ['curiosity+'] } };
    eventBus.emit('world:apply', { id, userId, sessionId, deltas, ts });

    // End
    const fingerprint = calcSigilHash(`${mod.cleaned}|${narrative}|${ts}`);
    const turn = { turnId: id, userId, sessionId, action: mod.cleaned, narrative, choices, deltas, ts, fingerprint };
    try { require('../utils/validation.cjs').validate('https://flappyjournal.dev/schema/game/turn.json', turn); } catch (e) { return eventBus.emit('turn:error', { error: 'invalid_turn', details: String(e && e.message || e) }); }
    try { await saveTurn({ turnId: id, userId: Number.isFinite(userId) ? userId : null, userSub: String(userId||''), sessionId, action: mod.cleaned, narrative, choices, deltas, fingerprint }); } catch {}
    const moment = { turnId: id, sessionId, text: narrative, tags: ['turn'], fingerprint, sigil: fingerprint, mintable: false };
    try { require('../utils/validation.cjs').validate('https://flappyjournal.dev/schema/game/moment.json', moment); } catch (e) { /* ignore and continue */ }
    try { await saveMoment(moment); } catch {}
    eventBus.emit('turn:end', turn);
  } catch (e) {
    try { eventBus.emit('turn:error', { error: e && e.message ? e.message : String(e) }); } catch {}
  }
});

module.exports = {};
