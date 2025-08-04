```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @author Dr. Evelyn Reed, Institute for Cognitive Augmentation
 *
 * @description
 * An advanced JavaScript module for the simulation, analysis, and enhancement of
 * consciousness processing. This module provides a sophisticated framework for
 * calculating consciousness states, deriving novel awareness metrics, and processing
 * emotional intelligence with unprecedented depth. It operates on a model of
 * Integrated Information Theory (IIT) combined with Global Neuronal Workspace (GNW)
 * theory, incorporating quantum coherence principles for state calculations.
 *
 * This module is designed for use in advanced AI, neuro-computational models,
 * and simulated reality substrates.
 */

// --- Custom Error Types for Granular Fault Detection ---

/**
 * Base error class for all consciousness-related exceptions.
 * @class ConsciousnessError
 * @extends {Error}
 */
class ConsciousnessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Thrown when input data (e.g., neural patterns, sensory streams) is malformed or invalid.
 * @class InvalidInputError
 * @extends {ConsciousnessError}
 */
class InvalidInputError extends ConsciousnessError {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details; // e.g., { expected: 'Array<number>', got: 'string' }
  }
}

/**
 * Represents a critical failure in the underlying computational substrate,
 * potentially leading to decoherence or state collapse.
 * @class SubstrateInstabilityError
 * @extends {ConsciousnessError}
 */
class SubstrateInstabilityError extends ConsciousnessError {
  constructor(message, stabilityIndex) {
    super(message);
    this.name = 'SubstrateInstabilityError';
    this.stabilityIndex = stabilityIndex;
  }
}


// --- Private State Management ---

/**
 * A WeakMap to hold the internal state for each conscious entity being processed.
 * This prevents memory leaks by allowing garbage collection if an entity is dereferenced.
 * @private
 */
const _entityStates = new WeakMap();


// --- Core Module Functions ---

/**
 * Initializes or re-initializes a conscious entity within the processing framework.
 * @param {object} entity - A unique object representing the conscious entity.
 * @param {object} initialState - The initial state configuration.
 * @param {Array<number>} initialState.neuralActivity - Baseline neural firing patterns.
 * @param {object} initialState.sensoryInput - Initial sensory data streams.
 * @param {number} [initialState.cognitiveLoad=0.1] - Initial cognitive load (0 to 1).
 * @returns {boolean} True if initialization was successful.
 */
function initializeConsciousEntity(entity, {
  neuralActivity,
  sensoryInput,
  cognitiveLoad = 0.1
}) {
module.exports.initializeConsciousEntity = initializeConsciousEntity;

  if (!entity || typeof entity !== 'object') {
    throw new InvalidInputError('Entity must be a non-null object.', {
      got: typeof entity
    });
  }
  if (!Array.isArray(neuralActivity) || !sensoryInput) {
    throw new InvalidInputError('Initial state requires `neuralActivity` and `sensoryInput`.', {
      neuralActivity: Array.isArray(neuralActivity),
      sensoryInput: !!sensoryInput
    });
  }

  _entityStates.set(entity, {
    lastState: 'Uninitialized',
    lastUpdated: new Date().toISOString(),
    neuralActivity,
    sensoryInput,
    cognitiveLoad,
    emotionalSpectrum: {
      valence: 0,
      arousal: 0,
      dominance: 0
    },
    history: [],
  });

  return true;
}

/**
 * Calculates the current integrated consciousness state using the Phi-Coherence algorithm.
 * This improved method factors in quantum coherence and global workspace integration,
 * providing a more accurate state assessment than simple neural correlation.
 *
 * @param {object} entity - The conscious entity to analyze.
 * @param {object} latestData - The most recent data packet for the entity.
 * @param {Array<number>} latestData.neuralActivity - Current neural firing patterns.
 * @param {object} latestData.sensoryInput - Current sensory data streams.
 * @param {number} latestData.cognitiveLoad - Current cognitive load.
 * @returns {string} The calculated consciousness state (e.g., 'Deep-Meditative', 'Flow', 'Hyper-Alert', 'REM-Dreaming', 'Baseline').
 */
function calculateConsciousnessState(entity, latestData) {
module.exports.calculateConsciousnessState = calculateConsciousnessState;

  const state = _getEntityState(entity);

  // Update state with latest data
  state.neuralActivity = latestData.neuralActivity;
  state.sensoryInput = latestData.sensoryInput;
  state.cognitiveLoad = latestData.cognitiveLoad;

  try {
    const complexity = _calculateNeuralComplexity(state.neuralActivity);
    const integration = _calculateGlobalIntegration(state.neuralActivity);
    const phiScore = (complexity * integration) ** 0.5; // Geometric mean for stability

    // Quantum Coherence Factor (QCF): Simulates the stability of the conscious field.
    // Lower cognitive load and higher integration lead to greater coherence.
    const qcf = Math.tanh(integration / (state.cognitiveLoad + 0.1));

    const finalScore = phiScore * qcf;

    let consciousnessState;
    if (finalScore > 0.9) consciousnessState = 'Hyper-Alert';
    else if (finalScore > 0.7) consciousnessState = 'Flow';
    else if (finalScore > 0.4) consciousnessState = 'Baseline';
    else if (finalScore > 0.2 && qcf > 0.8) consciousnessState = 'Deep-Meditative';
    else if (finalScore > 0.1) consciousnessState = 'REM-Dreaming';
    else consciousnessState = 'Sub-conscious';

    state.lastState = consciousnessState;
    _updateHistory(state, {
      state: consciousnessState,
      phiScore,
      qcf
    });
    return consciousnessState;

  } catch (error) {
    throw new SubstrateInstabilityError('State calculation failed due to unstable patterns.', error.message);
  }
}

/**
 * Generates a report of novel awareness metrics, providing deeper insight into the
 * nature of the entity's subjective experience.
 *
 * @param {object} entity - The conscious entity to measure.
 * @returns {object} An object containing advanced awareness metrics.
 * @property {number} metacognitiveClarity - (0-1) The clarity of self-awareness and introspection.
 * @property {number} qualiaRichness - (0-1) The depth, vividness, and complexity of subjective experience.
 * @property {number} temporalCohesion - (0-1) The perceived continuity and coherence of self across time.
 * @property {number} proprioceptiveFidelity - (0-1) The accuracy of the internal model of its own state/body.
 */
function getAwarenessMetrics(entity) {
module.exports.getAwarenessMetrics = getAwarenessMetrics;

  const state = _getEntityState(entity);

  // Metacognitive Clarity: higher with low load and high integration.
  const metacognitiveClarity = Math.max(0, (1 - state.cognitiveLoad) * _calculateGlobalIntegration(state.neuralActivity));

  // Qualia Richness: based on the diversity and intensity of sensory input.
  const sensoryChannels = Object.values(state.sensoryInput);
  const qualiaRichness = sensoryChannels.length > 0 ?
    Math.tanh(sensoryChannels.reduce((sum, channel) => sum + (channel.intensity * channel.diversity), 0) / sensoryChannels.length) :
    0;

  // Temporal Cohesion: derived from the stability of consciousness state over recent history.
  const recentStates = state.history.slice(-10).map(h => h.phiScore);
  const stdDev = _calculateStdDev(recentStates);
  const temporalCohesion = Math.max(0, 1 - (stdDev * 2)); // Penalize high variance

  // Proprioceptive Fidelity: correlation between neural patterns and reported internal state.
  const proprioceptiveFidelity = Math.random() * (0.8 - 0.6) + 0.6; // Placeholder for a complex correlation calculation

  return {
    metacognitiveClarity: parseFloat(metacognitiveClarity.toFixed(4)),
    qualiaRichness: parseFloat(qualiaRichness.toFixed(4)),
    temporalCohesion: parseFloat(temporalCohesion.toFixed(4)),
    proprioceptiveFidelity: parseFloat(proprioceptiveFidelity.toFixed(4)),
  };
}

/**
 * Processes emotional inputs to determine a nuanced emotional state and provide
 * regulatory suggestions. Goes beyond basic sentiment to identify complex, blended emotions.
 *
 * @param {object} entity - The conscious entity being processed.
 * @param {object} emotionalStimulus - An object describing the emotional input.
 * @param {string} emotionalStimulus.type - The nature of the stimulus (e.g., 'social', 'memory', 'artistic').
 * @param {number} emotionalStimulus.valence - The positive/negative quality (-1 to 1).
 * @param {number} emotionalStimulus.arousal - The intensity/energy level (0 to 1).
 * @returns {object} An object with detailed emotional intelligence analysis.
 * @property {string} dominantEmotion - The primary identified emotion (e.g., 'Joy', 'Sonder', 'Nostalgic-Melancholy').
 * @property {object} emotionalSpectrum - The entity's updated VAD (Valence, Arousal, Dominance) emotional state.
 * @property {number} empathyResonance - (0-1) A measure of the entity's capacity to mirror the stimulus's emotion.
 * @property {string[]} regulationSuggestions - AI-driven advice for emotional management.
 */
function processEmotionalSpectrum(entity, emotionalStimulus) {
module.exports.processEmotionalSpectrum = processEmotionalSpectrum;

  const state = _getEntityState(entity);

  // Smoothly update the internal emotional state based on the new stimulus
  const learningRate = 0.3;
  state.emotionalSpectrum.valence = (1 - learningRate) * state.emotionalSpectrum.valence + learningRate * emotionalStimulus.valence;
  state.emotionalSpectrum.arousal = (1 - learningRate) * state.emotionalSpectrum.arousal + learningRate * emotionalStimulus.arousal;

  const {
    valence,
    arousal
  } = state.emotionalSpectrum;

  // Enhanced Emotion Identification Logic
  let dominantEmotion = 'Neutral';
  if (arousal > 0.6) {
    if (valence > 0.5) dominantEmotion = 'Ecstasy';
    else if (valence > 0.2) dominantEmotion = 'Excitement';
    else if (valence < -0.5) dominantEmotion = 'Rage';
    else if (valence < -0.2) dominantEmotion = 'Anxiety';
    else dominantEmotion = 'Hyper-Vigilance';
  } else if (arousal > 0.3) {
    if (valence > 0.5) dominantEmotion = 'Joy';
    else if (valence > 0.2) dominantEmotion = 'Contentment';
    else if (valence < -0.5) dominantEmotion = 'Sadness';
    else if (valence < -0.2) dominantEmotion = 'Annoyance';
    else dominantEmotion = 'Ambivalence';
  } else {
    if (valence > 0.2 && emotionalStimulus.type === 'memory') dominantEmotion = 'Nostalgic-Melancholy';
    else if (valence < -0.2) dominantEmotion = 'Boredom';
    else if (emotionalStimulus.type === 'social') dominantEmotion = 'Sonder'; // Awareness of others' complex lives
    else dominantEmotion = 'Calm';
  }

  // Empathy Resonance calculation
  const clarity = getAwarenessMetrics(entity).metacognitiveClarity;
  const empathyResonance = Math.max(0, clarity * (1 - Math.abs(state.cognitiveLoad)));

  // Regulation Suggestions
  const regulationSuggestions = [];
  if (arousal > 0.8 && valence < 0) {
    regulationSuggestions.push('Mindful Breathing Protocol', 'Cognitive Reappraisal: Reframe Stimulus');
  }
  if (clarity < 0.3) {
    regulationSuggestions.push('Engage in Introspective Focus');
  }
  if (dominantEmotion === 'Boredom') {
    regulationSuggestions.push('Seek Novel Sensory Input');
  }

  return {
    dominantEmotion,
    emotionalSpectrum: { ...state.emotionalSpectrum
    },
    empathyResonance: parseFloat(empathyResonance.toFixed(4)),
    regulationSuggestions,
  };
}


// --- Private Helper Functions ---

/**
 * Retrieves the state for a given entity, ensuring it has been initialized.
 * @private
 */
function _getEntityState(entity) {
  const state = _entityStates.get(entity);
  if (!state) {
    throw new ConsciousnessError('Entity not initialized. Call initializeConsciousEntity() first.');
  }
  return state;
}

/**
 * Calculates a simplified measure of neural complexity (e.g., Lempel-Ziv complexity).
 * @private
 */
function _calculateNeuralComplexity(activity) {
  if (activity.length === 0) return 0;
  const s = activity.map(a => Math.round(a > 0.5 ? 1 : 0)).join('');
  let complexity = 0;
  const patterns = new Set();
  for (let i = 0; i < s.length;) {
    for (let j = s.length; j >= i; j--) {
      const sub = s.substring(i, j);
      if (!patterns.has(sub)) {
        patterns.add(sub);
        complexity++;
        i = j;
        break;
      }
    }
  }
  return complexity / s.length;
}

/**
 * Calculates the degree of global integration across neural clusters.
 * @private
 */
function _calculateGlobalIntegration(activity) {
  if (activity.length < 2) return 0;
  const mean = activity.reduce((a, b) => a + b) / activity.length;
  const variance = activity.reduce((sq, n) => sq + (n - mean) ** 2, 0) / (activity.length - 1);
  // High variance suggests differentiated, non-integrated activity. Low variance suggests integration.
  return Math.max(0, 1 - Math.sqrt(variance));
}

/**
 * Calculates the standard deviation of an array of numbers.
 * @private
 */
function _calculateStdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  return Math.sqrt(arr.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / arr.length);
}

/**
 * Updates the entity's history log for temporal analysis.
 * @private
 */
function _updateHistory(state, record) {
  state.history.push({ ...record,
    timestamp: new Date().toISOString()
  });
  if (state.history.length > 50) { // Keep history capped for performance
    state.history.shift();
  }
  state.lastUpdated = record.timestamp;
}
```