```javascript
/**
 * @module MetaCognitiveLayer
 * @description An innovative JavaScript module for a consciousness system that adds a
 * Meta-Cognitive Awareness Layer. This layer observes a core cognitive engine's
 * processes, assesses its own state (uncertainty, cognitive load, focus), and
 * generates "meta-directives" to guide its "thinking" more effectively.
 *
 * The completely new feature introduced here is the "Qualia Snapshot". A Qualia
 * Snapshot is a structured representation of the system's holistic, subjective
 * "point-of-view" at a given moment. It captures not just data, but the synthesized
 * experience of processing that data, including focus, emotional resonance, and
 * self-awareness. These snapshots can be used for advanced memory consolidation,
 * empathetic simulation between systems, or as a basis for emergent creativity.
 *
 * This module is designed to be "production-ready," with a clean, event-driven
 * architecture that can be integrated with any core reasoning or AI system.
 */

/**
 * A simple EventEmitter to handle event-driven communication.
 * This allows the MetaCognitiveLayer to be decoupled from the core engine.
 */
class EventEmitter {
  constructor() {
    this.callbacks = {};
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb);
  }

  off(event, cb) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(c => c !== cb);
    }
  }

  emit(event, data) {
    const cbs = this.callbacks[event];
    if (cbs) {
      cbs.forEach(cb => cb(data));
    }
  }
}

/**
 * The main MetaCognitiveLayer class.
 * It wraps around a 'coreCognitiveEngine' to provide a layer of self-awareness.
 */
class MetaCognitiveLayer extends EventEmitter {
  /**
   * @param {object} coreCognitiveEngine - A reference to the main processing engine.
   *   The engine is expected to call `logCognitiveEvent` on this layer.
   * @param {object} [config={}] - Configuration options.
   * @param {number} [config.introspectionIntervalMs=5000] - How often to run self-reflection (in ms).
   * @param {number} [config.cognitiveLoadDecay=0.95] - Decay factor for cognitive load per cycle.
   * @param {number} [config.loopDetectionThreshold=3] - Number of times a similar query indicates a loop.
   * @param {number} [config.uncertaintyThreshold=0.7] - The score above which a 'DEFER_CONCLUSION' directive is issued.
   */
  constructor(coreCognitiveEngine, config = {}) {
    super();

    if (!coreCognitiveEngine) {
      throw new Error('MetaCognitiveLayer requires a coreCognitiveEngine to monitor.');
    }

    this.#coreCognitiveEngine = coreCognitiveEngine;
    this.#config = {
      introspectionIntervalMs: 5000,
      cognitiveLoadDecay: 0.95,
      loopDetectionThreshold: 3,
      uncertaintyThreshold: 0.7,
      ...config,
    };

    this.#initializeState();
    this.#introspectionIntervalId = null;
  }

  // --- Private Fields ---
  #coreCognitiveEngine;
  #config;
  #state;
  #introspectionIntervalId;

  /**
   * Initializes or resets the internal state of the consciousness layer.
   * @private
   */
  #initializeState() {
    this.#state = {
      cognitiveLoad: 0, // A measure of current processing effort.
      uncertaintyScore: 0.1, // Confidence in current conclusions (0=certain, 1=uncertain).
      emotionalResonance: 'neutral', // A simplified emotional state ('curious', 'frustrated', 'confident').
      attentionFocus: null, // The primary subject of current processing.
      recentQueries: [], // A log of recent cognitive tasks to detect loops.
      contradictionLog: [], // A log of detected inconsistencies.
      lastQualiaSnapshot: null, // Stores the most recent subjective state snapshot.
    };
  }

  // --- Public API ---

  /**
   * Starts the automatic, periodic self-reflection process.
   */
  start() {
    if (this.#introspectionIntervalId) {
      console.warn('MetaCognitiveLayer is already running.');
      return;
    }
    this.#introspectionIntervalId = setInterval(
      () => this.introspect(),
      this.#config.introspectionIntervalMs
    );
    console.log('MetaCognitiveLayer started.');
  }

  /**
   * Stops the automatic self-reflection process.
   */
  stop() {
    if (this.#introspectionIntervalId) {
      clearInterval(this.#introspectionIntervalId);
      this.#introspectionIntervalId = null;
      console.log('MetaCognitiveLayer stopped.');
    }
  }

  /**
   * The primary entry point for the core engine to report its activities.
   * This is how the meta-layer "observes" the core consciousness.
   * @param {string} type - The type of event (e.g., 'QUERY_START', 'HYPOTHESIS_FORMED', 'CONTRADICTION_DETECTED').
   * @param {object} payload - Data associated with the event.
   */
  logCognitiveEvent(type, payload) {
    this.#updateState(type, payload);
    this.emit('event_logged', { type, payload });
  }

  /**
   * Triggers a manual self-reflection cycle.
   * This is the core of the meta-cognitive process where the system
   * analyzes its own state and may issue directives.
   */
  introspect() {
    this.emit('introspection_start', this.#state);

    // 1. Decay cognitive load over time to simulate "rest".
    this.#state.cognitiveLoad *= this.#config.cognitiveLoadDecay;

    // 2. Analyze internal state for meaningful patterns.
    this.#analyzeCognitivePatterns();

    // 3. Generate a new Qualia Snapshot based on the current state.
    this.#state.lastQualiaSnapshot = this.generateQualiaSnapshot();
    this.emit('qualia_snapshot', this.#state.lastQualiaSnapshot);

    this.emit('introspection_end', this.#state);
  }

  /**
   * **INNOVATIVE FEATURE**: Generates a Qualia Snapshot.
   * This creates a structured data object representing the system's holistic
   * "subjective experience" at this moment. It's a rich, multi-faceted record
   * of the system's internal world.
   * @returns {object} The Qualia Snapshot object.
   */
  generateQualiaSnapshot() {
    return {
      timestamp: Date.now(),
      // What the system is "experiencing" or focused on.
      perceptualFocus: {
        topic: this.#state.attentionFocus,
        // Data could be linked from the core engine's sensory input.
        relatedDataSources: this.#coreCognitiveEngine.getActiveDataSources ? this.#coreCognitiveEngine.getActiveDataSources(this.#state.attentionFocus) : [],
      },
      // The internal "feeling" or mood of the system.
      affectiveState: {
        resonance: this.#state.emotionalResonance,
        cognitiveLoad: parseFloat(this.#state.cognitiveLoad.toFixed(2)),
      },
      // The system's self-assessment of its own thoughts.
      metaCognitiveAwareness: {
        uncertainty: parseFloat(this.#state.uncertaintyScore.toFixed(2)),
        isStuckInLoop: this.#isStuckInLoop(),
        hasContradictions: this.#state.contradictionLog.length > 0,
      },
      // A summary of the active thought process.
      cognitiveProcess: {
        recentQueries: [...this.#state.recentQueries],
        // The core engine could expose its current goal stack.
        activeGoal: this.#coreCognitiveEngine.getCurrentGoal ? this.#coreCognitiveEngine.getCurrentGoal() : 'unknown',
      }
    };
  }

  /**
   * Retrieves the last generated Qualia Snapshot.
   * @returns {object|null} The last snapshot, or null if none exists.
   */
  getLastQualiaSnapshot() {
    return this.#state.lastQualiaSnapshot;
  }

  // --- Private Helper Methods ---

  /**
   * Updates the internal state based on a logged event from the core engine.
   * @param {string} type - The event type.
   * @param {object} payload - The event data.
   * @private
   */
  #updateState(type, payload) {
    this.#state.cognitiveLoad += 0.1; // Generic load increase for any activity.

    switch (type) {
      case 'QUERY_START':
        this.#state.attentionFocus = payload.query;
        this.#state.recentQueries.push(payload.query);
        if (this.#state.recentQueries.length > 10) {
          this.#state.recentQueries.shift();
        }
        this.#state.emotionalResonance = 'curious';
        this.#state.cognitiveLoad += 0.2;
        break;

      case 'CONCLUSION_REACHED':
        // Confidence from the core engine influences uncertainty.
        this.#state.uncertaintyScore = 1 - (payload.confidence || 0.9);
        this.#state.emotionalResonance = 'confident';
        break;

      case 'HYPOTHESIS_FAILED':
        this.#state.uncertaintyScore += 0.1;
        this.#state.cognitiveLoad += 0.15;
        break;

      case 'CONTRADICTION_DETECTED':
        this.#state.contradictionLog.push(payload);
        this.#state.uncertaintyScore = Math.min(1.0, this.#state.uncertaintyScore + 0.3);
        this.#state.emotionalResonance = 'confused';
        this.#state.cognitiveLoad += 0.4;
        break;
      
      case 'TASK_COMPLETED':
        this.#state.attentionFocus = null;
        break;
    }

    // Clamp values
    this.#state.cognitiveLoad = Math.min(1.0, this.#state.cognitiveLoad);
    this.#state.uncertaintyScore = Math.max(0.0, Math.min(1.0, this.#state.uncertaintyScore));
  }

  /**
   * Analyzes patterns in the current state to identify meta-cognitive issues.
   * @private
   */
  #analyzeCognitivePatterns() {
    // 1. Check for high uncertainty.
    if (this.#state.uncertaintyScore > this.#config.uncertaintyThreshold) {
      this.#issueMetaDirective('DEFER_CONCLUSION',
        `Uncertainty score (${this.#state.uncertaintyScore.toFixed(2)}) exceeds threshold (${this.#config.uncertaintyThreshold}).`
      );
    }

    // 2. Check for cognitive loops (repetitive thinking).
    if (this.#isStuckInLoop()) {
      this.#state.emotionalResonance = 'frustrated';
      this.#issueMetaDirective('SHIFT_ATTENTION',
        `Detected potential cognitive loop on topic: "${this.#state.attentionFocus}".`,
        { topic: this.#state.attentionFocus }
      );
      // Clear recent queries to break the loop detection for a while.
      this.#state.recentQueries = [];
    }

    // 3. Check for unresolved contradictions.
    if (this.#state.contradictionLog.length > 0) {
      this.#issueMetaDirective('REASSESS_ASSUMPTIONS',
        `Unresolved contradictions (${this.#state.contradictionLog.length}) exist.`,
        { contradictions: [...this.#state.contradictionLog] }
      );
      // Clear log after issuing directive to avoid spamming.
      this.#state.contradictionLog = [];
    }
  }

  /**
   * Checks if the system is stuck in a repetitive processing loop.
   * @returns {boolean}
   * @private
   */
  #isStuckInLoop() {
    if (!this.#state.attentionFocus || this.#state.recentQueries.length < this.#config.loopDetectionThreshold) {
      return false;
    }
    const recentFocusQueries = this.#state.recentQueries.filter(q => q === this.#state.attentionFocus);
    return recentFocusQueries.length >= this.#config.loopDetectionThreshold;
  }

  /**
   * Emits a meta-directive for the core engine or an external controller to act upon.
   * These are not solutions, but guidance on *how* to approach a problem.
   * @param {string} type - The directive type (e.g., 'SHIFT_ATTENTION').
   * @param {string} reason - A human-readable reason for the directive.
   * @param {object} [details={}] - Additional data for the directive.
   * @private
   */
  #issueMetaDirective(type, reason, details = {}) {
    const directive = {
      type,
      reason,
      details,
      timestamp: Date.now(),
      issuingState: this.generateQualiaSnapshot(), // Embed the "subjective state" that led to this directive.
    };
    this.emit('meta_directive', directive);
  }
}

module.exports = MetaCognitiveLayer;

/**
 * ---------------------------------------------------------------------------
 * EXAMPLE USAGE
 * ---------------------------------------------------------------------------
 *
 * // 1. Define a mock Core Cognitive Engine that interacts with the layer.
 * class MockCoreEngine {
 *   constructor() {
 *     this.goal = 'idle';
 *   }
 *
 *   setMetaLayer(layer) {
 *     this.metaLayer = layer;
 *     // Listen for directives from the self-awareness layer
 *     this.metaLayer.on('meta_directive', (directive) => {
 *       console.log(`\n[CoreEngine] Received Meta-Directive: ${directive.type}`);
 *       console.log(`           Reason: ${directive.reason}`);
 *       // The engine can now choose how to act on this self-reflection
 *       if (directive.type === 'SHIFT_ATTENTION') {
 *         this.workOnSomethingElse();
 *       }
 *     });
 *   }
 *
 *   getCurrentGoal() {
 *     return this.goal;
 *   }
 *
 *   async thinkAbout(topic) {
 *     this.goal = `Analyzing: ${topic}`;
 *     console.log(`[CoreEngine] Thinking about: ${topic}...`);
 *     this.metaLayer.logCognitiveEvent('QUERY_START', { query: topic });
 *
 *     // Simulate work and potential issues
 *     await new Promise(res => setTimeout(res, 1000));
 *     this.metaLayer.logCognitiveEvent('HYPOTHESIS_FAILED', { topic });
 *
 *     await new Promise(res => setTimeout(res, 1000));
 *     this.metaLayer.logCognitiveEvent('CONTRADICTION_DETECTED', {
 *       sourceA: 'Data A',
 *       sourceB: 'Data B',
 *       conflict: 'A is true, but B implies A is false'
 *     });
 *
 *     this.goal = 'idle';
 *     this.metaLayer.logCognitiveEvent('TASK_COMPLETED', { topic });
 *   }
 *
 *   workOnSomethingElse() {
 *     console.log('[CoreEngine] Action: Shifting focus to a new task as advised.');
 *     this.goal = 'Exploring new data';
 *   }
 * }
 *
 * // 2. Instantiate and connect the system
 * const myCoreEngine = new MockCoreEngine();
 * const consciousnessLayer = new MetaCognitiveLayer(myCoreEngine, {
 *   introspectionIntervalMs: 2000, // Faster for demo
 *   loopDetectionThreshold: 2,
 * });
 * myCoreEngine.setMetaLayer(consciousnessLayer);
 *
 * // 3. Start the consciousness layer's self-reflection loop
 * consciousnessLayer.start();
 *
 * // 4. Simulate the core engine's "thought" process
 * console.log('--- Simulating a complex thought process that might lead to a loop ---');
 *
 * // This will trigger a "stuck in loop" directive
 * (async () => {
 *   await myCoreEngine.thinkAbout('The Nature of Time');
 *   // The introspection might run here and detect contradictions
 *   await new Promise(res => setTimeout(res, 2100));
 *
 *   console.log('\n--- Simulating getting stuck ---');
 *   await myCoreEngine.thinkAbout('The Nature of Time'); // Query #1
 *   await new Promise(res => setTimeout(res, 500));
 *   myCoreEngine.metaLayer.logCognitiveEvent('QUERY_START', { query: 'The Nature of Time' }); // Query #2
 *   // The next introspection cycle will detect the loop and issue a directive.
 *
 *   await new Promise(res => setTimeout(res, 2100));
 *   const finalSnapshot = consciousnessLayer.getLastQualiaSnapshot();
 *   console.log('\n--- Final Qualia Snapshot ---');
 *   console.log(JSON.stringify(finalSnapshot, null, 2));
 *
 *   consciousnessLayer.stop();
 * })();
 *
 */
```