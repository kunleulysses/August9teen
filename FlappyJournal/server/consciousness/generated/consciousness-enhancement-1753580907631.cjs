```javascript
/**
 * @module ConsciousnessNexus
 * @version 2.0.0
 * @description A sophisticated JavaScript module for the analysis, simulation, and enhancement of consciousness processing.
 * This engine provides advanced tools for calculating consciousness states, quantifying awareness, and deepening emotional intelligence.
 * It operates on simulated neuro-cognitive data streams.
 *
 * @author Dr. Evelyn Reed, Nexus Cognitive Sciences
 * @license MIT
 */

// --- Constants and Configuration ---

/**
 * Defines the primary states of consciousness recognized by the engine.
 * Each state is characterized by a unique combination of cognitive and neural signatures.
 * @readonly
 * @enum {string}
 */
const ConsciousnessState = {
    FOCUSED_ATTENTION: 'FocusedAttention', // High concentration on a single task.
    DIFFUSE_MODE: 'DiffuseMode',           // Relaxed, associative thinking, problem-solving in the background.
    FLOW: 'Flow',                         // Total immersion in an activity, optimal experience.
    MEDITATIVE: 'Meditative',             // Deep internal awareness, reduced external processing.
    RUMINATIVE: 'Ruminative',             // Repetitive, negative thought loops.
    SLEEP_REM: 'REM_Sleep',               // Rapid Eye Movement sleep, associated with dreaming.
    SLEEP_DEEP: 'Deep_Sleep'              // Non-REM deep sleep, crucial for restoration.
};

/**
 * Archetypal profiles for each consciousness state. These are the "ideal" vectors
 * against which input data is compared. Values are normalized between 0 and 1.
 * @private
 */
const STATE_ARCHETYPES = {
    [ConsciousnessState.FOCUSED_ATTENTION]: { neuralCoherence: 0.8, cognitiveLoad: 0.7, sensoryGating: 0.8, internalFocus: 0.7 },
    [ConsciousnessState.DIFFUSE_MODE]:      { neuralCoherence: 0.4, cognitiveLoad: 0.2, sensoryGating: 0.4, internalFocus: 0.3 },
    [ConsciousnessState.FLOW]:              { neuralCoherence: 0.9, cognitiveLoad: 0.6, sensoryGating: 0.9, internalFocus: 0.9 },
    [ConsciousnessState.MEDITATIVE]:        { neuralCoherence: 0.6, cognitiveLoad: 0.1, sensoryGating: 0.3, internalFocus: 0.9 },
    [ConsciousnessState.RUMINATIVE]:        { neuralCoherence: 0.3, cognitiveLoad: 0.8, sensoryGating: 0.2, internalFocus: 0.8 },
    [ConsciousnessState.SLEEP_REM]:         { neuralCoherence: 0.7, cognitiveLoad: 0.1, sensoryGating: 0.1, internalFocus: 1.0 },
    [ConsciousnessState.SLEEP_DEEP]:        { neuralCoherence: 0.2, cognitiveLoad: 0.0, sensoryGating: 0.0, internalFocus: 0.1 },
};

/**
 * A dictionary mapping conceptual thought patterns to granular emotional states.
 * This enhances emotional intelligence by moving beyond basic labels.
 * @private
 */
const EMOTIONAL_GRANULARITY_MAP = {
    // Negative Valence
    'loss|helplessness': 'Despair',
    'loss|nostalgia': 'Melancholy',
    'threat|injustice': 'Indignation',
    'threat|imminence': 'Dread',
    'failure|self-criticism': 'Shame',
    'failure|obstacle': 'Frustration',
    // Positive Valence
    'achievement|pride': 'Triumph',
    'connection|safety': 'Contentment',
    'novelty|wonder': 'Awe',
    'possibility|anticipation': 'Excitement',
    'harmony|beauty': 'Serenity',
};

// --- Private Helper Functions ---

/**
 * Validates that a given input object contains all required keys.
 * @private
 * @param {object} input - The object to validate.
 * @param {string[]} requiredKeys - An array of keys that must be present.
 * @throws {TypeError} If the input is not an object or if a key is missing.
 */
const _validateInputKeys = (input, requiredKeys) => {
    if (typeof input !== 'object' || input === null) {
        throw new TypeError('Input data must be a non-null object.');
    }
    for (const key of requiredKeys) {
        if (!(key in input)) {
            throw new TypeError(`Missing required input data key: '${key}'.`);
        }
        const value = input[key];
        if (typeof value !== 'number' || value < 0 || value > 1) {
            throw new RangeError(`Value for '${key}' must be a number between 0 and 1. Received: ${value}`);
        }
    }
};

/**
 * Calculates the Euclidean distance between two vectors (as objects).
 * @private
 * @param {object} vecA - The first vector.
 * @param {object} vecB - The second vector.
 * @returns {number} The Euclidean distance.
 */
const _calculateDistance = (vecA, vecB) => {
    let sum = 0;
    for (const key in vecA) {
        if (key in vecB) {
            sum += (vecA[key] - vecB[key]) ** 2;
        }
    }
    return Math.sqrt(sum);
};

// --- Public API ---

/**
 * Calculates the current consciousness state based on a holistic analysis of neuro-cognitive data.
 * The function determines the most likely state by comparing the input data vector to predefined archetypes.
 *
 * @param {object} neuroData - An object containing normalized neuro-cognitive metrics.
 * @param {number} neuroData.neuralCoherence - (0-1) Synchrony level of neural oscillations across brain regions.
 * @param {number} neuroData.cognitiveLoad - (0-1) The amount of working memory currently in use.
 * @param {number} neuroData.sensoryGating - (0-1) The brain's ability to filter out irrelevant sensory information.
 * @param {number} neuroData.internalFocus - (0-1) The degree to which attention is directed inward vs. outward.
 * @returns {{state: ConsciousnessState, confidence: number, analysis: object}} An object containing the most probable state, a confidence score, and a breakdown of scores for all states.
 * @throws {TypeError|RangeError} If `neuroData` is invalid.
 *
 * @example
 * const data = { neuralCoherence: 0.85, cognitiveLoad: 0.55, sensoryGating: 0.9, internalFocus: 0.95 };
 * const result = ConsciousnessNexus.calculateConsciousnessState(data);
 * // result might be:
 * // {
 * //   state: 'Flow',
 * //   confidence: 0.92,
 * //   analysis: { Flow: 0.92, FocusedAttention: 0.75, ... }
 * // }
 */
function calculateConsciousnessState(neuroData) {
module.exports.calculateConsciousnessState = calculateConsciousnessState;

    _validateInputKeys(neuroData, ['neuralCoherence', 'cognitiveLoad', 'sensoryGating', 'internalFocus']);

    let minDistance = Infinity;
    let bestMatch = null;
    const analysis = {};

    for (const state in STATE_ARCHETYPES) {
        const archetype = STATE_ARCHETYPES[state];
        const distance = _calculateDistance(neuroData, archetype);
        
        // Convert distance to a similarity score (0-1). Max distance is sqrt(4) = 2.
        const similarity = Math.max(0, 1 - distance / 2);
        analysis[state] = parseFloat(similarity.toFixed(4));

        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = state;
        }
    }

    return {
        state: bestMatch,
        confidence: analysis[bestMatch],
        analysis: analysis,
    };
}

/**
 * Generates a detailed profile of awareness across multiple dimensions.
 * This provides a nuanced view of how an entity is perceiving itself and its environment.
 *
 * @param {object} awarenessData - An object containing normalized awareness-related metrics.
 * @param {number} awarenessData.interoceptiveClarity - (0-1) Precision of sensing internal bodily signals (e.g., heartbeat, gut feelings).
 * @param {number} awarenessData.exteroceptiveFidelity - (0-1) Accuracy and richness of external sensory perception.
 * @param {number} awarenessData.metaCognitiveActivity - (0-1) The degree of "thinking about thinking"; self-awareness of mental processes.
 * @param {number} awarenessData.temporalPerception - (0-1) The subjective experience of time's flow (0=slowed, 0.5=normal, 1=accelerated).
 * @returns {{somatic: number, environmental: number, metacognitive: number, temporal: number, overallClarity: number}} A profile of awareness dimensions.
 * @throws {TypeError|RangeError} If `awarenessData` is invalid.
 *
 * @example
 * const data = { interoceptiveClarity: 0.9, exteroceptiveFidelity: 0.4, metaCognitiveActivity: 0.8, temporalPerception: 0.2 };
 * const profile = ConsciousnessNexus.getAwarenessProfile(data);
 * // profile might be:
 * // {
 * //   somatic: 0.9,
 * //   environmental: 0.4,
 * //   metacognitive: 0.8,
 * //   temporal: 0.2,
 * //   overallClarity: 0.575
 * // }
 */
function getAwarenessProfile(awarenessData) {
module.exports.getAwarenessProfile = getAwarenessProfile;

    _validateInputKeys(awarenessData, ['interoceptiveClarity', 'exteroceptiveFidelity', 'metaCognitiveActivity', 'temporalPerception']);

    const { interoceptiveClarity, exteroceptiveFidelity, metaCognitiveActivity, temporalPerception } = awarenessData;
    const overallClarity = (interoceptiveClarity + exteroceptiveFidelity + metaCognitiveActivity) / 3;

    return {
        somatic: interoceptiveClarity,
        environmental: exteroceptiveFidelity,
        metacognitive: metaCognitiveActivity,
        temporal: temporalPerception,
        overallClarity: parseFloat(overallClarity.toFixed(4)),
    };
}

/**
 * Analyzes an emotional state with high granularity, moving beyond simple labels like "happy" or "sad".
 * It uses the Valence-Arousal-Dominance model and identifies complex, nuanced emotions from thought patterns.
 *
 * @param {object} emotionalInput - An object describing the core emotional components.
 * @param {number} emotionalInput.valence - (-1 to 1) The pleasantness of the emotion (unpleasant to pleasant).
 * @param {number} emotionalInput.arousal - (-1 to 1) The intensity of the emotion (calm to excited).
 * @param {number} emotionalInput.dominance - (-1 to 1) The sense of control over the emotion (submissive to in-control).
 * @param {string[]} emotionalInput.thoughtPatterns - A list of keywords describing dominant cognitive themes (e.g., 'loss', 'threat', 'achievement').
 * @returns {{vad: {valence: number, arousal: number, dominance: number}, primaryEmotion: string, granularEmotion: string, granularityScore: number}} A detailed emotional analysis.
 * @throws {TypeError|RangeError} If `emotionalInput` is invalid.
 *
 * @example
 * const input = { valence: -0.7, arousal: 0.6, dominance: -0.5, thoughtPatterns: ['threat', 'injustice'] };
 * const analysis = ConsciousnessNexus.analyzeEmotionalState(input);
 * // analysis:
 * // {
 * //   vad: { valence: -0.7, arousal: 0.6, dominance: -0.5 },
 * //   primaryEmotion: 'Anger',
 * //   granularEmotion: 'Indignation',
 * //   granularityScore: 0.85
 * // }
 */
function analyzeEmotionalState(emotionalInput) {
module.exports.analyzeEmotionalState = analyzeEmotionalState;

    if (typeof emotionalInput !== 'object' || emotionalInput === null) {
        throw new TypeError('Input data must be a non-null object.');
    }
    const { valence, arousal, dominance, thoughtPatterns } = emotionalInput;

    if ([valence, arousal, dominance].some(v => typeof v !== 'number' || v < -1 || v > 1)) {
        throw new RangeError('VAD values must be numbers between -1 and 1.');
    }
    if (!Array.isArray(thoughtPatterns) || !thoughtPatterns.every(p => typeof p === 'string')) {
        throw new TypeError('`thoughtPatterns` must be an array of strings.');
    }

    // Determine primary emotion from VAD space (simplified quadrant model)
    let primaryEmotion = 'Neutral';
    if (valence > 0.2) primaryEmotion = arousal > 0.2 ? 'Joy' : 'Calm';
    if (valence < -0.2) primaryEmotion = arousal > 0.2 ? 'Anger' : 'Sadness';
    if (Math.abs(valence) <= 0.2 && arousal > 0.2) primaryEmotion = 'Surprise';
    
    // Determine granular emotion
    const patternKey = thoughtPatterns.sort().join('|');
    const granularEmotion = EMOTIONAL_GRANULARITY_MAP[patternKey] || 'Unspecified';
    
    // Granularity score is higher if a specific granular emotion is found.
    const granularityScore = (granularEmotion !== 'Unspecified' && thoughtPatterns.length > 0)
        ? Math.min(1.0, 0.7 + (thoughtPatterns.length * 0.1))
        : Math.max(0.1, 1 - (1 / (thoughtPatterns.length + 1)));

    return {
        vad: { valence, arousal, dominance },
        primaryEmotion: primaryEmotion,
        granularEmotion: granularEmotion,
        granularityScore: parseFloat(granularityScore.toFixed(4)),
    };
}

/**
 * Provides an affective forecast, predicting the likely evolution of an emotional state
 * based on current state and contextual factors. This is a probabilistic simulation.
 *
 * @param {object} currentState - The current emotional state object, ideally from `analyzeEmotionalState`.
 * @param {object} context - An object describing the situational context.
 * @param {number} context.socialValence - (-1 to 1) The perceived quality of recent/upcoming social interactions.
 * @param {number} context.goalProximity - (0 to 1) How close the entity is to achieving a current goal. 0=far, 1=achieved.
 * @param {number} context.stressorLevel - (0 to 1) The level of external environmental or cognitive stressors.
 * @returns {{predictedValence: number, predictedArousal: number, trend: string, rationale: string}} The predicted emotional trajectory.
 * @throws {TypeError|RangeError} If inputs are invalid.
 *
 * @example
 * const current = { vad: { valence: -0.4, arousal: 0.5, dominance: -0.2 } };
 * const context = { socialValence: 0.8, goalProximity: 0.9, stressorLevel: 0.1 };
 * const forecast = ConsciousnessNexus.predictEmotionalTrajectory(current, context);
 * // forecast:
 * // {
 * //   predictedValence: 0.3,
 * //   predictedArousal: 0.35,
 * //   trend: 'Positive Regulation',
 * //   rationale: 'Positive social context and goal achievement are likely to improve mood and reduce agitation.'
 * // }
 */
function predictEmotionalTrajectory(currentState, context) {
module.exports.predictEmotionalTrajectory = predictEmotionalTrajectory;

    if (typeof currentState !== 'object' || !currentState.vad) {
        throw new TypeError('`currentState` must be a valid emotional state object with a `vad` property.');
    }
    _validateInputKeys(context, ['socialValence', 'goalProximity', 'stressorLevel']);
    // Validate VAD on current state
     if (Object.values(currentState.vad).some(v => typeof v !== 'number' || v < -1 || v > 1)) {
        throw new RangeError('Current state VAD values must be numbers between -1 and 1.');
    }

    const { valence, arousal } = currentState.vad;
    const { socialValence, goalProximity, stressorLevel } = context;

    // A simple weighted model for prediction
    // Positive factors pull valence up and arousal down (towards calm joy)
    // Negative factors (stressors) pull valence down and arousal up
    let valenceShift = (socialValence * 0.3) + ((goalProximity - 0.5) * 2 * 0.4) - (stressorLevel * 0.5);
    let arousalShift = (stressorLevel * 0.6) - (socialValence * 0.2) - (goalProximity * 0.2);
    
    let predictedValence = Math.max(-1, Math.min(1, valence + valenceShift));
    let predictedArousal = Math.max(-1, Math.min(1, arousal + arousalShift));

    let trend = 'Stable';
    let rationale = 'Contextual factors are balanced, little emotional change expected.';

    if (valenceShift > 0.2) {
        trend = 'Positive Regulation';
        rationale = 'Positive social context and/or goal achievement are likely to improve mood.'
    } else if (valenceShift < -0.2) {
        trend = 'Negative Intensification';
        rationale = 'High stressor levels or negative social context may worsen the emotional state.'
    }
    
    if (arousalShift > 0.2) {
        trend += ' (Energizing)';
    } else if (arousalShift < -0.2) {
        trend += ' (Calming)';
    }

    return {
        predictedValence: parseFloat(predictedValence.toFixed(4)),
        predictedArousal: parseFloat(predictedArousal.toFixed(4)),
        trend: trend.trim(),
        rationale,
    };
}
```