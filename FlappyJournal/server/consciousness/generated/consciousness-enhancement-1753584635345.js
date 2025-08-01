```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A JavaScript module for advanced modeling and processing of consciousness states,
 * awareness metrics, and emotional intelligence. This module provides a framework for simulating
 * and analyzing the phenomenological aspects of a conscious agent.
 *
 * @version 1.0.0
 * @author [Your Name/AI]
 * @license MIT
 *
 * @example
 * import ConsciousnessProcessor from './consciousness.js';
 *
 * // Initialize the processor with a baseline state
 * const agentConsciousness = new ConsciousnessProcessor({
 *   initialState: {
 *     consciousnessVector: { focus: 0.7, clarity: 0.8, metaCognition: 0.6 },
 *     awarenessMetrics: { sensory: 0.7, somatic: 0.5, temporal: 0.9, social: 0.6 },
 *     emotionalState: { valence: 0.8, arousal: 0.4, dominance: 0.7 } // Calmly positive and in control
 *   }
 * });
 *
 * // Simulate new inputs from the environment and internal state
 * const sensoryInput = {
 *   physiological: { heartRate: 85, breathingRate: 20, electrodermalActivity: 1.2 },
 *   cognitive: { taskLoad: 0.9, memoryRecallScore: 0.6 },
 *   environmental: { noiseLevel: 0.8, lightIntensity: 0.5, socialDensity: 4 },
 *   emotionalStimulus: { valence: -0.7, arousal: 0.8, eventSignificance: 0.9 } // A sudden, negative, important event
 * };
 *
 * try {
 *   agentConsciousness.updateState(sensoryInput);
 *   console.log('Updated State:', agentConsciousness.getFullState());
 *
 *   // Simulate an act of emotional regulation (e.g., deep breathing)
 *   agentConsciousness.simulateEmotionalRegulation({ valence: 0.3, arousal: 0.2 }); // Target a calmer state
 *   console.log('State after Regulation:', agentConsciousness.getFullState().emotionalState);
 *
 * } catch (error) {
 *   console.error(`Processing Error: ${error.name} - ${error.message}`);
 * }
 */

// --- Custom Error Types for Clearer Diagnostics ---

/**
 * @class ConsciousnessProcessingError
 * @extends Error
 * @description Custom error for issues during consciousness state calculations.
 */
class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @class InputValidationError
 * @extends Error
 * @description Custom error for invalid input data provided to the processor.
 */
class InputValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'InputValidationError';
    this.details = details; // e.g., { parameter: 'heartRate', value: -10 }
  }
}


// --- Core Module ---

/**
 * @class ConsciousnessProcessor
 * @description Manages and processes the state of a conscious agent.
 */
export default class ConsciousnessProcessor {
  /**
   * The current multi-dimensional state of consciousness.
   * @private
   * @type {Object}
   */
  #currentState;

  /**
   * Weights to determine the influence of various inputs on the final state.
   * Fine-tune these to simulate different personality types or cognitive models.
   * @private
   * @type {Object}
   */
  #config = {
    // How quickly the state changes in response to new stimuli (0.0 to 1.0)
    stateInertia: 0.3,
    // Influence of inputs on the Consciousness Vector
    vectorWeights: {
      taskLoadOnFocus: -0.2,
      noiseOnFocus: -0.15,
      arousalOnClarity: -0.3,
      heartRateOnClarity: -0.1,
      metaCognitionDecay: 0.05,
    },
    // Influence of inputs on Awareness Metrics
    awarenessWeights: {
      lightIntensityOnSensory: 0.2,
      noiseOnSensory: 0.3,
      breathingOnSomatic: -0.4, // Slower breathing = higher somatic awareness
      socialDensityOnSocial: 0.5,
    },
    // Influence on Emotional State
    emotionalWeights: {
      significanceAmplifier: 1.5,
    },
  };

  /**
   * Initializes the ConsciousnessProcessor.
   * @param {Object} [options={}] - Configuration options.
   * @param {Object} [options.initialState] - A predefined starting state for the processor.
   * @param {Object} [options.config] - Custom weights to override defaults.
   */
  constructor({ initialState, config } = {}) {
    this.#currentState = initialState || {
      consciousnessVector: { focus: 0.7, clarity: 0.7, metaCognition: 0.5 },
      awarenessMetrics: { sensory: 0.6, somatic: 0.5, temporal: 0.8, social: 0.5 },
      emotionalState: { valence: 0.5, arousal: 0.3, dominance: 0.6 }, // Neutral-positive, low energy
    };

    if (config) {
      this.#config = { ...this.#config, ...config };
    }

    // Perform an initial validation of the state
    this._validateState(this.#currentState);
  }

  // --- Private Helper Methods for Internal Calculations ---

  /**
   * Normalizes a value to be within the 0.0 to 1.0 range.
   * @private
   * @param {number} value - The value to normalize.
   * @returns {number} The normalized value.
   */
  _normalize(value) {
    return Math.max(0.0, Math.min(1.0, value));
  }

  /**
   * Validates the structure and value ranges of input data.
   * @private
   * @param {Object} inputs - The input data object.
   * @throws {InputValidationError} if inputs are invalid.
   */
  _validateInputs(inputs) {
    if (!inputs || typeof inputs !== 'object') {
      throw new InputValidationError('Inputs must be a non-null object.');
    }
    const requiredKeys = ['physiological', 'cognitive', 'environmental', 'emotionalStimulus'];
    for (const key of requiredKeys) {
      if (!(key in inputs)) {
        throw new InputValidationError(`Missing required input key: '${key}'.`);
      }
    }
    // Example of deep validation
    if (inputs.physiological.heartRate < 0) {
      throw new InputValidationError('Physiological.heartRate cannot be negative.', {
        parameter: 'heartRate',
        value: inputs.physiological.heartRate
      });
    }
  }
  
  /**
   * Validates the internal state to ensure its integrity.
   * @private
   * @param {Object} state - The state object to validate.
   * @throws {ConsciousnessProcessingError} if the state is malformed.
   */
  _validateState(state) {
      const checkRange = (obj, key) => {
          const value = obj[key];
          if (typeof value !== 'number' || value < 0.0 || value > 1.0) {
              throw new ConsciousnessProcessingError(`Invalid state value for ${key}: ${value}. Must be a number between 0 and 1.`);
          }
      };
      
      Object.keys(state.consciousnessVector).forEach(k => checkRange(state.consciousnessVector, k));
      Object.keys(state.awarenessMetrics).forEach(k => checkRange(state.awarenessMetrics, k));
      Object.keys(state.emotionalState).forEach(k => checkRange(state.emotionalState, k));
  }


  /**
   * Calculates the new Consciousness State Vector (CSV).
   * The CSV represents the core qualities of the conscious experience.
   * - Focus: Ability to concentrate on a single stimulus.
   * - Clarity: Lack of mental noise or confusion.
   * - Meta-Cognition: Awareness of one's own thought processes.
   * @private
   * @param {Object} inputs - The validated sensory and cognitive inputs.
   * @returns {Object} The new consciousness vector.
   */
  _calculateConsciousnessVector(inputs) {
    const { cognitive, environmental } = inputs;
    const { arousal } = this.#currentState.emotionalState;
    let { focus, clarity, metaCognition } = this.#currentState.consciousnessVector;

    // Focus is reduced by high task load and environmental noise.
    focus += cognitive.taskLoad * this.#config.vectorWeights.taskLoadOnFocus;
    focus += environmental.noiseLevel * this.#config.vectorWeights.noiseOnFocus;

    // Clarity is reduced by high emotional arousal and physiological stress.
    clarity += arousal * this.#config.vectorWeights.arousalOnClarity;
    clarity += this._normalize(inputs.physiological.heartRate / 150) * this.#config.vectorWeights.heartRateOnClarity;

    // Meta-cognition slowly decays without active reflection, but is boosted by low task load.
    metaCognition -= this.#config.vectorWeights.metaCognitionDecay;
    metaCognition += (1 - cognitive.taskLoad) * 0.05;

    return {
      focus: this._normalize(focus),
      clarity: this._normalize(clarity),
      metaCognition: this._normalize(metaCognition),
    };
  }

  /**
   * Calculates new awareness metrics.
   * - Sensory: Attunement to external environmental stimuli.
   * - Somatic: Attunement to internal bodily sensations.
   * - Temporal: Perception of the flow of time.
   * - Social: Attunement to the presence and state of other agents.
   * @private
   * @param {Object} inputs - The validated sensory and cognitive inputs.
   * @returns {Object} The new awareness metrics.
   */
  _calculateAwarenessMetrics(inputs) {
    const { physiological, environmental } = inputs;
    let { sensory, somatic, temporal, social } = this.#currentState.awarenessMetrics;

    // Sensory awareness increases with stimulus intensity.
    sensory = (environmental.lightIntensity * this.#config.awarenessWeights.lightIntensityOnSensory) +
              (environmental.noiseLevel * this.#config.awarenessWeights.noiseOnSensory);

    // Somatic awareness increases with calm physiological states (e.g., slow breathing).
    somatic = 1 - this._normalize(physiological.breathingRate / 30);

    // Temporal awareness is distorted by high arousal. A value near 0.5 is "normal".
    // High arousal can make time feel slower (value -> 1.0) or faster (value -> 0.0).
    const arousalEffect = (this.#currentState.emotionalState.arousal - 0.5) * 0.4;
    temporal = 0.5 + arousalEffect;
    
    // Social awareness increases with the number of other agents present.
    social = this._normalize(environmental.socialDensity / 10) * this.#config.awarenessWeights.socialDensityOnSocial;

    return {
      sensory: this._normalize(sensory),
      somatic: this._normalize(somatic),
      temporal: this._normalize(temporal),
      social: this._normalize(social),
    };
  }

  /**
   * Processes emotional stimuli using the Valence-Arousal-Dominance (VAD) model.
   * - Valence: The positive <-> negative quality of an emotion.
   * - Arousal: The intensity or energy level of an emotion (calm <-> excited).
   * - Dominance: The feeling of control over the situation (submissive <-> in control).
   * @private
   * @param {Object} inputs - The validated sensory and cognitive inputs.
   * @returns {Object} The new emotional state.
   */
  _processEmotionalState(inputs) {
    const { emotionalStimulus } = inputs;
    const { significanceAmplifier } = this.#config.emotionalWeights;
    
    // The impact of the stimulus is amplified by its significance.
    const impact = emotionalStimulus.eventSignificance * significanceAmplifier;

    // The new emotional state is a weighted average of the old state and the new stimulus.
    const blendFactor = this._normalize(impact);
    const currentState = this.#currentState.emotionalState;

    const valence = currentState.valence * (1 - blendFactor) + emotionalStimulus.valence * blendFactor;
    const arousal = currentState.arousal * (1 - blendFactor) + emotionalStimulus.arousal * blendFactor;
    
    // Dominance is inversely affected by the arousal of negative events.
    let dominance = currentState.dominance;
    if (valence < 0.5) {
        dominance -= arousal * (1 - valence) * 0.2;
    }

    return {
      valence: this._normalize(valence),
      arousal: this._normalize(arousal),
      dominance: this._normalize(dominance),
    };
  }

  /**
   * Applies a "Qualia Filter" to the processed state. This simulates the subjective,
   * ineffable nature of experience by introducing slight, non-linear transformations
   * based on the current state. This is an innovative, interpretive step.
   * @private
   * @param {Object} state - The raw, calculated state.
   * @returns {Object} The filtered, subjective state.
   */
  _applyQualiaFilter(state) {
      const { clarity } = state.consciousnessVector;
      const { valence } = state.emotionalState;

      // When clarity is low, all perceptions are "muddied" or regressed toward the mean.
      const clarityMuddiness = (1 - clarity) * 0.5;
      Object.keys(state.awarenessMetrics).forEach(key => {
          state.awarenessMetrics[key] = state.awarenessMetrics[key] * clarity + 0.5 * clarityMuddiness;
      });

      // When valence is very high (joy), focus can sharpen non-linearly.
      if (valence > 0.9 && clarity > 0.7) {
          state.consciousnessVector.focus = Math.pow(state.consciousnessVector.focus, 0.8);
      }
      
      return state;
  }


  // --- Public API Methods ---

  /**
   * The primary method to update the agent's consciousness with new data.
   * It performs a full processing cycle: calculation, blending, and filtering.
   * @param {Object} inputs - An object containing all new data.
   * @param {Object} inputs.physiological - e.g., { heartRate, breathingRate, electrodermalActivity }
   * @param {Object} inputs.cognitive - e.g., { taskLoad, memoryRecallScore }
   * @param {Object} inputs.environmental - e.g., { noiseLevel, lightIntensity, socialDensity }
   * @param {Object} inputs.emotionalStimulus - e.g., { valence, arousal, eventSignificance }
   * @throws {InputValidationError} if the input object is malformed.
   * @throws {ConsciousnessProcessingError} if calculation fails.
   */
  updateState(inputs) {
    this._validateInputs(inputs);

    const inertia = this.#config.stateInertia;
    const influence = 1 - inertia;

    try {
      // 1. Calculate the raw impact of new inputs
      const newVector = this._calculateConsciousnessVector(inputs);
      const newAwareness = this._calculateAwarenessMetrics(inputs);
      const newEmotion = this._processEmotionalState(inputs);

      // 2. Blend new state with current state based on inertia
      let blendedState = {
        consciousnessVector: {},
        awarenessMetrics: {},
        emotionalState: {},
      };

      for (const key in newVector) {
        blendedState.consciousnessVector[key] = this._normalize(this.#currentState.consciousnessVector[key] * inertia + newVector[key] * influence);
      }
      for (const key in newAwareness) {
        blendedState.awarenessMetrics[key] = this._normalize(this.#currentState.awarenessMetrics[key] * inertia + newAwareness[key] * influence);
      }
      for (const key in newEmotion) {
        blendedState.emotionalState[key] = this._normalize(this.#currentState.emotionalState[key] * inertia + newEmotion[key] * influence);
      }
      
      // 3. Apply the subjective qualia filter
      const finalState = this._applyQualiaFilter(blendedState);

      // 4. Commit the new state
      this.#currentState = finalState;
      
    } catch (error) {
      // Re-throw internal errors as the specific processing error type
      if (error instanceof InputValidationError) throw error;
      throw new ConsciousnessProcessingError(`Failed to update state: ${error.message}`);
    }
  }

  /**
   * Simulates an intentional act of emotional regulation.
   * This models cognitive strategies like mindfulness or reappraisal.
   * @param {Object} targetState - The desired emotional state to move towards.
   * @param {number} [targetState.valence] - Target valence (0-1).
   * @param {number} [targetState.arousal] - Target arousal (0-1).
   * @param {number} [targetState.dominance] - Target dominance (0-1).
   * @param {number} [efficacy=0.5] - How effective the regulation attempt is (0-1).
   */
  simulateEmotionalRegulation(targetState, efficacy = 0.5) {
    if (efficacy < 0 || efficacy > 1) {
        throw new InputValidationError("Efficacy must be between 0 and 1.", { efficacy });
    }
    
    const currentEmotion = this.#currentState.emotionalState;
    for (const key in targetState) {
        if (key in currentEmotion) {
            const targetValue = this._normalize(targetState[key]);
            currentEmotion[key] += (targetValue - currentEmotion[key]) * efficacy;
        }
    }
    // Regulation can also increase meta-cognition and clarity.
    this.#currentState.consciousnessVector.metaCognition = this._normalize(this.#currentState.consciousnessVector.metaCognition + 0.1 * efficacy);
    this.#currentState.consciousnessVector.clarity = this._normalize(this.#currentState.consciousnessVector.clarity + 0.1 * efficacy);
  }

  /**
   * Simulates an empathetic resonance with another agent's emotional state.
   * The agent's own emotional state shifts slightly towards the other's.
   * @param {Object} otherEmotionalState - The VAD state of another agent.
   * @param {number} [empathyFactor=0.3] - The strength of the empathetic connection (0-1).
   * @returns {Object} The agent's new emotional state after resonance.
   */
  simulateEmpathyResonance(otherEmotionalState, empathyFactor = 0.3) {
      if (empathyFactor < 0 || empathyFactor > 1) {
          throw new InputValidationError("Empathy factor must be between 0 and 1.", { empathyFactor });
      }

      this.simulateEmotionalRegulation(otherEmotionalState, empathyFactor);
      
      // Empathetic acts can increase social awareness.
      this.#currentState.awarenessMetrics.social = this._normalize(this.#currentState.awarenessMetrics.social + 0.1 * empathyFactor);
      
      return this.getEmotionalState();
  }

  /**
   * Retrieves the complete, current state of the conscious agent.
   * @returns {Object} A deep copy of the current state object.
   */
  getFullState() {
    return JSON.parse(JSON.stringify(this.#currentState));
  }

  /**
   * Retrieves just the Consciousness State Vector.
   * @returns {Object} The { focus, clarity, metaCognition } vector.
   */
  getConsciousnessVector() {
    return { ...this.#currentState.consciousnessVector };
  }

  /**
   * Retrieves just the awareness metrics.
   * @returns {Object} The { sensory, somatic, temporal, social } metrics.
   */
  getAwarenessMetrics() {
    return { ...this.#currentState.awarenessMetrics };
  }

  /**
   * Retrieves just the emotional state.
   * @returns {Object} The { valence, arousal, dominance } state.
   */
  getEmotionalState() {
    return { ...this.#currentState.emotionalState };
  }
}
```