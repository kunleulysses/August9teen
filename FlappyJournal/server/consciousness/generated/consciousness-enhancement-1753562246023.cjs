```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description A sophisticated JavaScript module for the advanced processing, analysis,
 * and enhancement of consciousness-related data streams. This module introduces
 * innovative models for calculating consciousness states, awareness metrics, and
 * emotional intelligence, designed for integration into next-generation neuro-interfaces
 * and digital wellness platforms.
 *
 * It operates on simulated neuro-physiological data, providing a framework for
 * understanding and potentially augmenting cognitive and emotional functions.
 */

// --- Custom Error Types for Robust Handling ---

/**
 * @class
 * @classdesc Custom error for invalid or malformed input data.
 * @extends Error
 */
class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidInputError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @class
 * @classdesc Custom error for failures during consciousness processing calculations.
 * @extends Error
 */
class ProcessingError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ProcessingError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// --- Core Consciousness Processing Module ---

class ConsciousnessEnhancer
 {
  /**
   * Initializes the ConsciousnessEnhancer with customizable processing parameters.
   * @param {object} [config={}] - Configuration object for tuning the enhancement algorithms.
   * @param {object} [config.weights] - Weights for consciousness state calculation.
   * @param {number} [config.weights.cognitiveFocus=1.5] - Importance of focused cognitive activity.
   * @param {number} [config.weights.sensoryClarity=1.2] - Importance of clear, non-distorted sensory input.
   * @param {number} [config.weights.emotionalCoherence=1.8] - Importance of aligned emotional and cognitive states.
   * @param {number} [config.weights.somaticGrounding=1.0] - Importance of body awareness.
   * @param {number} [config.neuroplasticityFactor=0.95] - A factor representing the brain's adaptability, affecting state transitions.
   */
  constructor(config = {}) {
    this.config = {
      weights: {
        cognitiveFocus: 1.5,
        sensoryClarity: 1.2,
        emotionalCoherence: 1.8,
        somaticGrounding: 1.0,
        ...config.weights,
      },
      neuroplasticityFactor: config.neuroplasticityFactor || 0.95,
    };

    // Pre-defined consciousness states based on extensive theoretical models.
    this.consciousnessStates = {
      DEEP_SLEEP: { range: [0, 10], description: "Non-REM sleep, minimal subjective awareness." },
      DREAMING_SLEEP: { range: [11, 25], description: "REM sleep, vivid but non-lucid internal world." },
      DEFAULT_MODE: { range: [26, 45], description: "Mind-wandering, introspective thought, low external awareness." },
      WAKEFUL_PRESENCE: { range: [46, 65], description: "Standard waking state, moderate awareness of self and environment." },
      MINDFUL_AWARENESS: { range: [66, 85], description: "Heightened, non-judgmental awareness of the present moment." },
      FLOW_STATE: { range: [86, 95], description: "Full immersion in an activity, loss of self-consciousness, peak performance." },
      PEAK_EXPERIENCE: { range: [96, 100], description: "Profound moments of unity, euphoria, and clarity." },
    };
  }

  /**
   * Validates the structure and values of the input data stream.
   * @private
   * @param {object} data - The input data object.
   * @throws {InvalidInputError} If data is missing or malformed.
   */
  #validateInput(data) {
    if (!data) {
      throw new InvalidInputError('Input data object is null or undefined.');
    }
    const requiredKeys = ['cognitive', 'sensory', 'physiological', 'emotional'];
    for (const key of requiredKeys) {
      if (data[key] === undefined) {
        throw new InvalidInputError(`Missing required data key: '${key}'.`);
      }
    }
    if (typeof data.cognitive.load !== 'number' || data.cognitive.load < 0 || data.cognitive.load > 1) {
      throw new InvalidInputError('cognitive.load must be a number between 0 and 1.');
    }
    if (typeof data.sensory.clarity !== 'number' || data.sensory.clarity < 0 || data.sensory.clarity > 1) {
      throw new InvalidInputError('sensory.clarity must be a number between 0 and 1.');
    }
  }

  /**
   * The main processing function that analyzes a complete data snapshot.
   * It orchestrates all sub-modules to generate a comprehensive consciousness profile.
   * @param {object} inputData - The raw neuro-physiological data snapshot.
   * @param {object} inputData.cognitive - Cognitive metrics.
   * @param {number} inputData.cognitive.load - Current cognitive load (0.0 to 1.0).
   * @param {number} inputData.cognitive.focus - Directed attention vs. distraction (0.0 to 1.0).
   * @param {object} inputData.sensory - Sensory input metrics.
   * @param {number} inputData.sensory.clarity - Clarity and fidelity of sensory input (0.0 to 1.0).
   * @param {number} inputData.sensory.bandwidth - Amount of incoming sensory information (e.g., in bits/sec).
   * @param {object} inputData.physiological - Body state metrics.
   * @param {number} inputData.physiological.heartRateVariability - A measure of autonomic nervous system balance.
   * @param {number} inputData.physiological.coherence - Synchronicity between heart, breath, and brain waves (0.0 to 1.0).
   * @param {object} inputData.emotional - Emotional state data.
   * @param {Array<object>} inputData.emotional.spectrum - An array of detected emotions with their intensities. e.g., [{emotion: 'joy', intensity: 0.8}].
   * @returns {object} A comprehensive profile of the current consciousness state.
   * @throws {ProcessingError} If any sub-module fails during calculation.
   */
  process(inputData) {
    try {
      this.#validateInput(inputData);

      const stateResult = this.calculateConsciousnessState(inputData);
      const awarenessMetrics = this.calculateAwarenessMetrics(inputData, stateResult.score);
      const emotionalIntelligence = this.analyzeEmotionalSpectrum(inputData);

      return {
        timestamp: new Date().toISOString(),
        consciousnessState: stateResult,
        awareness: awarenessMetrics,
        emotionalIntelligence: emotionalIntelligence,
        summary: `Currently in a state of ${stateResult.state} with ${Math.round(awarenessMetrics.metacognitive * 100)}% metacognitive awareness.`,
      };
    } catch (error) {
      if (error instanceof InvalidInputError) {
        throw error; // Re-throw validation errors directly.
      }
      // Wrap other errors in a ProcessingError for context.
      throw new ProcessingError('Failed to process consciousness data.', { originalError: error.message });
    }
  }

  /**
   * Improves consciousness state calculations using a weighted, multi-factor model.
   * @param {object} inputData - The validated input data.
   * @returns {{score: number, state: string, description: string}} The calculated state.
   */
  calculateConsciousnessState(inputData) {
    const { cognitive, sensory, physiological } = inputData;
    const { weights } = this.config;

    // Invert cognitive load: higher load can detract from pure awareness states.
    const invertedLoad = 1 - cognitive.load;

    // Calculate a raw score based on weighted inputs.
    let score =
      (cognitive.focus * weights.cognitiveFocus) +
      (sensory.clarity * weights.sensoryClarity) +
      (physiological.coherence * weights.emotionalCoherence) +
      ((physiological.heartRateVariability / 100) * weights.somaticGrounding) + // Normalize HRV
      (invertedLoad);

    // Normalize the score to a 0-100 scale. The divisor is the sum of max possible weighted values.
    const maxScore = weights.cognitiveFocus + weights.sensoryClarity + weights.emotionalCoherence + weights.somaticGrounding + 1;
    let normalizedScore = (score / maxScore) * 100;

    // Find the corresponding state.
    for (const state in this.consciousnessStates) {
      const { range, description } = this.consciousnessStates[state];
      if (normalizedScore >= range[0] && normalizedScore <= range[1]) {
        return {
          score: parseFloat(normalizedScore.toFixed(2)),
          state: state,
          description: description,
        };
      }
    }

    // Fallback for scores outside defined ranges.
    return {
      score: parseFloat(normalizedScore.toFixed(2)),
      state: 'UNDEFINED',
      description: 'The current state does not fit into known models.',
    };
  }

  /**
   * Calculates novel awareness metrics for a deeper understanding of the subjective experience.
   * @param {object} inputData - The validated input data.
   * @param {number} consciousnessScore - The score from `calculateConsciousnessState`.
   * @returns {object} An object containing advanced awareness metrics.
   */
  calculateAwarenessMetrics(inputData, consciousnessScore) {
    const { cognitive, sensory, physiological } = inputData;

    // 1. Metacognitive Awareness: Awareness of one's own thoughts.
    // Higher with high focus, low cognitive load, and high consciousness score.
    const metacognitive = cognitive.focus * (1 - cognitive.load) * (consciousnessScore / 100);

    // 2. Somatic Awareness: Awareness of internal body sensations.
    // Primarily driven by physiological coherence and HRV.
    const somatic = (physiological.coherence + (physiological.heartRateVariability / 150)) / 2;

    // 3. Temporal Awareness: Groundedness in the present moment.
    // High focus and sensory clarity pull awareness to the 'now'. Mind-wandering (low focus) pushes it away.
    const temporal = (cognitive.focus + sensory.clarity) / 2;

    // 4. Qualia Richness: The depth, vividness, and complexity of subjective experience.
    // A function of sensory bandwidth and emotional intensity. Using log to model diminishing returns.
    const avgEmotionalIntensity = inputData.emotional.spectrum.reduce((acc, curr) => acc + curr.intensity, 0) / (inputData.emotional.spectrum.length || 1);
    const qualia = Math.log1p(sensory.bandwidth) * avgEmotionalIntensity * sensory.clarity;

    return {
      metacognitive: parseFloat(metacognitive.toFixed(3)),
      somatic: parseFloat(somatic.toFixed(3)),
      temporal: parseFloat(temporal.toFixed(3)),
      qualiaRichness: parseFloat(qualia.toFixed(3)),
    };
  }

  /**
   * Enhances emotional intelligence processing by analyzing the complexity and coherence of emotions.
   * @param {object} inputData - The validated input data.
   * @returns {object} An object containing advanced emotional intelligence metrics.
   */
  analyzeEmotionalSpectrum(inputData) {
    const { emotional, cognitive, physiological } = inputData;
    const { spectrum } = emotional;

    if (!spectrum || spectrum.length === 0) {
      return {
        granularity: 0,
        coherence: 1, // Perfectly coherent if no emotion is present.
        dominantEmotion: 'neutral',
      };
    }

    // 1. Emotional Granularity: The ability to experience emotions with precision.
    // Measured by the number of distinct emotions identified.
    const granularity = spectrum.length / 10; // Normalize against a theoretical max of 10 concurrent emotions.

    // 2. Emotional Coherence: How well emotions align with the cognitive/physiological state.
    // Example logic: High-intensity negative emotions are incoherent with high physiological coherence.
    const dominantEmotion = spectrum.sort((a, b) => b.intensity - a.intensity)[0];
    const isPositive = ['joy', 'gratitude', 'serenity', 'love'].includes(dominantEmotion.emotion);
    let coherence = 1.0;
    if (isPositive && physiological.coherence < 0.4) {
      coherence = 0.5; // Positive emotion with a stressed body state is incoherent.
    } else if (!isPositive && physiological.coherence > 0.6) {
      coherence = 0.5; // Negative emotion with a calm body state is incoherent.
    }

    // 3. Neuroplasticity Adjustment: Apply a factor based on emotional state.
    // Positive, coherent states may increase adaptability.
    if (isPositive && coherence > 0.5) {
      coherence *= (1 + (1 - this.config.neuroplasticityFactor));
    }

    return {
      granularity: parseFloat(granularity.toFixed(3)),
      coherence: parseFloat(coherence.toFixed(3)),
      dominantEmotion: dominantEmotion.emotion,
      dominantIntensity: dominantEmotion.intensity,
    };
  }
}
```
module.exports = InvalidInputError;
