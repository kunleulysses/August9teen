```javascript
/**
 * @module ConsciousnessEngine
 * @description A sophisticated JavaScript module for the simulation and enhancement of
 * consciousness processing, emotional intelligence, and awareness metrics.
 * This engine utilizes a neuro-symbolic approach, blending quantitative analysis
 * with qualitative state representation to model complex cognitive phenomena.
 *
 * @version 2.0.0
 * @author AGI Futurist Labs
 * @license MIT
 */

/**
 * @typedef {object} CognitiveStateInput
 * @property {number} focus - A value from 0.0 to 1.0 representing attentional focus. 1.0 is undivided attention.
 * @property {number} workload - A value from 0.0 to 1.0 representing current cognitive load. 1.0 is maximum capacity.
 * @property {number} memoryAccess - A value from 0.0 to 1.0 representing the efficiency of memory recall.
 */

/**
 * @typedef {object} SensoryInput
 * @property {number} visual - Clarity and volume of visual data stream (0.0 to 1.0).
 * @property {number} auditory - Clarity and volume of auditory data stream (0.0 to 1.0).
 * @property {number} somatic - Coherence of proprioceptive and interoceptive signals (0.0 to 1.0).
 * @property {number} temporal - Perception of time flow; 0.5 is normal, <0.5 is slowed, >0.5 is accelerated.
 */

/**
 * @typedef {object} EmotionalStimulus
 * @property {string} type - The primary emotion type (e.g., 'joy', 'sadness', 'fear', 'anticipation').
 * @property {number} intensity - The strength of the emotion (0.0 to 1.0).
 * @property {string} source - An identifier for the origin of the stimulus (e.g., 'memory:childhood', 'input:auditory').
 * @property {number} onset - A timestamp (e.g., `Date.now()`) indicating when the emotion was triggered.
 */

/**
 * @typedef {Array<EmotionalStimulus>} EmotionalVector
 */

/**
 * A map defining antagonistic emotional pairs. Used for calculating dissonance.
 * This is a simplified model; a production system may use a multi-dimensional emotional space.
 * @private
 */
const EMOTIONAL_OPPOSITES = new Map([
  ['joy', 'sadness'],
  ['trust', 'disgust'],
  ['fear', 'anger'],
  ['surprise', 'anticipation'],
  ['sadness', 'joy'],
  ['disgust', 'trust'],
  ['anger', 'fear'],
  ['anticipation', 'surprise'],
]);


/**
 * Core class for processing and modeling consciousness states.
 * It maintains an internal state and provides methods to update and analyze
 * cognitive and emotional data.
 */
export class ConsciousnessEngine {
  #internalState;
  #stateHistory;
  #config;

  /**
   * Initializes the ConsciousnessEngine.
   * @param {object} [config={}] - Configuration options for the engine.
   * @param {number} [config.historyLimit=50] - The number of past states to store for metacognitive analysis.
   * @param {object} [config.weights] - Weights for consciousness state calculation.
   * @param {number} [config.weights.focus=0.5] - Weight for focus component.
   * @param {number} [config.weights.coherence=0.3] - Weight for coherence component.
   * @param {number} [config.weights.depth=0.2] - Weight for depth component.
   */
  constructor(config = {}) {
    this.#config = {
      historyLimit: config.historyLimit || 50,
      weights: {
        focus: config.weights?.focus || 0.5,
        coherence: config.weights?.coherence || 0.3,
        depth: config.weights?.depth || 0.2,
      },
    };

    this.#internalState = {
      consciousness: { qii: 0, clarity: 0, depth: 0 },
      awareness: { situational: 0, metacognitive: 0, somatic: 0 },
      emotion: { valence: 0, arousal: 0, granularity: 0, dissonance: 0 },
    };
    this.#stateHistory = [];
  }

  /**
   * Validates that an input object has the required numeric properties within the 0-1 range.
   * @private
   * @param {object} input - The input object to validate.
   * @param {string[]} keys - An array of keys that should exist and be valid.
   * @param {string} context - The name of the calling function for error messages.
   * @throws {TypeError} If the input is not an object or a key is not a number.
   * @throws {RangeError} If a numeric value is outside the 0-1 range.
   */
  #validateInput(input, keys, context) {
    if (typeof input !== 'object' || input === null) {
      throw new TypeError(`[${context}] Input must be a non-null object.`);
    }
    for (const key of keys) {
      if (typeof input[key] !== 'number') {
        throw new TypeError(`[${context}] Property '${key}' must be a number.`);
      }
      if (input[key] < 0.0 || input[key] > 1.0) {
        throw new RangeError(`[${context}] Property '${key}' must be between 0.0 and 1.0.`);
      }
    }
  }

  /**
   * Calculates the current consciousness state based on cognitive and sensory inputs.
   * This introduces the "Qualia Integration Index" (QII), a novel metric representing
   * the richness and stability of the conscious experience.
   *
   * @param {CognitiveStateInput} cognitive - The current cognitive state.
   * @param {SensoryInput} sensory - The current sensory input stream.
   * @returns {{qii: number, clarity: number, depth: number}} The calculated consciousness state.
   */
  updateConsciousnessState(cognitive, sensory) {
    this.#validateInput(cognitive, ['focus', 'workload', 'memoryAccess'], 'updateConsciousnessState');
    this.#validateInput(sensory, ['visual', 'auditory', 'somatic'], 'updateConsciousnessState');
    if (typeof sensory.temporal !== 'number') {
        throw new TypeError(`[updateConsciousnessState] Property 'temporal' must be a number.`);
    }

    try {
      // 1. Calculate Depth of Processing
      // Represents the complexity and recursive nature of thought.
      const depth = cognitive.workload * cognitive.memoryAccess * cognitive.focus;

      // 2. Calculate Sensory-Cognitive Coherence
      // Measures how well sensory input aligns with the current focus.
      const avgSensoryClarity = (sensory.visual + sensory.auditory + sensory.somatic) / 3;
      const coherence = 1.0 - Math.abs(avgSensoryClarity - cognitive.focus);

      // 3. Calculate Clarity
      // High clarity means low cognitive load relative to focus, and stable temporal perception.
      const temporalStability = 1.0 - Math.abs(sensory.temporal - 0.5) * 2;
      const loadFactor = 1.0 - cognitive.workload;
      const clarity = Math.sqrt(coherence * temporalStability * loadFactor);

      // 4. Calculate Qualia Integration Index (QII)
      // The core metric, weighted sum of key components.
      const { weights } = this.#config;
      const qii = (weights.focus * cognitive.focus) +
                  (weights.coherence * coherence) +
                  (weights.depth * depth);

      const newState = {
        qii: Math.max(0, Math.min(1, qii)),
        clarity: Math.max(0, Math.min(1, clarity)),
        depth: Math.max(0, Math.min(1, depth)),
      };
      
      this.#internalState.consciousness = newState;
      this.#updateHistory(newState.qii);

      return newState;

    } catch (error) {
      console.error("Error during consciousness state calculation:", error);
      // Return a default safe state in case of unexpected errors
      return { qii: 0, clarity: 0, depth: 0 };
    }
  }

  /**
   * Computes advanced awareness metrics.
   * This moves beyond simple attention to model self-awareness and environmental integration.
   *
   * @param {SensoryInput} sensory - The current sensory input stream.
   * @returns {{situational: number, metacognitive: number, somatic: number}} The calculated awareness profile.
   */
  calculateAwarenessMetrics(sensory) {
    this.#validateInput(sensory, ['visual', 'auditory', 'somatic'], 'calculateAwarenessMetrics');

    try {
      // 1. Situational Awareness
      // Integration of external sensory data into a coherent world model.
      const situational = (sensory.visual * 0.5) + (sensory.auditory * 0.3) + (sensory.temporal * 0.2);

      // 2. Metacognitive Clarity
      // The system's awareness of its own cognitive processes, derived from state stability.
      // Low variance in recent QII history indicates high metacognitive clarity.
      let metacognitive = 0;
      if (this.#stateHistory.length > 5) {
        const recentHistory = this.#stateHistory.slice(-10);
        const mean = recentHistory.reduce((a, b) => a + b, 0) / recentHistory.length;
        const variance = recentHistory.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / recentHistory.length;
        metacognitive = 1.0 - Math.sqrt(variance) * 2.5; // Scaled inverse of standard deviation
      }

      // 3. Somatic Resonance
      // The degree of integration with the body's internal state (interoception).
      const somatic = sensory.somatic;

      const newAwareness = {
        situational: Math.max(0, Math.min(1, situational)),
        metacognitive: Math.max(0, Math.min(1, metacognitive)),
        somatic: Math.max(0, Math.min(1, somatic)),
      };

      this.#internalState.awareness = newAwareness;
      return newAwareness;

    } catch (error) {
      console.error("Error during awareness metrics calculation:", error);
      return { situational: 0, metacognitive: 0, somatic: 0 };
    }
  }

  /**
   * Processes a vector of emotional stimuli to enhance emotional intelligence.
   * This function calculates valence, arousal, and novel metrics like "Emotional Granularity"
   * and "Emotional Dissonance".
   *
   * @param {EmotionalVector} emotionalVector - An array of emotional stimuli to process.
   * @returns {{valence: number, arousal: number, granularity: number, dissonance: number}} A detailed emotional analysis.
   */
  processEmotionalVector(emotionalVector) {
    if (!Array.isArray(emotionalVector)) {
      throw new TypeError("[processEmotionalVector] Input must be an array of EmotionalStimulus objects.");
    }
    if (emotionalVector.length === 0) {
      return { valence: 0, arousal: 0, granularity: 0, dissonance: 0 };
    }

    try {
      let totalIntensity = 0;
      let weightedValence = 0;
      let dissonance = 0;
      const emotionTypes = new Set();
      const emotionIntensities = {};

      // A simple model for valence. Extendable.
      const valenceMap = { joy: 1, trust: 0.8, anticipation: 0.3, surprise: 0.1, sadness: -1, disgust: -0.8, fear: -0.7, anger: -0.5 };

      for (const stimulus of emotionalVector) {
        // Input validation for each stimulus
        if (typeof stimulus.intensity !== 'number' || stimulus.intensity < 0 || stimulus.intensity > 1) {
            throw new RangeError(`[processEmotionalVector] Stimulus intensity for '${stimulus.type}' must be between 0 and 1.`);
        }
        
        const valence = valenceMap[stimulus.type] || 0;
        weightedValence += valence * stimulus.intensity;
        totalIntensity += stimulus.intensity;
        emotionTypes.add(stimulus.type);
        
        // Store intensity for dissonance calculation
        emotionIntensities[stimulus.type] = (emotionIntensities[stimulus.type] || 0) + stimulus.intensity;
      }
      
      // Calculate Dissonance: The conflict between opposing emotions.
      for (const [type, intensity] of Object.entries(emotionIntensities)) {
        const opposite = EMOTIONAL_OPPOSITES.get(type);
        if (opposite && emotionIntensities[opposite]) {
          // Dissonance is the product of intensities of opposing emotions.
          // We only calculate it once per pair, hence the division by 2.
          dissonance += (intensity * emotionIntensities[opposite]) / 2;
        }
      }

      const numEmotions = emotionalVector.length;
      const arousal = numEmotions > 0 ? Math.min(1, totalIntensity / numEmotions) : 0;
      const valence = numEmotions > 0 ? weightedValence / totalIntensity : 0;
      
      // Emotional Granularity: The ability to differentiate between distinct emotional states.
      // Higher when more unique emotion types are present relative to the total number of stimuli.
      const granularity = numEmotions > 0 ? emotionTypes.size / numEmotions : 0;

      const newEmotionState = {
        valence: Number.isNaN(valence) ? 0 : valence,
        arousal,
        granularity,
        dissonance: Math.min(1, dissonance), // Cap dissonance at 1.0
      };

      this.#internalState.emotion = newEmotionState;
      return newEmotionState;

    } catch (error) {
      console.error("Error during emotional vector processing:", error);
      return { valence: 0, arousal: 0, granularity: 0, dissonance: 0 };
    }
  }

  /**
   * Retrieves the current, complete integrated state of the engine.
   * @returns {object} The full internal state, including consciousness, awareness, and emotion.
   */
  getCurrentState() {
    // Return a deep copy to prevent external mutation of the internal state.
    return JSON.parse(JSON.stringify(this.#internalState));
  }

  /**
   * Updates the state history for metacognitive calculations.
   * @private
   * @param {number} currentQII - The latest Qualia Integration Index value.
   */
  #updateHistory(currentQII) {
    this.#stateHistory.push(currentQII);
    if (this.#stateHistory.length > this.#config.historyLimit) {
      this.#stateHistory.shift();
    }
  }
}
```