```javascript
/**
 * @module Consciousness
 * @description A sophisticated JavaScript module for simulating and enhancing core aspects of consciousness processing.
 * This module provides a framework for modeling awareness, emotional intelligence, and state of consciousness
 * based on simulated sensory and cognitive inputs. It is designed for use in advanced AI, robotics,
 * and computational psychology research.
 *
 * @version 2.0.0
 * @author AGI Research Collective
 * @license MIT
 */

// --- Custom Error Types for Clearer Debugging ---

/**
 * @class ConsciousnessInputError
 * @extends Error
 * @description Custom error for invalid input data supplied to the processor.
 */
class ConsciousnessInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessInputError';
  }
}

/**
 * @class ProcessorStateError
 * @extends Error
 * @description Custom error for operations on an invalid or uninitialized processor state.
 */
class ProcessorStateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProcessorStateError';
  }
}


// --- Type Definitions for JSDoc and IDE Intellisense ---

/**
 * @typedef {Object} SensoryInput
 * @property {('visual'|'auditory'|'tactile'|'olfactory'|'proprioceptive')} type - The modality of the sensory input.
 * @property {number} salience - A value from 0.0 to 1.0 indicating how much the stimulus stands out.
 * @property {*} data - The raw data of the stimulus (e.g., a string description, an object with features).
 * @property {number} timestamp - The time the input was received (e.g., Date.now()).
 */

/**
 * @typedef {Object} CognitiveInput
 * @property {string[]} activeThoughts - A list of current "thoughts" or internal monologue strings.
 * @property {Object.<string, number>} goalStates - Current goals and their perceived importance (0.0 to 1.0).
 * @property {number} selfReflectionLevel - A value from 0.0 to 1.0 indicating focus on internal state.
 */

/**
 * @typedef {Object} EmotionalInput
 * @property {string} emotion - The name of the emotion (e.g., 'joy', 'sadness', 'fear').
 * @property {number} intensity - A value from 0.0 to 1.0.
 */

/**
 * @typedef {Object} ProcessorInput
 * @property {SensoryInput[]} [sensory=[]] - An array of sensory inputs to process.
 * @property {CognitiveInput} [cognitive] - The current cognitive frame.
 * @property {EmotionalInput[]} [emotional=[]] - An array of newly registered emotional stimuli.
 */

/**
 * @typedef {Object} ConsciousnessState
 * @property {('Focused'|'Aware'|'Diffuse'|'Dreaming')} label - A high-level description of the consciousness state.
 * @property {number} focusContinuum - A numerical value from -1.0 (fully diffuse) to 1.0 (highly focused).
 * @property {number} qualiaIntegration - A score representing the richness and integration of sensory experience.
 */

/**
 * @typedef {Object} EmotionalState
 * @property {Map<string, number>} affectiveMap - A map of all current emotions and their intensities.
 * @property {number} emotionalDissonance - A metric for conflicting emotions (e.g., joy and sadness simultaneously).
 * @property {number} emotionalValence - The overall positive or negative leaning of the current emotional state.
 */

/**
 * @typedef {Object} AwarenessMetrics
 * @property {number} situationalCoherence - How well internal goals align with external stimuli (0.0 to 1.0).
 * @property {number} selfAwarenessIndex - A measure of introspective focus (0.0 to 1.0).
 * @property {number} externalSalienceRatio - The ratio of attention paid to external vs. internal events.
 */


/**
 * @class ConsciousnessProcessor
 * @description A class that simulates and processes consciousness states.
 * It integrates sensory, cognitive, and emotional data to produce high-level metrics
 * about awareness, focus, and emotional intelligence.
 */
class ConsciousnessProcessor {
  /**
   * Initializes the ConsciousnessProcessor.
   * @param {Object} [config={}] - Initial configuration.
   * @param {number} [config.decayRate=0.95] - The rate at which emotional and attentional states decay over time.
   * @param {number} [config.dissonanceThreshold=0.5] - The threshold for detecting significant emotional conflict.
   */
  constructor(config = {}) {
    this.config = {
      decayRate: config.decayRate || 0.95,
      dissonanceThreshold: config.dissonanceThreshold || 0.5,
    };

    /**
     * @private
     * @type {EmotionalState}
     * @description The core emotional state of the processor.
     */
    this._emotionalState = {
      affectiveMap: new Map(),
      emotionalDissonance: 0,
      emotionalValence: 0,
    };

    /**
     * @private
     * @type {ConsciousnessState}
     * @description The core consciousness state.
     */
    this._consciousnessState = {
      label: 'Diffuse',
      focusContinuum: 0,
      qualiaIntegration: 0,
    };

    /**
     * @private
     * @type {AwarenessMetrics}
     * @description The core awareness metrics.
     */
    this._awarenessMetrics = {
      situationalCoherence: 0,
      selfAwarenessIndex: 0,
      externalSalienceRatio: 0.5,
    };

    /**
     * @private
     * @type {number}
     * @description Timestamp of the last processing cycle.
     */
    this._lastUpdateTimestamp = Date.now();
  }

  /**
   * Validates the structure of the main input object.
   * @private
   * @param {ProcessorInput} input - The input data to validate.
   * @throws {ConsciousnessInputError} If the input is malformed.
   */
  _validateInput(input) {
    if (typeof input !== 'object' || input === null) {
      throw new ConsciousnessInputError('Input must be a non-null object.');
    }
    if (input.sensory && !Array.isArray(input.sensory)) {
      throw new ConsciousnessInputError('Input property "sensory" must be an array.');
    }
    if (input.emotional && !Array.isArray(input.emotional)) {
      throw new ConsciousnessInputError('Input property "emotional" must be an array.');
    }
    if (input.cognitive && (typeof input.cognitive !== 'object' || input.cognitive === null)) {
        throw new ConsciousnessInputError('Input property "cognitive" must be a non-null object.');
    }
  }

  /**
   * Processes a new set of inputs, updating the internal state of consciousness.
   * This is the main entry point for feeding data into the module.
   *
   * @param {ProcessorInput} input - The combined sensory, cognitive, and emotional input.
   * @returns {{consciousness: ConsciousnessState, awareness: AwarenessMetrics, emotions: EmotionalState}} An object containing the full updated state.
   *
   * @example
   * const processor = new ConsciousnessProcessor();
   * const input = {
   *   sensory: [{ type: 'visual', salience: 0.9, data: 'red ball approaching', timestamp: Date.now() }],
   *   cognitive: { activeThoughts: ['I should catch it'], goalStates: { 'catchBall': 0.95 }, selfReflectionLevel: 0.1 },
   *   emotional: [{ emotion: 'anticipation', intensity: 0.8 }]
   * };
   * const newState = processor.process(input);
   * console.log(newState.consciousness.label); // Likely 'Focused'
   */
  process(input) {
    this._validateInput(input);
    
    // Apply time-based decay to all states before processing new input
    this._applyDecay();

    // Deconstruct input with defaults for robustness
    const { sensory = [], cognitive = {}, emotional = [] } = input;

    // 1. Enhance Emotional Intelligence Processing
    this._updateEmotionalState(emotional);

    // 2. Add New Awareness Metrics
    this._updateAwarenessMetrics(sensory, cognitive);

    // 3. Improve Consciousness State Calculations
    this._updateConsciousnessState(sensory, cognitive);

    this._lastUpdateTimestamp = Date.now();

    return {
      consciousness: this.getConsciousnessState(),
      awareness: this.getAwarenessMetrics(),
      emotions: this.getEmotionalState(),
    };
  }
  
  /**
   * Applies a decay factor to volatile states like emotion and focus over time.
   * This simulates the natural fading of attention and feelings.
   * @private
   */
  _applyDecay() {
    // Decay emotional intensities
    for (const [emotion, intensity] of this._emotionalState.affectiveMap.entries()) {
        const newIntensity = intensity * this.config.decayRate;
        if (newIntensity < 0.01) {
            this._emotionalState.affectiveMap.delete(emotion);
        } else {
            this._emotionalState.affectiveMap.set(emotion, newIntensity);
        }
    }
    // Recalculate emotional state after decay
    this._recalculateEmotionalMetrics();

    // Decay consciousness and awareness metrics towards a neutral baseline
    this._consciousnessState.focusContinuum *= this.config.decayRate;
    this._consciousnessState.qualiaIntegration *= this.config.decayRate;
    this._awarenessMetrics.situationalCoherence *= this.config.decayRate;
    this._awarenessMetrics.selfAwarenessIndex *= this.config.decayRate;
  }

  /**
   * Updates the internal emotional state based on new inputs.
   * Handles emotional blending, intensity updates, and dissonance calculation.
   * @private
   * @param {EmotionalInput[]} newEmotions - New emotional stimuli.
   */
  _updateEmotionalState(newEmotions) {
    newEmotions.forEach(({ emotion, intensity }) => {
      const currentIntensity = this._emotionalState.affectiveMap.get(emotion) || 0;
      // New emotions are additive but capped at 1.0
      const newIntensity = Math.min(1.0, currentIntensity + intensity);
      this._emotionalState.affectiveMap.set(emotion, newIntensity);
    });
    
    this._recalculateEmotionalMetrics();
  }
  
  /**
   * Recalculates aggregate emotional metrics like valence and dissonance.
   * @private
   */
  _recalculateEmotionalMetrics() {
    const emotionValenceMap = { // Simplified valence mapping
        'joy': 1, 'trust': 0.8, 'anticipation': 0.2, 'surprise': 0.1,
        'sadness': -1, 'disgust': -0.8, 'anger': -0.7, 'fear': -0.9,
    };
    const emotionOpposites = {
        'joy': 'sadness', 'sadness': 'joy',
        'trust': 'disgust', 'disgust': 'trust',
        'fear': 'anger', 'anger': 'fear',
        'anticipation': 'surprise', 'surprise': 'anticipation',
    };

    let totalIntensity = 0;
    let weightedValence = 0;
    let dissonance = 0;

    for (const [emotion, intensity] of this._emotionalState.affectiveMap.entries()) {
        totalIntensity += intensity;
        weightedValence += (emotionValenceMap[emotion] || 0) * intensity;

        // Calculate dissonance
        const opposite = emotionOpposites[emotion];
        if (opposite && this._emotionalState.affectiveMap.has(opposite)) {
            const oppositeIntensity = this._emotionalState.affectiveMap.get(opposite);
            // Dissonance is the product of the intensities of opposing emotions
            dissonance += intensity * oppositeIntensity;
        }
    }
    
    this._emotionalState.emotionalValence = totalIntensity > 0 ? weightedValence / totalIntensity : 0;
    // Normalize dissonance by the number of potential pairs to keep it manageable
    this._emotionalState.emotionalDissonance = Math.min(1.0, dissonance);
  }

  /**
   * Updates awareness metrics based on sensory and cognitive data.
   * @private
   * @param {SensoryInput[]} sensory - Sensory inputs.
   * @param {CognitiveInput} cognitive - Cognitive frame.
   */
  _updateAwarenessMetrics(sensory, cognitive) {
    // 1. Self-Awareness Index
    this._awarenessMetrics.selfAwarenessIndex = cognitive.selfReflectionLevel || this._awarenessMetrics.selfAwarenessIndex;

    // 2. Situational Coherence
    let totalGoalImportance = 0;
    let weightedCoherence = 0;
    if (cognitive.goalStates && Object.keys(cognitive.goalStates).length > 0) {
        // A simple model: coherence is high if sensory input is salient and aligns with a primary goal.
        // This could be replaced with a more complex semantic matching algorithm.
        const primaryGoal = Object.keys(cognitive.goalStates).reduce((a, b) => cognitive.goalStates[a] > cognitive.goalStates[b] ? a : b);
        const mostSalientInput = sensory.reduce((max, s) => s.salience > max.salience ? s : max, {salience: 0});
        
        if (mostSalientInput.salience > 0.5 && cognitive.goalStates[primaryGoal] > 0.5) {
            // A placeholder for true semantic analysis
            const goalInThought = cognitive.activeThoughts.some(t => t.includes(primaryGoal.replace(/([A-Z])/g, ' $1').toLowerCase()));
            if (goalInThought) {
                weightedCoherence = (mostSalientInput.salience + cognitive.goalStates[primaryGoal]) / 2;
            }
        }
    }
    this._awarenessMetrics.situationalCoherence = weightedCoherence;

    // 3. External Salience Ratio
    const totalExternalSalience = sensory.reduce((sum, s) => sum + s.salience, 0);
    const totalInternalSalience = (cognitive.selfReflectionLevel || 0) + 
                                  Object.values(cognitive.goalStates || {}).reduce((sum, i) => sum + i, 0);
    const totalSalience = totalExternalSalience + totalInternalSalience;
    if (totalSalience > 0) {
        this._awarenessMetrics.externalSalienceRatio = totalExternalSalience / totalSalience;
    }
  }

  /**
   * Updates the primary consciousness state (Focus-Diffusion spectrum).
   * @private
   * @param {SensoryInput[]} sensory - Sensory inputs.
   * @param {CognitiveInput} cognitive - Cognitive frame.
   */
  _updateConsciousnessState(sensory, cognitive) {
    const numInputs = sensory.length;
    const avgSalience = numInputs > 0 ? sensory.reduce((sum, s) => sum + s.salience, 0) / numInputs : 0;
    const variety = new Set(sensory.map(s => s.type)).size;

    // Qualia Integration: richness of experience. Higher with more varied and salient sensory input.
    this._consciousnessState.qualiaIntegration = Math.min(1.0, (avgSalience * (1 + variety / 5)));

    // Focus Continuum:
    // High focus = high salience, low variety, strong goals.
    // Diffuse = low salience, high variety, weak goals.
    const goalStrength = Object.values(cognitive.goalStates || {}).reduce((sum, i) => sum + i, 0);
    const focusPull = (avgSalience * 2 + goalStrength) / 3;
    const diffusionPull = (1 - avgSalience) * (variety / 5);
    
    this._consciousnessState.focusContinuum = Math.max(-1.0, Math.min(1.0, focusPull - diffusionPull));

    // Determine descriptive label
    if (this._consciousnessState.focusContinuum > 0.6) {
        this._consciousnessState.label = 'Focused';
    } else if (this._consciousnessState.focusContinuum > 0.1) {
        this._consciousnessState.label = 'Aware';
    } else if (this._consciousnessState.focusContinuum > -0.5) {
        this._consciousnessState.label = 'Diffuse';
    } else {
        this._consciousnessState.label = 'Dreaming'; // High internal activity, low external focus
    }
  }

  /**
   * Projects an empathetic response to another agent's emotional state.
   * This is an advanced emotional intelligence function that simulates understanding.
   * It does not permanently alter the processor's own state.
   *
   * @param {Object} params
   * @param {EmotionalInput[]} params.targetEmotions - The observed emotions of the target.
   * @returns {{empathyResonance: number, affectiveGap: number}} An object describing the empathetic connection.
   *          - empathyResonance: How closely the processor's state can mirror the target's (0.0 to 1.0).
   *          - affectiveGap: The overall emotional distance between processor and target.
   */
  projectEmpathy({ targetEmotions }) {
    if (!Array.isArray(targetEmotions)) {
        throw new ConsciousnessInputError('targetEmotions must be an array.');
    }

    const targetAffectiveMap = new Map();
    targetEmotions.forEach(e => targetAffectiveMap.set(e.emotion, e.intensity));

    let sharedIntensity = 0;
    let totalTargetIntensity = 0;
    let affectiveGap = 0;

    const allEmotions = new Set([...this._emotionalState.affectiveMap.keys(), ...targetAffectiveMap.keys()]);

    for (const emotion of allEmotions) {
        const selfIntensity = this._emotionalState.affectiveMap.get(emotion) || 0;
        const targetIntensity = targetAffectiveMap.get(emotion) || 0;
        
        sharedIntensity += Math.min(selfIntensity, targetIntensity);
        totalTargetIntensity += targetIntensity;
        affectiveGap += Math.abs(selfIntensity - targetIntensity);
    }

    const empathyResonance = totalTargetIntensity > 0 ? sharedIntensity / totalTargetIntensity : 1; // Perfect resonance if target is neutral

    return { empathyResonance, affectiveGap };
  }


  // --- Public Getters for State Access ---

  /**
   * Retrieves the current, fully calculated consciousness state.
   * @returns {ConsciousnessState}
   */
  getConsciousnessState() {
    return { ...this._consciousnessState };
  }

  /**
   * Retrieves the current, fully calculated emotional state.
   * @returns {EmotionalState}
   */
  getEmotionalState() {
    // Return a deep copy to prevent mutation of the internal state map
    return { 
        ...this._emotionalState,
        affectiveMap: new Map(this._emotionalState.affectiveMap)
    };
  }

  /**
   * Retrieves the current, fully calculated awareness metrics.
   * @returns {AwarenessMetrics}
   */
  getAwarenessMetrics() {
    return { ...this._awarenessMetrics };
  }
}

module.exports = ConsciousnessProcessor;
```