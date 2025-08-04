```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for simulating and enhancing
 *              core aspects of consciousness processing. This module operates on a
 *              conceptual model of a "Cognitive Lattice" to provide nuanced
 *              calculations of consciousness states, awareness metrics, and emotional
 *              intelligence. It is designed for use in advanced AI, philosophical
 *              modeling, and simulated cognitive architectures.
 * @version 2.0.0
 * @author AI Cogitatus
 * @license MIT
 */

// --- Custom Error Handling ---

/**
 * Base error class for all consciousness processing-related errors.
 * This allows for specific catching of errors thrown by this module.
 */
class ConsciousnessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Thrown when input data for a calculation is invalid or out of expected bounds.
 */
class InvalidInputError extends ConsciousnessError {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details; // e.g., { parameter: 'cognitiveLoad', value: -5 }
  }
}

/**
 * Thrown when the cognitive model becomes unstable, e.g., due to chaotic feedback loops.
 */
class CognitiveInstabilityError extends ConsciousnessError {
  constructor(message = 'Cognitive state has become unstable and cannot be reliably processed.') {
    super(message);
    this.name = 'CognitiveInstabilityError';
  }
}


// --- Emotional Intelligence Sub-System ---

/**
 * A lexicon for basic sentiment and emotional tone analysis.
 * In a real-world scenario, this would be a vast, nuanced library.
 * Structure: { word: [valence, arousal, dominance] }
 * - Valence (-1 to 1): Unpleasant to Pleasant
 * - Arousal (-1 to 1): Calm to Excited
 * - Dominance (-1 to 1): Submissive to In-Control
 */
const EMOTIONAL_LEXICON = {
  'joy': [0.8, 0.6, 0.4], 'happy': [0.9, 0.5, 0.3], 'ecstatic': [0.9, 0.8, 0.5],
  'sadness': [-0.7, -0.5, -0.6], 'grief': [-0.8, -0.4, -0.7], 'depressed': [-0.9, -0.8, -0.8],
  'anger': [-0.6, 0.7, 0.5], 'rage': [-0.7, 0.9, 0.8], 'irritated': [-0.4, 0.3, 0.2],
  'fear': [-0.7, 0.8, -0.5], 'anxious': [-0.5, 0.6, -0.4], 'terror': [-0.8, 0.9, -0.6],
  'calm': [0.6, -0.8, 0.1], 'serene': [0.7, -0.7, 0.2], 'peaceful': [0.8, -0.6, 0.3],
  'curiosity': [0.4, 0.5, -0.2], 'interest': [0.5, 0.4, -0.1],
  'love': [0.9, 0.6, 0.2], 'empathy': [0.7, 0.2, 0.1],
  'neutral': [0, 0, 0],
};

/**
 * @class EmotionalResonanceEngine
 * @description Processes emotional data and calculates emotional intelligence metrics.
 */
class EmotionalResonanceEngine {
  /**
   * Analyzes a text-based stimulus to derive its emotional vector.
   * @param {string} text - The input text containing emotional cues.
   * @returns {{valence: number, arousal: number, dominance: number, recognizedWords: string[]}} The calculated emotional vector.
   */
  static analyzeText(text) {
    if (typeof text !== 'string') {
      throw new InvalidInputError('Text input must be a string.', { parameter: 'text', value: text });
    }

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let vectorSum = [0, 0, 0];
    let recognizedCount = 0;
    const recognizedWords = [];

    words.forEach(word => {
      if (EMOTIONAL_LEXICON[word]) {
        vectorSum[0] += EMOTIONAL_LEXICON[word][0];
        vectorSum[1] += EMOTIONAL_LEXICON[word][1];
        vectorSum[2] += EMOTIONAL_LEXICON[word][2];
        recognizedCount++;
        recognizedWords.push(word);
      }
    });

    if (recognizedCount === 0) {
      return { valence: 0, arousal: 0, dominance: 0, recognizedWords: [] };
    }

    return {
      valence: vectorSum[0] / recognizedCount,
      arousal: vectorSum[1] / recognizedCount,
      dominance: vectorSum[2] / recognizedCount,
      recognizedWords
    };
  }

  /**
   * Calculates the empathy level between the self's state and a perceived external state.
   * @param {{valence: number, arousal: number}} selfState - The current emotional state of the self.
   * @param {{valence: number, arousal: number}} externalState - The perceived emotional state of another entity.
   * @returns {number} An empathy score from 0 (no resonance) to 1 (perfect resonance).
   */
  static calculateEmpathy(selfState, externalState) {
    // Empathy is modeled as the inverse of the emotional distance in the valence-arousal space.
    const distance = Math.sqrt(
      Math.pow(selfState.valence - externalState.valence, 2) +
      Math.pow(selfState.arousal - externalState.arousal, 2)
    );
    // The maximum possible distance is sqrt(2^2 + 2^2) = sqrt(8) ~= 2.828
    const maxDistance = Math.sqrt(8);
    return Math.max(0, 1 - (distance / maxDistance));
  }
  
  /**
   * Suggests a cognitive strategy for emotional regulation based on the current state.
   * @param {{valence: number, arousal: number, dominance: number}} currentState - The current emotional state.
   * @returns {string} A suggested cognitive strategy.
   */
  static suggestRegulationStrategy(currentState) {
    const { valence, arousal } = currentState;

    if (arousal > 0.7 && valence < -0.5) return 'Mindful Breathing: Focus on slowing the breath to reduce high-arousal negative states like anger or fear.';
    if (arousal < -0.6 && valence < -0.5) return 'Behavioral Activation: Engage in a simple, positive activity to counteract low-arousal negative states like sadness.';
    if (arousal > 0.8) return 'Cognitive Distancing: Observe intense thoughts and feelings without judgment to reduce overwhelming arousal.';
    if (valence < -0.7) return 'Cognitive Reframing: Actively challenge and reinterpret negative thought patterns to shift perspective.';
    
    return 'Mindful Observation: Maintain awareness of the current state without the need for immediate change.';
  }
}


// --- Main Consciousness Module ---

/**
 * @class CognitiveLattice
 * @description Represents the core of a conscious entity, managing its state,
 * awareness, and processing of sensory and internal data.
 */
class CognitiveLattice
 {
  #stateHistory = [];
  #maxHistory = 50; // Store last 50 states for stability analysis

  /**
   * Initializes the CognitiveLattice.
   * @param {object} [initialState={}] - Optional initial state configuration.
   * @param {number} [initialState.cognitiveLoad=0.1] - Normalized (0-1) cognitive load.
   * @param {number} [initialState.sensoryBandwidth=0.5] - Normalized (0-1) richness of sensory input.
   * @param {object} [initialState.emotionalState={valence:0, arousal:0, dominance:0}] - Initial emotional vector.
   */
  constructor(initialState = {}) {
    this.cognitiveLoad = initialState.cognitiveLoad ?? 0.1;
    this.sensoryBandwidth = initialState.sensoryBandwidth ?? 0.5;
    this.emotionalState = initialState.emotionalState ?? { valence: 0, arousal: 0, dominance: 0 };
    
    this.qualiaVector = { focus: 0, clarity: 0, presence: 0, integration: 0 };
    this.awarenessMetrics = { somatic: 0, environmental: 0, metacognitive: 0 };

    this.process(); // Perform initial calculation
  }

  /**
   * The core processing cycle. Updates all internal states and metrics.
   * This function simulates a "moment" of conscious experience.
   * @param {object} [inputs={}] - New inputs for this processing cycle.
   * @param {number} [inputs.cognitiveLoadDelta=0] - Change in cognitive load.
   * @param {number} [inputs.newSensoryBandwidth] - Absolute new value for sensory bandwidth.
   * @param {string} [inputs.emotionalStimulus] - A text-based stimulus to process.
   */
  process(inputs = {}) {
    // 1. Update primary inputs with validation
    if (inputs.cognitiveLoadDelta) {
      this.cognitiveLoad = Math.max(0, Math.min(1, this.cognitiveLoad + inputs.cognitiveLoadDelta));
    }
    if (inputs.newSensoryBandwidth !== undefined) {
      if (inputs.newSensoryBandwidth < 0 || inputs.newSensoryBandwidth > 1) {
        throw new InvalidInputError('Sensory bandwidth must be between 0 and 1.', {
          parameter: 'newSensoryBandwidth', value: inputs.newSensoryBandwidth
        });
      }
      this.sensoryBandwidth = inputs.newSensoryBandwidth;
    }
    if (inputs.emotionalStimulus) {
      this.emotionalState = EmotionalResonanceEngine.analyzeText(inputs.emotionalStimulus);
    }
    
    // 2. Enhance Consciousness State Calculation (The Qualia Vector)
    this._updateQualiaVector();

    // 3. Calculate New Awareness Metrics
    this._updateAwarenessMetrics();
    
    // 4. Store state for metacognitive analysis
    this._archiveState();

    // 5. Check for cognitive instability
    this._checkStability();
  }

  /**
   * @private
   * Updates the multi-dimensional Qualia Vector based on current inputs.
   * This is an "improved" calculation moving beyond a single consciousness score.
   */
  _updateQualiaVector() {
    const { cognitiveLoad, sensoryBandwidth, emotionalState } = this;
    
    // Focus: High when load is moderate and sensory input is not overwhelming.
    this.qualiaVector.focus = (1 - cognitiveLoad) * (1 - Math.abs(sensoryBandwidth - 0.7));

    // Clarity: Inversely related to cognitive load and emotional arousal.
    const emotionalIntensity = Math.abs(emotionalState.valence) + Math.abs(emotionalState.arousal);
    this.qualiaVector.clarity = 1 - (cognitiveLoad * 0.6 + emotionalIntensity * 0.4);

    // Presence: High with strong sensory input but low cognitive load. "Being in the moment."
    this.qualiaVector.presence = sensoryBandwidth * (1 - cognitiveLoad);

    // Integration: The ability to bind different streams. Degrades at extreme loads or low sensory input.
    const optimalLoad = 1 - Math.abs(cognitiveLoad - 0.5) * 2; // Peaks at 0.5 load
    this.qualiaVector.integration = sensoryBandwidth * optimalLoad;

    // Normalize all vector components to be within [0, 1]
    for (const key in this.qualiaVector) {
        this.qualiaVector[key] = Math.max(0, Math.min(1, this.qualiaVector[key]));
    }
  }

  /**
   * @private
   * Calculates advanced awareness metrics based on the current state.
   */
  _updateAwarenessMetrics() {
    // Somatic Awareness: Awareness of internal bodily state. Modeled as clarity during low arousal.
    this.awarenessMetrics.somatic = this.qualiaVector.clarity * (1 - Math.abs(this.emotionalState.arousal));

    // Environmental Awareness: Direct function of sensory input and presence.
    this.awarenessMetrics.environmental = this.sensoryBandwidth * this.qualiaVector.presence;

    // Metacognitive Awareness: "Awareness of awareness." Modeled as the stability of the Qualia Vector.
    this.awarenessMetrics.metacognitive = this._calculateStateStability();
    
    // Normalize
    for (const key in this.awarenessMetrics) {
        this.awarenessMetrics[key] = Math.max(0, Math.min(1, this.awarenessMetrics[key]));
    }
  }

  /**
   * @private
   * Archives the current qualia vector to the state history.
   */
  _archiveState() {
    this.#stateHistory.push({ ...this.qualiaVector });
    if (this.#stateHistory.length > this.#maxHistory) {
      this.#stateHistory.shift();
    }
  }

  /**
   * @private
   * Calculates the stability of the Qualia Vector over the last few states.
   * High stability suggests high metacognitive awareness.
   * @returns {number} A stability score from 0 (chaotic) to 1 (perfectly stable).
   */
  _calculateStateStability() {
    if (this.#stateHistory.length < 5) return 0.5; // Not enough data for a meaningful calculation

    const lastFiveStates = this.#stateHistory.slice(-5);
    let totalDistance = 0;

    for (let i = 1; i < lastFiveStates.length; i++) {
      const s1 = lastFiveStates[i - 1];
      const s2 = lastFiveStates[i];
      const distance = Math.sqrt(
        Math.pow(s1.focus - s2.focus, 2) +
        Math.pow(s1.clarity - s2.clarity, 2) +
        Math.pow(s1.presence - s2.presence, 2) +
        Math.pow(s1.integration - s2.integration, 2)
      );
      totalDistance += distance;
    }
    
    const averageDistance = totalDistance / (lastFiveStates.length - 1);
    // Max possible distance between two points in 4D unit hypercube is sqrt(4) = 2
    const maxAvgDistance = 2; 
    
    return Math.max(0, 1 - (averageDistance / maxAvgDistance));
  }
  
  /**
   * @private
   * Checks for signs of cognitive instability.
   */
  _checkStability() {
    const { clarity, integration, metacognitive } = { ...this.qualiaVector, ...this.awarenessMetrics };
    // If clarity and integration are critically low, and metacognition is failing, the state is unstable.
    if (clarity < 0.1 && integration < 0.1 && metacognitive < 0.2) {
      throw new CognitiveInstabilityError('Critical failure in clarity, integration, and metacognitive feedback loop.');
    }
  }

  /**
   * Returns a full diagnostic report of the current cognitive state.
   * @returns {object} A comprehensive snapshot of the lattice's state.
   */
  getReport() {
    return {
      timestamp: new Date().toISOString(),
      primaryInputs: {
        cognitiveLoad: this.cognitiveLoad,
        sensoryBandwidth: this.sensoryBandwidth,
      },
      emotionalState: this.emotionalState,
      qualiaVector: this.qualiaVector,
      awarenessMetrics: this.awarenessMetrics,
      emotionalIntelligence: {
        regulationSuggestion: EmotionalResonanceEngine.suggestRegulationStrategy(this.emotionalState)
      }
    };
  }
}

// --- Module Exports ---

module.exports.CognitiveLattice = CognitiveLattice;
module.exports.EmotionalResonanceEngine = EmotionalResonanceEngine;
module.exports.ConsciousnessError = ConsciousnessError;
module.exports.InvalidInputError = InvalidInputError;
module.exports.CognitiveInstabilityError = CognitiveInstabilityError;
```
module.exports = for;
