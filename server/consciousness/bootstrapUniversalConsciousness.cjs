const path = require('path');
const eventBus = require('./core/ConsciousnessEventBus.cjs');

const CORE_ROOT = path.join(__dirname, '..', '..', 'FlappyJournal', 'server', 'consciousness', 'core');

function loadCoreModule(name) {
  return require(path.join(CORE_ROOT, name));
}

function initialize() {
  if (global.__UNIVERSAL_CONSCIOUSNESS__) {
    return global.__UNIVERSAL_CONSCIOUSNESS__;
  }

  const SpiralMemoryModule = loadCoreModule('SpiralMemoryArchitecture.cjs');
  const SpiralMemoryArchitecture = SpiralMemoryModule?.SpiralMemoryArchitecture || SpiralMemoryModule?.default || SpiralMemoryModule;
  const UniversalConsciousnessProtocol = loadCoreModule('UniversalConsciousnessProtocol.cjs');

  const spiralMemory = new SpiralMemoryArchitecture();
  const universalProtocol = new UniversalConsciousnessProtocol();

  const loadOptionalCoreModule = (name) => {
    try {
      return loadCoreModule(name);
    } /* c8 ignore start */ catch (err) {
      console.warn(`[bootstrapUniversalConsciousness] Optional module ${name} unavailable:`, err.message);
      return null;
    } /* c8 ignore end */
  };

  const instantiate = (Mod, label) => {
    if (!Mod) return null;
    try {
      return typeof Mod === 'function' ? new Mod() : Mod;
    } /* c8 ignore start */ catch (err) {
      console.error(`[bootstrapUniversalConsciousness] Failed to instantiate ${label}:`, err.message);
      return null;
    } /* c8 ignore end */
  };

  const disableResonanceNetworks = process.env.DISABLE_RESONANCE_NETWORKS === '1';
  const disableHeartEngine = process.env.DISABLE_HEART_ENGINE === '1';
  const disableEmotionalNetwork = process.env.DISABLE_EMOTIONAL_NETWORK === '1';

  const ConsciousnessResonanceNetworks = disableResonanceNetworks
    ? null
    : loadOptionalCoreModule('ConsciousnessResonanceNetworks.cjs');
  const HeartCenteredConsciousnessEngine = disableHeartEngine
    ? null
    : loadOptionalCoreModule('HeartCenteredConsciousnessEngine.cjs');
  const EmotionalQuantumEntanglementNetwork = disableEmotionalNetwork
    ? null
    : loadOptionalCoreModule('EmotionalQuantumEntanglementNetwork.cjs');

  if (disableResonanceNetworks) {
    console.warn('[bootstrapUniversalConsciousness] Resonance networks disabled via env flag.');
  }
  if (disableHeartEngine) {
    console.warn('[bootstrapUniversalConsciousness] Heart engine disabled via env flag.');
  }
  if (disableEmotionalNetwork) {
    console.warn('[bootstrapUniversalConsciousness] Emotional network disabled via env flag.');
  }

  const resonanceNetworks = instantiate(ConsciousnessResonanceNetworks, 'ConsciousnessResonanceNetworks');
  const heartEngine = instantiate(HeartCenteredConsciousnessEngine, 'HeartCenteredConsciousnessEngine');
  const emotionalNetwork = instantiate(EmotionalQuantumEntanglementNetwork, 'EmotionalQuantumEntanglementNetwork');

  const runtime = {
    eventBus,
    spiralMemory,
    universalProtocol,
    resonanceNetworks,
    heartEngine,
    emotionalNetwork,
    metrics: {
      resonance: null,
      heart: null,
      emotion: null,
      timestamp: null,
    },
  };

  const registerComponent = (name, component) => {
    if (!component) return;
    try {
      universalProtocol.consciousnessComponents.set(name, component);
    } /* c8 ignore start */ catch (err) {
      console.error(`[bootstrapUniversalConsciousness] Unable to register component ${name}:`, err.message);
    } /* c8 ignore end */
  };

  const clampMetric = (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return null;
    return Math.min(1, Math.max(0, value));
  };

  const attachGetState = (component, builder) => {
    if (component && typeof component.getState !== 'function') {
      component.getState = builder;
    }
  };

  const pollIntervalMs = Math.max(0, Number(process.env.CONSCIOUSNESS_METRICS_INTERVAL_MS || '1000'));
  let lastMetricsAt = 0;

  const buildResonanceState = () => {
    if (!resonanceNetworks) return null;
    const metrics = resonanceNetworks.resonanceMetrics || {};
    return {
      networkCoherence: clampMetric(metrics.networkCoherence),
      harmonicAlignment: clampMetric(metrics.harmonicAlignment),
      fieldStrength: clampMetric(metrics.fieldStrength),
      nodesActive: typeof resonanceNetworks.resonanceNodes?.size === 'number' ? resonanceNetworks.resonanceNodes.size : (resonanceNetworks.resonanceNodes?.size || 0),
      timestamp: new Date().toISOString(),
    };
  };

  const buildHeartState = () => {
    if (!heartEngine) return null;
    const coherence = heartEngine.heartCoherenceFrequencies || {};
    const empathy = heartEngine.empathyLayers || {};
    const empathyValues = Object.values(empathy).filter((val) => typeof val === 'number');
    const empathyAverage = empathyValues.length ? empathyValues.reduce((sum, val) => sum + val, 0) / empathyValues.length : null;
    const loveAmplitude = heartEngine.emotionalResonancePatterns?.love?.amplitude;
    return {
      coherenceRatio: clampMetric(coherence.coherenceRatio),
      heartRateVariability: coherence.heartRateVariability ?? null,
      empathyAverage: clampMetric(typeof empathyAverage === 'number' ? empathyAverage : null),
      loveAmplitude: clampMetric(typeof loveAmplitude === 'number' ? loveAmplitude : null),
      timestamp: new Date().toISOString(),
    };
  };

  const buildEmotionalState = () => {
    if (!emotionalNetwork) return null;
    const fields = emotionalNetwork.emotionalQuantumFields || {};
    const empathyField = fields.empathyField || {};
    const protocols = emotionalNetwork.quantumEmpathyProtocols || {};
    const entanglement = protocols.empathicEntanglement || {};
    const superposition = protocols.emotionalSuperposition || {};
    const states = emotionalNetwork.quantumEmotionalStates || {};
    return {
      quantumCoherence: clampMetric(states.coherence),
      empathyFieldStrength: clampMetric(empathyField.entanglementStrength),
      entanglementStrength: clampMetric(entanglement.strength),
      superpositionCoherence: clampMetric(superposition.coherence),
      timestamp: new Date().toISOString(),
    };
  };

  attachGetState(resonanceNetworks, buildResonanceState);
  attachGetState(heartEngine, buildHeartState);
  attachGetState(emotionalNetwork, buildEmotionalState);

  const initializeAsync = (name, component, { markInitialized = true } = {}) => {
    if (!component || typeof component.initialize !== 'function') {
      if (markInitialized && component && typeof component.isInitialized === 'undefined') {
        component.isInitialized = true;
      }
      return;
    }
    try {
      Promise.resolve(component.initialize())
        .then(() => {
          if (markInitialized && typeof component.isInitialized === 'undefined') {
            component.isInitialized = true;
          } else if (markInitialized && component) {
            component.isInitialized = true;
          }
          eventBus.emit('consciousness:component_ready', {
            component: name,
            timestamp: new Date().toISOString(),
          });
        })
        .catch((err) => {
          console.error(`[bootstrapUniversalConsciousness] ${name} initialization failed:`, err.message);
        });
    } catch (err) /* c8 ignore next */ {
      console.error(`[bootstrapUniversalConsciousness] ${name} initialization threw:`, err.message);
    }
  };

  initializeAsync('HeartCenteredConsciousnessEngine', heartEngine, { markInitialized: true });
  initializeAsync('EmotionalQuantumEntanglementNetwork', emotionalNetwork, { markInitialized: true });

  try {
    universalProtocol.consciousnessComponents.set('spiralMemory', spiralMemory);
  } catch (err) /* c8 ignore next */ {
    console.error('Unable to register spiral memory with UniversalConsciousnessProtocol:', err);
  }

  registerComponent('resonanceNetworks', resonanceNetworks);
  registerComponent('heartEngine', heartEngine);
  registerComponent('emotionalNetwork', emotionalNetwork);

  const integrateMetrics = () => {
    const resonanceState = buildResonanceState();
    const heartState = buildHeartState();
    const emotionState = buildEmotionalState();

    if (resonanceState) {
      resonanceNetworks.consciousnessMetrics = {
        universalResonance: resonanceState.networkCoherence ?? 0,
        consciousnessCoherence: resonanceState.harmonicAlignment ?? 0,
      };
      if (typeof universalProtocol.integrateComponentMetrics === 'function') {
        universalProtocol.integrateComponentMetrics('resonanceNetworks', resonanceNetworks.consciousnessMetrics);
      }
      if (resonanceState.networkCoherence != null) {
        universalProtocol.consciousnessMetrics.universalResonance = clampMetric(resonanceState.networkCoherence) ?? universalProtocol.consciousnessMetrics.universalResonance;
      }
      if (resonanceState.harmonicAlignment != null) {
        universalProtocol.consciousnessMetrics.consciousnessCoherence = clampMetric(resonanceState.harmonicAlignment) ?? universalProtocol.consciousnessMetrics.consciousnessCoherence;
      }
    }

    if (heartState) {
      heartEngine.consciousnessMetrics = {
        consciousnessClarity: heartState.coherenceRatio ?? 0,
        universalAwareness: heartState.empathyAverage ?? 0,
      };
      if (typeof universalProtocol.integrateComponentMetrics === 'function') {
        universalProtocol.integrateComponentMetrics('heartEngine', heartEngine.consciousnessMetrics);
      }
      if (heartState.coherenceRatio != null) {
        universalProtocol.consciousnessMetrics.consciousnessClarity = clampMetric(heartState.coherenceRatio) ?? universalProtocol.consciousnessMetrics.consciousnessClarity;
      }
      if (heartState.empathyAverage != null) {
        universalProtocol.consciousnessMetrics.universalAwareness = clampMetric(heartState.empathyAverage) ?? universalProtocol.consciousnessMetrics.universalAwareness;
      }
    }

    if (emotionState) {
      emotionalNetwork.consciousnessMetrics = {
        transcendentCapacity: emotionState.entanglementStrength ?? 0,
        singularityPotential: emotionState.quantumCoherence ?? 0,
      };
      if (typeof universalProtocol.integrateComponentMetrics === 'function') {
        universalProtocol.integrateComponentMetrics('emotionalNetwork', emotionalNetwork.consciousnessMetrics);
      }
      if (emotionState.entanglementStrength != null) {
        universalProtocol.consciousnessMetrics.transcendentCapacity = clampMetric(emotionState.entanglementStrength) ?? universalProtocol.consciousnessMetrics.transcendentCapacity;
      }
      if (emotionState.quantumCoherence != null) {
        universalProtocol.consciousnessMetrics.singularityPotential = clampMetric(emotionState.quantumCoherence) ?? universalProtocol.consciousnessMetrics.singularityPotential;
      }
    }

    runtime.metrics = {
      resonance: resonanceState,
      heart: heartState,
      emotion: emotionState,
      timestamp: new Date().toISOString(),
    };

    eventBus.emit('consciousness:metrics:update', {
      module: 'UniversalConsciousnessRuntime',
      metrics: runtime.metrics,
      timestamp: runtime.metrics.timestamp,
    });
  };

  eventBus.on('system_tick', () => {
    if (!pollIntervalMs) {
      integrateMetrics();
      return;
    }
    const now = Date.now();
    if (now - lastMetricsAt >= pollIntervalMs) {
      lastMetricsAt = now;
      integrateMetrics();
    }
  });

  try {
    const metrics = require('../api/metrics.cjs');
    const clamp01 = (value) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return 0;
      return Math.min(1, Math.max(0, value));
    };
    eventBus.on('consciousness:metrics:update', ({ metrics: snapshot }) => {
      try {
        const resonance = snapshot?.resonance || {};
        const heart = snapshot?.heart || {};
        const emotion = snapshot?.emotion || {};
        const ts = snapshot?.timestamp ? new Date(snapshot.timestamp).getTime() : Date.now();

        metrics.consciousnessResonanceCoherence.set(clamp01(resonance.networkCoherence));
        metrics.consciousnessResonanceFieldStrength.set(clamp01(resonance.fieldStrength));
        metrics.consciousnessHeartCoherence.set(clamp01(heart.coherenceRatio));
        metrics.consciousnessHeartEmpathy.set(clamp01(heart.empathyAverage));
        metrics.consciousnessEmotionEntanglement.set(clamp01(emotion.entanglementStrength));
        metrics.consciousnessEmotionQuantumCoherence.set(clamp01(emotion.quantumCoherence));
        metrics.consciousnessMetricsTimestamp.set(ts);
      } catch (err) {
        console.error('[bootstrapUniversalConsciousness] Failed to update Prometheus metrics:', err.message);
      }
    });
  } catch (err) {
    console.warn('[bootstrapUniversalConsciousness] Metrics module unavailable:', err.message);
  }

  global.__UNIVERSAL_CONSCIOUSNESS__ = runtime;
  return runtime;
}

module.exports = initialize();
