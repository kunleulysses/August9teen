```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the advanced processing, analysis,
 * and enhancement of consciousness-related data streams. It provides robust tools for
 * state calculation, awareness metric generation, and nuanced emotional intelligence processing.
 * This module is designed for high-throughput, real-time neuro-computational environments.
 *
 * @version 2.0.0
 * @author Neural-AI Research Group
 * @license MIT
 */

/**
 * @typedef {Object} NeuralData
 * @property {number} delta - Power of delta waves (0.5-4 Hz). Associated with deep sleep.
 * @property {number} theta - Power of theta waves (4-8 Hz). Associated with drowsiness, REM, meditation.
 * @property {number} alpha - Power of alpha waves (8-12 Hz). Associated with relaxed wakefulness.
 * @property {number} beta - Power of beta waves (12-30 Hz). Associated with active thinking, focus.
 * @property {number} gamma - Power of gamma waves (30-100+ Hz). Associated with high-level information processing, insight.
 */

/**
 * @typedef {Object} CognitiveInput
 * @property {number} cognitiveLoad - A normalized value (0-1) representing current mental workload.
 * @property {number} sensoryThroughput - A measure of processed sensory information (bits/sec).
 * @property {number} feedbackLoopCoherence - A normalized score (0-1) of metacognitive feedback loop stability.
 * @property {number} interoceptiveClarity - A normalized score (0-1) of internal bodily signal clarity.
 */

/**
 * @typedef {Object} EmotionalInput
 * @property {number} valence - The pleasantness of an emotion (-1 for negative, +1 for positive).
 * @property {number} arousal - The intensity of the emotion (0 for calm, 1 for excited/agitated).
 * @property {string[]} socialContext - Keywords describing the current social situation (e.g., 'solitude', 'conflict', 'collaboration').
 */

/**
 * @typedef {Object} ConsciousnessState
 * @property {string} state - The name of the dominant consciousness state.
 * @property {number} confidence - The confidence score (0-1) for the determined state.
 * @property {Object<string, number>} distribution - The probability distribution across all possible states.
 */

/**
 * @typedef {Object} AwarenessMetrics
 * @property {number} metacognitive - Score (0-100) for self-awareness of thought processes.
 * @property {number} somatic - Score (0-100) for awareness of internal bodily sensations.
 * @property {number} environmental - Score (0-100) for awareness of external surroundings.
 * @property {number} globalAwarenessIndex - A composite index derived from the other metrics.
 */

/**
 * @typedef {Object} EmotionalProfile
 * @property {string} primaryEmotion - The dominant identified emotion.
 * @property {number} intensity - The intensity of the primary emotion (0-1).
 * @property {Object[]} emotionalBlend - An array of secondary emotions contributing to the overall state.
 * @property {string} emotionalBlend[].emotion - The name of the secondary emotion.
 * @property {number} emotionalBlend[].contribution - The contribution score (0-1) of the secondary emotion.
 * @property {string} nuance - A qualitative descriptor of the emotional state, influenced by social context.
 */


// --- Private Utility Functions ---

/**
 * Validates that a value is a number within a specified range.
 * @param {*} value - The value to check.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @param {string} name - The name of the value for the error message.
 * @throws {Error} If the value is not a valid number in the range.
 * @private
 */
const _validateNumber = (value, min, max, name) => {
  if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
    throw new Error(`Invalid ${name}: Must be a number between ${min} and ${max}. Received: ${value}`);
  }
};

/**
 * A sigmoid function to normalize scores into a 0-1 range, providing a smooth gradient.
 * @param {number} x - The input value.
 * @returns {number} The normalized value.
 * @private
 */
const _sigmoid = (x) => 1 / (1 + Math.exp(-x));

/**
 * A softmax function to convert a vector of scores into a probability distribution.
 * @param {number[]} scores - An array of numerical scores.
 * @returns {number[]} An array representing the probability distribution.
 * @private
 */
const _softmax = (scores) => {
  const maxScore = Math.max(...scores);
  const exps = scores.map(score => Math.exp(score - maxScore)); // Subtract maxScore for numerical stability
  const sumExps = exps.reduce((a, b) => a + b, 0);
  return exps.map(exp => exp / sumExps);
};


// --- Core Data Structures ---

/**
 * Defines the characteristics of different consciousness states.
 * The weights determine how much each input factor contributes to the score of a given state.
 * @private
 */
const STATE_DEFINITIONS = {
  'Deep Sleep':   { weights: { delta: 0.8, theta: 0.2, alpha: -0.5, beta: -1.0, gamma: -1.0, load: -1.0 } },
  'REM Sleep':    { weights: { delta: 0.1, theta: 0.7, alpha: 0.1, beta: 0.5, gamma: 0.4, load: -0.5 } },
  'Drowsiness':   { weights: { delta: 0.2, theta: 0.6, alpha: 0.4, beta: -0.3, gamma: -0.5, load: -0.2 } },
  'Relaxed':      { weights: { delta: -0.5, theta: 0.2, alpha: 0.8, beta: 0.1, gamma: -0.2, load: -0.1 } },
  'Focused':      { weights: { delta: -0.8, theta: -0.2, alpha: -0.5, beta: 0.8, gamma: 0.6, load: 0.7 } },
  'Flow State':   { weights: { delta: -1.0, theta: 0.4, alpha: 0.2, beta: 0.6, gamma: 0.8, load: 0.9 } },
  'Meditative':   { weights: { delta: -0.2, theta: 0.8, alpha: 0.6, beta: -0.4, gamma: 0.1, load: -0.8 } },
};

/**
 * Defines emotions in a 2D valence-arousal space.
 * @private
 */
const EMOTION_MAP = {
  'Joy':          { valence: 0.8, arousal: 0.6 },
  'Trust':        { valence: 0.7, arousal: 0.4 },
  'Fear':         { valence: -0.6, arousal: 0.7 },
  'Surprise':     { valence: 0.2, arousal: 0.8 },
  'Sadness':      { valence: -0.7, arousal: 0.2 },
  'Disgust':      { valence: -0.6, arousal: 0.5 },
  'Anger':        { valence: -0.5, arousal: 0.8 },
  'Anticipation': { valence: 0.4, arousal: 0.6 },
  'Serenity':     { valence: 0.6, arousal: 0.1 },
  'Grief':        { valence: -0.8, arousal: 0.4 },
  'Ecstasy':      { valence: 0.9, arousal: 0.9 },
  'Rage':         { valence: -0.8, arousal: 0.9 },
};

// --- Public API ---

/**
 * Calculates the current consciousness state based on neural and cognitive data.
 * This enhanced calculation uses a weighted model and softmax distribution for higher accuracy.
 *
 * @param {NeuralData} neuralData - The power spectrum of neural oscillations.
 * @param {CognitiveInput} cognitiveInput - The cognitive performance and load metrics.
 * @returns {ConsciousnessState} An object containing the determined state and its probability distribution.
 * @throws {Error} If input data is invalid.
 */
function calculateConsciousnessState(neuralData, cognitiveInput) {
module.exports.calculateConsciousnessState = calculateConsciousnessState;

  // --- Input Validation ---
  if (!neuralData || !cognitiveInput) {
    throw new Error('Both neuralData and cognitiveInput objects must be provided.');
  }
  for (const wave in neuralData) {
    _validateNumber(neuralData[wave], 0, Infinity, `neuralData.${wave}`);
  }
  _validateNumber(cognitiveInput.cognitiveLoad, 0, 1, 'cognitiveInput.cognitiveLoad');

  // --- State Scoring ---
  const stateNames = Object.keys(STATE_DEFINITIONS);
  const totalPower = Object.values(neuralData).reduce((a, b) => a + b, 1e-9); // Avoid division by zero

  const scores = stateNames.map(stateName => {
    const def = STATE_DEFINITIONS[stateName];
    let score = 0;
    score += def.weights.delta * (neuralData.delta / totalPower);
    score += def.weights.theta * (neuralData.theta / totalPower);
    score += def.weights.alpha * (neuralData.alpha / totalPower);
    score += def.weights.beta  * (neuralData.beta  / totalPower);
    score += def.weights.gamma * (neuralData.gamma / totalPower);
    score += def.weights.load  * cognitiveInput.cognitiveLoad;
    return score;
  });

  // --- Probability Calculation ---
  const probabilities = _softmax(scores);
  const distribution = Object.fromEntries(stateNames.map((name, i) => [name, probabilities[i]]));

  const maxProb = Math.max(...probabilities);
  const dominantState = stateNames[probabilities.indexOf(maxProb)];

  return {
    state: dominantState,
    confidence: maxProb,
    distribution: distribution,
  };
}

/**
 * Generates a profile of novel awareness metrics.
 * These metrics provide deeper insight into the subject's internal and external perception.
 *
 * @param {CognitiveInput} cognitiveInput - The cognitive performance and signal clarity metrics.
 * @returns {AwarenessMetrics} An object containing calculated awareness scores.
 * @throws {Error} If input data is invalid.
 */
function getAwarenessMetrics(cognitiveInput) {
module.exports.getAwarenessMetrics = getAwarenessMetrics;

  // --- Input Validation ---
  if (!cognitiveInput) {
    throw new Error('cognitiveInput object must be provided.');
  }
  _validateNumber(cognitiveInput.feedbackLoopCoherence, 0, 1, 'cognitiveInput.feedbackLoopCoherence');
  _validateNumber(cognitiveInput.interoceptiveClarity, 0, 1, 'cognitiveInput.interoceptiveClarity');
  _validateNumber(cognitiveInput.sensoryThroughput, 0, Infinity, 'cognitiveInput.sensoryThroughput');

  // --- Metric Calculation ---
  // Metacognitive: Based on feedback loop coherence, penalized by high cognitive load.
  const metacognitive = (cognitiveInput.feedbackLoopCoherence * (1 - cognitiveInput.cognitiveLoad * 0.5)) * 100;

  // Somatic: Directly related to interoceptive clarity.
  const somatic = cognitiveInput.interoceptiveClarity * 100;

  // Environmental: A function of sensory throughput, normalized with a sigmoid curve to represent saturation.
  const environmental = _sigmoid((cognitiveInput.sensoryThroughput - 500) / 250) * 100;

  // Global Awareness Index: A weighted average, emphasizing metacognition.
  const globalAwarenessIndex = (metacognitive * 0.5) + (somatic * 0.25) + (environmental * 0.25);

  return {
    metacognitive: parseFloat(metacognitive.toFixed(2)),
    somatic: parseFloat(somatic.toFixed(2)),
    environmental: parseFloat(environmental.toFixed(2)),
    globalAwarenessIndex: parseFloat(globalAwarenessIndex.toFixed(2)),
  };
}

/**
 * Processes raw emotional data to generate a nuanced emotional profile.
 * This enhanced function identifies primary emotions, secondary blends, and contextual nuances.
 *
 * @param {EmotionalInput} emotionalInput - The raw valence, arousal, and context data.
 * @returns {EmotionalProfile} A detailed breakdown of the emotional state.
 * @throws {Error} If input data is invalid.
 */
function processEmotionalState(emotionalInput) {
module.exports.processEmotionalState = processEmotionalState;

  // --- Input Validation ---
  if (!emotionalInput) {
    throw new Error('emotionalInput object must be provided.');
  }
  _validateNumber(emotionalInput.valence, -1, 1, 'emotionalInput.valence');
  _validateNumber(emotionalInput.arousal, 0, 1, 'emotionalInput.arousal');
  if (!Array.isArray(emotionalInput.socialContext)) {
    throw new Error('Invalid socialContext: Must be an array of strings.');
  }

  // --- Emotion Identification ---
  let closestEmotion = null;
  let minDistance = Infinity;

  for (const emotion in EMOTION_MAP) {
    const def = EMOTION_MAP[emotion];
    const distance = Math.sqrt(
      Math.pow(def.valence - emotionalInput.valence, 2) +
      Math.pow(def.arousal - emotionalInput.arousal, 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestEmotion = emotion;
    }
  }

  // --- Emotional Blending ---
  const emotionalBlend = [];
  const blendThreshold = 0.5; // How close other emotions must be to be considered part of the blend.
  for (const emotion in EMOTION_MAP) {
    if (emotion === closestEmotion) continue;
    const def = EMOTION_MAP[emotion];
    const distance = Math.sqrt(
      Math.pow(def.valence - emotionalInput.valence, 2) +
      Math.pow(def.arousal - emotionalInput.arousal, 2)
    );
    if (distance < blendThreshold) {
      // Contribution is inversely proportional to distance.
      const contribution = parseFloat((1 - (distance / blendThreshold)).toFixed(2));
      emotionalBlend.push({ emotion, contribution });
    }
  }
  emotionalBlend.sort((a, b) => b.contribution - a.contribution);

  // --- Contextual Nuance ---
  let nuance = "Unspecified";
  const context = new Set(emotionalInput.socialContext);
  if (context.has('conflict') && (closestEmotion === 'Anger' || closestEmotion === 'Disgust')) {
    nuance = "Righteous Indignation";
  } else if (context.has('collaboration') && closestEmotion === 'Joy') {
    nuance = "Harmonious Synergy";
  } else if (context.has('solitude') && closestEmotion === 'Serenity') {
    nuance = "Peaceful Contemplation";
  } else if (context.has('loss') && closestEmotion === 'Sadness') {
    nuance = "Mourning";
  }

  return {
    primaryEmotion: closestEmotion,
    intensity: emotionalInput.arousal,
    emotionalBlend: emotionalBlend.slice(0, 2), // Return top 2 blends for clarity
    nuance,
  };
}
```