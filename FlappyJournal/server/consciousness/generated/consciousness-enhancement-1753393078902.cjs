/**
 * @module ConsciousnessProcessor
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This module provides a computational framework for analyzing cognitive and emotional states,
 * offering deeper insights into awareness, emotional intelligence, and overall conscious experience.
 * It is designed for use in advanced AI, psychological modeling, and philosophical simulations.
 *
 * @version 2.0.0
 * @author AGI Futurist Labs
 * @license MIT
 */

/**
 * Custom error class for handling specific consciousness processing failures.
 * This allows for more granular error handling by the consumer of the module.
 */
class ConsciousnessError extends Error {
  /**
   * @param {string} message - The error message.
   * @param {object} [details] - Optional details about the error context.
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'ConsciousnessError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * A sophisticated class for processing and analyzing cognitive snapshots.
 * It integrates multiple data points to generate a holistic view of a conscious state.
 */
class ConsciousnessProcessor {
  /**
   * Initializes the ConsciousnessProcessor.
   * @param {object} [config={}] - Configuration options.
   * @param {number} [config.quantumFluctuationFactor=0.05] - A factor to simulate the inherent non-determinism of consciousness.
   * @param {number} [config.emotionalComplexityThreshold=0.1] - The minimum intensity for an emotion to be considered active.
   */
  constructor(config = {}) {
    this.config = {
      quantumFluctuationFactor: config.quantumFluctuationFactor || 0.05,
      emotionalComplexityThreshold: config.emotionalComplexityThreshold || 0.1,
    };

    // Stores the results of the last processed snapshot
    this.lastResult = null;
  }

  /**
   * Validates the structure and values of a cognitive snapshot.
   * @private
   * @param {object} snapshot - The cognitive snapshot to validate.
   * @throws {ConsciousnessError} If the snapshot is invalid.
   */
  _validateSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') {
      throw new ConsciousnessError('Cognitive snapshot must be a non-null object.');
    }

    const requiredFields = {
      cognitiveLoad: 'number', // 0.0 to 1.0
      sensoryInputIntensity: 'number', // 0.0 to 1.0
      internalFocus: 'number', // 0.0 (external) to 1.0 (internal)
      emotions: 'object', // e.g., { joy: 0.8, sadness: 0.1, ... }
      somaticMarkers: 'object', // e.g., { heartRate: 70, breathRate: 15 }
    };

    for (const field in requiredFields) {
      if (!(field in snapshot)) {
        throw new ConsciousnessError(`Missing required field in snapshot: '${field}'.`);
      }
      if (typeof snapshot[field] !== requiredFields[field]) {
        throw new ConsciousnessError(`Field '${field}' must be of type '${requiredFields[field]}'.`);
      }
    }

    if (snapshot.emotions === null || Array.isArray(snapshot.emotions)) {
        throw new ConsciousnessError(`Field 'emotions' must be a non-null object.`);
    }
  }

  /**
   * Calculates the primary state of consciousness based on core metrics.
   * This improved calculation uses a weighted system and introduces non-determinism.
   * @private
   * @param {object} snapshot - The validated cognitive snapshot.
   * @returns {{state: string, clarity: number}} The calculated consciousness state and its clarity.
   */
  _calculateConsciousnessState(snapshot) {
    const { cognitiveLoad, sensoryInputIntensity, internalFocus } = snapshot;

    // Introduce a slight, non-deterministic fluctuation to simulate quantum effects on neural pathways.
    const fluctuation = (Math.random() - 0.5) * this.config.quantumFluctuationFactor;
    
    // Weighted score for state determination
    const focusScore = (internalFocus * 1.5 - sensoryInputIntensity * 0.5 + cognitiveLoad * 1.0) / 3.0 + fluctuation;
    const clarity = 1.0 - cognitiveLoad * 0.7 - Math.abs(fluctuation) * 2;

    let state = 'Undefined';

    if (focusScore > 0.7) {
      state = 'DeepIntrospection';
    } else if (focusScore > 0.4) {
      state = 'FocusedTask';
    } else if (focusScore > 0.1) {
      state = 'FlowState';
    } else if (focusScore > -0.2) {
      state = 'DiffuseAwareness';
    } else if (focusScore > -0.5) {
      state = 'Meditative';
    } else {
      state = 'SensorySaturation';
    }

    // Override for low-arousal states
    if (cognitiveLoad < 0.1 && sensoryInputIntensity < 0.1) {
        state = 'Quiescent';
    }

    return {
      state,
      clarity: Math.max(0, Math.min(1, clarity)), // Clamp between 0 and 1
    };
  }

  /**
   * Computes novel awareness metrics for a deeper understanding of self and environment.
   * @private
   * @param {object} snapshot - The validated cognitive snapshot.
   * @param {{state: string, clarity: number}} consciousnessState - The current consciousness state.
   * @returns {object} An object containing various awareness metrics.
   */
  _calculateAwarenessMetrics(snapshot, consciousnessState) {
    const { internalFocus, sensoryInputIntensity, cognitiveLoad } = snapshot;

    // Situational Awareness: How tuned-in to the external environment.
    const situational = sensoryInputIntensity * (1 - internalFocus) * (1 - cognitiveLoad * 0.5);

    // Proprioceptive Awareness: How tuned-in to the internal body state.
    const proprioceptive = internalFocus * (1 - sensoryInputIntensity * 0.5);

    // Metacognitive Awareness: The awareness of one's own thought processes.
    // Higher clarity and moderate focus contribute to better metacognition.
    const metacognitive = consciousnessState.clarity * (1 - Math.abs(internalFocus - 0.5));

    return {
      situationalAwareness: Math.max(0, Math.min(1, situational)),
      proprioceptiveAwareness: Math.max(0, Math.min(1, proprioceptive)),
      metacognitiveAwareness: Math.max(0, Math.min(1, metacognitive)),
    };
  }

  /**
   * Performs enhanced emotional intelligence processing.
   * Calculates emotional polarity, complexity, and a novel 'resonance' metric.
   * @private
   * @param {object} snapshot - The validated cognitive snapshot.
   * @returns {object} An object containing advanced emotional intelligence metrics.
   */
  _calculateEmotionalIntelligence(snapshot) {
    const { emotions, thoughtContent = '' } = snapshot;
    const emotionalKeys = Object.keys(emotions);

    if (emotionalKeys.length === 0) {
      return {
        dominantEmotion: 'Neutral',
        intensity: 0,
        polarity: 0,
        complexity: 0,
        resonance: 0.5, // Neutral resonance
      };
    }

    let totalIntensity = 0;
    let dominantEmotion = 'Neutral';
    let maxIntensity = 0;
    let complexity = 0;
    let polarityScore = 0;

    // Pre-defined sentiment for common emotions (can be expanded)
    const emotionSentiments = {
      joy: 1, happiness: 1, serenity: 0.8, love: 1,
      sadness: -1, grief: -1, fear: -0.7, anger: -0.5, disgust: -0.8,
      surprise: 0.3, anticipation: 0.4, trust: 0.7,
    };

    for (const emotion of emotionalKeys) {
      const intensity = emotions[emotion];
      totalIntensity += intensity;

      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        dominantEmotion = emotion;
      }
      if (intensity > this.config.emotionalComplexityThreshold) {
        complexity++;
      }
      
      const sentiment = emotionSentiments[emotion.toLowerCase()] || 0;
      polarityScore += intensity * sentiment;
    }

    const averageIntensity = totalIntensity / emotionalKeys.length;
    const polarity = emotionalKeys.length > 0 ? polarityScore / totalIntensity : 0;
    
    // Neuro-Linguistic Resonance: A metric for alignment between thought and feeling.
    // This is a simplified simulation. A real implementation would use advanced NLP.
    let resonance = 0.5;
    const dominantSentiment = emotionSentiments[dominantEmotion.toLowerCase()] || 0;
    if (dominantSentiment > 0.5 && thoughtContent.match(/positive|good|happy|wonderful|love/i)) {
        resonance = 0.8;
    } else if (dominantSentiment < -0.5 && thoughtContent.match(/negative|bad|sad|terrible|hate/i)) {
        resonance = 0.8;
    } else if (dominantSentiment !== 0 && thoughtContent.length > 0) {
        resonance = 0.2; // Mismatch
    }

    return {
      dominantEmotion,
      intensity: Math.max(0, Math.min(1, maxIntensity)),
      polarity: Math.max(-1, Math.min(1, polarity)),
      complexity: complexity / emotionalKeys.length, // Normalized complexity
      resonance, // 0 (dissonant) to 1 (resonant)
    };
  }

  /**
   * @typedef {object} CognitiveSnapshot
   * @property {number} cognitiveLoad - The current mental workload (0.0 to 1.0).
   * @property {number} sensoryInputIntensity - The intensity of incoming sensory data (0.0 to 1.0).
   * @property {number} internalFocus - The direction of focus; 0.0 for purely external, 1.0 for purely internal/introspective.
   * @property {object} emotions - An object mapping emotion names to their intensity (0.0 to 1.0). e.g., `{ joy: 0.8, fear: 0.1 }`.
   * @property {object} somaticMarkers - Physiological data. e.g., `{ heartRate: 75, breathRate: 16 }`.
   * @property {string} [thoughtContent] - Optional string representing current high-level thoughts for resonance analysis.
   */

  /**
   * @typedef {object} ProcessingResult
   * @property {object} consciousness - The primary state of consciousness.
   * @property {string} consciousness.state - The name of the conscious state (e.g., 'FlowState').
   * @property {number} consciousness.clarity - The clarity of the conscious state (0.0 to 1.0).
   * @property {object} awareness - Advanced awareness metrics.
   * @property {number} awareness.situationalAwareness - Awareness of the external environment (0.0 to 1.0).
   * @property {number} awareness.proprioceptiveAwareness - Awareness of the internal body state (0.0 to 1.0).
   * @property {number} awareness.metacognitiveAwareness - Awareness of own mental processes (0.0 to 1.0).
   * @property {object} emotionalIntelligence - Advanced emotional analysis.
   * @property {string} emotionalIntelligence.dominantEmotion - The most intense current emotion.
   * @property {number} emotionalIntelligence.intensity - The intensity of the dominant emotion (0.0 to 1.0).
   * @property {number} emotionalIntelligence.polarity - The overall positive/negative balance of emotions (-1.0 to 1.0).
   * @property {number} emotionalIntelligence.complexity - The degree of emotional blending (0.0 to 1.0).
   * @property {number} emotionalIntelligence.resonance - The alignment between thoughts and feelings (0.0 to 1.0).
   * @property {string} timestamp - The ISO 8601 timestamp of the processing.
   */

  /**
   * The main method to process a cognitive snapshot.
   * It performs a full analysis and returns a structured result.
   * @param {CognitiveSnapshot} snapshot - The input data representing a moment of consciousness.
   * @returns {ProcessingResult} A detailed analysis of the conscious state.
   * @throws {ConsciousnessError} If the input snapshot is invalid or processing fails.
   */
  process(snapshot) {
    try {
      this._validateSnapshot(snapshot);

      const consciousness = this._calculateConsciousnessState(snapshot);
      const awareness = this._calculateAwarenessMetrics(snapshot, consciousness);
      const emotionalIntelligence = this._calculateEmotionalIntelligence(snapshot);

      const result = {
        consciousness,
        awareness,
        emotionalIntelligence,
        timestamp: new Date().toISOString(),
      };

      this.lastResult = result;
      return result;

    } catch (error) {
      if (error instanceof ConsciousnessError) {
        // Re-throw our custom error to be handled by the caller
        throw error;
      } else {
        // Wrap unexpected errors in our custom error type for consistency
        throw new ConsciousnessError('An unexpected internal error occurred during processing.', {
          originalError: error.message,
        });
      }
    }
  }

  /**
   * Retrieves the result of the most recent processing call.
   * @returns {ProcessingResult | null} The last processing result, or null if no processing has occurred.
   */
  getLastResult() {
    return this.lastResult;
  }
}

module.exports = ConsciousnessProcessor;