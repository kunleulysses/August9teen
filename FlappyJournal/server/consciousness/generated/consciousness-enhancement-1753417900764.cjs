```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 1.0.0
 * @description A sophisticated JavaScript module for the simulation and enhancement of
 *              consciousness processing. This module provides a framework for analyzing
 *              cognitive and biometric data to derive advanced metrics related to
 *              consciousness states, awareness, and emotional intelligence.
 *
 * @author AGI Futurist Labs
 * @license MIT
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Base error class for all exceptions thrown by this module.
 */
class CognitiveProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CognitiveProcessingError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Thrown when input data (e.g., a CognitiveSnapshot) is malformed or missing required fields.
 */
class InvalidInputError extends CognitiveProcessingError {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details; // e.g., which field was invalid
  }
}

/**
 * Thrown when processing logic encounters an unstable or paradoxical state.
 */
class UnstableStateError extends CognitiveProcessingError {
  constructor(message) {
    super(message);
    this.name = 'UnstableStateError';
  }
}


// --- Core Constants and Models ---

/**
 * Defines the primary states of consciousness that can be calculated.
 * Inspired by psychological and neuroscientific models of cognitive states.
 * @readonly
 * @enum {string}
 */
const CONSCIOUSNESS_STATES = {
  FOCUSED_FLOW: 'FOCUSED_FLOW', // High engagement, low self-awareness, peak performance
  MINDFUL_PRESENCE: 'MINDFUL_PRESENCE', // Calm, high self-awareness, present-moment focus
  CREATIVE_EXPLORATION: 'CREATIVE_EXPLORATION', // Divergent thinking, associative, high neuro-plasticity
  ROUTINE_AUTOMATION: 'ROUTINE_AUTOMATION', // "Autopilot", low cognitive load, performing known tasks
  DISCONNECTED_DRIFT: 'DISCONNECTED_DRIFT', // Mind-wandering, low external awareness
  DEEP_RECOVERY: 'DEEP_RECOVERY', // Restorative state, memory consolidation, low sensory input
};
module.exports.CONSCIOUSNESS_STATES = CONSCIOUSNESS_STATES;

/**
 * A simplified model of Plutchik's wheel of emotions for analysis.
 * Used to calculate emotional granularity and complexity.
 * @readonly
 */
const EMOTION_VECTORS = {
  JOY: { valence: 0.9, arousal: 0.6 },
  TRUST: { valence: 0.7, arousal: 0.4 },
  FEAR: { valence: -0.8, arousal: 0.8 },
  SURPRISE: { valence: 0.2, arousal: 0.9 },
  SADNESS: { valence: -0.7, arousal: -0.5 },
  DISGUST: { valence: -0.6, arousal: 0.3 },
  ANGER: { valence: -0.5, arousal: 0.8 },
  ANTICIPATION: { valence: 0.4, arousal: 0.7 },
};


/**
 * The core class for processing cognitive data.
 * An instance of CognitiveProcessor represents a single conscious entity or a processing session.
 */
class CognitiveProcessor
 {
  /**
   * Initializes the CognitiveProcessor.
   * @param {object} [config={}] - Optional configuration for the processor.
   * @param {number} [config.neuroplasticity=0.5] - A value from 0 to 1 representing the adaptability of the cognitive model.
   * @param {object} [config.baselineBio] - A baseline biometric reading for calibration (e.g., { heartRate: 70, gsr: 0.5 }).
   */
  constructor(config = {}) {
    this.config = {
      neuroplasticity: 0.5,
      baselineBio: { heartRate: 70, gsr: 0.5 },
      ...config,
    };
    this.cognitiveSnapshot = null;
    this.history = []; // Stores previous states for temporal analysis
  }

  /**
   * Updates the processor with a new set of data for analysis.
   * @param {object} cognitiveSnapshot - The data representing a moment of cognitive activity.
   * @param {object} cognitiveSnapshot.neuroData - Simulated neural activity readings.
   * @param {number} cognitiveSnapshot.neuroData.gamma - Gamma wave activity (focus, peak performance).
   * @param {number} cognitiveSnapshot.neuroData.beta - Beta wave activity (active thinking, arousal).
   * @param {number} cognitiveSnapshot.neuroData.alpha - Alpha wave activity (relaxation, reflection).
   * @param {number} cognitiveSnapshot.neuroData.theta - Theta wave activity (creativity, drowsiness).
   * @param {object} cognitiveSnapshot.bioData - Simulated biometric readings.
   * @param {number} cognitiveSnapshot.bioData.heartRate - Heart rate in BPM.
   * @param {number} cognitiveSnapshot.bioData.hrv - Heart Rate Variability (coherence).
   * @param {number} cognitiveSnapshot.bioData.gsr - Galvanic Skin Response (arousal).
   * @param {object} cognitiveSnapshot.semanticContext - Data about current thoughts or communication.
   * @param {string} cognitiveSnapshot.semanticContext.activeThought - A string representing the current primary thought.
   * @param {number} cognitiveSnapshot.semanticContext.complexity - Linguistic complexity score (0-1).
   * @param {number} cognitiveSnapshot.semanticContext.selfReference - Degree of self-referential thought (0-1).
   * @throws {InvalidInputError} If the cognitiveSnapshot is malformed.
   */
  update(cognitiveSnapshot) {
    this._validateSnapshot(cognitiveSnapshot);
    this.cognitiveSnapshot = cognitiveSnapshot;
    // Maintain a history for temporal analysis, capped at a reasonable length
    if (this.history.length > 50) {
      this.history.shift();
    }
    this.history.push(cognitiveSnapshot);
  }

  /**
   * Performs a full analysis, returning a comprehensive report of the current cognitive state.
   * @returns {object} A full report containing consciousness state, awareness metrics, and emotional intelligence.
   * @throws {UnstableStateError} If no valid state can be determined from the current data.
   */
  runFullAnalysis() {
    if (!this.cognitiveSnapshot) {
      throw new UnstableStateError("Cannot run analysis. Update with a cognitive snapshot first.");
    }

    const consciousnessState = this.calculateConsciousnessState();
    const awarenessMetrics = this.getAwarenessMetrics();
    const emotionalIntelligence = this.getEmotionalIntelligence();

    return {
      timestamp: new Date().toISOString(),
      consciousnessState,
      awarenessMetrics,
      emotionalIntelligence,
    };
  }

  /**
   * Calculates the current predominant state of consciousness.
   * This improved calculation uses a weighted scoring system across multiple data points
   * to provide a more nuanced assessment than simple thresholding.
   * @returns {{state: CONSCIOUSNESS_STATES, confidence: number, details: object}} The calculated state, confidence score, and contributing factors.
   */
  calculateConsciousnessState() {
    const { neuroData, bioData, semanticContext } = this.cognitiveSnapshot;
    const scores = {
      [CONSCIOUSNESS_STATES.FOCUSED_FLOW]: 0,
      [CONSCIOUSNESS_STATES.MINDFUL_PRESENCE]: 0,
      [CONSCIOUSNESS_STATES.CREATIVE_EXPLORATION]: 0,
      [CONSCIOUSNESS_STATES.ROUTINE_AUTOMATION]: 0,
      [CONSCIOUSNESS_STATES.DISCONNECTED_DRIFT]: 0,
      [CONSCIOUSNESS_STATES.DEEP_RECOVERY]: 0,
    };

    // --- Scoring Logic ---
    // FOCUSED_FLOW: High gamma, stable high beta, low alpha, coherent HRV, low self-reference.
    scores[CONSCIOUSNESS_STATES.FOCUSED_FLOW] = (neuroData.gamma * 3 + neuroData.beta * 1.5 - neuroData.alpha * 2 - semanticContext.selfReference * 2 + bioData.hrv * 1.5);

    // MINDFUL_PRESENCE: High alpha, low beta, very low gamma, high HRV, moderate self-reference.
    scores[CONSCIOUSNESS_STATES.MINDFUL_PRESENCE] = (neuroData.alpha * 3 - neuroData.beta * 2 - neuroData.gamma + bioData.hrv * 2 + semanticContext.selfReference);

    // CREATIVE_EXPLORATION: High theta and alpha, moderate beta, high semantic complexity.
    scores[CONSCIOUSNESS_STATES.CREATIVE_EXPLORATION] = (neuroData.theta * 3 + neuroData.alpha * 1.5 + neuroData.beta + semanticContext.complexity * 2);

    // ROUTINE_AUTOMATION: Dominant beta, low other bands, low semantic complexity, low HRV.
    scores[CONSCIOUSNESS_STATES.ROUTINE_AUTOMATION] = (neuroData.beta * 2 - neuroData.gamma - neuroData.theta - semanticContext.complexity * 2 - bioData.hrv);
    
    // DISCONNECTED_DRIFT: High theta, low beta, high self-reference, low semantic complexity.
    scores[CONSCIOUSNESS_STATES.DISCONNECTED_DRIFT] = (neuroData.theta * 2 + neuroData.alpha - neuroData.beta * 2 + semanticContext.selfReference * 1.5 - semanticContext.complexity);

    // DEEP_RECOVERY: Very low frequency waves (implicit), very low arousal (HR, GSR), near-zero complexity.
    const arousal = (bioData.heartRate / this.config.baselineBio.heartRate + bioData.gsr / this.config.baselineBio.gsr) / 2;
    scores[CONSCIOUSNESS_STATES.DEEP_RECOVERY] = (5 - arousal * 5 - (neuroData.beta + neuroData.gamma) * 2);

    // Determine the winning state
    let maxScore = -Infinity;
    let dominantState = null;
    let totalScore = 0;

    for (const state in scores) {
      if (scores[state] > maxScore) {
        maxScore = scores[state];
        dominantState = state;
      }
      totalScore += Math.max(0, scores[state]); // Sum of non-negative scores for confidence calculation
    }

    if (dominantState === null || totalScore === 0) {
      throw new UnstableStateError("Cognitive state is paradoxical or indeterminate.");
    }

    const confidence = Math.min(1, Math.max(0, maxScore / totalScore));

    return {
      state: dominantState,
      confidence: parseFloat(confidence.toFixed(4)),
      details: scores,
    };
  }

  /**
   * Computes a set of novel awareness metrics, providing a multi-dimensional view of awareness.
   * @returns {object} An object containing different facets of awareness, each scored from 0 to 1.
   */
  getAwarenessMetrics() {
    const { neuroData, semanticContext, bioData } = this.cognitiveSnapshot;

    // Metacognitive Awareness: The ability to observe one's own thoughts.
    // High when self-reference is high but complexity is also high (indicating analysis, not just rumination).
    const metacognitiveAwareness = semanticContext.selfReference * semanticContext.complexity * (neuroData.beta / (neuroData.theta + 0.1));

    // Somatic Awareness: The connection to and awareness of the body's state.
    // High when HRV is high, indicating a regulated nervous system.
    const somaticAwareness = bioData.hrv;

    // Environmental Awareness: How much attention is paid to the external world.
    // Inversely related to self-reference and alpha/theta waves (internal focus).
    const environmentalAwareness = 1 - (semanticContext.selfReference * 0.5 + (neuroData.alpha + neuroData.theta) * 0.25);
    
    // Temporal Awareness: The perception of the flow of time.
    // Calculated by consistency in processing loops (simulated via HRV and beta wave stability).
    const betaHistory = this.history.map(h => h.neuroData.beta);
    const betaStdDev = this._calculateStdDev(betaHistory);
    const temporalAwareness = Math.max(0, 1 - (betaStdDev * 2)) * bioData.hrv;

    return {
      metacognitive: parseFloat(this._normalize(metacognitiveAwareness).toFixed(4)),
      somatic: parseFloat(this._normalize(somaticAwareness).toFixed(4)),
      environmental: parseFloat(this._normalize(environmentalAwareness).toFixed(4)),
      temporal: parseFloat(this._normalize(temporalAwareness).toFixed(4)),
    };
  }

  /**
   * Performs an advanced analysis of the current emotional state.
   * @returns {object} A detailed breakdown of emotional intelligence metrics.
   * @returns {string} object.primaryEmotion - The most dominant emotion detected.
   * @returns {number} object.intensity - The intensity of the primary emotion (0-1).
   * @returns {number} object.emotionalGranularity - A score (0-1) for the ability to differentiate nuanced emotions.
   * @returns {object} object.affect - The raw valence (positivity/negativity) and arousal (energy).
   */
  getEmotionalIntelligence() {
    const { bioData, semanticContext } = this.cognitiveSnapshot;

    // 1. Calculate Valence and Arousal (the core of affect)
    const valence = (semanticContext.complexity - 0.5) * 2 * (1 - semanticContext.selfReference); // Positive thoughts are often more complex and less self-ruminating
    const arousal = (bioData.gsr / (this.config.baselineBio.gsr * 2)) + (bioData.heartRate / (this.config.baselineBio.heartRate * 2));
    
    // 2. Find the closest primary emotion vector
    let closestEmotion = 'NEUTRAL';
    let minDistance = Infinity;

    for (const [emotion, vector] of Object.entries(EMOTION_VECTORS)) {
        const distance = Math.sqrt(Math.pow(valence - vector.valence, 2) + Math.pow(arousal - vector.arousal, 2));
        if (distance < minDistance) {
            minDistance = distance;
            closestEmotion = emotion;
        }
    }

    // 3. Calculate Intensity and Granularity
    const intensity = Math.sqrt(Math.pow(valence, 2) + Math.pow(arousal, 2));
    // Granularity is higher when the identified emotion is a good fit (low distance) and overall cognitive complexity is high.
    const emotionalGranularity = (1 - Math.min(1, minDistance)) * semanticContext.complexity;

    return {
      primaryEmotion: closestEmotion,
      intensity: parseFloat(this._normalize(intensity).toFixed(4)),
      emotionalGranularity: parseFloat(this._normalize(emotionalGranularity).toFixed(4)),
      affect: {
        valence: parseFloat(valence.toFixed(4)),
        arousal: parseFloat(this._normalize(arousal).toFixed(4)),
      },
    };
  }

  // --- Private Helper Methods ---

  /**
   * Validates the structure and types of the cognitive snapshot object.
   * @private
   * @param {object} snapshot - The cognitive snapshot to validate.
   * @throws {InvalidInputError}
   */
  _validateSnapshot(snapshot) {
    const required = {
      neuroData: ['gamma', 'beta', 'alpha', 'theta'],
      bioData: ['heartRate', 'hrv', 'gsr'],
      semanticContext: ['activeThought', 'complexity', 'selfReference'],
    };

    for (const key in required) {
      if (!snapshot[key]) {
        throw new InvalidInputError(`Missing required top-level key: '${key}'`, { missing: key });
      }
      if (typeof snapshot[key] !== 'object' || snapshot[key] === null) {
         throw new InvalidInputError(`Key '${key}' must be an object.`, { key });
      }
      for (const subKey of required[key]) {
        if (snapshot[key][subKey] === undefined) {
          throw new InvalidInputError(`Missing required sub-key: '${key}.${subKey}'`, { missing: `${key}.${subKey}` });
        }
        if (typeof snapshot[key][subKey] !== (subKey === 'activeThought' ? 'string' : 'number')) {
          throw new InvalidInputError(`Invalid type for '${key}.${subKey}'. Expected ${subKey === 'activeThought' ? 'string' : 'number'}.`, { key: `${key}.${subKey}` });
        }
      }
    }
  }

  /**
   * Normalizes a value to a 0-1 range with soft clamping.
   * @private
   */
  _normalize(value) {
    return Math.max(0, Math.min(1, value));
  }

  /**
   * Calculates the standard deviation of an array of numbers.
   * @private
   */
  _calculateStdDev(arr) {
    if (arr.length < 2) return 0;
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }
}

// Default export the main class for ease of use.
module.exports = CognitiveProcessor;
```
module.exports = for;
