```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description An advanced JavaScript module for simulating and enhancing core aspects of
 * conscious processing. It provides a sophisticated model for calculating consciousness states,
 * awareness metrics, and emotional intelligence, designed for integration into AI agents,
 * virtual reality systems, or advanced data visualization projects.
 *
 * This module operates on a "Consciousness Stream," a temporal sequence of input data
 * representing synthesized biometric and cognitive inputs.
 */

// --- Custom Error Types for Robust Handling ---

/**
 * @class InvalidInputError
 * @extends Error
 * @description Custom error for invalid or malformed input data provided to the module.
 */
class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidInputError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @class ProcessingError
 * @extends Error
 * @description Custom error for issues arising during internal state calculations.
 */
class ProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProcessingError';
    this.timestamp = new Date().toISOString();
  }
}


// --- Core Constants and Enumerations ---

/**
 * @enum {string}
 * @description Defines the primary calculated states of consciousness.
 * These states are not mutually exclusive but represent the dominant mode of processing.
 */
const ConsciousnessState = {
  FOCUSED_ANALYTICAL: 'Focused-Analytical', // High beta waves, low noise, task-oriented.
  CREATIVE_DIFFUSE: 'Creative-Diffuse',     // High alpha/theta, associative thinking.
  DEEP_MEDITATIVE: 'Deep-Meditative',       // Dominant alpha/delta, high interoception.
  RECEPTIVE_AWARENESS: 'Receptive-Awareness', // Balanced state, open to stimuli.
  NEURAL_IDLE: 'Neural-Idle',               // Default resting state.
};
module.exports.ConsciousnessState = ConsciousnessState;

/**
 * @description Defines the Valence-Arousal model for core affect.
 * Valence: pleasure (positive) to displeasure (negative).
 * Arousal: activation (high) to deactivation (low).
 */
const EmotionalSpectrum = {
  // [Valence, Arousal] -> Emotion
  '1,1': 'Excited',
  '1,0': 'Serene',
  '1,-1': 'Relaxed',
  '0,1': 'Tense',
  '0,0': 'Neutral',
  '0,-1': 'Fatigued',
  '-1,1': 'Stressed',
  '-1,0': 'Sad',
  '-1,-1': 'Depressed',
};

// --- Main ConsciousnessStream Class ---

/**
 * @class ConsciousnessStream
 * @description Manages and processes a continuous stream of cognitive data.
 * This class maintains a history of inputs to analyze temporal patterns and
 * provides a comprehensive, real-time analysis of the simulated conscious state.
 */
class ConsciousnessStream
 {
  /**
   * @constructor
   * @param {object} [config={}] - Configuration for the consciousness stream.
   * @param {number} [config.neuroplasticityFactor=0.05] - Learning rate for adapting internal weights (0 to 1). Higher values mean faster adaptation.
   * @param {number} [config.temporalWindowSize=10] - Number of recent data points to consider for temporal analysis.
   * @param {object} [config.customWeights] - Optional custom weights for state calculations.
   */
  constructor(config = {}) {
    this.config = {
      neuroplasticityFactor: config.neuroplasticityFactor || 0.05,
      temporalWindowSize: config.temporalWindowSize || 10,
      ...config,
    };

    // State history for temporal analysis
    this.history = [];

    // Internal weights that can adapt over time
    this.weights = {
      state: {
        alpha: config.customWeights?.state?.alpha || 1.2,
        beta: config.customWeights?.state?.beta || 1.5,
        theta: config.customWeights?.state?.theta || 1.0,
        delta: config.customWeights?.state?.delta || 0.8,
        gamma: config.customWeights?.state?.gamma || 2.0,
        coherence: config.customWeights?.state?.coherence || 1.8,
        hrv: config.customWeights?.state?.hrv || 1.3, // Heart Rate Variability
      },
      awareness: {
        externalSignalRatio: config.customWeights?.awareness?.externalSignalRatio || 1.0,
        internalNoise: config.customWeights?.awareness?.internalNoise || 1.0,
        gamma: config.customWeights?.awareness?.gamma || 1.5,
      },
    };

    // The current comprehensive state
    this.currentState = {
      timestamp: null,
      consciousnessState: ConsciousnessState.NEURAL_IDLE,
      stateScores: {},
      awarenessMetrics: {},
      emotionalIntelligence: {},
      cognitiveReframingSuggestion: null,
    };
  }

  /**
   * Validates the structure and values of the input data tick.
   * @private
   * @param {object} inputData - The data object for the current tick.
   * @throws {InvalidInputError} If data is missing or malformed.
   */
  _validateInput(inputData) {
    const requiredKeys = [
      'neural', 'biometric', 'stimulus'
    ];
    if (!inputData || requiredKeys.some(key => inputData[key] === undefined)) {
      throw new InvalidInputError('Input data must include `neural`, `biometric`, and `stimulus` keys.');
    }

    const { neural, biometric, stimulus } = inputData;
    const requiredNeural = ['alpha', 'beta', 'theta', 'delta', 'gamma', 'coherence', 'internalNoise'];
    const requiredBiometric = ['hrv', 'gsr']; // gsr: Galvanic Skin Response
    const requiredStimulus = ['externalSignalRatio', 'emotionalValence', 'emotionalArousal'];

    for (const key of requiredNeural) {
      if (typeof neural[key] !== 'number' || neural[key] < 0 || neural[key] > 1) {
        throw new InvalidInputError(`Invalid neural input: '${key}' must be a number between 0 and 1.`);
      }
    }
    for (const key of requiredBiometric) {
      if (typeof biometric[key] !== 'number' || biometric[key] < 0 || biometric[key] > 1) {
        throw new InvalidInputError(`Invalid biometric input: '${key}' must be a number between 0 and 1.`);
      }
    }
    for (const key of requiredStimulus) {
      const val = stimulus[key];
      if (typeof val !== 'number') {
        throw new InvalidInputError(`Invalid stimulus input: '${key}' must be a number.`);
      }
      if ((key === 'emotionalValence' || key === 'emotionalArousal') && (val < -1 || val > 1)) {
        throw new InvalidInputError(`'${key}' must be between -1 and 1.`);
      }
    }
  }

  /**
   * Processes a single tick of data, updating the entire consciousness model.
   * This is the primary method for interacting with the module.
   * @param {object} inputData - The data for the current time step.
   * @param {object} inputData.neural - Synthesized neural activity.
   * @param {number} inputData.neural.alpha - Alpha wave power (0-1).
   * @param {number} inputData.neural.beta - Beta wave power (0-1).
   * @param {number} inputData.neural.theta - Theta wave power (0-1).
   * @param {number} inputData.neural.delta - Delta wave power (0-1).
   * @param {number} inputData.neural.gamma - Gamma wave power (0-1), associated with metacognition.
   * @param {number} inputData.neural.coherence - Cross-hemispheric coherence (0-1).
   * @param {number} inputData.neural.internalNoise - Level of random neural firing (0-1).
   * @param {object} inputData.biometric - Synthesized biometric data.
   * @param {number} inputData.biometric.hrv - Heart Rate Variability (0-1). High HRV indicates calm.
   * @param {number} inputData.biometric.gsr - Galvanic Skin Response (0-1). High GSR indicates arousal.
   * @param {object} inputData.stimulus - External and internal stimuli.
   * @param {number} inputData.stimulus.externalSignalRatio - Ratio of external to internal sensory data (0-1).
   * @param {number} inputData.stimulus.emotionalValence - The pleasure/displeasure axis of emotion (-1 to 1).
   * @param {number} inputData.stimulus.emotionalArousal - The activation/deactivation axis of emotion (-1 to 1).
   * @returns {object} The full, updated state of the consciousness model.
   */
  processTick(inputData) {
    try {
      this._validateInput(inputData);

      // Add current input to history, maintaining window size
      this.history.push(inputData);
      if (this.history.length > this.config.temporalWindowSize) {
        this.history.shift();
      }

      // Perform calculations
      const stateScores = this._calculateConsciousnessState(inputData.neural, inputData.biometric);
      const dominantState = Object.keys(stateScores).reduce((a, b) => stateScores[a] > stateScores[b] ? a : b);

      const awarenessMetrics = this._calculateAwarenessMetrics(inputData.neural, inputData.stimulus);
      const emotionalIntelligence = this._calculateEmotionalIntelligence(inputData.stimulus, inputData.biometric);
      
      // Update the main state object
      this.currentState = {
        timestamp: new Date().toISOString(),
        consciousnessState: dominantState,
        stateScores,
        awarenessMetrics,
        emotionalIntelligence,
        cognitiveReframingSuggestion: this.suggestCognitiveReframing(emotionalIntelligence),
      };

      // Apply neuroplasticity to adapt weights
      this._adaptWeights(inputData);
      
      return this.getComprehensiveState();

    } catch (error) {
      if (error instanceof InvalidInputError) {
        throw error; // Re-throw validation errors directly
      }
      // Wrap other errors in a ProcessingError
      throw new ProcessingError(`Calculation failed: ${error.message}`);
    }
  }

  /**
   * Calculates scores for each potential consciousness state.
   * @private
   */
  _calculateConsciousnessState(neural, biometric) {
    const w = this.weights.state;
    const scores = {};

    // Focused-Analytical: High beta/gamma, high coherence, low noise.
    scores[ConsciousnessState.FOCUSED_ANALYTICAL] =
      (neural.beta * w.beta + neural.gamma * w.gamma + neural.coherence * w.coherence) /
      (1 + neural.alpha + neural.theta);

    // Creative-Diffuse: High alpha/theta, moderate coherence.
    scores[ConsciousnessState.CREATIVE_DIFFUSE] =
      (neural.alpha * w.alpha + neural.theta * w.theta) / (1 + neural.beta);

    // Deep-Meditative: Dominant alpha/delta, high HRV, low external focus.
    scores[ConsciousnessState.DEEP_MEDITATIVE] =
      (neural.alpha * w.alpha + neural.delta * w.delta + biometric.hrv * w.hrv) / (1 + neural.beta + neural.gamma);

    // Receptive-Awareness: Balanced waves, high coherence, high HRV.
    scores[ConsciousnessState.RECEPTIVE_AWARENESS] =
      (neural.coherence * w.coherence + biometric.hrv * w.hrv) / (1 + Math.abs(neural.beta - neural.alpha));
      
    // Neural-Idle: Low activity across the board.
    scores[ConsciousnessState.NEURAL_IDLE] = 1 / (1 + neural.alpha + neural.beta + neural.theta + neural.gamma);

    // Normalize scores to a 0-1 range
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (totalScore === 0) return scores; // Avoid division by zero
    for (const state in scores) {
      scores[state] = scores[state] / totalScore;
    }
    
    return scores;
  }

  /**
   * Calculates novel awareness metrics.
   * @private
   */
  _calculateAwarenessMetrics(neural, stimulus) {
    const w = this.weights.awareness;

    // Situational Awareness: Balance between external focus and internal processing load.
    const situationalAwareness = stimulus.externalSignalRatio * (1 - neural.internalNoise * w.internalNoise);

    // Metacognitive Clarity: The ability to "think about thinking." Strongly linked to gamma activity and low noise.
    const metacognitiveClarity = neural.gamma * w.gamma * (1 - neural.internalNoise);
    
    // Interoceptive Accuracy: The clarity of perceiving internal bodily sensations. Linked to HRV and low noise.
    const hrv = this.history.length > 0 ? this.history[this.history.length - 1].biometric.hrv : 0.5;
    const interoceptiveAccuracy = hrv * (1 - neural.internalNoise);

    return {
      situationalAwareness: Math.max(0, Math.min(1, situationalAwareness)),
      metacognitiveClarity: Math.max(0, Math.min(1, metacognitiveClarity)),
      interoceptiveAccuracy: Math.max(0, Math.min(1, interoceptiveAccuracy)),
    };
  }

  /**
   * Processes emotional inputs to determine a nuanced emotional state.
   * @private
   */
  _calculateEmotionalIntelligence(stimulus, biometric) {
    const { emotionalValence, emotionalArousal } = stimulus;
    
    // Emotional Granularity: Determine a specific emotional label from the Valence-Arousal model.
    const valenceKey = Math.round(emotionalValence);
    const arousalKey = Math.round(emotionalArousal);
    const coreAffect = EmotionalSpectrum[`${valenceKey},${arousalKey}`] || 'Mixed';

    // Emotional Regulation Capacity: Ability to manage emotional responses.
    // High metacognitive clarity and high HRV suggest better regulation capacity.
    const regulationCapacity = (this.currentState.awarenessMetrics.metacognitiveClarity + biometric.hrv) / 2;

    return {
      coreAffect, // e.g., 'Serene', 'Stressed'
      valence: emotionalValence,
      arousal: emotionalArousal,
      emotionalGranularity: 1 - Math.abs(emotionalValence - valenceKey) - Math.abs(emotionalArousal - arousalKey), // How well the emotion fits the label
      regulationCapacity: Math.max(0, Math.min(1, regulationCapacity)),
    };
  }
  
  /**
   * Simulates neuroplastic adaptation by adjusting weights based on recent activity.
   * "Neurons that fire together, wire together."
   * @private
   */
  _adaptWeights(inputData) {
      const factor = this.config.neuroplasticityFactor;
      if (factor === 0) return;

      // Example adaptation: If in a highly focused state, slightly increase the weight of beta waves.
      if (this.currentState.consciousnessState === ConsciousnessState.FOCUSED_ANALYTICAL) {
          const reinforcement = inputData.neural.beta * factor;
          this.weights.state.beta += reinforcement;
      }
      // If in a meditative state, reinforce the value of HRV.
      else if (this.currentState.consciousnessState === ConsciousnessState.DEEP_MEDITATIVE) {
          const reinforcement = inputData.biometric.hrv * factor;
          this.weights.state.hrv += reinforcement;
      }
      // Add a small decay to all weights to prevent them from growing indefinitely.
      for (const key in this.weights.state) {
          this.weights.state[key] *= (1 - factor * 0.1);
      }
  }

  /**
   * Provides an actionable suggestion to shift from a negative emotional state.
   * @param {object} emotionalState - The current emotional intelligence object.
   * @returns {string|null} A suggestion or null if no intervention is needed.
   */
  suggestCognitiveReframing(emotionalState) {
    if (emotionalState.valence < -0.5) { // If in a significantly negative state
      if (emotionalState.regulationCapacity > 0.6) {
        // High capacity for self-regulation
        return "Suggestion: Acknowledge the negative feeling and re-evaluate the triggering stimulus from a neutral, observational perspective (metacognitive shift).";
      } else if (this.currentState.awarenessMetrics.interoceptiveAccuracy > 0.5) {
        // Good body awareness
        return "Suggestion: Focus on physiological sensations. Practice deep, slow breathing to increase Heart Rate Variability and reduce arousal.";
      } else {
        // Low capacity, requires simpler strategy
        return "Suggestion: Engage in a focused, external task to shift attention away from the negative stimulus.";
      }
    }
    return null; // No intervention needed for neutral or positive states.
  }

  /**
   * Returns the latest comprehensive state of the consciousness model.
   * @returns {object} The full state object.
   */
  getComprehensiveState() {
    // Return a deep copy to prevent external mutation of the internal state.
    return JSON.parse(JSON.stringify(this.currentState));
  }

  /**
   * Returns the current adaptive weights.
   * @returns {object} The current weights used in calculations.
   */
  getAdaptiveWeights() {
    return JSON.parse(JSON.stringify(this.weights));
  }
}
```
module.exports = InvalidInputError;
