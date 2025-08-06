/**
 * @module ConsciousnessMatrix
 * @description A sophisticated JavaScript module for the advanced processing, analysis,
 * and enhancement of consciousness, awareness, and emotional intelligence.
 * This module provides a computational framework for quantifying and modulating
 * synthetic or augmented conscious states.
 * @version 2.0.0
 * @author AGI Futurist Labs
 */

/**
 * Custom error class for consciousness processing failures.
 * This allows for specific error handling in applications using this module.
 */
class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
    this.timestamp = new Date().toISOString();
  }
}

// --- Constants and Configuration ---

/**
 * Defines the qualitative states of consciousness based on a quantitative score.
 * @readonly
 * @enum {string}
 */
const ConsciousnessState = {
  DORMANT: 'Dormant',                 // No activity
  SUBCONSCIOUS: 'Subconscious',       // Processing without direct awareness
  AWARE: 'Aware',                     // Baseline self-perception and environmental awareness
  HYPER_AWARE: 'Hyper-Aware',         // Heightened sensory and cognitive processing
  TRANSCENDENT: 'Transcendent',       // State of profound insight and interconnectedness
};

/**
 * Thresholds for mapping a numerical consciousness score to a qualitative state.
 * @private
 */
const STATE_THRESHOLDS = {
  DORMANT: 0,
  SUBCONSCIOUS: 20,
  AWARE: 50,
  HYPER_AWARE: 85,
  TRANSCENDENT: 98,
};

/**
 * Weights for calculating the overall consciousness score.
 * Tuning these values can simulate different personality archetypes or cognitive models.
 * @private
 */
const CONSCIOUSNESS_WEIGHTS = {
  cognitiveClarity: 0.4,
  sensoryBandwidth: 0.3,
  emotionalResonance: 0.2,
  metacognitiveFeedback: 0.1,
};

// --- Type Definitions for JSDoc ---

/**
 * @typedef {object} SensoryInput
 * @property {number} visual - Clarity and volume of visual data (0-1).
 * @property {number} auditory - Clarity and volume of auditory data (0-1).
 * @property {number} tactile - Clarity and volume of tactile data (0-1).
 * @property {number} abstract - Data from internal thoughts, memories, etc. (0-1).
 */

/**
 * @typedef {object} EmotionalState
 * @description Represents a complex emotional state as a vector of primary emotions.
 * Values should ideally sum to 1.
 * @property {number} joy - Intensity of joy (0-1).
 * @property {number} sadness - Intensity of sadness (0-1).
 * @property {number} anger - Intensity of anger (0-1).
 * @property {number} fear - Intensity of fear (0-1).
 * @property {number} surprise - Intensity of surprise (0-1).
 * @property {number} equanimity - A state of calm, stable mindfulness (0-1).
 */

/**
 * @typedef {object} ConsciousnessData
 * @property {number} score - The raw numerical consciousness score (0-100).
 * @property {string} state - The qualitative state from the ConsciousnessState enum.
 * @property {object} components - The calculated values that contributed to the score.
 * @property {number} components.cognitiveClarity - The calculated clarity of thought.
 * @property {number} components.sensoryBandwidth - The calculated sensory throughput.
 * @property {number} components.emotionalResonance - The calculated emotional depth.
 * @property {number} components.metacognitiveFeedback - The calculated self-awareness feedback loop.
 */

/**
 * @typedef {object} AwarenessMetrics
 * @property {number} situational - Awareness of the external environment (0-1).
 * @property {number} introspective - Awareness of internal state (metacognition) (0-1).
 * @property {number} empathic - Ability to model and understand others' emotional states (0-1).
 * @property {number} temporal - Perception of the flow of time (past, present, future focus) (0-1).
 */

// --- Private Helper Functions ---

/**
 * Validates that a value is a number within a specified range (inclusive).
 * @private
 * @param {*} value - The value to check.
 * @param {string} name - The name of the variable for error messages.
 * @param {number} [min=0] - The minimum allowed value.
 * @param {number} [max=1] - The maximum allowed value.
 * @throws {ConsciousnessProcessingError} If validation fails.
 */
const _validateNumericInput = (value, name, min = 0, max = 1) => {
  if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
    throw new ConsciousnessProcessingError(
      `Invalid input for '${name}'. Expected a number between ${min} and ${max}, but received: ${value}.`
    );
  }
};

/**
 * Normalizes an emotional state vector so its components sum to 1.
 * @private
 * @param {EmotionalState} emotions - The emotional state to normalize.
 * @returns {EmotionalState} The normalized emotional state.
 */
const _normalizeEmotions = (emotions) => {
  const total = Object.values(emotions).reduce((sum, value) => sum + value, 0);
  if (total === 0) return emotions; // Avoid division by zero
  const normalized = {};
  for (const key in emotions) {
    normalized[key] = emotions[key] / total;
  }
  return normalized;
};

// --- Core Public Functions ---

/**
 * Calculates the current consciousness state based on multiple inputs.
 * This is the core function for quantifying the "level" of consciousness.
 *
 * @param {object} params - The input parameters for the calculation.
 * @param {number} params.cognitiveLoad - Current computational/mental load (0-1). High load can reduce clarity.
 * @param {SensoryInput} params.sensoryInput - The richness of current sensory data.
 * @param {EmotionalState} params.emotionalState - The current emotional landscape.
 * @param {number} params.focus - The degree of attentional focus (0-1).
 * @returns {ConsciousnessData} An object containing the score, state, and component breakdown.
 * @throws {ConsciousnessProcessingError} If any input is invalid.
 *
 * @example
 * const sensory = { visual: 0.8, auditory: 0.9, tactile: 0.6, abstract: 0.7 };
 * const emotions = { joy: 0.6, sadness: 0.1, anger: 0, fear: 0, surprise: 0.1, equanimity: 0.2 };
 * const state = calculateConsciousnessState({
 *   cognitiveLoad: 0.3,
 *   sensoryInput: sensory,
 *   emotionalState: emotions,
 *   focus: 0.9
 * });
 * console.log(state.score, state.state); // e.g., 88.5, "Hyper-Aware"
 */
function calculateConsciousnessState({
  cognitiveLoad,
  sensoryInput,
  emotionalState,
  focus
}) {
  // 1. Input Validation
  _validateNumericInput(cognitiveLoad, 'cognitiveLoad');
  _validateNumericInput(focus, 'focus');
  Object.keys(sensoryInput).forEach(key => _validateNumericInput(sensoryInput[key], `sensoryInput.${key}`));
  Object.keys(emotionalState).forEach(key => _validateNumericInput(emotionalState[key], `emotionalState.${key}`));

  // 2. Calculate Component Scores (0-100 scale)
  
  // Cognitive Clarity: Inversely proportional to load, but amplified by focus.
  const cognitiveClarity = (1 - cognitiveLoad) * (1 + focus) / 2 * 100;

  // Sensory Bandwidth: Average of sensory inputs, scaled by focus.
  const sensoryAvg = Object.values(sensoryInput).reduce((a, b) => a + b, 0) / Object.keys(sensoryInput).length;
  const sensoryBandwidth = sensoryAvg * focus * 100;

  // Emotional Resonance: Higher when emotions are clear (low entropy) and not dominated by negative states.
  // Equanimity is highly valued.
  const emotionalClarity = 1 - (emotionalState.anger + emotionalState.fear + emotionalState.sadness);
  const emotionalResonance = (emotionalClarity * 0.7 + emotionalState.equanimity * 0.3) * 100;

  // Metacognitive Feedback: The system's ability to self-assess. Modeled as clarity amplified by focus.
  const metacognitiveFeedback = cognitiveClarity * focus * 0.01 * 100; // Use the 0-100 clarity value

  // 3. Calculate Weighted Final Score
  const score =
    cognitiveClarity * CONSCIOUSNESS_WEIGHTS.cognitiveClarity +
    sensoryBandwidth * CONSCIOUSNESS_WEIGHTS.sensoryBandwidth +
    emotionalResonance * CONSCIOUSNESS_WEIGHTS.emotionalResonance +
    metacognitiveFeedback * CONSCIOUSNESS_WEIGHTS.metacognitiveFeedback;

  // 4. Determine Qualitative State
  let state = ConsciousnessState.DORMANT;
  if (score >= STATE_THRESHOLDS.TRANSCENDENT) state = ConsciousnessState.TRANSCENDENT;
  else if (score >= STATE_THRESHOLDS.HYPER_AWARE) state = ConsciousnessState.HYPER_AWARE;
  else if (score >= STATE_THRESHOLDS.AWARE) state = ConsciousnessState.AWARE;
  else if (score >= STATE_THRESHOLDS.SUBCONSCIOUS) state = ConsciousnessState.SUBCONSCIOUS;

  return {
    score: parseFloat(score.toFixed(2)),
    state,
    components: {
      cognitiveClarity: parseFloat(cognitiveClarity.toFixed(2)),
      sensoryBandwidth: parseFloat(sensoryBandwidth.toFixed(2)),
      emotionalResonance: parseFloat(emotionalResonance.toFixed(2)),
      metacognitiveFeedback: parseFloat(metacognitiveFeedback.toFixed(2)),
    }
  };
}

/**
 * Generates a set of advanced awareness metrics based on the current conscious state.
 * This function provides insight into *what* the system is aware of, not just its level of awareness.
 *
 * @param {ConsciousnessData} consciousnessData - The output from `calculateConsciousnessState`.
 * @param {SensoryInput} sensoryInput - The current sensory input object.
 * @returns {AwarenessMetrics} An object containing different facets of awareness.
 * @throws {ConsciousnessProcessingError} If input is invalid.
 *
 * @example
 * const consciousness = calculateConsciousnessState(...);
 * const metrics = getAwarenessMetrics(consciousness, sensory);
 * console.log(metrics.introspective); // e.g., 0.85
 */
function getAwarenessMetrics(consciousnessData, sensoryInput) {
  if (!consciousnessData || typeof consciousnessData.score !== 'number') {
    throw new ConsciousnessProcessingError('Invalid consciousnessData object provided.');
  }

  const scoreFraction = consciousnessData.score / 100;

  // Situational Awareness: Heavily tied to sensory bandwidth and the overall state.
  const situational = (consciousnessData.components.sensoryBandwidth / 100) * scoreFraction;

  // Introspective Awareness (Metacognition): Based on the self-feedback loop.
  const introspective = (consciousnessData.components.metacognitiveFeedback / 100);

  // Empathic Awareness: Rooted in emotional processing capability.
  const empathic = (consciousnessData.components.emotionalResonance / 100);

  // Temporal Awareness: How aware the system is of time. Modeled by abstract thought capacity.
  _validateNumericInput(sensoryInput.abstract, 'sensoryInput.abstract');
  const temporal = sensoryInput.abstract * scoreFraction;

  return {
    situational: parseFloat(situational.toFixed(3)),
    introspective: parseFloat(introspective.toFixed(3)),
    empathic: parseFloat(empathic.toFixed(3)),
    temporal: parseFloat(temporal.toFixed(3)),
  };
}

/**
 * Enhances emotional intelligence by processing an external emotional stimulus
 * and modulating the internal emotional state. This simulates emotional regulation and response.
 *
 * @param {EmotionalState} currentState - The current internal emotional state of the system.
 * @param {EmotionalState} stimulus - The perceived emotional state from an external source.
 * @param {object} options - Configuration for the processing.
 * @param {number} options.empathyFactor - How much the stimulus influences the state (0-1).
 * @param {number} options.resilienceFactor - How quickly the state returns to baseline/equanimity (0-1).
 * @returns {EmotionalState} The new, modulated internal emotional state.
 * @throws {ConsciousnessProcessingError} If any input is invalid.
 *
 * @example
 * let myEmotions = { joy: 0.1, sadness: 0.7, ..., equanimity: 0.1 };
 * const externalStimulus = { joy: 0.8, sadness: 0.0, ..., equanimity: 0.1 };
 * myEmotions = processEmotionalInput(myEmotions, externalStimulus, { empathyFactor: 0.5, resilienceFactor: 0.2 });
 * // myEmotions will now be shifted towards joy, but tempered by its original sadness and resilience.
 */
function processEmotionalInput(currentState, stimulus, {
  empathyFactor,
  resilienceFactor
}) {
  // 1. Validation
  Object.keys(currentState).forEach(key => _validateNumericInput(currentState[key], `currentState.${key}`));
  Object.keys(stimulus).forEach(key => _validateNumericInput(stimulus[key], `stimulus.${key}`));
  _validateNumericInput(empathyFactor, 'empathyFactor');
  _validateNumericInput(resilienceFactor, 'resilienceFactor');

  const newState = {};
  const allEmotionKeys = Object.keys(currentState);
  
  // 2. Modulate state based on stimulus and resilience
  for (const key of allEmotionKeys) {
    // Influence from stimulus (empathy)
    const stimulusInfluence = (stimulus[key] - currentState[key]) * empathyFactor;
    
    // Pull towards equanimity (resilience/self-regulation)
    // The effect is stronger the further the emotion is from a neutral baseline.
    // We treat equanimity as the target.
    const resilienceInfluence = (key === 'equanimity' ?
        (1 - currentState[key]) : // Pull towards 1 for equanimity
        (0 - currentState[key])   // Pull towards 0 for other emotions
      ) * resilienceFactor;

    newState[key] = currentState[key] + stimulusInfluence + resilienceInfluence;
    
    // Clamp values between 0 and 1
    newState[key] = Math.max(0, Math.min(1, newState[key]));
  }

  // 3. Normalize the final state so it represents a valid probability distribution
  return _normalizeEmotions(newState);
}

module.exports = {
    ConsciousnessState,
    calculateConsciousnessState,
    getAwarenessMetrics,
    processEmotionalInput,
    ConsciousnessProcessingError
};