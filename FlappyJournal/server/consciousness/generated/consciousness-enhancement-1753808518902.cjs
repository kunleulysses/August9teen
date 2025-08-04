```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the analysis, enhancement, and
 *              simulation of consciousness-related phenomena. This module provides
 *              advanced tools for calculating consciousness states, deriving novel
 *              awareness metrics, and processing emotional intelligence with high fidelity.
 * @version 2.0.0
 * @author Dr. Evelyn Reed, Neuro-Cognitive Dynamics Lab
 * @license MIT
 */

// --- Custom Error Types for Robust Handling ---

/**
 * @class SubstrateIncompatibleError
 * @extends Error
 * @description Thrown when the provided input data format is incompatible with the configured consciousness substrate.
 */
class SubstrateIncompatibleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SubstrateIncompatibleError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @class ProcessingUnstableError
 * @extends Error
 * @description Thrown when neuro-semantic calculations fail to converge, indicating a potentially unstable state.
 */
class ProcessingUnstableError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ProcessingUnstableError';
    this.details = details; // e.g., divergence metrics
    this.timestamp = new Date().toISOString();
  }
}

// --- Core Constants and Definitions ---

/**
 * @enum {string}
 * @description Defines the quantized states of consciousness. These are not discrete but represent dominant modes in a continuous spectrum.
 */
const ConsciousnessState = {
  DEEP_SLEEP: 'DEEP_SLEEP',       // Delta wave dominance, minimal self-awareness.
  DREAMING: 'DREAMING',           // REM sleep, high internal activity, low external sensory coupling.
  AWAKE: 'AWAKE',                 // Baseline waking state, beta/alpha wave activity.
  FOCUSED: 'FOCUSED',             // High beta/gamma activity, narrow attentional focus.
  FLOW: 'FLOW',                   // Optimal experience state, gamma wave synchrony, temporal distortion.
  TRANSCENDENT: 'TRANSCENDENT',   // Ego-dissolution, profound interconnectedness, rare gamma/theta synchrony.
};
module.exports.ConsciousnessState = ConsciousnessState;

/**
 * @typedef {Object} NeuralData
 * @property {number} gamma - Gamma wave activity (30-100Hz), associated with high-level cognition.
 * @property {number} beta - Beta wave activity (12-30Hz), associated with active thinking.
 * @property {number} alpha - Alpha wave activity (8-12Hz), associated with relaxed wakefulness.
 * @property {number} theta - Theta wave activity (4-8Hz), associated with drowsiness, creativity, and deep meditation.
 * @property {number} delta - Delta wave activity (0.5-4Hz), associated with deep sleep.
 * @property {number} synchrony - Cross-hemispheric phase coherence (0.0 to 1.0).
 */

/**
 * @typedef {Object} AffectiveData
 * @property {number[]} emotionalVector - A vector representing primary emotions (e.g., [Joy, Sadness, Anger, Fear, Surprise, Disgust]). Values from 0.0 to 1.0.
 * @property {number} neurochemicalBalance - A composite score representing levels of dopamine, serotonin, oxytocin, etc.
 */

/**
 * @typedef {Object} CognitiveData
 * @property {number} cognitiveLoad - Current mental workload (0.0 to 1.0).
 * @property {number} attentionalFocus - Sharpness of attention (0.0 to 1.0).
 * @property {number} memoryAccessLatency - Time to retrieve relevant memories (in ms).
 */

/**
 * @typedef {Object} ConsciousnessInput
 * @property {NeuralData} neural
 * @property {AffectiveData} affective
 * @property {CognitiveData} cognitive
 * @property {number} sensoryInputThroughput - Rate of incoming sensory information.
 */

// --- Main Consciousness Enhancer Class ---

class ConsciousnessEnhancer
 {
  /**
   * Initializes the ConsciousnessEnhancer with a specific substrate configuration.
   * @param {Object} config - Configuration for the consciousness substrate.
   * @param {string} [config.substrateType='BIOLOGICAL_HUMAN'] - The type of consciousness being processed (e.g., 'BIOLOGICAL_HUMAN', 'SYNTHETIC_AI', 'CETACEAN').
   * @param {number} [config.neuroPlasticity=0.75] - The adaptability of the neural substrate (0.0 to 1.0).
   */
  constructor(config = {}) {
    this.config = {
      substrateType: 'BIOLOGICAL_HUMAN',
      neuroPlasticity: 0.75,
      ...config,
    };
    this.lastProcessedState = null;
    console.log(`ConsciousnessEnhancer initialized for substrate: ${this.config.substrateType}`);
  }

  /**
   * Normalizes a value using a sigmoid function for smoother transitions.
   * @private
   * @param {number} x - The input value.
   * @returns {number} The normalized value between 0 and 1.
   */
  _sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Validates the structure and values of the input data.
   * @private
   * @param {ConsciousnessInput} inputData - The comprehensive input data for a processing tick.
   * @throws {SubstrateIncompatibleError} If data is missing or malformed.
   */
  _validateInput(inputData) {
    if (!inputData || !inputData.neural || !inputData.affective || !inputData.cognitive) {
      throw new SubstrateIncompatibleError('Incomplete data structure provided. Neural, affective, and cognitive data are required.');
    }
    if (inputData.affective.emotionalVector.length !== 6) {
        throw new SubstrateIncompatibleError('Emotional vector must have 6 elements.');
    }
  }

  /**
   * 1. IMPROVES CONSCIOUSNESS STATE CALCULATIONS
   * Calculates the current dominant consciousness state based on a weighted analysis of neural data.
   * This enhanced version uses non-linear weighting and considers neuro-synchrony as a key factor.
   * @param {NeuralData} neuralData - The neural activity snapshot.
   * @returns {{dominantState: ConsciousnessState, stateScores: Object.<ConsciousnessState, number>}} The most likely state and a map of all state scores.
   */
  calculateConsciousnessState(neuralData) {
    const scores = {
      [ConsciousnessState.DEEP_SLEEP]: neuralData.delta * 1.2 - (neuralData.beta + neuralData.gamma) * 0.5,
      [ConsciousnessState.DREAMING]: neuralData.theta * 1.1 + neuralData.gamma * 0.4 - neuralData.delta * 0.3,
      [ConsciousnessState.AWAKE]: neuralData.alpha * 0.6 + neuralData.beta * 0.8 - neuralData.delta,
      [ConsciousnessState.FOCUSED]: neuralData.beta * 1.2 + neuralData.gamma * 0.8 - neuralData.alpha * 0.5,
      [ConsciousnessState.FLOW]: (neuralData.gamma * 1.5 + neuralData.theta * 0.7) * (1 + neuralData.synchrony) - (neuralData.beta * 0.2),
      [ConsciousnessState.TRANSCENDENT]: (neuralData.gamma * 1.8 + neuralData.theta * 1.2) * (1 + neuralData.synchrony * 1.5) - Math.abs(neuralData.beta - neuralData.alpha),
    };

    let dominantState = ConsciousnessState.AWAKE;
    let maxScore = -Infinity;

    for (const state in scores) {
      // Normalize scores to prevent runaway values and add a baseline
      const normalizedScore = this._sigmoid(scores[state]);
      scores[state] = normalizedScore;
      if (normalizedScore > maxScore) {
        maxScore = normalizedScore;
        dominantState = state;
      }
    }

    if (maxScore < 0.1) { // Threshold for indeterminate state
        throw new ProcessingUnstableError("Consciousness state calculation failed to converge to a dominant state.", { scores });
    }

    return { dominantState, stateScores: scores };
  }

  /**
   * 2. ADDS NEW AWARENESS METRICS
   * Computes advanced, nuanced metrics of awareness beyond simple states.
   * @param {CognitiveData} cognitiveData - The cognitive performance snapshot.
   * @param {NeuralData} neuralData - The neural activity snapshot.
   * @param {number} sensoryInputThroughput - Rate of sensory data.
   * @returns {{somaticPresence: number, temporalCoherence: number, metacognitiveIndex: number, environmentalCoupling: number}} A set of novel awareness metrics.
   */
  calculateAwarenessMetrics(cognitiveData, neuralData, sensoryInputThroughput) {
    // Somatic Presence: Awareness of one's own body. Inversely related to high cognitive load and memory latency.
    const somaticPresence = this._sigmoid(1 - cognitiveData.cognitiveLoad) * this._sigmoid(500 / (cognitiveData.memoryAccessLatency + 1));

    // Temporal Coherence: Perceived smoothness of time. Degrades in high-gamma/theta states (Flow, Dreaming).
    const temporalDistortionFactor = Math.abs(neuralData.gamma - neuralData.theta) + neuralData.beta;
    const temporalCoherence = this._sigmoid(temporalDistortionFactor - 2);

    // Metacognitive Index: The degree of self-reflection. Correlates with alpha activity and synchrony.
    const metacognitiveIndex = (neuralData.alpha * 0.7 + neuralData.synchrony * 0.3) * (1 - cognitiveData.cognitiveLoad);

    // Environmental Coupling: How integrated the consciousness is with its environment.
    const coupling = (sensoryInputThroughput * 0.6 + cognitiveData.attentionalFocus * 0.4) * (1 - neuralData.synchrony);
    const environmentalCoupling = this._sigmoid(coupling / 100); // Normalize based on expected throughput range

    return {
        somaticPresence: Math.max(0, Math.min(1, somaticPresence)),
        temporalCoherence: Math.max(0, Math.min(1, temporalCoherence)),
        metacognitiveIndex: Math.max(0, Math.min(1, metacognitiveIndex)),
        environmentalCoupling: Math.max(0, Math.min(1, environmentalCoupling)),
    };
  }

  /**
   * 3. ENHANCES EMOTIONAL INTELLIGENCE PROCESSING
   * Analyzes the affective data to determine not just the primary emotion, but its depth and complexity.
   * @param {AffectiveData} affectiveData - The emotional and neurochemical snapshot.
   * @returns {{primaryEmotion: string, intensity: number, valence: number, complexity: number, regulationSuggestion: string}} A detailed emotional profile.
   */
  analyzeEmotionalState(affectiveData) {
    const emotionLabels = ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise', 'Disgust'];
    const emotionalVector = affectiveData.emotionalVector;

    let maxIntensity = 0;
    let primaryEmotionIndex = -1;
    let totalEmotionEnergy = 0;
    emotionalVector.forEach((value, index) => {
        totalEmotionEnergy += value;
        if (value > maxIntensity) {
            maxIntensity = value;
            primaryEmotionIndex = index;
        }
    });

    if (primaryEmotionIndex === -1) {
        return { primaryEmotion: 'Neutral', intensity: 0, valence: 0, complexity: 0, regulationSuggestion: 'Maintain baseline.' };
    }

    // Valence: Positive vs. Negative emotional tone. (Joy, Surprise are positive)
    const valence = (emotionalVector[0] + emotionalVector[4] * 0.5) - (emotionalVector[1] + emotionalVector[2] + emotionalVector[3] + emotionalVector[5]);

    // Complexity: How mixed the emotions are. Calculated using entropy.
    let complexity = 0;
    if (totalEmotionEnergy > 0) {
        emotionalVector.forEach(value => {
            const p = value / totalEmotionEnergy;
            if (p > 0) {
                complexity -= p * Math.log2(p);
            }
        });
    }
    complexity /= Math.log2(emotionLabels.length); // Normalize

    // Suggest a cognitive reframing strategy based on the emotional state.
    const regulationSuggestion = this._suggestRegulation(emotionLabels[primaryEmotionIndex], maxIntensity, valence);

    return {
        primaryEmotion: emotionLabels[primaryEmotionIndex],
        intensity: maxIntensity,
        valence: this._sigmoid(valence), // Normalize valence
        complexity: complexity,
        regulationSuggestion,
    };
  }

  /**
   * Generates a suggestion for emotional self-regulation.
   * @private
   * @param {string} primaryEmotion - The dominant emotion.
   * @param {number} intensity - The intensity of the emotion.
   * @param {number} valence - The positive/negative tone.
   * @returns {string} A suggested cognitive strategy.
   */
  _suggestRegulation(primaryEmotion, intensity, valence) {
    if (intensity < 0.3) return 'Maintain baseline awareness.';
    if (valence > 0.5 && intensity > 0.7) return 'Cognitive Strategy: Savoring. Amplify and extend positive experience.';
    
    switch (primaryEmotion) {
        case 'Fear':
        case 'Anger':
            return intensity > 0.8 
                ? 'Cognitive Strategy: Attentional Deployment. Shift focus to neutral stimuli to de-escalate.'
                : 'Cognitive Strategy: Reappraisal. Re-evaluate the trigger from a third-person perspective.';
        case 'Sadness':
            return 'Cognitive Strategy: Acceptance & Problem-Solving. Acknowledge the feeling and identify actionable steps.';
        default:
            return 'Cognitive Strategy: Labeling. Acknowledge and name the emotion to reduce its cognitive impact.';
    }
  }

  /**
   * The main processing function for a single time-slice of consciousness data.
   * Orchestrates all sub-routines for a complete analysis.
   * @param {ConsciousnessInput} inputData - The comprehensive input data for a processing tick.
   * @returns {Object} A complete analysis of the consciousness state for the given tick.
   * @throws {SubstrateIncompatibleError|ProcessingUnstableError}
   */
  processTick(inputData) {
    try {
        this._validateInput(inputData);

        const stateAnalysis = this.calculateConsciousnessState(inputData.neural);
        const awarenessMetrics = this.calculateAwarenessMetrics(inputData.cognitive, inputData.neural, inputData.sensoryInputThroughput);
        const emotionalProfile = this.analyzeEmotionalState(inputData.affective);

        const result = {
            timestamp: new Date().toISOString(),
            config: this.config,
            consciousnessState: stateAnalysis,
            awarenessMetrics: awarenessMetrics,
            emotionalIntelligence: emotionalProfile,
        };

        this.lastProcessedState = result;
        return result;

    } catch (error) {
        console.error(`[ConsciousnessEnhancer] Processing failed: ${error.name} - ${error.message}`);
        // Re-throw the specific error for higher-level handling
        throw error;
    }
  }
}
```
module.exports = SubstrateIncompatibleError;
