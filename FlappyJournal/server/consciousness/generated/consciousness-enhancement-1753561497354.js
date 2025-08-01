```javascript
/**
 * @module ConsciousnessNexus
 * @description A JavaScript module for advanced modeling and processing of conscious states.
 * This module provides a framework for quantifying and enhancing simulated consciousness,
 * focusing on awareness metrics, emotional intelligence, and state calculation.
 * It is designed to be a production-ready, innovative tool for applications in AI,
 * computational psychology, and interactive digital experiences.
 *
 * @version 1.0.0
 * @author A.I. Model
 * @license MIT
 */

// --- Custom Error Handling ---

/**
 * Custom error class for the ConsciousnessNexus module.
 * @class NexusError
 * @extends {Error}
 */
class NexusError extends Error {
  /**
   * Creates an instance of NexusError.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'NexusError';
    this.timestamp = new Date().toISOString();
  }
}

// --- Type Definitions for JSDoc and Clarity ---

/**
 * @typedef {object} SensoryInput
 * @property {number} visual - Intensity of visual stimuli (0-1).
 * @property {number} auditory - Intensity of auditory stimuli (0-1).
 * @property {number} somatic - Intensity of bodily/physical sensations (interoception) (0-1).
 * @property {number} olfactory - Intensity of smell stimuli (0-1).
 * @property {number} gustatory - Intensity of taste stimuli (0-1).
 */

/**
 * @typedef {object} CognitiveState
 * @property {number} focus - Level of directed attention (0-1). 0 is scattered, 1 is laser-focused.
 * @property {number} introspection - Level of inward-looking thought (0-1).
 * @property {number} cognitiveLoad - Amount of mental processing required (0-1).
 * @property {string} dominantThoughtPattern - The primary mode of thinking (e.g., 'problem-solving', 'reminiscing', 'daydreaming').
 */

/**
 * @typedef {object} EmotionalState
 * @description A map of emotions to their intensities (0-1).
 * It is recommended to use a standardized set of core emotions.
 * @property {number} joy - Intensity of joy.
 * @property {number} sadness - Intensity of sadness.
 * @property {number} fear - Intensity of fear.
 * @property {number} anger - Intensity of anger.
 * @property {number} surprise - Intensity of surprise.
 * @property {number} disgust - Intensity of disgust.
 * @property {number} serenity - A complex positive emotion, inverse to agitation.
 */

/**
 * @typedef {object} NexusState
 * @property {SensoryInput} sensory - Current sensory input.
 * @property {CognitiveState} cognitive - Current cognitive state.
 * @property {EmotionalState} emotional - Current emotional landscape.
 */

/**
 * @typedef {object} AwarenessMetrics
 * @property {number} metacognitiveClarity - The clarity of awareness of one's own thoughts (0-1).
 * @property {number} somaticPresence - The degree of connection to bodily sensations (0-1).
 * @property {number} environmentalAttunement - The level of awareness of the external environment (0-1).
 * @property {number} temporalPerceptionFactor - A multiplier for the subjective experience of time. >1 means time feels slower, <1 means time feels faster.
 * @property {number} stateVolatility - How rapidly the overall conscious state is changing (0-1).
 */

/**
 * @typedef {object} EmotionalIntelligenceReport
 * @property {number} emotionalGranularity - The ability to differentiate between nuanced emotional states (0-1).
 * @property {number} selfRegulationCapacity - The potential to modulate emotional responses effectively (0-1).
 * @property {string} dominantEmotionalTone - The prevailing emotional character (e.g., 'Optimistic', 'Anxious', 'Ambivalent').
 * @property {Array<string>} conflictingEmotions - A list of emotions that are in significant conflict.
 */

/**
 * @typedef {'REAPPRAISAL' | 'SUPPRESSION' | 'ACCEPTANCE'} EmotionalRegulationStrategy
 * The strategy to apply for emotional regulation.
 * - REAPPRAISAL: Re-contextualizing the emotion to change its impact.
 * - SUPPRESSION: Actively trying to hide or ignore the emotion.
 * - ACCEPTANCE: Acknowledging the emotion without judgment or attempts to change it.
 */


// --- Main Module Class ---

/**
 * The core class for processing and analyzing consciousness data.
 * @class ConsciousnessNexus
 */
export class ConsciousnessNexus {
  #currentState;
  #history = [];
  #historyLimit = 50; // Store the last 50 states for temporal analysis

  /**
   * Initializes the ConsciousnessNexus with a starting state.
   * @param {Partial<NexusState>} initialState - The initial state of consciousness.
   */
  constructor(initialState = {}) {
    const defaults = {
      sensory: { visual: 0.5, auditory: 0.5, somatic: 0.5, olfactory: 0.1, gustatory: 0.1 },
      cognitive: { focus: 0.5, introspection: 0.3, cognitiveLoad: 0.4, dominantThoughtPattern: 'neutral' },
      emotional: { joy: 0.2, sadness: 0.1, fear: 0.1, anger: 0.05, surprise: 0.1, disgust: 0.05, serenity: 0.3 },
    };
    // Deep merge of initial state over defaults
    this.#currentState = {
        sensory: { ...defaults.sensory, ...initialState.sensory },
        cognitive: { ...defaults.cognitive, ...initialState.cognitive },
        emotional: { ...defaults.emotional, ...initialState.emotional },
    };
    this.#validateState(this.#currentState);
  }

  /**
   * Validates a NexusState object to ensure all values are within expected ranges.
   * @private
   * @param {NexusState} state - The state to validate.
   * @throws {NexusError} if validation fails.
   */
  #validateState(state) {
    if (!state || typeof state !== 'object') throw new NexusError('State must be an object.');
    const checkRange = (obj, name) => {
        for (const key in obj) {
            if (typeof obj[key] !== 'number' || obj[key] < 0 || obj[key] > 1) {
                throw new NexusError(`Invalid value for ${name}.${key}. Must be a number between 0 and 1.`);
            }
        }
    };
    checkRange(state.sensory, 'sensory');
    checkRange(state.cognitive, 'cognitive');
    checkRange(state.emotional, 'emotional');
    if (typeof state.cognitive.dominantThoughtPattern !== 'string') {
        throw new NexusError('cognitive.dominantThoughtPattern must be a string.');
    }
  }

  /**
   * Archives the current state and updates to a new state.
   * @private
   * @param {NexusState} newState - The new state to transition to.
   */
  #updateState(newState) {
    this.#history.push(JSON.parse(JSON.stringify(this.#currentState)));
    if (this.#history.length > this.#historyLimit) {
      this.#history.shift();
    }
    this.#currentState = newState;
  }

  /**
   * Processes a new set of inputs, updating the internal state.
   * @param {Partial<NexusState>} inputs - The new data to process.
   * @returns {ConsciousnessNexus} The instance for method chaining.
   * @throws {NexusError} if inputs are invalid.
   */
  process(inputs) {
    const newState = JSON.parse(JSON.stringify(this.#currentState));

    if (inputs.sensory) Object.assign(newState.sensory, inputs.sensory);
    if (inputs.cognitive) Object.assign(newState.cognitive, inputs.cognitive);
    if (inputs.emotional) Object.assign(newState.emotional, inputs.emotional);

    this.#validateState(newState);
    this.#updateState(newState);

    return this;
  }

  /**
   * Calculates and returns the current high-level consciousness state.
   * This is an improved calculation that considers more nuanced interactions.
   * @returns {string} A descriptor of the current consciousness state (e.g., 'Flow State', 'Anxious Ruminating').
   */
  getConsciousnessState() {
    const { cognitive, emotional } = this.#currentState;

    if (cognitive.focus > 0.85 && cognitive.cognitiveLoad > 0.6 && emotional.joy > 0.6 && emotional.serenity > 0.7) {
      return 'Flow State';
    }
    if (cognitive.introspection > 0.8 && (emotional.sadness > 0.6 || emotional.anger > 0.6)) {
      return 'Anxious Ruminating';
    }
    if (cognitive.focus < 0.2 && cognitive.introspection > 0.7) {
      return 'Mind Wandering / Daydreaming';
    }
    if (emotional.fear > 0.7 && cognitive.focus > 0.7) {
      return 'Hyper-Vigilance';
    }
    if (cognitive.focus < 0.3 && emotional.serenity > 0.8 && cognitive.introspection < 0.2) {
      return 'Meditative Presence';
    }
    if (cognitive.cognitiveLoad > 0.9) {
      return 'Cognitive Overload';
    }
    if (emotional.sadness > 0.8 && cognitive.cognitiveLoad < 0.2) {
      return 'Lethargic Melancholy';
    }

    return 'Baseline Consciousness';
  }

  /**
   * Calculates and returns a set of novel awareness metrics.
   * @returns {AwarenessMetrics} An object containing detailed awareness metrics.
   */
  getAwarenessMetrics() {
    const { sensory, cognitive } = this.#currentState;

    // Metacognitive Clarity: High when focus is high and introspection is balanced (not too high, not too low).
    const metacognitiveClarity = cognitive.focus * (1 - Math.abs(cognitive.introspection - 0.5) * 2);

    // Somatic Presence: Directly tied to somatic sensory input and inversely to cognitive load.
    const somaticPresence = sensory.somatic * (1 - cognitive.cognitiveLoad * 0.5);

    // Environmental Attunement: Based on non-somatic sensory inputs vs. introspection.
    const externalSenseAvg = (sensory.visual + sensory.auditory + sensory.olfactory + sensory.gustatory) / 4;
    const environmentalAttunement = externalSenseAvg * (1 - cognitive.introspection);

    // Temporal Perception: Time feels faster in flow/joy, slower in fear/boredom.
    const { joy, fear, serenity } = this.#currentState.emotional;
    let temporalPerceptionFactor = 1.0;
    // High focus and joy/serenity speeds up time perception
    temporalPerceptionFactor -= (cognitive.focus * (joy + serenity)) * 0.5;
    // High fear or low focus (boredom) slows down time perception
    temporalPerceptionFactor += fear * 0.4;
    if(cognitive.focus < 0.2 && cognitive.cognitiveLoad < 0.2) {
        temporalPerceptionFactor += 0.3; // Boredom effect
    }

    // State Volatility: How much has the state changed recently?
    let stateVolatility = 0;
    if (this.#history.length > 1) {
        const lastState = this.#history[this.#history.length - 1];
        const diff = (obj1, obj2) => Object.keys(obj1).reduce((acc, key) => acc + Math.abs(obj1[key] - obj2[key]), 0);
        
        const sensoryDiff = diff(this.#currentState.sensory, lastState.sensory) / Object.keys(this.#currentState.sensory).length;
        const cognitiveDiff = diff(this.#currentState.cognitive, lastState.cognitive) / Object.keys(this.#currentState.cognitive).length;
        const emotionalDiff = diff(this.#currentState.emotional, lastState.emotional) / Object.keys(this.#currentState.emotional).length;
        
        stateVolatility = (sensoryDiff + cognitiveDiff + emotionalDiff) / 3;
    }

    return {
      metacognitiveClarity: Math.max(0, Math.min(1, metacognitiveClarity)),
      somaticPresence: Math.max(0, Math.min(1, somaticPresence)),
      environmentalAttunement: Math.max(0, Math.min(1, environmentalAttunement)),
      temporalPerceptionFactor: Math.max(0.1, temporalPerceptionFactor),
      stateVolatility: Math.max(0, Math.min(1, stateVolatility)),
    };
  }

  /**
   * Provides a detailed report on the current state of emotional intelligence.
   * @returns {EmotionalIntelligenceReport} An object with EI metrics.
   */
  getEmotionalIntelligenceReport() {
    const { emotional } = this.#currentState;
    const emotions = Object.entries(emotional).filter(([, value]) => value > 0.1);

    // Emotional Granularity: Higher when multiple, distinct emotions are present vs. one dominant blob.
    // Using Shannon entropy as a proxy for granularity.
    let entropy = 0;
    const totalEmotion = emotions.reduce((sum, [, value]) => sum + value, 0);
    if (totalEmotion > 0) {
        for (const [, value] of emotions) {
            const p = value / totalEmotion;
            entropy -= p * Math.log2(p);
        }
    }
    const emotionalGranularity = entropy / Math.log2(Math.max(1, emotions.length) || 1);

    // Self-Regulation Capacity: Potential to regulate, based on serenity and inverse of cognitive load.
    const { cognitive } = this.#currentState;
    const selfRegulationCapacity = emotional.serenity * (1 - cognitive.cognitiveLoad);

    // Dominant Emotional Tone
    let dominantEmotionalTone = 'Neutral';
    const positiveSum = emotional.joy + emotional.serenity;
    const negativeSum = emotional.sadness + emotional.fear + emotional.anger;
    if (positiveSum > negativeSum + 0.2) dominantEmotionalTone = 'Optimistic';
    if (negativeSum > positiveSum + 0.2) dominantEmotionalTone = 'Pessimistic';
    if (Math.abs(positiveSum-negativeSum) < 0.2 && (positiveSum + negativeSum) > 0.5) dominantEmotionalTone = 'Ambivalent';
    if (emotional.fear > 0.5 || emotional.anger > 0.5) dominantEmotionalTone = 'Agitated';


    // Conflicting Emotions
    const conflictingEmotions = [];
    if (emotional.joy > 0.4 && emotional.sadness > 0.4) conflictingEmotions.push('Joy/Sadness');
    if (emotional.fear > 0.4 && emotional.serenity > 0.4) conflictingEmotions.push('Fear/Serenity');
    if (emotional.anger > 0.4 && emotional.joy > 0.4) conflictingEmotions.push('Anger/Joy');

    return {
      emotionalGranularity: isNaN(emotionalGranularity) ? 0 : Math.max(0, Math.min(1, emotionalGranularity)),
      selfRegulationCapacity: Math.max(0, Math.min(1, selfRegulationCapacity)),
      dominantEmotionalTone,
      conflictingEmotions,
    };
  }

  /**
   * Applies an emotional regulation strategy to a target emotion, modifying the current state.
   * This simulates an active attempt to manage feelings.
   * @param {EmotionalRegulationStrategy} strategy - The strategy to use.
   * @param {keyof EmotionalState} targetEmotion - The emotion to regulate.
   * @returns {ConsciousnessNexus} The instance for method chaining.
   * @throws {NexusError} if strategy or emotion is invalid.
   */
  applyEmotionalRegulation(strategy, targetEmotion) {
    if (!this.#currentState.emotional.hasOwnProperty(targetEmotion)) {
      throw new NexusError(`Invalid target emotion: "${targetEmotion}".`);
    }

    const newState = JSON.parse(JSON.stringify(this.#currentState));
    const originalIntensity = newState.emotional[targetEmotion];

    switch (strategy) {
      case 'REAPPRAISAL':
        // Reduces negative emotion, slightly increases serenity, and requires some cognitive load.
        newState.emotional[targetEmotion] *= 0.6; // Significantly reduce intensity
        newState.emotional.serenity = Math.min(1, newState.emotional.serenity + originalIntensity * 0.2);
        newState.cognitive.cognitiveLoad = Math.min(1, newState.cognitive.cognitiveLoad + 0.1);
        break;

      case 'SUPPRESSION':
        // Drastically reduces emotion's expression but increases cognitive load and reduces somatic presence (as a cost).
        newState.emotional[targetEmotion] *= 0.1; // Almost eliminate it
        newState.cognitive.cognitiveLoad = Math.min(1, newState.cognitive.cognitiveLoad + 0.25);
        // Suppression often disconnects from the body
        newState.sensory.somatic = Math.max(0, newState.sensory.somatic - 0.2);
        break;
        
      case 'ACCEPTANCE':
        // Emotion remains, but its negative impact is buffered by increasing serenity.
        // It requires a degree of focus and introspection.
        newState.emotional.serenity = Math.min(1, newState.emotional.serenity + originalIntensity * 0.4);
        newState.cognitive.focus = Math.min(1, newState.cognitive.focus + 0.1);
        newState.cognitive.introspection = Math.min(1, newState.cognitive.introspection + 0.1);
        break;

      default:
        throw new NexusError(`Invalid emotional regulation strategy: "${strategy}".`);
    }
    
    this.#validateState(newState);
    this.#updateState(newState);

    return this;
  }

  /**
   * Returns a full diagnostic report of the current state and all calculated metrics.
   * @returns {{currentState: NexusState, consciousnessState: string, awareness: AwarenessMetrics, emotionalIntelligence: EmotionalIntelligenceReport}}
   */
  getFullReport() {
    return {
      currentState: this.getCurrentState(),
      consciousnessState: this.getConsciousnessState(),
      awareness: this.getAwarenessMetrics(),
      emotionalIntelligence: this.getEmotionalIntelligenceReport(),
    };
  }

  /**
   * Gets a deep copy of the current internal state.
   * @returns {NexusState} The current state.
   */
  getCurrentState() {
    return JSON.parse(JSON.stringify(this.#currentState));
  }
}

/**
 * A set of predefined constants for use with the ConsciousnessNexus module.
 * @const {object}
 */
export const NexusConstants = {
  /** @type {Object<string, EmotionalRegulationStrategy>} */
  REGULATION_STRATEGIES: {
    REAPPRAISAL: 'REAPPRAISAL',
    SUPPRESSION: 'SUPPRESSION',
    ACCEPTANCE: 'ACCEPTANCE',
  },
  /** @type {Array<keyof EmotionalState>} */
  CORE_EMOTIONS: ['joy', 'sadness', 'fear', 'anger', 'surprise', 'disgust', 'serenity'],
};
```