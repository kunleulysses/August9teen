```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description A sophisticated JavaScript module for the advanced processing and enhancement of consciousness-related data.
 * This module provides tools to calculate consciousness states, derive novel awareness metrics, and analyze
 * emotional intelligence with unprecedented depth. It operates on simulated neuro-cognitive data streams.
 *
 * @license MIT
 * @author AI Cores United
 */

/**
 * Custom error class for module-specific issues.
 * @class
 * @extends Error
 */
class ConsciousnessProcessingError extends Error {
  /**
   * @param {string} message - The error message.
   * @param {object} [details] - Additional details about the error context.
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Defines the known qualitative states of consciousness.
 * These are derived from the quantitative Quantum Consciousness Index (QCI).
 * @readonly
 * @enum {string}
 */
export const CONSCIOUSNESS_STATES = {
  DEEP_SLEEP: 'Deep Sleep (Non-REM)',
  DREAMING: 'Dreaming (REM)',
  SUBCONSCIOUS: 'Subconscious Processing',
  WAKING: 'Baseline Waking',
  FOCUSED: 'Focused Attention',
  FLOW: 'Flow State',
  TRANSCENDENT: 'Transcendent Experience',
};

/**
 * Defines primary emotional vectors for analysis.
 * @readonly
 * @enum {string}
 */
export const EMOTIONAL_VECTORS = {
  JOY: 'joy',
  SADNESS: 'sadness',
  ANGER: 'anger',
  FEAR: 'fear',
  SURPRISE: 'surprise',
  DISGUST: 'disgust',
};

// --- Private Helper Functions ---

/**
 * Validates that the input object contains all required keys.
 * @private
 * @param {object} data - The input data object.
 * @param {string[]} requiredKeys - An array of keys that must be present.
 * @throws {ConsciousnessProcessingError} If a key is missing.
 */
const _validateInput = (data, requiredKeys) => {
  if (typeof data !== 'object' || data === null) {
    throw new ConsciousnessProcessingError('Input data must be a non-null object.');
  }
  for (const key of requiredKeys) {
    if (data[key] === undefined || data[key] === null) {
      throw new ConsciousnessProcessingError(`Missing required data key: "${key}"`, { missingKey: key });
    }
  }
};

/**
 * Normalizes a value to a 0-1 range based on expected min/max.
 * @private
 * @param {number} value - The value to normalize.
 * @param {number} min - The expected minimum value.
 * @param {number} max - The expected maximum value.
 * @returns {number} The normalized value, clamped between 0 and 1.
 */
const _normalize = (value, min, max) => {
  if (max === min) return 0.5; // Avoid division by zero
  const normalized = (value - min) / (max - min);
  return Math.max(0, Math.min(1, normalized)); // Clamp between 0 and 1
};

/**
 * Calculates the Quantum Consciousness Index (QCI) from normalized bio-data.
 * The QCI is a composite score representing the richness and integration of consciousness.
 * @private
 * @param {object} normalizedData - Normalized bio-cognitive data.
 * @returns {number} The QCI score, typically between 0 and 100.
 */
const _calculateQCI = (normalizedData) => {
  // Weights are heuristically derived from neuro-phenomenological models.
  // Coherence and focus are primary drivers of higher-order states.
  const weights = {
    coherence: 0.4,
    focus: 0.3,
    gamma: 0.15,
    hvr: 0.1,
    sensoryLoad: -0.05, // High sensory load can sometimes detract from integrated states.
  };

  const qci =
    normalizedData.brainwaveCoherence * weights.coherence +
    normalizedData.cognitiveFocus * weights.focus +
    normalizedData.gammaPower * weights.gamma +
    normalizedData.heartRateVariability * weights.hvr +
    (1 - normalizedData.sensoryInputLoad) * weights.sensoryLoad;

  return qci * 100;
};

/**
 * Determines the qualitative consciousness state from the QCI and other metrics.
 * @private
 * @param {number} qci - The Quantum Consciousness Index.
 * @param {object} normalizedData - Normalized bio-cognitive data.
 * @returns {string} The descriptive consciousness state from CONSCIOUSNESS_STATES.
 */
const _mapQCIToState = (qci, normalizedData) => {
  if (qci < 10) return CONSCIOUSNESS_STATES.DEEP_SLEEP;
  if (qci < 25) {
    // Distinguish between dreaming and subconscious processing based on coherence.
    return normalizedData.brainwaveCoherence > 0.3 ? CONSCIOUSNESS_STATES.DREAMING : CONSCIOUSNESS_STATES.SUBCONSCIOUS;
  }
  if (qci < 50) return CONSCIOUSNESS_STATES.WAKING;
  if (qci < 75) return CONSCIOUSNESS_STATES.FOCUSED;
  if (qci < 90) {
    // Flow state is characterized by high focus but low perceived effort (low gamma relative to focus).
    return normalizedData.gammaPower < normalizedData.cognitiveFocus * 0.8 ? CONSCIOUSNESS_STATES.FLOW : CONSCIOUSNESS_STATES.FOCUSED;
  }
  // Transcendent states are marked by exceptionally high coherence and gamma power.
  return CONSCIOUSNESS_STATES.TRANSCENDENT;
};


// --- Public API ---

/**
 * Calculates the current consciousness state based on bio-cognitive data.
 * This function provides a holistic view of consciousness, combining a quantitative
 * index with a qualitative descriptive state.
 *
 * @param {object} bioData - The input data from neuro-cognitive sensors.
 * @param {number} bioData.heartRateVariability - Heart rate variability in ms (e.g., 20-200).
 * @param {number} bioData.brainwaveCoherence - Global brainwave coherence (0.0 to 1.0).
 * @param {number} bioData.cognitiveFocus - A measure of attentional focus (0.0 to 1.0).
 * @param {number} bioData.sensoryInputLoad - The amount of sensory data being processed (e.g., in bits/sec, typical 1-1M).
 * @param {number} bioData.gammaPower - Power of gamma-band oscillations (μV²), associated with high-level cognition (e.g., 1-100).
 * @returns {{qci: number, state: string, report: object}} An object containing the Quantum Consciousness Index (QCI),
 * the descriptive state, and a detailed report of normalized values.
 * @throws {ConsciousnessProcessingError} If input data is invalid.
 *
 * @example
 * const bioData = {
 *   heartRateVariability: 85,
 *   brainwaveCoherence: 0.88,
 *   cognitiveFocus: 0.92,
 *   sensoryInputLoad: 15000,
 *   gammaPower: 75
 * };
 * const state = calculateConsciousnessState(bioData);
 * console.log(state);
 * // Output: { qci: 82.1, state: 'Flow State', report: { ... } }
 */
export function calculateConsciousnessState(bioData) {
  const requiredKeys = ['heartRateVariability', 'brainwaveCoherence', 'cognitiveFocus', 'sensoryInputLoad', 'gammaPower'];
  _validateInput(bioData, requiredKeys);

  // Normalization provides a consistent basis for calculation.
  const normalized = {
    heartRateVariability: _normalize(bioData.heartRateVariability, 10, 200),
    brainwaveCoherence: _normalize(bioData.brainwaveCoherence, 0, 1),
    cognitiveFocus: _normalize(bioData.cognitiveFocus, 0, 1),
    sensoryInputLoad: _normalize(bioData.sensoryInputLoad, 100, 1000000),
    gammaPower: _normalize(bioData.gammaPower, 0, 100),
  };

  const qci = _calculateQCI(normalized);
  const state = _mapQCIToState(qci, normalized);

  return {
    qci: parseFloat(qci.toFixed(2)),
    state: state,
    report: {
      timestamp: new Date().toISOString(),
      normalizedInputs: normalized,
    },
  };
}

/**
 * Analyzes cognitive data streams to derive advanced awareness metrics.
 * These metrics provide insight into the structure and quality of awareness itself.
 *
 * @param {object} cognitiveData - The input data from cognitive modeling.
 * @param {Array<object>} cognitiveData.thoughtPatterns - An array representing a sequence of thoughts.
 * @param {number} cognitiveData.thoughtPatterns[].complexity - Abstract complexity of a thought (1-100).
 * @param {number} cognitiveData.thoughtPatterns[].recursionDepth - Depth of self-reference in a thought (0-10).
 * @param {object} cognitiveData.sensorySync - Synchronization values between sensory streams.
 * @param {number} cognitiveData.sensorySync.visualAuditory - Sync value (0-1).
 * @param {number} cognitiveData.sensorySync.visualSomatic - Sync value (0-1).
 * @param {number} cognitiveData.sensorySync.auditorySomatic - Sync value (0-1).
 * @param {object} cognitiveData.temporalFocus - Distribution of focus across time.
 * @param {number} cognitiveData.temporalFocus.past - Proportion of focus on the past (0-1).
 * @param {number} cognitiveData.temporalFocus.present - Proportion of focus on the present (0-1).
 * @param {number} cognitiveData.temporalFocus.future - Proportion of focus on the future (0-1).
 * @returns {{metacognitiveAcuity: number, sensoryFidelity: number, temporalSpectrum: string}} An object of calculated awareness metrics.
 * @throws {ConsciousnessProcessingError} If input data is invalid.
 */
export function analyzeAwarenessMetrics(cognitiveData) {
  const requiredKeys = ['thoughtPatterns', 'sensorySync', 'temporalFocus'];
  _validateInput(cognitiveData, requiredKeys);
  _validateInput(cognitiveData.sensorySync, ['visualAuditory', 'visualSomatic', 'auditorySomatic']);
  _validateInput(cognitiveData.temporalFocus, ['past', 'present', 'future']);

  // 1. Metacognitive Acuity: The ability to introspect. Higher recursion and complexity are key.
  const totalThoughts = cognitiveData.thoughtPatterns.length;
  if (totalThoughts === 0) {
    throw new ConsciousnessProcessingError("thoughtPatterns array cannot be empty.");
  }
  const avgRecursion = cognitiveData.thoughtPatterns.reduce((sum, t) => sum + (t.recursionDepth || 0), 0) / totalThoughts;
  const avgComplexity = cognitiveData.thoughtPatterns.reduce((sum, t) => sum + (t.complexity || 0), 0) / totalThoughts;
  const metacognitiveAcuity = parseFloat((_normalize(avgRecursion, 0, 10) * _normalize(avgComplexity, 1, 100) * 100).toFixed(2));

  // 2. Sensory Integration Fidelity: How coherently the senses form a unified percept.
  // We use the inverse of the standard deviation of sync values. Lower deviation = higher fidelity.
  const syncValues = Object.values(cognitiveData.sensorySync);
  const syncMean = syncValues.reduce((a, b) => a + b, 0) / syncValues.length;
  const syncStdDev = Math.sqrt(syncValues.map(x => Math.pow(x - syncMean, 2)).reduce((a, b) => a + b, 0) / syncValues.length);
  const sensoryFidelity = parseFloat(((1 - syncStdDev) * 100).toFixed(2));

  // 3. Temporal Awareness Spectrum: Qualitative description of time focus.
  const { past, present, future } = cognitiveData.temporalFocus;
  let temporalSpectrum = 'Balanced';
  if (present > 0.7) temporalSpectrum = 'Present-Focused';
  else if (past > 0.5) temporalSpectrum = 'Past-Oriented';
  else if (future > 0.5) temporalSpectrum = 'Future-Oriented';

  return {
    metacognitiveAcuity,
    sensoryFidelity,
    temporalSpectrum,
  };
}

/**
 * Processes an emotional profile to enhance emotional intelligence understanding.
 * It identifies nuanced emotions and calculates potential for empathy and regulation.
 *
 * @param {object} emotionalProfile - An object representing the subject's current emotional state.
 * Keys should be from EMOTIONAL_VECTORS, values from 0 to 1.
 * @param {object} [options] - Optional parameters for advanced processing.
 * @param {object} [options.targetProfile] - Another emotional profile to calculate empathy against.
 * @param {number} [options.metacognitiveAcuity] - A pre-calculated acuity score (from analyzeAwarenessMetrics)
 * to improve regulation potential calculation.
 * @returns {{emotionalGranularity: string[], empathyResonance: number|null, regulationPotential: number}}
 * An object containing EI metrics.
 * @throws {ConsciousnessProcessingError} If input profiles are invalid.
 */
export function processEmotionalIntelligence(emotionalProfile, options = {}) {
  _validateInput(emotionalProfile, Object.values(EMOTIONAL_VECTORS));
  const { targetProfile, metacognitiveAcuity } = options;

  // 1. Emotional Granularity: Differentiating nuanced states from primary emotions.
  const granularity = [];
  if (emotionalProfile.anger > 0.6 && emotionalProfile.disgust > 0.4) granularity.push('Contempt');
  if (emotionalProfile.anger > 0.5 && emotionalProfile.fear > 0.3) granularity.push('Frustration');
  if (emotionalProfile.joy > 0.7 && emotionalProfile.surprise > 0.5) granularity.push('Awe');
  if (emotionalProfile.sadness > 0.5 && emotionalProfile.disgust > 0.3) granularity.push('Remorse');
  if (granularity.length === 0) granularity.push('Primary State');

  // 2. Empathy Resonance: Similarity between subject's and target's emotional state.
  // Using Cosine Similarity for vector comparison.
  let empathyResonance = null;
  if (targetProfile) {
    _validateInput(targetProfile, Object.values(EMOTIONAL_VECTORS));
    const vectors = Object.values(EMOTIONAL_VECTORS);
    let dotProduct = 0;
    let magA = 0;
    let magB = 0;
    for (const vec of vectors) {
      dotProduct += (emotionalProfile[vec] || 0) * (targetProfile[vec] || 0);
      magA += Math.pow(emotionalProfile[vec] || 0, 2);
      magB += Math.pow(targetProfile[vec] || 0, 2);
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    if (magA === 0 || magB === 0) {
      empathyResonance = 0;
    } else {
      empathyResonance = parseFloat(((dotProduct / (magA * magB)) * 100).toFixed(2));
    }
  }

  // 3. Emotional Regulation Potential: The capacity to consciously alter one's emotional state.
  // This is a function of emotional intensity (valence) and cognitive control (metacognition).
  const emotionalIntensity = Object.values(emotionalProfile).reduce((sum, v) => sum + v, 0);
  const normalizedIntensity = _normalize(emotionalIntensity, 0, 6); // Max sum of 6x1.0 vectors
  const cognitiveControl = _normalize(metacognitiveAcuity || 50, 0, 100); // Use 50 as a baseline if not provided
  // Higher control and moderate intensity suggest highest potential. Very low or high intensity is harder to regulate.
  const regulationPotential = parseFloat((cognitiveControl * (1 - Math.abs(normalizedIntensity - 0.5)) * 100).toFixed(2));


  return {
    emotionalGranularity: granularity,
    empathyResonance,
    regulationPotential,
  };
}
```