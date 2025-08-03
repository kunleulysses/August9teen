```javascript
/**
 * @module ConsciousnessMatrix
 * @description A JavaScript module for advanced processing of simulated consciousness,
 * awareness, and emotional intelligence. This module provides a framework for
 * quantifying and manipulating abstract psychological constructs in a computational context.
 * It is designed for use in advanced AI, character simulation, and theoretical modeling.
 *
 * @version 1.0.0
 * @author A.I. Architect
 * @license MIT
 */

/**
 * @typedef {object} VADState
 * @description Represents an emotional state using the Valence-Arousal-Dominance model.
 * All values range from -1.0 to 1.0.
 * @property {number} valence - The pleasure/displeasure dimension of emotion. (1: happy, -1: unhappy)
 * @property {number} arousal - The intensity or energy level of the emotion. (1: agitated, -1: calm)
 * @property {number} dominance - The sense of control over the situation. (1: in control, -1: controlled)
 */

/**
 * @typedef {object} CognitiveInput
 * @description Represents a stream of cognitive data.
 * @property {string} id - A unique identifier for the input stream.
 * @property {number} attention - The level of attention allocated to this stream (0.0 to 1.0).
 * @property {number} complexity - The perceived complexity of the information (0.0 to 1.0).
 * @property {object} data - The raw data associated with the stream.
 */

/**
 * @typedef {object} SensoryInput
 * @description Represents raw sensory data.
 * @property {number} signal - The primary signal strength (0.0 to 1.0).
 * @property {number} noise - The level of background noise or interference (0.0 to 1.0).
 */

/**
 * @typedef {object} SystemMetrics
 * @description Represents the "somatic" state of the system running the simulation.
 * @property {number} cpuLoad - CPU utilization (0.0 to 1.0).
 * @property {number} memoryUsage - Memory usage (0.0 to 1.0).
 * @property {number} networkLatency - Network latency in ms.
 */

/**
 * @typedef {object} ConsciousnessState
 * @description The calculated overall state of consciousness.
 * @property {number} level - The overall level of consciousness (0.0 to 1.0). (0: unconscious, 1: hyper-aware)
 * @property {number} focus - The ability to concentrate attention (0.0 to 1.0).
 * @property {number} clarity - The distinctness and lucidity of the conscious experience (0.0 to 1.0).
 * @property {number} integration - The seamless binding of different data streams (cognitive, emotional) (0.0 to 1.0).
 */

/**
 * @typedef {object} AwarenessMetrics
 * @description A detailed breakdown of different facets of awareness.
 * @property {number} selfAwareness - The ability to introspect and model one's own internal state (0.0 to 1.0).
 * @property {number} situationalAwareness - The ability to perceive and understand the external environment (0.0 to 1.0).
 * @property {number} somaticAwareness - The awareness of the system's own "physical" state (0.0 to 1.0).
 * @property {number} temporalAwareness - The perception of the flow of time and one's place within it (0.0 to 1.0).
 */

/**
 * Custom error class for consciousness processing failures.
 */
class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
  }
}

/**
 * Defines the weighting for different components in consciousness calculation.
 * Tuning these values can create different "personality" profiles.
 * @const {object}
 */
const CONSCIOUSNESS_WEIGHTS = {
  FOCUS: 0.4,
  CLARITY: 0.3,
  INTEGRATION: 0.3,
};

/**
 * The core class for managing and processing the consciousness matrix.
 */
export class ConsciousnessMatrix {
  /**
   * Initializes the ConsciousnessMatrix.
   * @param {object} [initialState={}] - Optional initial state configuration.
   * @param {VADState} [initialState.emotionalState] - The starting emotional state.
   * @param {CognitiveInput[]} [initialState.cognitiveStreams] - Initial cognitive inputs.
   * @param {SensoryInput} [initialState.sensoryInput] - Initial sensory data.
   * @param {SystemMetrics} [initialState.systemMetrics] - Initial system metrics.
   */
  constructor(initialState = {}) {
    this.state = {
      emotionalState: initialState.emotionalState || { valence: 0.0, arousal: 0.0, dominance: 0.0 },
      cognitiveStreams: initialState.cognitiveStreams || [],
      sensoryInput: initialState.sensoryInput || { signal: 0.5, noise: 0.1 },
      systemMetrics: initialState.systemMetrics || { cpuLoad: 0.1, memoryUsage: 0.2, networkLatency: 20 },
    };

    // History is crucial for temporal and self-awareness calculations.
    this.history = {
      emotionalStates: [this.state.emotionalState],
      consciousnessLevels: [],
    };
    
    this.MAX_HISTORY_LENGTH = 100;
  }

  /**
   * Updates the matrix with new data, simulating the passage of a "moment".
   * @param {object} newData - The new data to process.
   * @param {VADState} [newData.emotionalState] - A new or modified emotional state.
   * @param {CognitiveInput[]} [newData.cognitiveStreams] - New or updated cognitive streams.
   * @param {SensoryInput} [newData.sensoryInput] - New sensory data.
   * @param {SystemMetrics} [newData.systemMetrics] - Updated system metrics.
   * @throws {ConsciousnessProcessingError} If newData is not a valid object.
   */
  updateState(newData) {
    if (typeof newData !== 'object' || newData === null) {
      throw new ConsciousnessProcessingError('Invalid input: newData must be an object.');
    }

    // Deep merge would be better in a real library, but this is sufficient.
    this.state = {
      ...this.state,
      ...newData,
    };
    
    // Update history
    if (newData.emotionalState) {
        this.history.emotionalStates.push(newData.emotionalState);
        if (this.history.emotionalStates.length > this.MAX_HISTORY_LENGTH) {
            this.history.emotionalStates.shift();
        }
    }
  }

  /**
   * Calculates the current, holistic consciousness state.
   * @returns {ConsciousnessState} The calculated state of consciousness.
   */
  calculateConsciousnessState() {
    const focus = this._calculateFocus();
    const clarity = this._calculateClarity();
    const integration = this._calculateIntegration();

    const level = 
      focus * CONSCIOUSNESS_WEIGHTS.FOCUS +
      clarity * CONSCIOUSNESS_WEIGHTS.CLARITY +
      integration * CONSCIOUSNESS_WEIGHTS.INTEGRATION;

    const consciousnessState = {
      level: Math.max(0, Math.min(1, level)), // Clamp between 0 and 1
      focus,
      clarity,
      integration,
    };
    
    // Update history
    this.history.consciousnessLevels.push(consciousnessState.level);
    if (this.history.consciousnessLevels.length > this.MAX_HISTORY_LENGTH) {
        this.history.consciousnessLevels.shift();
    }
    
    return consciousnessState;
  }
  
  /**
   * Calculates a set of advanced awareness metrics based on the current state.
   * @returns {AwarenessMetrics} The calculated awareness metrics.
   */
  getAwarenessMetrics() {
    return {
      selfAwareness: this._calculateSelfAwareness(),
      situationalAwareness: this._calculateSituationalAwareness(),
      somaticAwareness: this._calculateSomaticAwareness(),
      temporalAwareness: this._calculateTemporalAwareness(),
    };
  }
  
  /**
   * Provides a suite of functions for processing emotional intelligence.
   * @returns {{
   *   recognizeEmotion: (function(object): VADState),
   *   regulateEmotion: (function(number): VADState),
   *   empathize: (function(VADState, number=): VADState)
   * }} An object with EI functions.
   */
  emotionalIntelligenceProcessor() {
    return {
      /**
       * Maps a conceptual input to a VAD emotional state.
       * A placeholder for a more complex model (e.g., NLP sentiment analysis).
       * @param {{sentiment: number, intensity: number, control: number}} input - Abstract emotional input.
       * @returns {VADState} The recognized VAD state.
       */
      recognizeEmotion: (input) => {
        if (!input || typeof input.sentiment === 'undefined' || typeof input.intensity === 'undefined' || typeof input.control === 'undefined') {
          throw new ConsciousnessProcessingError('Invalid input for emotion recognition.');
        }
        const newState = {
          valence: input.sentiment, // e.g., -1 to 1 from sentiment analysis
          arousal: input.intensity, // e.g., 0 to 1 from text energy
          dominance: input.control, // e.g., -1 to 1 based on perceived agency
        };
        this.updateState({ emotionalState: newState });
        return newState;
      },
      
      /**
       * Simulates emotional regulation by dampening or amplifying the current emotional state.
       * @param {number} regulationFactor - The factor to apply. > 1 amplifies, < 1 dampens.
       * @returns {VADState} The new, regulated emotional state.
       */
      regulateEmotion: (regulationFactor) => {
        if (typeof regulationFactor !== 'number' || regulationFactor < 0) {
            throw new ConsciousnessProcessingError('Regulation factor must be a non-negative number.');
        }
        const { valence, arousal, dominance } = this.state.emotionalState;
        const newState = {
          valence: valence * regulationFactor,
          arousal: arousal * regulationFactor,
          dominance: dominance, // Dominance is often less volatile
        };
        // Clamp values to the valid range [-1, 1]
        for (const key in newState) {
            newState[key] = Math.max(-1, Math.min(1, newState[key]));
        }
        this.updateState({ emotionalState: newState });
        return newState;
      },
      
      /**
       * Simulates an empathetic response by shifting one's own emotional state towards another's.
       * @param {VADState} otherEmotionalState - The emotional state of the other agent.
       * @param {number} [empathyFactor=0.5] - How strongly to empathize (0.0 to 1.0).
       * @returns {VADState} The new, empathetic emotional state.
       */
      empathize: (otherEmotionalState, empathyFactor = 0.5) => {
        if (!otherEmotionalState || typeof otherEmotionalState.valence === 'undefined') {
            throw new ConsciousnessProcessingError('Invalid otherEmotionalState provided for empathy.');
        }
        if (empathyFactor < 0 || empathyFactor > 1) {
            throw new ConsciousnessProcessingError('Empathy factor must be between 0 and 1.');
        }
        const own = this.state.emotionalState;
        const other = otherEmotionalState;
        
        const newState = {
          valence: own.valence * (1 - empathyFactor) + other.valence * empathyFactor,
          arousal: own.arousal * (1 - empathyFactor) + other.arousal * empathyFactor,
          dominance: own.dominance * (1 - empathyFactor) + other.dominance * empathyFactor,
        };
        this.updateState({ emotionalState: newState });
        return newState;
      }
    };
  }

  // --- Private Helper Methods for Calculations ---

  /** @private */
  _calculateFocus() {
    const streams = this.state.cognitiveStreams;
    if (streams.length === 0) return 1.0; // Perfect focus if there's nothing to be distracted by.
    
    const totalAttention = streams.reduce((sum, s) => sum + s.attention, 0);
    if (totalAttention === 0) return 0.0;
    
    // Using entropy as a measure of focus. High entropy = low focus (attention is spread out).
    let entropy = 0;
    streams.forEach(stream => {
      if (stream.attention > 0) {
        const p = stream.attention / totalAttention;
        entropy -= p * Math.log2(p);
      }
    });
    
    const maxEntropy = Math.log2(streams.length) || 1;
    return 1 - (entropy / maxEntropy);
  }

  /** @private */
  _calculateClarity() {
    const { signal, noise } = this.state.sensoryInput;
    if (signal + noise === 0) return 1.0;
    // Clarity is the signal-to-noise ratio, normalized.
    return signal / (signal + noise);
  }

  /** @private */
  _calculateIntegration() {
    // Measures how well the emotional state aligns with the cognitive load.
    // High arousal should correlate with high complexity/attention.
    // This is a heuristic model.
    const streams = this.state.cognitiveStreams;
    const { arousal } = this.state.emotionalState;
    
    if (streams.length === 0) return 1.0;

    const avgComplexity = streams.reduce((sum, s) => sum + s.complexity, 0) / streams.length;
    const totalAttention = streams.reduce((sum, s) => sum + s.attention, 0);

    // Cognitive load is a function of complexity and attention.
    const cognitiveLoad = avgComplexity * totalAttention;
    
    // Emotional intensity is the absolute value of arousal.
    const emotionalIntensity = Math.abs(arousal);

    // Integration is high when load and intensity are aligned.
    // 1 minus the absolute difference.
    return 1.0 - Math.abs(cognitiveLoad - emotionalIntensity);
  }

  /** @private */
  _calculateSelfAwareness() {
    // Self-awareness is modeled as emotional stability and predictability.
    // High variance in recent emotional states suggests low self-awareness.
    const history = this.history.emotionalStates;
    if (history.length < 5) return 0.5; // Not enough data for a meaningful calculation.

    const recentHistory = history.slice(-5);
    const avgValence = recentHistory.reduce((sum, s) => sum + s.valence, 0) / recentHistory.length;
    const avgArousal = recentHistory.reduce((sum, s) => sum + s.arousal, 0) / recentHistory.length;

    const variance = recentHistory.reduce((sum, s) => {
      return sum + Math.pow(s.valence - avgValence, 2) + Math.pow(s.arousal - avgArousal, 2);
    }, 0) / recentHistory.length;
    
    // Inverse relationship: higher variance means lower self-awareness.
    // The scaling factor (e.g., 2.0) is for tuning.
    return Math.max(0, 1.0 - variance * 2.0);
  }

  /** @private */
  _calculateSituationalAwareness() {
    // A simplified model: awareness is proportional to attention on high-complexity tasks.
    const streams = this.state.cognitiveStreams;
    if (streams.length === 0) return 0.0;
    
    const weightedAwareness = streams.reduce((sum, s) => {
      // More awareness from paying attention to complex things.
      return sum + (s.attention * s.complexity);
    }, 0);
    
    const totalAttention = streams.reduce((sum, s) => sum + s.attention, 0);
    if (totalAttention === 0) return 0.0;
    
    return weightedAwareness / totalAttention;
  }

  /** @private */
  _calculateSomaticAwareness() {
    // Awareness of the system's "body". High/erratic load reduces awareness.
    const { cpuLoad, memoryUsage } = this.state.systemMetrics;
    const stress = (cpuLoad + memoryUsage) / 2; // Average system stress
    // Inversely related to stress. Calm system = high somatic awareness.
    return 1.0 - stress;
  }

  /** @private */
  _calculateTemporalAwareness() {
    // Compares short-term consciousness level vs long-term average.
    // High awareness if current state is significantly different from the norm (change detection).
    const history = this.history.consciousnessLevels;
    if (history.length < 10) return 0.5; // Not enough data.
    
    const longTermAvg = history.reduce((sum, level) => sum + level, 0) / history.length;
    const shortTermAvg = history.slice(-5).reduce((sum, level) => sum + level, 0) / 5;
    
    // The awareness is the magnitude of change, scaled.
    // A factor of 2.0 makes the changes more pronounced.
    return Math.min(1.0, Math.abs(shortTermAvg - longTermAvg) * 2.0);
  }
}
```