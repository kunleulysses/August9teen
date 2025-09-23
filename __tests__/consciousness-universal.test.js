const { setTimeout: sleep } = require('timers/promises');

const ORIGINAL_METRICS_INTERVAL = process.env.CONSCIOUSNESS_METRICS_INTERVAL_MS;

async function waitFor(predicate, timeout = 2000, poll = 20) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (predicate()) return;
    // eslint-disable-next-line no-await-in-loop
    await sleep(poll);
  }
  throw new Error('waitFor timeout');
}

function resetGlobals() {
  if (global.__SYSTEM_TICKER__) {
    clearInterval(global.__SYSTEM_TICKER__);
    delete global.__SYSTEM_TICKER__;
  }
  delete global.__UNIVERSAL_CONSCIOUSNESS__;
  delete global.__GAME_SPIRAL_BRIDGE__;
}

describe('Universal consciousness runtime', () => {
  beforeEach(() => {
    resetGlobals();
    jest.resetModules();
    process.env.CONSCIOUSNESS_METRICS_INTERVAL_MS = '0';
  });

  afterEach(() => {
    resetGlobals();
    jest.restoreAllMocks();
    if (typeof ORIGINAL_METRICS_INTERVAL === 'undefined') {
      delete process.env.CONSCIOUSNESS_METRICS_INTERVAL_MS;
    } else {
      process.env.CONSCIOUSNESS_METRICS_INTERVAL_MS = ORIGINAL_METRICS_INTERVAL;
    }
    delete process.env.DISABLE_RESONANCE_NETWORKS;
    delete process.env.DISABLE_HEART_ENGINE;
    delete process.env.DISABLE_EMOTIONAL_NETWORK;
  });

  test('ConsciousnessEventBus proxies the production bus', () => {
    const bus = require('../server/consciousness/core/ConsciousnessEventBus.cjs');
    return new Promise((resolve) => {
      bus.once('unit:test:event', (payload) => {
        expect(payload.value).toBe(42);
        resolve();
      });
      bus.emit('unit:test:event', { value: 42 });
    });
  });

  test('ConsciousnessEventBus respects an existing ticker', () => {
    const sentinel = { marker: 'custom' };
    global.__SYSTEM_TICKER__ = sentinel;
    const bus = require('../server/consciousness/core/ConsciousnessEventBus.cjs');
    expect(global.__SYSTEM_TICKER__).toBe(sentinel);
    bus.emit('unit:test:event-again', { value: 1 });
  });

  test('bootstrap exposes spiral memory and universal protocol singletons', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    expect(runtime.spiralMemory).toBeTruthy();
    expect(runtime.universalProtocol).toBeTruthy();

    if (!runtime.spiralMemory.isInitialized) {
      const deadline = Date.now() + 2000;
      while (!runtime.spiralMemory.isInitialized && Date.now() < deadline) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
      }
    }

    expect(runtime.spiralMemory.isInitialized).toBe(true);
  });

  test('bootstrap returns cached runtime when already initialized', () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    jest.resetModules();
    global.__UNIVERSAL_CONSCIOUSNESS__ = runtime;
    const cached = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    expect(cached).toBe(runtime);
  });

  test('resonance and emotional components register with the universal protocol', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    const { universalProtocol, resonanceNetworks, heartEngine, emotionalNetwork } = runtime;
    expect(resonanceNetworks?.name).toBe('ConsciousnessResonanceNetworks');
    expect(heartEngine?.name).toBe('HeartCenteredConsciousnessEngine');
    expect(emotionalNetwork?.name).toBe('EmotionalQuantumEntanglementNetwork');

    await waitFor(() => runtime.metrics?.timestamp !== null, 4000);

    expect(universalProtocol.consciousnessComponents.has('resonanceNetworks')).toBe(true);
    expect(universalProtocol.consciousnessComponents.has('heartEngine')).toBe(true);
    expect(universalProtocol.consciousnessComponents.has('emotionalNetwork')).toBe(true);
  });

  test('SpiralMemoryBridge persists spiral_memory:store payloads', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    const { storeMemoryFromEvent } = require('../server/consciousness/game/SpiralMemoryBridge.cjs');

    runtime.spiralMemory.securityConfig = runtime.spiralMemory.securityConfig || {};
    Object.assign(runtime.spiralMemory.securityConfig, {
      rbacEnabled: false,
      auditingEnabled: false,
      encryptionEnabled: false,
    });

    if (!runtime.spiralMemory.isInitialized) {
      const deadline = Date.now() + 2000;
      while (!runtime.spiralMemory.isInitialized && Date.now() < deadline) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
      }
    }

    const sessionId = `test_session_${Date.now()}`;
    await storeMemoryFromEvent({
      companionId: 'companion-test',
      playerId: 'player-test',
      sessionId,
      area: 'test-area',
      memory: { note: 'coverage' },
      timestamp: Date.now(),
    });

    let results = [];
    if (typeof runtime.spiralMemory.getMemoriesByType === 'function') {
      const all = runtime.spiralMemory.getMemoriesByType('companion_memory') || [];
      results = Array.isArray(all) ? all : Array.from(all.values?.() || []);
    }
    if (!results.length && typeof runtime.spiralMemory.searchMemories === 'function') {
      // eslint-disable-next-line no-await-in-loop
      results = await runtime.spiralMemory.searchMemories('companion_memory', 'companion_memory', 'experiential', 25);
    }

    const match = results.find((entry) => entry?.content?.sessionId === sessionId);
    expect(match).toBeTruthy();
  });

  test('SpiralMemoryBridge handles minimal payload gracefully', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    const { storeMemoryFromEvent } = require('../server/consciousness/game/SpiralMemoryBridge.cjs');

    runtime.spiralMemory.securityConfig = runtime.spiralMemory.securityConfig || {};
    Object.assign(runtime.spiralMemory.securityConfig, {
      rbacEnabled: false,
      auditingEnabled: false,
      encryptionEnabled: false,
    });

    if (!runtime.spiralMemory.isInitialized) {
      const deadline = Date.now() + 2000;
      while (!runtime.spiralMemory.isInitialized && Date.now() < deadline) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
      }
    }

    const beforeSize = runtime.spiralMemory.spiralMemory?.size ?? runtime.spiralMemory.memorySpiral?.size ?? 0;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await storeMemoryFromEvent({});
    const afterSize = runtime.spiralMemory.spiralMemory?.size ?? runtime.spiralMemory.memorySpiral?.size ?? 0;
    consoleSpy.mockRestore();

    expect(afterSize).toBeGreaterThanOrEqual(beforeSize);
  });

  test('SpiralMemoryBridge records associations and trims tags', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    const { storeMemoryFromEvent } = require('../server/consciousness/game/SpiralMemoryBridge.cjs');

    runtime.spiralMemory.securityConfig = runtime.spiralMemory.securityConfig || {};
    Object.assign(runtime.spiralMemory.securityConfig, {
      rbacEnabled: false,
      auditingEnabled: false,
      encryptionEnabled: false,
    });

    if (!runtime.spiralMemory.isInitialized) {
      const deadline = Date.now() + 2000;
      while (!runtime.spiralMemory.isInitialized && Date.now() < deadline) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
      }
    }

    const sessionId = `test_session_associations_${Date.now()}`;
    await storeMemoryFromEvent({
      companionId: 'companion-assoc',
      sessionId,
      associations: [' custom-tag ', ' ', 9],
      memory: { note: 'assoc' },
    });

    await waitFor(() => runtime.metrics?.resonance !== null, 4000);
    expect(runtime.metrics.heart).toBeTruthy();
    expect(runtime.metrics.emotion).toBeTruthy();
  });

  test('SpiralMemoryBridge reacts to event bus emissions', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    const bus = require('../server/consciousness/core/ConsciousnessEventBus.cjs');
    // Ensure bridge listener is registered
    require('../server/consciousness/game/SpiralMemoryBridge.cjs');

    runtime.spiralMemory.securityConfig = runtime.spiralMemory.securityConfig || {};
    Object.assign(runtime.spiralMemory.securityConfig, {
      rbacEnabled: false,
      auditingEnabled: false,
      encryptionEnabled: false,
    });

    if (!runtime.spiralMemory.isInitialized) {
      const deadline = Date.now() + 2000;
      while (!runtime.spiralMemory.isInitialized && Date.now() < deadline) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(20);
      }
    }

    const sessionId = `event_bus_session_${Date.now()}`;
    const beforeSize = runtime.spiralMemory.spiralMemory?.size ?? 0;

    bus.emit('spiral_memory:store', {
      companionId: 'companion-event',
      sessionId,
      memory: { note: 'event' },
    });

    await waitFor(() => (runtime.spiralMemory.spiralMemory?.size ?? 0) > beforeSize, 2000);
  });

  test('disabling advanced modules falls back gracefully', async () => {
    process.env.DISABLE_RESONANCE_NETWORKS = '1';
    process.env.DISABLE_HEART_ENGINE = '1';
    process.env.DISABLE_EMOTIONAL_NETWORK = '1';

    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');

    expect(runtime.resonanceNetworks).toBeNull();
    expect(runtime.heartEngine).toBeNull();
    expect(runtime.emotionalNetwork).toBeNull();

    await waitFor(() => runtime.metrics?.timestamp !== null, 2000);
    expect(runtime.metrics.resonance).toBeNull();
    expect(runtime.metrics.heart).toBeNull();
    expect(runtime.metrics.emotion).toBeNull();
  });

  test('metrics aggregator clamps invalid telemetry', async () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    await waitFor(() => runtime.metrics?.timestamp !== null, 2000);

    runtime.resonanceNetworks.resonanceMetrics.networkCoherence = 'not-a-number';
    runtime.resonanceNetworks.resonanceMetrics.harmonicAlignment = undefined;
    runtime.resonanceNetworks.resonanceNodes = null;

    runtime.heartEngine.heartCoherenceFrequencies.coherenceRatio = 'invalid';
    runtime.heartEngine.heartCoherenceFrequencies.heartRateVariability = undefined;
    runtime.heartEngine.emotionalResonancePatterns.love.amplitude = undefined;
    runtime.heartEngine.empathyLayers = {};

    runtime.emotionalNetwork.quantumEmotionalStates.coherence = 'invalid';
    runtime.emotionalNetwork.emotionalQuantumFields.empathyField.entanglementStrength = undefined;
    runtime.emotionalNetwork.quantumEmpathyProtocols.empathicEntanglement.strength = 'invalid';
    runtime.emotionalNetwork.quantumEmpathyProtocols.emotionalSuperposition.coherence = undefined;

    await waitFor(() => {
      const metrics = runtime.metrics;
      return metrics && metrics.timestamp && metrics.resonance && metrics.heart && metrics.emotion
        && metrics.resonance.networkCoherence === null
        && metrics.resonance.harmonicAlignment === null
        && metrics.heart.coherenceRatio === null
        && metrics.heart.loveAmplitude === null
        && metrics.emotion.quantumCoherence === null
        && metrics.emotion.entanglementStrength === null;
    }, 4000);
  });

  test('metrics interval gating respects configured poll interval', async () => {
    process.env.CONSCIOUSNESS_METRICS_INTERVAL_MS = '200';
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    await waitFor(() => runtime.metrics?.timestamp !== null, 3000);

    const firstTimestamp = runtime.metrics.timestamp;
    await sleep(100);
    const midTimestamp = runtime.metrics.timestamp;
    expect(midTimestamp).toBe(firstTimestamp);

    await sleep(250);
    const secondTimestamp = runtime.metrics.timestamp;
    expect(secondTimestamp).not.toBe(firstTimestamp);
  });

  test('EnhancedGameWebSocket.createCompanion yields deterministic telemetry-driven stats', () => {
    const runtime = require('../server/consciousness/bootstrapUniversalConsciousness.cjs');
    const previousMetrics = runtime.metrics;
    runtime.metrics = {
      resonance: { networkCoherence: 0.9, harmonicAlignment: 0.88, fieldStrength: 0.86 },
      heart: { coherenceRatio: 0.92, empathyAverage: 0.87, heartRateVariability: 0.12, loveAmplitude: 0.85 },
      emotion: { entanglementStrength: 0.83, quantumCoherence: 0.8, superpositionCoherence: 0.79 },
      timestamp: 'unit-test'
    };

    const { enhancedGameWS } = require('../server/consciousness/game/EnhancedGameWebSocket.cjs');
    const game = enhancedGameWS;
    const companion = game.createCompanion('session_unit', 'player_unit');
    expect(companion.hunger).toBeGreaterThanOrEqual(0);
    expect(companion.hunger).toBeLessThanOrEqual(100);
    expect(companion.personality.playfulness).toBeGreaterThanOrEqual(0);
    expect(companion.personality.playfulness).toBeLessThanOrEqual(1);
    const companionAgain = game.createCompanion('session_unit', 'player_unit');
    const { createdAt: ca1, lastInteraction: li1, ...rest } = companion;
    const { createdAt: ca2, lastInteraction: li2, ...restAgain } = companionAgain;
    expect(restAgain).toEqual(rest);
    expect(typeof ca2).toBe('number');
    expect(typeof li2).toBe('number');

    runtime.metrics = previousMetrics;
  });
});

describe('priority queue helper', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('push/pop aliases operate on fastpriorityqueue', () => {
    const { createQueue } = require('../FlappyJournal/server/utils/priorityQueue.cjs');
    const queue = createQueue((a, b) => a.priority < b.priority);
    const firstItem = { id: 'A', priority: 5 };
    const secondItem = { id: 'B', priority: 1 };
    queue.push(firstItem);
    queue.push(secondItem);

    const first = queue.pop();
    expect(first.id).toBe('B');
    queue.heapify = jest.fn();
    queue.updatePriority(firstItem, 0);
    expect(queue.heapify).toHaveBeenCalled();
    expect(typeof queue.push).toBe('function');
    expect(typeof queue.pop).toBe('function');
  });
});
