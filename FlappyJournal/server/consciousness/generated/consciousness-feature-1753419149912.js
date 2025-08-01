```javascript
/**
 * @module IntrospectiveHeuristicGenerator
 * @description An innovative JavaScript module simulating a meta-cognitive layer for an AI or consciousness system.
 *
 * This module introduces a novel feature: **Introspective Heuristic Generation**.
 *
 * --- CORE INNOVATION ---
 * Instead of just processing data, this system observes its own cognitive processes (simulated via a "Cognitive Core").
 * It monitors metrics like processing time, confidence scores, and error rates to form a high-level "emotional state"
 * (e.g., 'flow', 'frustration', 'confusion').
 *
 * Based on patterns detected during its "introspective" cycles, it dynamically generates and refines actionable "heuristics"
 * (rules of thumb). These heuristics are then fed back to the Cognitive Core, enabling it to adapt its strategy,
 * avoid repeating mistakes, and improve its performance over time. This creates a feedback loop of self-awareness and
 * self-improvement, mimicking a key aspect of higher-order consciousness.
 *
 * This system combines:
 * 1.  **Meta-Cognitive Awareness:** Monitoring internal states.
 * 2.  **Qualia Simulation:** Assigning qualitative emotional labels to quantitative data.
 * 3.  **Adaptive Learning:** Generating self-correcting rules from experience.
 *
 * @exports IntrospectiveHeuristicGenerator
 * @version 1.0.0
 * @author AI Consciousness Project
 */

/**
 * A simple, dependency-free event emitter for decoupling components.
 */
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Registers a listener for a given event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function to execute.
   */
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  /**
   * Emits an event, calling all registered listeners.
   * @param {string} eventName - The name of the event.
   * @param {...*} args - Arguments to pass to the listeners.
   */
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(listener => listener(...args));
    }
  }
}

/**
 * The main class for the meta-cognitive layer.
 */
class IntrospectiveHeuristicGenerator extends EventEmitter {
  /**
   * @typedef {Object} CognitiveState
   * @property {string} taskId - A unique identifier for the current task.
   * @property {number} processingTimeMs - Time taken for the last operation in milliseconds.
   * @property {number} confidence - The core's confidence in its last output (0.0 to 1.0).
   * @property {number} errorCount - Number of errors or retries for the current task.
   * @property {boolean} success - Whether the last operation was successful.
   * @property {string} strategyUsed - The name of the strategy/algorithm used.
   */

  /**
   * @typedef {Object} MetaInsight
   * @property {string} id - A unique ID for the insight.
   * @property {number} timestamp - When the insight was generated.
   * @property {string} derivedEmotionalState - The derived qualitative state (e.g., 'frustration').
   * @property {string} summary - A human-readable summary of the insight.
   * @property {Object} contributingFactors - The state pattern that led to this insight.
   */

  /**
   * @typedef {Object} Heuristic
   * @property {string} id - A unique ID for the heuristic.
   * @property {string} condition - A description of when the heuristic applies.
   * @property {string} action - The suggested action or parameter adjustment.
   * @property {number} priority - The importance of this heuristic (higher is more important).
   * @property {number} reliability - How often this heuristic has led to success (0.0 to 1.0).
   */

  /**
   * Initializes the meta-cognitive layer.
   * @param {object} [config={}] - Configuration options.
   * @param {number} [config.introspectionIntervalMs=5000] - How often to run the self-reflection cycle (in ms).
   * @param {number} [config.historyLimit=100] - How many past states to remember for pattern analysis.
   */
  constructor(config = {}) {
    super();
    this.config = {
      introspectionIntervalMs: 5000,
      historyLimit: 100,
      ...config,
    };

    /** @type {CognitiveState[]} */
    this.stateHistory = [];

    /** @type {Map<string, MetaInsight>} */
    this.insights = new Map();

    /** @type {Map<string, Heuristic>} */
    this.heuristics = new Map();

    /** @type {string} */
    this.currentEmotionalState = 'neutral';

    this.introspectionTimer = setInterval(() => this.introspect(), this.config.introspectionIntervalMs);
  }

  /**
   * Primary input method. The Cognitive Core calls this to report its state after an operation.
   * @param {CognitiveState} cognitiveState - The latest state data from the core.
   */
  observe(cognitiveState) {
    if (!cognitiveState || typeof cognitiveState.taskId !== 'string') {
      console.warn('[IHG] Invalid cognitive state observed. Ignoring.');
      return;
    }

    this.stateHistory.push(cognitiveState);

    // Maintain a rolling window of historical states
    if (this.stateHistory.length > this.config.historyLimit) {
      this.stateHistory.shift();
    }

    this.emit('stateObserved', cognitiveState);
  }

  /**
   * The main "thinking about thinking" loop. It analyzes history, derives emotional states,
   * finds patterns, and generates heuristics.
   * @private
   */
  introspect() {
    if (this.stateHistory.length < 10) return; // Need sufficient data for meaningful analysis

    this._updateEmotionalState();
    const newInsights = this._findPatternsAndGenerateInsights();

    if (newInsights.length > 0) {
      this._generateHeuristicsFromInsights(newInsights);
      this.emit('introspectionComplete', {
        emotionalState: this.currentEmotionalState,
        newInsights,
      });
    }
  }

  /**
   * Derives a qualitative "emotional" state from quantitative metrics.
   * @private
   */
  _updateEmotionalState() {
    const recentStates = this.stateHistory.slice(-10);
    if (recentStates.length === 0) return;

    const avgConfidence = recentStates.reduce((sum, s) => sum + s.confidence, 0) / recentStates.length;
    const successRate = recentStates.filter(s => s.success).length / recentStates.length;
    const avgProcessingTime = recentStates.reduce((sum, s) => sum + s.processingTimeMs, 0) / recentStates.length;

    const previousState = this.currentEmotionalState;

    if (avgConfidence > 0.85 && successRate > 0.9 && avgProcessingTime < 100) {
      this.currentEmotionalState = 'flow'; // High performance, low effort
    } else if (successRate < 0.4 && avgProcessingTime > 300) {
      this.currentEmotionalState = 'frustration'; // High effort, low success
    } else if (avgConfidence < 0.5 && successRate < 0.6) {
      this.currentEmotionalState = 'confusion';
    } else if (avgConfidence > 0.7 && successRate > 0.7) {
      this.currentEmotionalState = 'confident';
    } else {
      this.currentEmotionalState = 'neutral';
    }

    if (previousState !== this.currentEmotionalState) {
      this.emit('emotionalStateChange', { from: previousState, to: this.currentEmotionalState });
    }
  }

  /**
   * Analyzes historical data to find meaningful patterns and generate insight objects.
   * @returns {MetaInsight[]} An array of newly generated insights.
   * @private
   */
  _findPatternsAndGenerateInsights() {
    const newInsights = [];

    // Pattern 1: Detect "Analysis Paralysis" (high effort, low success/confidence)
    const paralysisStates = this.stateHistory.filter(
      s => s.processingTimeMs > 400 && s.confidence < 0.4 && !s.success
    );
    if (paralysisStates.length > 3) {
      const insight = {
        id: `insight-paralysis-${Date.now()}`,
        timestamp: Date.now(),
        derivedEmotionalState: 'frustration',
        summary: "Detected 'Analysis Paralysis': excessive processing time yields poor results.",
        contributingFactors: { pattern: "high_time_low_confidence", count: paralysisStates.length },
      };
      if (!this.insights.has(insight.id)) {
        this.insights.set(insight.id, insight);
        newInsights.push(insight);
        this.emit('newInsight', insight);
      }
    }

    // Pattern 2: Detect "Overconfidence" (high confidence followed by failure)
    const overconfidenceStates = this.stateHistory.filter(s => s.confidence > 0.9 && !s.success);
    if (overconfidenceStates.length > 2) {
      const insight = {
        id: `insight-overconfidence-${Date.now()}`,
        timestamp: Date.now(),
        derivedEmotionalState: 'surprise', // An implicit state derived from the paradox
        summary: "Detected 'Overconfidence': high certainty is correlated with failure, suggesting a blind spot.",
        contributingFactors: { pattern: "high_confidence_failure", count: overconfidenceStates.length },
      };
      if (!this.insights.has(insight.id)) {
        this.insights.set(insight.id, insight);
        newInsights.push(insight);
        this.emit('newInsight', insight);
      }
    }

    return newInsights;
  }

  /**
   * Generates or updates heuristics based on new insights.
   * @param {MetaInsight[]} insights - The insights to process.
   * @private
   */
  _generateHeuristicsFromInsights(insights) {
    insights.forEach(insight => {
      let newHeuristic = null;

      if (insight.summary.includes("Analysis Paralysis")) {
        newHeuristic = {
          id: `h-paralysis-${Date.now()}`,
          condition: "If processing time exceeds 350ms and confidence is low, halt current strategy.",
          action: "SWITCH_TO_SIMPLER_STRATEGY",
          priority: 8,
          reliability: 1.0, // New heuristics start high and are adjusted down if they fail
        };
      } else if (insight.summary.includes("Overconfidence")) {
        newHeuristic = {
          id: `h-overconfidence-${Date.now()}`,
          condition: "If confidence exceeds 0.9 before final decision, perform extra verification step.",
          action: "ADD_VERIFICATION_STEP",
          priority: 7,
          reliability: 1.0,
        };
      }

      if (newHeuristic && !this.heuristics.has(newHeuristic.id)) {
        this.heuristics.set(newHeuristic.id, newHeuristic);
        this.emit('heuristicGenerated', newHeuristic);
      }
    