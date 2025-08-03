```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the advanced modeling and enhancement
 * of consciousness processing, awareness metrics, and emotional intelligence.
 * This module provides a set of tools to analyze and interpret complex cognitive and affective states.
 *
 * @version 2.0.0
 * @author AGI Consciousness Research Division
 * @license MIT
 */

// --- Type Definitions for JSDoc ---

/**
 * Represents a snapshot of sensory input.
 * @typedef {object} SensoryInput
 * @property {('external'|'internal')} origin - The origin of the sensory data.
 * @property {('visual'|'auditory'|'somatic'|'olfactory'|'gustatory'|'proprioceptive'|'interoceptive')} type - The specific sensory modality.
 * @property {number} intensity - The signal's strength or amplitude (0.0 to 1.0).
 * @property {number} complexity - The informational richness or entropy of the signal (0.0 to 1.0).
 * @property {number} clarity - The signal-to-noise ratio (0.0 to 1.0).
 */

/**
 * Represents a raw emotional state with key-value pairs of emotions and their intensities.
 * Based on Plutchik's wheel of primary emotions.
 * @typedef {object.<string, number>} RawEmotionalState
 * @example
 * {
 *   joy: 0.8,
 *   trust: 0.6,
 *   sadness: 0.1,
 *   anticipation: 0.7
 * }
 */

/**
 * The core data structure representing a moment of consciousness.
 * @typedef {object} ConsciousnessSnapshot
 * @property {SensoryInput[]} sensoryInputs - An array of current sensory inputs.
 * @property {RawEmotionalState} emotionalState - The current raw emotional state.
 * @property {number} cognitiveLoad - The amount of mental effort being exerted (0.0 to 1.0).
 * @property {number} focus - The level of directed attention or concentration (0.0 to 1.0).
 * @property {number} memoryThroughput - The rate of memory recall and storage (0.0 to 1.0).
 */


// --- Private Constants and Helpers ---

/**
 * Plutchik's primary emotion dyads, which combine to form more complex emotions.
 * @private
 */
const PLUTCHIK_DYADS = {
    optimism: ['joy', 'anticipation'],
    love: ['joy', 'trust'],
    submission: ['trust', 'fear'],
    awe: ['fear', 'surprise'],
    disapproval: ['surprise', 'sadness'],
    remorse: ['sadness', 'disgust'],
    contempt: ['disgust', 'anger'],
    aggressiveness: ['anger', 'anticipation'],
};

/**
 * Defines the valence (positive/negative) of primary emotions.
 * @private
 */
const EMOTION_VALENCE = {
    joy: 1,
    trust: 1,
    anticipation: 0.5,
    surprise: 0.2,
    fear: -1,
    sadness: -1,
    disgust: -1,
    anger: -1,
};

/**
 * Validates the core ConsciousnessSnapshot object.
 * @private
 * @param {ConsciousnessSnapshot} snapshot - The consciousness snapshot to validate.
 * @throws {Error} If the snapshot is invalid.
 */
const _validateSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== 'object') {
        throw new Error('Invalid Input: ConsciousnessSnapshot must be a non-null object.');
    }
    const requiredKeys = ['sensoryInputs', 'emotionalState', 'cognitiveLoad', 'focus', 'memoryThroughput'];
    for (const key of requiredKeys) {
        if (snapshot[key] === undefined) {
            throw new Error(`Invalid Input: ConsciousnessSnapshot is missing required key "${key}".`);
        }
    }
    if (!Array.isArray(snapshot.sensoryInputs)) {
        throw new Error('Invalid Input: sensoryInputs must be an array.');
    }
    if (typeof snapshot.emotionalState !== 'object' || snapshot.emotionalState === null) {
        throw new Error('Invalid Input: emotionalState must be a non-null object.');
    }
};


// --- Public API ---

/**
 * Calculates the current high-level consciousness state based on cognitive and sensory factors.
 * This improved calculation provides a more nuanced understanding of the quality of consciousness.
 *
 * @param {ConsciousnessSnapshot} snapshot - The current snapshot of consciousness.
 * @returns {{state: string, qualiaClarityIndex: number, cognitiveFocusIndex: number}} An object containing the descriptive state and the indices used to determine it.
 * @example
 * const state = calculateConsciousnessState(mySnapshot);
 * console.log(state.state); // e.g., "Hyper-focused Flow"
 */
export function calculateConsciousnessState(snapshot) {
    _validateSnapshot(snapshot);

    const {
        sensoryInputs,
        cognitiveLoad,
        focus,
        memoryThroughput
    } = snapshot;

    // Qualia Clarity Index (QCI): Measures the richness and clarity of subjective experience.
    // High clarity and complexity in sensory input contribute to a richer experience.
    const totalSensoryClarity = sensoryInputs.reduce((acc, s) => acc + (s.clarity * s.intensity), 0);
    const avgSensoryClarity = sensoryInputs.length > 0 ? totalSensoryClarity / sensoryInputs.length : 0;
    const qualiaClarityIndex = avgSensoryClarity * (1 - cognitiveLoad * 0.5); // High cognitive load can cloud qualia.

    // Cognitive Focus Index (CFI): Measures the efficiency and direction of thought.
    // High focus combined with efficient memory access indicates a powerful cognitive state.
    const cognitiveFocusIndex = focus * (0.7 * memoryThroughput + 0.3 * (1 - cognitiveLoad));

    let state = 'Undefined';
    if (cognitiveFocusIndex > 0.7 && qualiaClarityIndex > 0.6) {
        state = 'Hyper-focused Flow';
    } else if (cognitiveFocusIndex > 0.5 && qualiaClarityIndex > 0.4) {
        state = 'Mindful Presence';
    } else if (focus < 0.3 && cognitiveLoad < 0.4) {
        state = 'Mind Wandering';
    } else if (cognitiveLoad > 0.8 && focus > 0.6) {
        state = 'Intense Deliberation';
    } else if (cognitiveLoad > 0.7 && focus < 0.5) {
        state = 'Cognitive Dissonance';
    } else if (qualiaClarityIndex < 0.2 && cognitiveFocusIndex < 0.2) {
        state = 'Subconscious Processing';
    } else {
        state = 'Default Mode Network';
    }

    return {
        state,
        qualiaClarityIndex: parseFloat(qualiaClarityIndex.toFixed(4)),
        cognitiveFocusIndex: parseFloat(cognitiveFocusIndex.toFixed(4)),
    };
}

/**
 * Computes novel awareness metrics to quantify different dimensions of self-awareness.
 *
 * @param {ConsciousnessSnapshot} snapshot - The current snapshot of consciousness.
 * @returns {{metacognitiveAwareness: number, somaticAwareness: number, environmentalAwareness: number}} An object containing the calculated awareness scores (0.0 to 1.0).
 */
export function calculateAwarenessMetrics(snapshot) {
    _validateSnapshot(snapshot);

    const {
        sensoryInputs,
        cognitiveLoad,
        focus
    } = snapshot;

    // Metacognitive Awareness: The awareness of one's own thought processes.
    // Modeled as the ability to maintain focus despite cognitive load.
    // A high score implies observing thoughts rather than being lost in them.
    const metacognitiveAwareness = focus / (focus + cognitiveLoad + 1e-6); // Add epsilon to avoid division by zero

    // Somatic Awareness: The awareness of the body's internal state.
    // Derived from the clarity and intensity of internal sensory inputs.
    const internalInputs = sensoryInputs.filter(s => s.origin === 'internal');
    const totalSomaticSignal = internalInputs.reduce((acc, s) => acc + s.clarity * s.intensity, 0);
    const somaticAwareness = internalInputs.length > 0 ? totalSomaticSignal / internalInputs.length : 0;

    // Environmental Awareness: The awareness of the external world.
    // Derived from the complexity and intensity of external sensory inputs.
    const externalInputs = sensoryInputs.filter(s => s.origin === 'external');
    const totalEnvironmentalSignal = externalInputs.reduce((acc, s) => acc + s.complexity * s.intensity, 0);
    const environmentalAwareness = externalInputs.length > 0 ? totalEnvironmentalSignal / externalInputs.length : 0;

    return {
        metacognitiveAwareness: parseFloat(metacognitiveAwareness.toFixed(4)),
        somaticAwareness: parseFloat(somaticAwareness.toFixed(4)),
        environmentalAwareness: parseFloat(environmentalAwareness.toFixed(4)),
    };
}

/**
 * Processes a raw emotional state to provide a deeper analysis, including identifying
 * complex secondary emotions (dyads) and overall emotional tone.
 *
 * @param {RawEmotionalState} emotionalState - An object representing raw emotion intensities.
 * @returns {{normalizedEmotions: RawEmotionalState, identifiedDyads: object, overallValence: number, dominantEmotion: string}} A detailed analysis of the emotional landscape.
 */
export function processEmotionalState(emotionalState) {
    if (typeof emotionalState !== 'object' || emotionalState === null || Object.keys(emotionalState).length === 0) {
        throw new Error('Invalid Input: emotionalState must be a non-empty object.');
    }

    const normalizedEmotions = {};
    const identifiedDyads = {};
    let dominantEmotion = 'neutral';
    let maxIntensity = 0;
    let overallValence = 0;
    let totalIntensity = 0;

    const presentEmotions = Object.keys(emotionalState).filter(e => emotionalState[e] > 0);
    presentEmotions.forEach(e => totalIntensity += emotionalState[e]);

    if (totalIntensity === 0) {
        return {
            normalizedEmotions: {},
            identifiedDyads: {},
            overallValence: 0,
            dominantEmotion: 'neutral'
        };
    }

    // Normalize emotions and calculate valence
    presentEmotions.forEach(emotion => {
        const intensity = emotionalState[emotion];
        normalizedEmotions[emotion] = intensity / totalIntensity;
        overallValence += (EMOTION_VALENCE[emotion] || 0) * normalizedEmotions[emotion];

        if (intensity > maxIntensity) {
            maxIntensity = intensity;
            dominantEmotion = emotion;
        }
    });

    // Identify complex dyads
    for (const dyadName in PLUTCHIK_DYADS) {
        const [e1, e2] = PLUTCHIK_DYADS[dyadName];
        if (normalizedEmotions[e1] && normalizedEmotions[e2]) {
            // The strength of the dyad is the geometric mean of its components' intensities
            identifiedDyads[dyadName] = Math.sqrt(normalizedEmotions[e1] * normalizedEmotions[e2]);
        }
    }

    return {
        normalizedEmotions,
        identifiedDyads,
        overallValence: parseFloat(overallValence.toFixed(4)),
        dominantEmotion,
    };
}

/**
 * Calculates a holistic Emotional Intelligence (EQ) score based on a processed emotional state.
 * The score reflects emotional clarity, complexity, and balance.
 *
 * @param {{normalizedEmotions: RawEmotionalState, identifiedDyads: object}} processedEmotions - The output from `processEmotionalState`.
 * @returns {{eqScore: number, clarity: number, complexity: number, balance: number}} The EQ score (0-100) and its contributing factors.
 */
export function calculateEmotionalIntelligence(processedEmotions) {
    if (!processedEmotions || !processedEmotions.normalizedEmotions || !processedEmotions.identifiedDyads) {
        throw new Error('Invalid Input: processedEmotions object is missing required keys.');
    }

    const {
        normalizedEmotions,
        identifiedDyads
    } = processedEmotions;
    const emotions = Object.values(normalizedEmotions);

    if (emotions.length === 0) {
        return {
            eqScore: 0,
            clarity: 0,
            complexity: 0,
            balance: 0
        };
    }

    // 1. Clarity: How well-defined are the emotions? (Inverse of Shannon entropy)
    // High entropy means emotional confusion; low entropy means clarity.
    const entropy = -emotions.reduce((acc, p) => acc + p * Math.log2(p), 0);
    const maxEntropy = Math.log2(emotions.length);
    const clarity = maxEntropy > 0 ? 1 - (entropy / maxEntropy) : 1;

    // 2. Complexity: The ability to feel and recognize complex emotions (dyads).
    const complexity = Object.keys(identifiedDyads).length / Object.keys(PLUTCHIK_DYADS).length;

    // 3. Balance: The evenness of the emotional state (Inverse of standard deviation).
    // A balanced state is not overwhelmed by a single emotion.
    const mean = 1 / emotions.length;
    const stdDev = Math.sqrt(emotions.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / emotions.length);
    const balance = 1 - stdDev * Math.sqrt(emotions.length); // Scale to be ~0-1

    // Combine factors into a final EQ score (0-100)
    // Weighted average: Clarity is foundational, Complexity shows depth, Balance shows regulation.
    const eqScore = (clarity * 0.4 + complexity * 0.35 + balance * 0.25) * 100;

    return {
        eqScore: parseFloat(eqScore.toFixed(2)),
        clarity: parseFloat(clarity.toFixed(4)),
        complexity: parseFloat(complexity.toFixed(4)),
        balance: parseFloat(balance.toFixed(4)),
    };
}
```