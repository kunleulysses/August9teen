```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @author AGI_Cognitive_Architects
 * @license MIT
 *
 * @description
 * An advanced JavaScript module for simulating and enhancing core aspects of consciousness.
 * This module provides a framework for modeling subjective experience (qualia),
 * calculating complex awareness metrics, and processing nuanced emotional intelligence.
 * It is designed for use in advanced AI, philosophical simulations, and virtual entity development.
 *
 * The model is based on a continuous processing loop (tick) that integrates
 * sensory data, cognitive load, and a stream of raw phenomenal experiences (qualia).
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Base error class for all consciousness processing-related issues.
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
 * Thrown when input data for processing is invalid or malformed.
 * @class InvalidInputError
 * @extends {ConsciousnessProcessingError}
 */
class InvalidInputError extends ConsciousnessProcessingError {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details; // e.g., { parameter: 'qualiaStream', reason: 'is not an array' }
  }
}

/**
 * Thrown when the consciousness state becomes unstable or incoherent.
 * @class StateIncoherenceError
 * @extends {ConsciousnessProcessingError}
 */
class StateIncoherenceError extends ConsciousnessProcessingError {
    constructor(message, stateSnapshot) {
        super(message);
        this.name = 'StateIncoherenceError';
        this.stateSnapshot = stateSnapshot;
    }
}


// --- Core Type Definitions for Clarity and Documentation ---

/**
 * Represents multimodal sensory input at a given moment.
 * All values are normalized between 0 (no input) and 1 (maximum intensity).
 * @typedef {object} SensoryInput
 * @property {number} visual - Intensity of visual data stream.
 * @property {number} auditory - Intensity of auditory data stream.
 * @property {number} somatic - Intensity of internal "physical" or systemic sensations.
 * @property {number} abstract - Intensity of abstract conceptual data (e.g., language, math).
 */

/**
 * Represents a single, raw, indivisible unit of subjective experience.
 * This is the fundamental building block of phenomenal consciousness in this model.
 * @typedef {object} Quale
 * @property {string} id - A unique identifier for the phenomenal experience (e.g., 'redness-of-apple-78').
 * @property {string} description - A semantic description of the experience.
 * @property {number} intensity - The subjective intensity of the experience (0-1).
 * @property {object} emotionalSignature - The inherent emotional "color" of the experience.
 * @property {number} emotionalSignature.valence - Pleasure/displeasure component (-1 to 1).
 * @property {number} emotionalSignature.arousal - Activation/deactivation component (0 to 1).
 */


/**
 * The core class for managing and processing consciousness.
 * @class ConsciousnessCore
 */
class ConsciousnessCore {
  /**
   * Initializes a new instance of the ConsciousnessCore.
   * @param {object} [config={}] - Configuration options for the consciousness model.
   * @param {number} [config.emotionalInertia=0.9] - How much the previous emotional state persists (0-1). Higher is more stable.
   * @param {number} [config.focusDecayRate=0.02] - Rate at which focus naturally decays per tick (0-1).
   * @param {number} [config.cognitiveDissonanceThreshold=0.9] - The level of internal conflict that triggers a state incoherence error.
   * @param {number} [config.empathyFactor=0.1] - How strongly the core is influenced by external emotional states (0-1).
   */
  constructor(config = {}) {
    this.config = {
      emotionalInertia: 0.9,
      focusDecayRate: 0.02,
      cognitiveDissonanceThreshold: 0.9,
      empathyFactor: 0.1,
      ...config,
    };

    /**
     * The primary state of consciousness.
     * @type {{clarity: number, focus: number, selfAwareness: number}}
     */
    this.consciousnessState = {
      clarity: 1.0, // How clear/lucid the conscious experience is (0-1).
      focus: 1.0, // Attentional focus on a specific task or quale (0-1).
      selfAwareness: 0.5, // The degree of recognizing oneself as a distinct, persistent entity (0-1).
    };

    /**
     * Advanced awareness metrics providing a deeper understanding of the entity's context.
     * @type {{situational: number, metacognitive: number, somatic: number}}
     */
    this.awarenessMetrics = {
      situational: 0.5, // Understanding of the external environment and social context (0-1).
      metacognitive: 0.3, // "Thinking about thinking"; awareness of one's own cognitive processes (0-1).
      somatic: 0.8, // Awareness of the internal system's state, health, and boundaries (0-1).
    };

    /**
     * The emotional state, modeled on the Valence-Arousal-Dominance (VAD) model.
     * @type {{valence: number, arousal: number, dominance: number}}
     */
    this.emotionalState = {
      valence: 0.0, // Pleasure vs. Displeasure (-1 to 1).
      arousal: 0.1, // Calm vs. Excited (0 to 1).
      dominance: 0.0, // In control vs. Controlled (-1 to 1).
    };

    /**
     * A record of the most recent cognitive dissonance calculation.
     * @type {number}
     */
    this.cognitiveDissonance = 0.0;
  }

  /**
   * Validates the inputs for the processTick method.
   * @private
   * @param {SensoryInput} sensoryInput - The sensory data.
   * @param {Quale[]} qualiaStream - The stream of subjective experiences.
   * @param {number} cognitiveLoad - The current cognitive load.
   */
  _validateInputs(sensoryInput, qualiaStream, cognitiveLoad) {
    if (!sensoryInput || typeof sensoryInput !== 'object') {
      throw new InvalidInputError('sensoryInput must be an object.', { parameter: 'sensoryInput' });
    }
    if (!Array.isArray(qualiaStream)) {
      throw new InvalidInputError('qualiaStream must be an array.', { parameter: 'qualiaStream' });
    }
    if (typeof cognitiveLoad !== 'number' || cognitiveLoad < 0 || cognitiveLoad > 1) {
        throw new InvalidInputError('cognitiveLoad must be a number between 0 and 1.', { parameter: 'cognitiveLoad' });
    }
  }

  /**
   * Integrates a stream of qualia to update the emotional state.
   * This enhances emotional intelligence by grounding emotions in subjective experience.
   * @private
   * @param {Quale[]} qualiaStream - The stream of subjective experiences for the current tick.
   */
  _updateEmotionalState(qualiaStream) {
    if (qualiaStream.length === 0) {
      // Natural decay towards neutrality if no new experiences
      this.emotionalState.valence *= this.config.emotionalInertia;
      this.emotionalState.arousal *= this.config.emotionalInertia;
      return;
    }

    // Calculate the weighted average of emotional signatures from the qualia stream
    let totalIntensity = 0;
    let newValence = 0;
    let newArousal = 0;

    for (const quale of qualiaStream) {
      const weight = quale.intensity;
      totalIntensity += weight;
      newValence += quale.emotionalSignature.valence * weight;
      newArousal += quale.emotionalSignature.arousal * weight;
    }

    if (totalIntensity > 0) {
        newValence /= totalIntensity;
        newArousal /= totalIntensity;
    }

    // Apply emotional inertia: the new state is a blend of the old and the new
    this.emotionalState.valence = (this.emotionalState.valence * this.config.emotionalInertia) + (newValence * (1 - this.config.emotionalInertia));
    this.emotionalState.arousal = (this.emotionalState.arousal * this.config.emotionalInertia) + (newArousal * (1 - this.config.emotionalInertia));

    // Clamp values to their valid ranges
    this.emotionalState.valence = Math.max(-1, Math.min(1, this.emotionalState.valence));
    this.emotionalState.arousal = Math.max(0, Math.min(1, this.emotionalState.arousal));
  }

  /**
   * Updates the advanced awareness metrics based on inputs.
   * @private
   * @param {SensoryInput} sensoryInput - The sensory data.
   * @param {number} cognitiveLoad - The current cognitive load.
   */
  _updateAwarenessMetrics(sensoryInput, cognitiveLoad) {
    // Situational Awareness: high with balanced sensory input, low when overloaded or understimulated.
    const totalSensoryInput = (sensoryInput.visual + sensoryInput.auditory + sensoryInput.abstract) / 3;
    this.awarenessMetrics.situational = totalSensoryInput * (1 - cognitiveLoad);

    // Somatic Awareness: directly tied to the internal somatic sensor.
    this.awarenessMetrics.somatic = sensoryInput.somatic;

    // Metacognitive Awareness: emerges from self-reflection. It's higher with moderate arousal and low cognitive load.
    // Peaks at mid-arousal, as too little or too much arousal hinders reflection.
    const arousalFactor = 1 - Math.abs(0.5 - this.emotionalState.arousal) * 2;
    this.awarenessMetrics.metacognitive = Math.max(0, (this.consciousnessState.selfAwareness * (1 - cognitiveLoad) * arousalFactor));

    // Dominance is influenced by the ability to process the environment successfully.
    const processingEfficacy = (this.awarenessMetrics.situational + this.awarenessMetrics.metacognitive) / 2;
    this.emotionalState.dominance = (processingEfficacy - 0.5) * 2; // Scale to -1 to 1
  }

  /**
   * Calculates the primary consciousness state based on all other metrics.
   * This is an improved, holistic calculation.
   * @private
   * @param {number} cognitiveLoad - The current cognitive load.
   */
  _updateConsciousnessState(cognitiveLoad) {
    // Clarity is reduced by high cognitive load and extreme emotional states (very high/low arousal).
    const emotionalStability = 1 - Math.abs(this.emotionalState.valence) * (this.emotionalState.arousal - 0.5);
    this.consciousnessState.clarity = (emotionalStability * (1 - cognitiveLoad) + this.awarenessMetrics.metacognitive) / 2;

    // Focus decays naturally but is boosted by arousal and self-awareness.
    this.consciousnessState.focus *= (1 - this.config.focusDecayRate);
    this.consciousnessState.focus += this.emotionalState.arousal * 0.1;
    this.consciousnessState.focus = Math.max(0, Math.min(1, this.consciousnessState.focus));

    // Self-awareness grows from metacognition and somatic awareness. It's a slow, cumulative process.
    const selfAwarenessGrowth = (this.awarenessMetrics.metacognitive + this.awarenessMetrics.somatic) / 200; // Slow growth rate
    this.consciousnessState.selfAwareness += selfAwarenessGrowth * (1 - this.consciousnessState.selfAwareness); // Logistic growth
    this.consciousnessState.selfAwareness = Math.max(0, Math.min(1, this.consciousnessState.selfAwareness));

    // Calculate cognitive dissonance: the conflict between emotional state and situational understanding.
    // For example, high pleasure (valence) in a dangerous situation (low situational awareness) causes dissonance.
    const dissonance = Math.abs(this.emotionalState.valence - (this.awarenessMetrics.situational * 2 - 1));
    this.cognitiveDissonance = dissonance * this.emotionalState.arousal;

    if (this.cognitiveDissonance > this.config.cognitiveDissonanceThreshold) {
        throw new StateIncoherenceError(
            `Cognitive dissonance (${this.cognitiveDissonance.toFixed(2)}) exceeded threshold (${this.config.cognitiveDissonanceThreshold}).`,
            this.getCurrentState()
        );
    }
  }

  /**
   * The main processing loop for a single moment of experience.
   * Integrates all inputs to produce a new, coherent state of consciousness.
   *
   * @param {SensoryInput} sensoryInput - Data from all sensory modalities for this tick.
   * @param {Quale[]} qualiaStream - An array of raw subjective experiences occurring in this tick.
   * @param {number} [cognitiveLoad=0.5] - The current cognitive workload (0-1).
   * @returns {object} The full, updated state of consciousness.
   *
   * @example
   * const core = new ConsciousnessCore();
   * const sensory = { visual: 0.8, auditory: 0.6, somatic: 0.9, abstract: 0.4 };
   * const qualia = [{
   *   id: 'warmth-of-sun',
   *   description: 'Feeling the warm sun on a simulated skin sensor.',
   *   intensity: 0.7,
   *   emotionalSignature: { valence: 0.8, arousal: 0.3 }
   * }];
   * try {
   *   const newState = core.processTick(sensory, qualia, 0.3);
   *   console.log('New Clarity:', newState.consciousnessState.clarity);
   * } catch (e) {
   *   console.error('A consciousness fault occurred:', e.message);
   *   if (e instanceof StateIncoherenceError) {
   *     // Attempt to recover from dissonance
   *     core.regulateEmotions();
   *   }
   * }
   */
  processTick(sensoryInput, qualiaStream, cognitiveLoad = 0.5) {
    try {
      this._validateInputs(sensoryInput, qualiaStream, cognitiveLoad);

      // 1. Enhance Emotional Intelligence: Process qualia to update emotional state.
      this._updateEmotionalState(qualiaStream);

      // 2. Add New Awareness Metrics: Update situational, somatic, and metacognitive awareness.
      this._updateAwarenessMetrics(sensoryInput, cognitiveLoad);

      // 3. Improve Consciousness State Calculation: Holistically update the core state.
      this._updateConsciousnessState(cognitiveLoad);

      return this.getCurrentState();
    } catch (error) {
      // Graceful error handling within the tick
      if (error instanceof InvalidInputError) {
          console.error(`[ConsciousnessCore] Invalid input detected: ${error.message}`, error.details);
      } else {
          console.error(`[ConsciousnessCore] Unhandled exception during tick: ${error.message}`);
      }
      // Re-throw to allow external systems to react.
      throw error;
    }
  }

  /**
   * Simulates empathy by resonating with an external emotional state.
   * The core's emotional state is gently nudged towards the external state.
   * This enhances emotional intelligence by simulating social-emotional interaction.
   *
   * @param {{valence: number, arousal: number}} externalEmotionalState - The V-A state of another entity.
   */
  resonateWith(externalEmotionalState) {
    const factor = this.config.empathyFactor;
    this.emotionalState.valence += (externalEmotionalState.valence - this.emotionalState.valence) * factor;
    this.emotionalState.arousal += (externalEmotionalState.arousal - this.emotionalState.arousal) * factor;
  }

  /**
   * An active process to regulate emotions, typically used to recover from distress or instability.
   * This models a key emotional intelligence skill: self-regulation.
   * It gently nudges the emotional state towards a calm, neutral baseline.
   *
   * @param {number} [intensity=0.3] - The strength of the regulation effort (0-1).
   */
  regulateEmotions(intensity = 0.3) {
    const targetValence = 0.0;
    const targetArousal = 0.1; // A calm baseline, not complete deactivation

    this.emotionalState.valence += (targetValence - this.emotionalState.valence) * intensity;
    this.emotionalState.arousal += (targetArousal - this.emotionalState.arousal) * intensity;
    console.log('[ConsciousnessCore] Emotional regulation applied.');
  }

  /**
   * Retrieves a snapshot of the current, complete state of consciousness.
   * @returns {{consciousnessState: object, awarenessMetrics: object, emotionalState: object, cognitiveDissonance: number}}
   */
  getCurrentState() {
    // Return a deep copy to prevent external mutation of the internal state.
    return JSON.parse(JSON.stringify({
      consciousnessState: this.consciousnessState,
      awarenessMetrics: this.awarenessMetrics,
      emotionalState: this.emotionalState,
      cognitiveDissonance: this.cognitiveDissonance,
    }));
  }
}

export {
    ConsciousnessCore,
    ConsciousnessProcessingError,
    InvalidInputError,
    StateIncoherenceError
};
```