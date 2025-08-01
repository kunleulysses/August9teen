```javascript
/**
 * @module Consciousness
 * @description A JavaScript module for advanced processing and simulation of
 * consciousness, awareness, and emotional intelligence. This module provides
 * a framework for quantifying and analyzing complex cognitive states.
 * It is designed for use in AI, simulations, and theoretical cognitive modeling.
 *
 * @version 2.0.0
 * @author AGI Development Collective
 * @license MIT
 */

/**
 * Custom error class for cognitive processing failures.
 */
class CognitiveProcessingError extends Error {
  /**
   * @param {string} message The error message.
   * @param {object} [details] Additional details about the error context.
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'CognitiveProcessingError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @typedef {Object.<string, number>} EmotionalState
 * @description Represents the intensity of primary emotions, with values from 0 (absent) to 1 (maximum intensity).
 * Based on a modified Plutchik's wheel of emotions.
 * @example
 * { joy: 0.8, trust: 0.6, fear: 0.1, surprise: 0.3, sadness: 0.0, disgust: 0.0, anger: 0.0, anticipation: 0.7 }
 */

/**
 * @typedef {Object} CognitiveFrame
 * @description A snapshot of the cognitive state at a single moment in time.
 * This is the primary data structure used by the module.
 * @property {string} id - A unique identifier for this frame.
 * @property {number} timestamp - The millisecond timestamp of the frame's creation.
 * @property {object} sensoryInput - Data from sensory modalities.
 * @property {number} sensoryInput.visualClarity - 0 to 1, clarity of visual information.
 * @property {number} sensoryInput.auditoryFocus - 0 to 1, focus on auditory streams.
 * @property {number} sensoryInput.somaticIntensity - 0 to 1, intensity of bodily sensations.
 * @property {object} internalMonologue - Represents internal thought processes.
 * @property {number} internalMonologue.clarity - 0 to 1, how coherent and focused the thoughts are.
 * @property {number} internalMonologue.complexity - 0 to 1, the abstractness or depth of thought.
 * @property {EmotionalState} emotionalState - The current emotional landscape.
 * @property {object} [memoryContext] - Optional context from memory systems.
 * @property {number} memoryContext.shortTermRecallAccuracy - 0 to 1.
 * @property {number} memoryContext.longTermAssociationStrength - 0 to 1.
 */

const CONSCIOUSNESS_STATES = {
  FOCUSED_AWARENESS: 'FOCUSED_AWARENESS', // High clarity, low internal noise, task-oriented.
  DIFFUSE_REFLECTION: 'DIFFUSE_REFLECTION', // Daydreaming, low sensory focus, high associative thought.
  INTROSPECTION: 'INTROSPECTION', // High self-awareness, focused on internal emotional/somatic state.
  REACTIVE_FLOW: 'REACTIVE_FLOW', // High sensory input, low internal monologue, "in the zone".
  DEEP_SLEEP: 'DEEP_SLEEP', // Minimal activity across all domains.
};

const PRIMARY_EMOTIONS = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'];

// Based on Plutchik's model, primary dyads (emotions next to each other)
const EMOTIONAL_DYADS = {
  love: ['joy', 'trust'],
  submission: ['trust', 'fear'],
  awe: ['fear', 'surprise'],
  disapproval: ['surprise', 'sadness'],
  remorse: ['sadness', 'disgust'],
  contempt: ['disgust', 'anger'],
  aggressiveness: ['anger', 'anticipation'],
  optimism: ['anticipation', 'joy'],
};

/**
 * Validates the structure and values of a CognitiveFrame.
 * @private
 * @param {CognitiveFrame} frame - The cognitive frame to validate.
 * @throws {CognitiveProcessingError} If the frame is invalid.
 */
function _validateCognitiveFrame(frame) {
  if (!frame || typeof frame !== 'object') {
    throw new CognitiveProcessingError('CognitiveFrame must be a non-null object.');
  }

  const requiredKeys = ['id', 'timestamp', 'sensoryInput', 'internalMonologue', 'emotionalState'];
  for (const key of requiredKeys) {
    if (!(key in frame)) {
      throw new CognitiveProcessingError(`CognitiveFrame is missing required key: "${key}".`);
    }
  }

  if (!frame.emotionalState || typeof frame.emotionalState !== 'object') {
    throw new CognitiveProcessingError('CognitiveFrame.emotionalState must be an object.');
  }

  for (const emotion of PRIMARY_EMOTIONS) {
    const intensity = frame.emotionalState[emotion];
    if (typeof intensity !== 'number' || intensity < 0 || intensity > 1) {
      throw new CognitiveProcessingError(`Invalid intensity for emotion "${emotion}". Must be a number between 0 and 1.`, {
        emotion,
        value: intensity
      });
    }
  }
}

/**
 * Calculates the dominant consciousness state from a cognitive frame.
 * This improved calculation uses a weighted scoring system to provide a more
 * nuanced state assessment than simple thresholds.
 *
 * @param {CognitiveFrame} frame - The current cognitive snapshot.
 * @returns {string} The calculated dominant consciousness state (from CONSCIOUSNESS_STATES).
 */
function calculateConsciousnessState(frame) {
  try {
    _validateCognitiveFrame(frame);

    const {
      sensoryInput,
      internalMonologue,
      emotionalState
    } = frame;

    // Normalize total emotional intensity
    const totalEmotion = Object.values(emotionalState).reduce((sum, val) => sum + val, 0) / PRIMARY_EMOTIONS.length;

    // Calculate scores for each potential state
    const scores = {
      [CONSCIOUSNESS_STATES.FOCUSED_AWARENESS]: (internalMonologue.clarity * 0.5) +
        (sensoryInput.visualClarity * 0.3) +
        (sensoryInput.auditoryFocus * 0.2) -
        (totalEmotion * 0.2),

      [CONSCIOUSNESS_STATES.DIFFUSE_REFLECTION]: (internalMonologue.complexity * 0.6) -
        (internalMonologue.clarity * 0.3) -
        (sensoryInput.visualClarity * 0.2) -
        (sensoryInput.auditoryFocus * 0.2),

      [CONSCIOUSNESS_STATES.INTROSPECTION]: (totalEmotion * 0.4) +
        (internalMonologue.clarity * 0.3) +
        (sensoryInput.somaticIntensity * 0.3) -
        (sensoryInput.visualClarity * 0.5),

      [CONSCIOUSNESS_STATES.REACTIVE_FLOW]: (sensoryInput.visualClarity * 0.4) +
        (sensoryInput.auditoryFocus * 0.3) +
        (sensoryInput.somaticIntensity * 0.3) -
        (internalMonologue.clarity * 0.5) -
        (internalMonologue.complexity * 0.3),

      [CONSCIOUSNESS_STATES.DEEP_SLEEP]: 1.0 -
        (sensoryInput.visualClarity + sensoryInput.auditoryFocus + sensoryInput.somaticIntensity +
          internalMonologue.clarity + internalMonologue.complexity + totalEmotion) / 6,
    };

    // Find the state with the highest score
    let dominantState = CONSCIOUSNESS_STATES.DEEP_SLEEP;
    let maxScore = -Infinity;

    for (const state in scores) {
      if (scores[state] > maxScore) {
        maxScore = scores[state];
        dominantState = state;
      }
    }

    return dominantState;

  } catch (error) {
    if (error instanceof CognitiveProcessingError) {
      throw error; // Re-throw our specific errors
    }
    // Wrap other unexpected errors
    throw new CognitiveProcessingError('An unexpected error occurred during consciousness state calculation.', {
      originalError: error
    });
  }
}

/**
 * Computes a set of advanced awareness metrics.
 * These metrics provide deeper insight into the quality of awareness.
 *
 * @param {CognitiveFrame} currentFrame - The cognitive frame to analyze.
 * @param {CognitiveFrame} [previousFrame] - Optional. The immediately preceding frame for temporal analysis.
 * @returns {{selfAwareness: number, situationalAwareness: number, temporalCoherence: number}} An object containing awareness scores from 0 to 1.
 */
function calculateAwarenessMetrics(currentFrame, previousFrame = null) {
  try {
    _validateCognitiveFrame(currentFrame);
    if (previousFrame) _validateCognitiveFrame(previousFrame);

    // 1. Self-Awareness: The clarity of one's own internal state.
    // A combination of knowing what you're thinking and what you're feeling.
    const selfAwareness = (currentFrame.internalMonologue.clarity * 0.6) +
      (currentFrame.sensoryInput.somaticIntensity * 0.2) +
      ((1 - Math.abs(Object.values(currentFrame.emotionalState).reduce((a, b) => a + b, 0) - 1)) * 0.2); // Penalizes wildly fluctuating or muted emotional signals

    // 2. Situational Awareness: How well internal models align with sensory input.
    // High complexity of thought with low sensory clarity might indicate a disconnect.
    const sensoryFocus = (currentFrame.sensoryInput.visualClarity + currentFrame.sensoryInput.auditoryFocus) / 2;
    const situationalAwareness = sensoryFocus * (1 - Math.abs(sensoryFocus - currentFrame.internalMonologue.clarity));

    // 3. Temporal Coherence: The logical and emotional consistency between moments.
    // Requires a previous frame to compare against. Default to 0.5 if no history.
    let temporalCoherence = 0.5;
    if (previousFrame) {
      const thoughtClarityDelta = Math.abs(currentFrame.internalMonologue.clarity - previousFrame.internalMonologue.clarity);

      // Calculate emotional distance (Euclidean distance in N-dimensional emotion space)
      let emotionDeltaSq = 0;
      for (const emotion of PRIMARY_EMOTIONS) {
        emotionDeltaSq += Math.pow((currentFrame.emotionalState[emotion] || 0) - (previousFrame.emotionalState[emotion] || 0), 2);
      }
      const emotionalDistance = Math.sqrt(emotionDeltaSq) / Math.sqrt(PRIMARY_EMOTIONS.length);

      // Coherence is high when changes are small.
      temporalCoherence = 1 - ((thoughtClarityDelta * 0.4) + (emotionalDistance * 0.6));
    }

    return {
      selfAwareness: Math.max(0, Math.min(1, selfAwareness)),
      situationalAwareness: Math.max(0, Math.min(1, situationalAwareness)),
      temporalCoherence: Math.max(0, Math.min(1, temporalCoherence)),
    };

  } catch (error) {
    if (error instanceof CognitiveProcessingError) {
      throw error;
    }
    throw new CognitiveProcessingError('Failed to calculate awareness metrics.', {
      originalError: error
    });
  }
}

/**
 * Enhances emotional intelligence processing by identifying complex emotions (dyads)
 * and calculating overall emotional depth.
 *
 * @param {EmotionalState} emotionalState - The emotional state object from a CognitiveFrame.
 * @returns {{identifiedDyads: Object.<string, number>, emotionalDepth: number}} An object containing identified complex emotions and a metric for emotional complexity.
 */
function processEmotionalIntelligence(emotionalState) {
  try {
    if (!emotionalState || typeof emotionalState !== 'object') {
      throw new CognitiveProcessingError('Invalid emotionalState provided. Must be an object.');
    }

    const identifiedDyads = {};
    for (const dyadName in EMOTIONAL_DYADS) {
      const [emotion1, emotion2] = EMOTIONAL_DYADS[dyadName];
      const intensity1 = emotionalState[emotion1] || 0;
      const intensity2 = emotionalState[emotion2] || 0;

      // The intensity of the dyad is the geometric mean of its components.
      // This ensures both must be present to form the complex emotion.
      const dyadIntensity = Math.sqrt(intensity1 * intensity2);
      if (dyadIntensity > 0.1) { // Threshold to avoid noise
        identifiedDyads[dyadName] = dyadIntensity;
      }
    }

    // Emotional Depth: A measure of how many distinct emotions are being experienced simultaneously.
    // Uses Shannon entropy to measure the richness/complexity of the emotional state.
    let entropy = 0;
    const activeEmotions = Object.values(emotionalState).filter(val => val > 0);
    const sumOfIntensities = activeEmotions.reduce((sum, val) => sum + val, 0);

    if (sumOfIntensities > 0) {
      for (const intensity of activeEmotions) {
        const p = intensity / sumOfIntensities;
        entropy -= p * Math.log2(p);
      }
    }
    // Normalize entropy to a 0-1 scale. Max entropy for 8 emotions is log2(8) = 3.
    const emotionalDepth = entropy / 3;

    return {
      identifiedDyads,
      emotionalDepth: Math.max(0, Math.min(1, emotionalDepth))
    };

  } catch (error) {
    if (error instanceof CognitiveProcessingError) {
      throw error;
    }
    throw new CognitiveProcessingError('Failed to process emotional intelligence.', {
      originalError: error
    });
  }
}

/**
 * Simulates empathic resonance between two cognitive entities.
 * It calculates how one entity might perceive and be affected by another's state.
 *
 * @param {CognitiveFrame} selfFrame - The cognitive frame of the observer.
 * @param {CognitiveFrame} otherFrame - The cognitive frame of the entity being observed.
 * @returns {{cognitiveEmpathy: number, affectiveResonance: EmotionalState}}
 *          - cognitiveEmpathy: (0-1) Accuracy of perceiving the other's emotional state.
 *          - affectiveResonance: A new EmotionalState representing the observer's potential emotional shift.
 */
function simulateEmpathicResonance(selfFrame, otherFrame) {
  try {
    _validateCognitiveFrame(selfFrame);
    _validateCognitiveFrame(otherFrame);

    // Cognitive Empathy: The ability to accurately read another's emotional state.
    // This is influenced by one's own self-awareness and situational awareness.
    const awarenessMetrics = calculateAwarenessMetrics(selfFrame);
    const perceptionAccuracy = (awarenessMetrics.selfAwareness * 0.5) + (awarenessMetrics.situationalAwareness * 0.5);

    // Calculate the perceived emotional state of the other.
    const perceivedOtherEmotions = {};
    let errorSumSq = 0;
    for (const emotion of PRIMARY_EMOTIONS) {
      const actual = otherFrame.emotionalState[emotion] || 0;
      // Perception error is inversely proportional to accuracy.
      const error = (Math.random() - 0.5) * (1 - perceptionAccuracy);
      perceivedOtherEmotions[emotion] = Math.max(0, Math.min(1, actual + error));
      errorSumSq += Math.pow(actual - perceivedOtherEmotions[emotion], 2);
    }
    // Cognitive empathy is high when the error between actual and perceived is low.
    const cognitiveEmpathy = 1 - Math.sqrt(errorSumSq / PRIMARY_EMOTIONS.length);


    // Affective Resonance: How the observer's own emotions shift in response.
    // Influenced by the observer's current emotional state and the perceived state of the other.
    // A high "trust" and low "anger/disgust" in self can increase resonance.
    const empathicSusceptibility = (selfFrame.emotionalState.trust * 0.5 + (1 - selfFrame.emotionalState.anger) * 0.25 + (1 - selfFrame.emotionalState.disgust) * 0.25);

    const affectiveResonance = {};
    for (const emotion of PRIMARY_EMOTIONS) {
      const selfIntensity = selfFrame.emotionalState[emotion] || 0;
      const perceivedOtherIntensity = perceivedOtherEmotions[emotion];
      // The new emotion is a weighted average of the self's original emotion and the perceived other's emotion.
      const newIntensity = (selfIntensity * (1 - empathicSusceptibility)) + (perceivedOtherIntensity * empathicSusceptibility);
      affectiveResonance[emotion] = Math.max(0, Math.min(1, newIntensity));
    }

    return {
      cognitiveEmpathy: Math.max(0, Math.min(1, cognitiveEmpathy)),
      affectiveResonance,
    };

  } catch (error) {
    if (error instanceof CognitiveProcessingError) {
      throw error;
    }
    throw new CognitiveProcessingError('Failed to simulate empathic resonance.', {
      originalError: error
    });
  }
}

// Export the public API of the module.
export default {
  calculateConsciousnessState,
  calculateAwarenessMetrics,
  processEmotionalIntelligence,
  simulateEmpathicResonance,
  // Expose constants for external use and reference.
  CONSTANTS: {
    CONSCIOUSNESS_STATES,
    PRIMARY_EMOTIONS,
    EMOTIONAL_DYADS,
  },
  // Expose the custom error for type checking.
  CognitiveProcessingError,
};
```