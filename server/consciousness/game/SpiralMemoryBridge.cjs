const eventBus = require('../core/ConsciousnessEventBus.cjs');
const { spiralMemory } = require('../bootstrapUniversalConsciousness.cjs');

function buildAssociations(payload) {
  const associations = new Set();
  if (payload.companionId) associations.add(`companion:${payload.companionId}`);
  if (payload.playerId) associations.add(`player:${payload.playerId}`);
  if (payload.sessionId) associations.add(`session:${payload.sessionId}`);
  if (payload.area) associations.add(`area:${payload.area}`);
  if (Array.isArray(payload.associations)) {
    payload.associations.forEach((tag) => {
      if (typeof tag === 'string' && tag.trim()) associations.add(tag.trim());
    });
  }
  return Array.from(associations);
}

async function storeMemoryFromEvent(payload = {}) {
  if (!spiralMemory || typeof spiralMemory.storeMemory !== 'function') {
    return;
  }
  const type = typeof payload.type === 'string' && payload.type ? payload.type : 'companion_memory';
  const depth = typeof payload.depth === 'string' && payload.depth ? payload.depth : 'experiential';
  const timestamp = payload.timestamp || Date.now();
  const content = {
    ...payload.memory,
    companionId: payload.companionId || null,
    playerId: payload.playerId || null,
    sessionId: payload.sessionId || null,
    area: payload.area || null,
    origin: payload.origin || 'game',
    mood: payload.mood || null,
    energy: payload.energy || null,
    timestamp,
  };

  const associations = buildAssociations(payload);
  try {
    await spiralMemory.storeMemory(content, type, depth, associations, payload.playerId || null, payload.sessionId || null);
  } catch (err) {
    console.error('Failed to store spiral memory from game event:', err);
  }
}

if (!global.__GAME_SPIRAL_BRIDGE__) {
  eventBus.on('spiral_memory:store', (payload) => {
    storeMemoryFromEvent(payload).catch((err) => {
      console.error('spiral_memory:store bridge error:', err);
    });
  });
  global.__GAME_SPIRAL_BRIDGE__ = true;
}

module.exports = { storeMemoryFromEvent };
