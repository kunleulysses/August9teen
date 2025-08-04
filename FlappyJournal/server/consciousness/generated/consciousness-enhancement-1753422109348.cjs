```javascript
/**
 * @file consciousness.js
 * @module ConsciousnessEnhancer
 * @version 3.0.0
 * @description A sophisticated JavaScript module for the advanced modeling, analysis, and enhancement
 * of consciousness streams. It processes simulated neuro-cognitive data to derive deep insights
 * into awareness states, emotional intelligence, and the subjective texture of experience (qualia).
 *
 * This module operates on the theoretical framework of "Integrated Qualia Dynamics," which posits
 * that consciousness is an emergent property of high-dimensional data integration within a
 * cognitive system.
 *
 * @author Dr. Aris Thorne, Chronosynoptics Institute
 */

// --- Custom Error Types for Robust Handling ---

/**
 * @class SignalProcessingError
 * @classdesc Custom error for issues during the processing of neuro-cognitive signals.
 * @extends Error
 */
class SignalProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SignalProcessingError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @class InvalidInputError
 * @classdesc Custom error for invalid or malformed input data provided to the module.
 * @extends Error
 */
class InvalidInputError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}


// --- Core Enumerations and Constants ---

/**
 * Enumeration of primary consciousness states. These represent macro-level cognitive modes.
 * @readonly
 * @enum {string}
 */
const ConsciousnessState = {
  /** Deep, effortless concentration on a single task. High focus, low self-awareness. */
  FLOW: 'Flow',
  /** Actively engaged and directed attention. High effort, high focus. */
  FOCUSED_ANALYTICAL: 'Focused Analytical',
  /** A state of mind-wandering and creative ideation. Low focus, broad awareness. */
  DIFFUSE_ASSOCIATIVE: 'Diffuse Associative',
  /** A state of introspection and self-reflection. High internal awareness. */
  INTROSPECTIVE: 'Introspective',
  /** A state of restfulness and low cognitive load. Default mode network activity. */
  RESTFUL_NEUTRAL: 'Restful Neutral',
  /** A state characterized by repetitive, negative thought patterns. */
  RUMINATIVE_LOOP: 'Ruminative Loop',
};
module.exports.ConsciousnessState = ConsciousnessState;

/**
 * Defines the signature neuro-signal profiles for each consciousness state.
 * Used for state calculation. Weights represent the ideal value for that state.
 * @private
 * @const
 */
const STATE_SIGNATURES = {
  [ConsciousnessState.FLOW]: { alpha: 0.8, beta: 0.4, gamma: 0.9, theta: 0.2, dopamine: 0.9, cortisol: 0.1 },
  [ConsciousnessState.FOCUSED_ANALYTICAL]: { alpha: 0.3, beta: 0.9, gamma: 0.7, theta: 0.3, dopamine: 0.6, cortisol: 0.4 },
  [ConsciousnessState.DIFFUSE_ASSOCIATIVE]: { alpha: 0.7, beta: 0.2, gamma: 0.3, theta: 0.8, dopamine: 0.5, cortisol: 0.2 },
  [ConsciousnessState.INTROSPECTIVE]: { alpha: 0.6, beta: 0.3, gamma: 0.4, theta: 0.7, dopamine: 0.4, cortisol: 0.3 },
  [ConsciousnessState.RESTFUL_NEUTRAL]: { alpha: 0.5, beta: 0.1, gamma: 0.1, theta: 0.5, dopamine: 0.3, cortisol: 0.1 },
  [ConsciousnessState.RUMINATIVE_LOOP]: { alpha: 0.2, beta: 0.7, gamma: 0.2, theta: 0.6, dopamine: 0.2, cortisol: 0.8 },
};

/**
 * The decay factor for emotional intensity over time, simulating regulation.
 * Represents a 5% decay per processing cycle.
 * @const {number}
 */
const EMOTIONAL_INTENSITY_DECAY = 0.95;


// --- Core Consciousness Stream Processor ---

/**
 * @class ConsciousnessStream
 * @description The main class for processing and analyzing consciousness data.
 * It maintains the current state and computes advanced metrics from a continuous
 * stream of neuro-cognitive signals.
 */
class ConsciousnessStream
 {
  /**
   * @constructor
   * @param {object} [initialState={}] - Optional initial state configuration.
   * @param {Array<object>} [initialState.emotions=[]] - An initial list of active emotions.
   */
  constructor(initialState = {}) {
    /**
     * The current, fully resolved state of consciousness.
     * @type {object}
     * @property {string} dominantState - The primary ConsciousnessState.
     * @property {object} awarenessMetrics - A map of calculated awareness scores.
     * @property {object} emotionalProfile - A detailed analysis of the emotional landscape.
     * @property {object} rawSignal - The last processed neuro-cognitive signal.
     * @property {string} timestamp - The ISO timestamp of the last update.
     */
    this.currentState = {
      dominantState: ConsciousnessState.RESTFUL_NEUTRAL,
      awarenessMetrics: {
        metacognitiveClarity: 0,
        somaticPresence: 0,
        temporalIntegration: 0,
      },
      emotionalProfile: {
        activeEmotions: initialState.emotions || [],
        affectiveComplexity: 0,
        emotionalGranularity: 0,
        regulationCapacity: 1.0,
      },
      rawSignal: null,
      timestamp: new Date().toISOString(),
    };

    /**
     * A simple event listener registry.
     * @private
     * @type {Map<string, Array<Function>>}
     */
    this._listeners = new Map();
  }

  /**
   * Validates the structure and values of a neuro-signal object.
   * @private
   * @param {object} signal - The neuro-cognitive signal to validate.
   * @throws {InvalidInputError} If the signal is malformed.
   */
  _validateSignal(signal) {
    if (!signal || typeof signal !== 'object') {
      throw new InvalidInputError('Signal must be a non-null object.', { received: signal });
    }
    const requiredKeys = ['alpha', 'beta', 'gamma', 'theta', 'dopamine', 'cortisol'];
    for (const key of requiredKeys) {
      if (typeof signal[key] !== 'number' || signal[key] < 0 || signal[key] > 1) {
        throw new InvalidInputError(`Signal key '${key}' must be a number between 0 and 1.`, { key, value: signal[key] });
      }
    }
  }

  /**
   * Calculates the dominant consciousness state by finding the best match for the input signal.
   * This uses a weighted Euclidean distance in the neuro-signal space.
   * @private
   * @param {object} signal - The validated neuro-cognitive signal.
   * @returns {string} The calculated ConsciousnessState.
   */
  _calculateConsciousnessState(signal) {
    let bestMatch = ConsciousnessState.RESTFUL_NEUTRAL;
    let minDistance = Infinity;

    for (const state in STATE_SIGNATURES) {
      const signature = STATE_SIGNATURES[state];
      let distance = 0;
      for (const key in signature) {
        // Weighted difference squared
        distance += Math.pow(signal[key] - signature[key], 2);
      }
      distance = Math.sqrt(distance);

      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = state;
      }
    }
    return bestMatch;
  }

  /**
   * Computes novel awareness metrics based on the integrated signal data.
   * @private
   * @param {object} signal - The validated neuro-cognitive signal.
   * @returns {object} An object containing the new awareness metrics.
   */
  _computeAwarenessMetrics(signal) {
    // Metacognitive Clarity: Awareness of one's own thought processes.
    // High gamma suggests high-level processing, low cortisol suggests clarity over stress.
    const metacognitiveClarity = (signal.gamma * 0.7 + (1 - signal.cortisol) * 0.3);

    // Somatic Presence: Awareness of the body's internal state.
    // High alpha and theta are linked to interoception, low beta reduces external distraction.
    const somaticPresence = ((signal.alpha * 0.4) + (signal.theta * 0.4) + (1 - signal.beta) * 0.2);

    // Temporal Integration: A sense of the smooth flow of time.
    // Balanced dopamine and stable, mid-range alpha waves contribute to this.
    const temporalIntegration = 1 - Math.abs(signal.dopamine - 0.5) * (signal.beta * 0.5);

    return {
      metacognitiveClarity: Math.max(0, Math.min(1, metacognitiveClarity)),
      somaticPresence: Math.max(0, Math.min(1, somaticPresence)),
      temporalIntegration: Math.max(0, Math.min(1, temporalIntegration)),
    };
  }

  /**
   * Processes emotional data, enhancing emotional intelligence metrics.
   * @private
   * @param {object} signal - The validated neuro-cognitive signal.
   * @param {Array<object>} [newEmotions=[]] - New emotional events to introduce.
   * @returns {object} The updated emotional profile.
   */
  _enhanceEmotionalIntelligence(signal, newEmotions = []) {
    try {
      let { activeEmotions, regulationCapacity } = this.currentState.emotionalProfile;

      // 1. Decay existing emotions to simulate regulation
      activeEmotions = activeEmotions
        .map(e => ({ ...e, intensity: e.intensity * EMOTIONAL_INTENSITY_DECAY }))
        .filter(e => e.intensity > 0.05); // Remove trivial emotions

      // 2. Integrate new emotions
      newEmotions.forEach(newEmotion => {
        if (!newEmotion.name || typeof newEmotion.intensity !== 'number') {
          console.warn('Skipping invalid new emotion:', newEmotion);
          return;
        }
        const existing = activeEmotions.find(e => e.name === newEmotion.name);
        if (existing) {
          existing.intensity = Math.min(1, existing.intensity + newEmotion.intensity);
        } else {
          activeEmotions.push({ ...newEmotion, intensity: Math.min(1, newEmotion.intensity) });
        }
      });

      // 3. Calculate advanced EI metrics
      // Affective Complexity: The capacity to hold multiple, distinct emotions.
      const affectiveComplexity = 1 - (1 / (1 + activeEmotions.length * 0.5));

      // Emotional Granularity: Differentiating between emotions. Based on the number of distinct emotion labels.
      const uniqueEmotionNames = new Set(activeEmotions.map(e => e.name.toLowerCase().split(' ')[0]));
      const emotionalGranularity = Math.min(1, uniqueEmotionNames.size / 5); // Normalized to 5 distinct emotions

      // Regulation Capacity: Updated based on cortisol levels. High cortisol degrades regulation.
      regulationCapacity = Math.max(0.1, regulationCapacity * 0.99 + (1 - signal.cortisol) * 0.01);

      return {
        activeEmotions,
        affectiveComplexity: Math.max(0, Math.min(1, affectiveComplexity)),
        emotionalGranularity: Math.max(0, Math.min(1, emotionalGranularity)),
        regulationCapacity: Math.max(0, Math.min(1, regulationCapacity)),
      };
    } catch (error) {
      throw new SignalProcessingError(`Failed during emotional intelligence enhancement: ${error.message}`);
    }
  }

  /**
   * Processes a new snapshot of neuro-cognitive data, updating the entire consciousness state.
   * This is the primary method for feeding data into the stream.
   *
   * @param {object} neuroSignal - The input data object.
   * @param {number} neuroSignal.alpha - Alpha wave amplitude (0-1). Associated with restful states.
   * @param {number} neuroSignal.beta - Beta wave amplitude (0-1). Associated with active thinking.
   * @param {number} neuroSignal.gamma - Gamma wave amplitude (0-1). Associated with high-level processing.
   * @param {number} neuroSignal.theta - Theta wave amplitude (0-1). Associated with deep meditation/creativity.
   * @param {number} neuroSignal.dopamine - Simulated dopamine level (0-1). Reward and motivation.
   * @param {number} neuroSignal.cortisol - Simulated cortisol level (0-1). Stress and alertness.
   * @param {Array<object>} [newEmotions=[]] - An optional array of new emotional events occurring at this moment.
   * @param {string} newEmotions.name - The name of the emotion (e.g., 'Joy', 'Anticipation').
   * @param {number} newEmotions.intensity - The intensity of the emotion (0-1).
   */
  process(neuroSignal, newEmotions = []) {
    try {
      this._validateSignal(neuroSignal);

      const dominantState = this._calculateConsciousnessState(neuroSignal);
      const awarenessMetrics = this._computeAwarenessMetrics(neuroSignal);
      const emotionalProfile = this._enhanceEmotionalIntelligence(neuroSignal, newEmotions);

      this.currentState = {
        dominantState,
        awarenessMetrics,
        emotionalProfile,
        rawSignal: neuroSignal,
        timestamp: new Date().toISOString(),
      };

      this._emit('update', this.currentState);
    } catch (error) {
      // Re-throw internal errors or wrap external ones for consistent API error handling
      if (error instanceof InvalidInputError || error instanceof SignalProcessingError) {
        throw error;
      }
      throw new SignalProcessingError(`An unexpected error occurred during processing: ${error.message}`);
    }
  }

  /**
   * Retrieves the latest, fully analyzed consciousness state.
   * @returns {object} The current state object.
   */
  getCurrentState() {
    return JSON.parse(JSON.stringify(this.currentState)); // Return a deep copy
  }

  /**
   * Registers a callback function to be executed when an event is emitted.
   * @param {string} eventName - The name of the event to listen for (e.g., 'update').
   * @param {Function} callback - The function to execute. It will receive the current state as an argument.
   */
  on(eventName, callback) {
    if (!this._listeners.has(eventName)) {
      this._listeners.set(eventName, []);
    }
    this._listeners.get(eventName).push(callback);
  }

  /**
   * Emits an event, triggering all registered callbacks for that event.
   * @private
   * @param {string} eventName - The name of the event to emit.
   * @param {*} data - The data to pass to the callbacks.
   */
  _emit(eventName, data) {
    if (this._listeners.has(eventName)) {
      this._listeners.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in '${eventName}' event listener:`, error);
        }
      });
    }
  }
}
```
module.exports = SignalProcessingError;
