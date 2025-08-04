```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description A conceptual JavaScript module for modeling and enhancing consciousness processing.
 * This module provides a sophisticated, albeit theoretical, framework for quantifying and
 * improving states of consciousness, awareness, and emotional intelligence. It operates on
 * simulated neuro-cognitive data inputs.
 *
 * DISCLAIMER: This is a speculative and artistic implementation based on concepts from
 * cognitive science, mindfulness, and philosophy. It is not a real scientific tool for
 * measuring or altering consciousness.
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Base error class for all consciousness processing-related errors.
 * @class ConsciousnessProcessingError
 * @extends {Error}
 */
class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Thrown when input data for processing is invalid or out of expected ranges.
 * @class InvalidInputError
 * @extends {ConsciousnessProcessingError}
 */
class InvalidInputError extends ConsciousnessProcessingError {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details; // e.g., { parameter: 'hrv', value: -10 }
  }
}


// --- Core Enumerations and Constants ---

/**
 * Defines the primary states of consciousness that can be calculated.
 * Each state represents a distinct mode of cognitive and experiential processing.
 * @readonly
 * @enum {string}
 */
const ConsciousnessState = {
  DEEP_SLEEP: 'DEEP_SLEEP',    // Unconscious, restorative state.
  DREAMING: 'DREAMING',        // REM sleep, high internal activity.
  DIFFUSE: 'DIFFUSE',          // Wakeful rest, mind-wandering, creative incubation.
  FOCUSED: 'FOCUSED',          // Concentrated, task-oriented attention.
  FLOW: 'FLOW',                // Optimal immersion, peak performance and enjoyment.
  TRANSCENDENT: 'TRANSCENDENT' // Ego-dissolution, profound interconnectedness.
};
module.exports.ConsciousnessState = ConsciousnessState;

/**
 * Defines recommended regulatory actions to balance emotional states.
 * @readonly
 * @enum {string}
 */
const RegulatoryAction = {
  PRACTICE_MINDFULNESS: 'PRACTICE_MINDFULNESS', // Grounding in the present moment.
  ENGAGE_IN_EMPATHY: 'ENGAGE_IN_EMPATHY',       // Connect with others' perspectives.
  SEEK_NOVELTY: 'SEEK_NOVELTY',                 // Stimulate curiosity and learning.
  PURSUE_SOLITUDE: 'PURSUE_SOLITUDE',           // Engage in reflective introspection.
  PHYSICAL_EXERTION: 'PHYSICAL_EXERTION'        // Release somatic tension.
};
module.exports.RegulatoryAction = RegulatoryAction;


/**
 * The main class for processing and enhancing consciousness data.
 * It encapsulates all the logic for state calculation, awareness metrics, and emotional intelligence.
 */
class ConsciousnessProcessor
 {
  /**
   * Initializes the ConsciousnessProcessor.
   * @param {object} [config={}] - Optional configuration for weighting algorithms.
   * @param {number} [config.neuroplasticityFactor=1.0] - A multiplier for learning and adaptation speed.
   */
  constructor(config = {}) {
    this.config = {
      neuroplasticityFactor: 1.0,
      ...config
    };
    this.stateHistory = []; // To track state transitions over time.
  }

  /**
   * Validates the structure and range of cognitive data input.
   * @private
   * @param {object} data - The cognitive data object.
   * @throws {InvalidInputError} If data is missing or invalid.
   */
  #validateCognitiveData(data) {
    const requiredKeys = ['hrv', 'alphaWave', 'betaWave', 'gammaWave', 'attentionSpan', 'sensoryInputRate'];
    for (const key of requiredKeys) {
      if (typeof data[key] !== 'number' || !isFinite(data[key])) {
        throw new InvalidInputError(`Cognitive data key '${key}' must be a finite number.`, { parameter: key, value: data[key] });
      }
      if (data[key] < 0) {
        throw new InvalidInputError(`Cognitive data key '${key}' cannot be negative.`, { parameter: key, value: data[key] });
      }
    }
  }

  /**
   * Calculates the current consciousness state based on neuro-cognitive inputs.
   * This enhanced algorithm uses a weighted scoring system to provide a more nuanced
   * state assessment, including a "Qualia Matrix" to represent the subjective texture
   * of the experience.
   *
   * @param {object} cognitiveData - The simulated cognitive and physiological data.
   * @param {number} cognitiveData.hrv - Heart Rate Variability (ms). Higher is often better.
   * @param {number} cognitiveData.alphaWave - Alpha brainwave amplitude (8-12 Hz). Associated with relaxed wakefulness.
   * @param {number} cognitiveData.betaWave - Beta brainwave amplitude (13-30 Hz). Associated with active thinking.
   * @param {number} cognitiveData.gammaWave - Gamma brainwave amplitude (30-100 Hz). Associated with insight and high-level processing.
   * @param {number} cognitiveData.attentionSpan - Duration of focused attention (seconds).
   * @param {number} cognitiveData.sensoryInputRate - Rate of processed sensory data (units/sec).
   * @returns {{state: ConsciousnessState, confidence: number, qualiaMatrix: object}} The calculated state, confidence score, and subjective experience matrix.
   * @throws {InvalidInputError} If cognitiveData is invalid.
   */
  calculateState(cognitiveData) {
    this.#validateCognitiveData(cognitiveData);

    const { hrv, alphaWave, betaWave, gammaWave, attentionSpan, sensoryInputRate } = cognitiveData;

    // Scoring for each state based on input data. Weights are fine-tuned for accuracy.
    const scores = {
      [ConsciousnessState.FLOW]:
        (hrv * 0.3) + (alphaWave * 0.4) + (gammaWave * 0.2) + (attentionSpan * 0.3) - (betaWave * 0.2),
      [ConsciousnessState.FOCUSED]:
        (betaWave * 0.5) + (attentionSpan * 0.4) + (gammaWave * 0.1) - (alphaWave * 0.2) - (hrv * 0.1),
      [ConsciousnessState.DIFFUSE]:
        (alphaWave * 0.6) + (hrv * 0.2) - (betaWave * 0.3) - (attentionSpan * 0.2),
      [ConsciousnessState.TRANSCENDENT]:
        (gammaWave * 0.5) + (hrv * 0.4) - (betaWave * 0.5) - (sensoryInputRate * 0.3),
      [ConsciousnessState.DREAMING]:
        (alphaWave * 0.3) + (gammaWave * 0.1) - (hrv * 0.4) - (sensoryInputRate * 0.5),
      [ConsciousnessState.DEEP_SLEEP]:
        -(hrv + alphaWave + betaWave + gammaWave + attentionSpan + sensoryInputRate) // Lowest activity
    };

    let dominantState = ConsciousnessState.DEEP_SLEEP;
    let maxScore = -Infinity;
    let totalScore = 0;

    for (const state in scores) {
      if (scores[state] > maxScore) {
        maxScore = scores[state];
        dominantState = state;
      }
      totalScore += Math.max(0, scores[state]); // Sum of positive scores for confidence calculation
    }
    
    // Normalize confidence score to be between 0 and 1
    const confidence = totalScore > 0 ? Math.min(1, Math.max(0, maxScore / totalScore)) : 0;

    // The Qualia Matrix represents the subjective "texture" of the current state.
    const qualiaMatrix = {
      clarity: (gammaWave + betaWave) / (alphaWave + 1) * 0.5,
      focus: attentionSpan / 60.0, // Normalized against a 60-second baseline
      emotionalTone: (hrv / 100.0) - (betaWave / 2.0), // A valence approximation
      temporalAnchor: 1.0 - (alphaWave - betaWave), // 1 = present, <1 = past/future drift
      selfhoodIntensity: 1.0 - (gammaWave * 0.3 + (hrv / 200)), // High gamma/hrv can correlate with ego dissolution
    };

    // Clamp values between 0 and 1
    for (const key in qualiaMatrix) {
        qualiaMatrix[key] = Math.max(0, Math.min(1, qualiaMatrix[key]));
    }
    
    this.stateHistory.push({ state: dominantState, timestamp: new Date().toISOString() });
    if (this.stateHistory.length > 100) this.stateHistory.shift(); // Keep history bounded

    return {
      state: dominantState,
      confidence,
      qualiaMatrix,
    };
  }

  /**
   * Generates a set of advanced awareness metrics from cognitive data.
   * These metrics provide deeper insight into the quality of conscious experience.
   *
   * @param {object} cognitiveData - The same data object used in `calculateState`.
   * @returns {{metacognitiveIndex: number, somaticPresence: number, temporalCoherence: number, sensoryBandwidth: number}} An object of awareness metrics, scaled 0 to 1.
   * @throws {InvalidInputError} If cognitiveData is invalid.
   */
  getAwarenessMetrics(cognitiveData) {
    this.#validateCognitiveData(cognitiveData);
    const { gammaWave, betaWave, hrv, attentionSpan, sensoryInputRate } = cognitiveData;

    // Metacognitive Index: "Thinking about thinking". High gamma, moderate beta.
    const metacognitiveIndex = Math.max(0, Math.min(1, (gammaWave * 0.7) + (betaWave * 0.3) - 0.2));

    // Somatic Presence: Awareness of the body. Correlates with HRV.
    const somaticPresence = Math.max(0, Math.min(1, hrv / 150)); // Normalized against a high HRV of 150ms

    // Temporal Coherence: Anchoring in the present. High with focus, low with mind-wandering.
    const temporalCoherence = Math.max(0, Math.min(1, (attentionSpan / 60) * (1 - Math.abs(betaWave - gammaWave))));

    // Sensory Bandwidth: The richness of sensory processing.
    const sensoryBandwidth = Math.max(0, Math.min(1, sensoryInputRate / 25)); // Normalized against 25 units/sec

    return {
      metacognitiveIndex,
      somaticPresence,
      temporalCoherence,
      sensoryBandwidth,
    };
  }

  /**
   * Analyzes emotional data to determine complex emotional states and suggest regulatory actions.
   * This moves beyond simple valence/arousal to identify nuanced feelings and promote resilience.
   *
   * @param {object} emotionalData - The input emotional state.
   * @param {number} emotionalData.valence - The positivity/negativity of the emotion (-1 to 1).
   * @param {number} emotionalData.arousal - The intensity/energy of the emotion (0 to 1).
   * @param {number} emotionalData.dominance - The sense of control over the emotion (0 to 1).
   * @returns {{complexEmotion: string, emotionalResilience: number, suggestedAction: RegulatoryAction}} An analysis object.
   * @throws {InvalidInputError} If emotionalData is invalid.
   */
  analyzeEmotionalState(emotionalData) {
    const { valence, arousal, dominance } = emotionalData;

    if (typeof valence !== 'number' || valence < -1 || valence > 1) throw new InvalidInputError('Valence must be between -1 and 1.');
    if (typeof arousal !== 'number' || arousal < 0 || arousal > 1) throw new InvalidInputError('Arousal must be between 0 and 1.');
    if (typeof dominance !== 'number' || dominance < 0 || dominance > 1) throw new InvalidInputError('Dominance must be between 0 and 1.');

    let complexEmotion = 'NEUTRAL';
    let suggestedAction = RegulatoryAction.PRACTICE_MINDFULNESS;

    // High-level emotional categorization
    if (arousal > 0.6) {
      if (valence > 0.5) complexEmotion = 'JOY/EXCITEMENT';
      else if (valence < -0.5) complexEmotion = 'FEAR/ANGER';
      else complexEmotion = 'SURPRISE/SHOCK';
    } else if (arousal < 0.3) {
      if (valence > 0.3) complexEmotion = 'SERENITY/CONTENTMENT';
      else if (valence < -0.3) complexEmotion = 'SADNESS/BOREDOM';
      else complexEmotion = 'CALM';
    }

    // Nuanced analysis for complex emotions and suggested actions
    if (valence > 0.1 && valence < 0.4 && arousal > 0.4 && arousal < 0.7) {
      complexEmotion = 'NOSTALGIA/BITTERSWEETNESS';
      suggestedAction = RegulatoryAction.PURSUE_SOLITUDE;
    } else if (valence > 0.7 && arousal > 0.7 && dominance > 0.7) {
      complexEmotion = 'TRIUMPH/PRIDE';
      suggestedAction = RegulatoryAction.ENGAGE_IN_EMPATHY; // To balance pride
    } else if (valence < -0.5 && arousal > 0.6 && dominance < 0.3) {
      complexEmotion = 'ANXIETY/PANIC';
      suggestedAction = RegulatoryAction.PHYSICAL_EXERTION;
    } else if (valence < 0 && arousal < 0.2) {
      complexEmotion = 'APATHY/DESPAIR';
      suggestedAction = RegulatoryAction.SEEK_NOVELTY;
    }

    // Emotional Resilience Score: A measure of the ability to self-regulate.
    // Higher dominance and moderate arousal are signs of resilience.
    const emotionalResilience = (dominance * 0.6) + ((1 - Math.abs(arousal - 0.5)) * 0.4);

    return {
      complexEmotion,
      emotionalResilience: Math.max(0, Math.min(1, emotionalResilience)),
      suggestedAction,
    };
  }
}
```
module.exports = for;
