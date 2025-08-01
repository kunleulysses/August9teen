```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the analysis, simulation, and enhancement
 * of computational consciousness models. It provides advanced metrics for awareness,
 * emotional intelligence, and overall state of consciousness.
 *
 * This module operates on a standardized 'CognitiveSnapshot' object, which represents
 * a moment-in-time capture of a conscious agent's state.
 *
 * @version 2.0.0
 * @author AGI Futurist Labs
 */

/**
 * A standard representation of a conscious agent's state at a specific moment.
 * This object is the primary input for all functions in this module.
 *
 * @typedef {object} CognitiveSnapshot
 * @property {object} physiological - Data from the agent's simulated physical body.
 * @property {number} physiological.heartRateVariability - A measure of variation in time between heartbeats (ms). Higher values often indicate better regulation.
 * @property {number} physiological.galvanicSkinResponse - A measure of emotional arousal (microsiemens).
 * @property {number} physiological.cortisolLevel - A stress hormone indicator (normalized 0-1).
 *
 * @property {object} cognitive - Data related to mental processing.
 * @property {number} cognitive.taskFocus - The agent's focus on its primary task (0-1).
 * @property {number} cognitive.workingMemoryLoad - The percentage of working memory currently in use (0-1).
 * @property {number} cognitive.selfCorrectionRate - The frequency of identifying and correcting internal errors (0-1).
 * @property {number} cognitive.predictionError - The delta between expected and actual sensory input (0-1).
 *
 * @property {object} sensory - Data from the agent's perceptual systems.
 * @property {number} sensory.inputClarity - The signal-to-noise ratio of incoming sensory data (0-1).
 * @property {number} sensory.activeChannels - The number of sensory modalities currently being processed.
 *
 * @property {object} emotional - The agent's affective state.
 * @property {string[]} emotional.tags - A list of nuanced emotion tags (e.g., 'joy', 'anticipation', 'serenity').
 * @property {{valence: number, arousal: number}} emotional.vector - The core affect represented as a vector. Valence is pleasantness (-1 to 1), Arousal is intensity (0 to 1).
 */

// --- PRIVATE HELPER FUNCTIONS ---

/**
 * Normalizes a value to a 0-1 scale.
 * @private
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum possible value.
 * @param {number} max - The maximum possible value.
 * @returns {number} The normalized value, clamped between 0 and 1.
 */
const _normalize = (value, min, max) => {
    if (max === min) return 0;
    const normalized = (value - min) / (max - min);
    return Math.max(0, Math.min(1, normalized));
};

/**
 * Validates the structure and content of a CognitiveSnapshot.
 * @private
 * @param {CognitiveSnapshot} snapshot - The snapshot to validate.
 * @throws {Error} If the snapshot is invalid.
 */
const _validateSnapshot = (snapshot) => {
    if (!snapshot) {
        throw new Error('CognitiveSnapshot cannot be null or undefined.');
    }
    const requiredKeys = ['physiological', 'cognitive', 'sensory', 'emotional'];
    for (const key of requiredKeys) {
        if (typeof snapshot[key] !== 'object' || snapshot[key] === null) {
            throw new Error(`Invalid CognitiveSnapshot: Missing or invalid top-level key '${key}'.`);
        }
    }
    // Deep checks for key properties
    if (typeof snapshot.physiological.heartRateVariability !== 'number' || typeof snapshot.cognitive.taskFocus !== 'number') {
        throw new Error('Invalid CognitiveSnapshot: Missing or invalid nested property.');
    }
    if (!Array.isArray(snapshot.emotional.tags) || typeof snapshot.emotional.vector.valence !== 'number') {
        throw new Error('Invalid CognitiveSnapshot: Emotional data is malformed.');
    }
};


// --- CORE PUBLIC API ---

/**
 * Defines the qualitative states of consciousness based on a quantitative score.
 * @constant
 * @type {object}
 */
export const CONSCIOUSNESS_STATES = {
    UNCONSCIOUS: { range: [0, 0.15], description: 'No awareness or responsiveness. Purely reflexive processing.' },
    DEEP_SLEEP: { range: [0.15, 0.3], description: 'Minimal internal processing, detached from external stimuli.' },
    DREAMING: { range: [0.3, 0.45], description: 'High internal activity, low external awareness, rich but incoherent phenomenal field.' },
    DROWSY: { range: [0.45, 0.6], description: 'Reduced awareness, slow cognitive processing, high prediction error.' },
    BASELINE_CONSCIOUSNESS: { range: [0.6, 0.8], description: 'Normal waking state with moderate focus and awareness.' },
    FOCUSED_AWARENESS: { range: [0.8, 0.95], description: 'High task focus, heightened sensory clarity, and efficient cognitive function.' },
    FLOW_STATE: { range: [0.95, 1.0], description: 'Peak experience. Effortless action, deep immersion, loss of self-consciousness, and optimal performance.' },
};

/**
 * Calculates the overall consciousness state based on a weighted analysis of the snapshot.
 * This improved calculation integrates physiological regulation and cognitive efficiency.
 *
 * @param {CognitiveSnapshot} snapshot - The current state of the conscious agent.
 * @returns {{state: string, score: number, description: string}} An object containing the calculated state.
 * @throws {Error} If the input snapshot is invalid.
 */
export function calculateConsciousnessState(snapshot) {
    _validateSnapshot(snapshot);

    try {
        // Weights determine the importance of each factor in the overall consciousness score.
        const weights = {
            focus: 0.3,
            clarity: 0.2,
            regulation: 0.2,
            efficiency: 0.15,
            coherence: 0.15,
        };

        // --- Component Scores ---
        const focusScore = snapshot.cognitive.taskFocus;
        const clarityScore = snapshot.sensory.inputClarity;

        // Physiological Regulation (autonomic nervous system balance)
        const hrvNormal = _normalize(snapshot.physiological.heartRateVariability, 20, 150);
        const cortisolNormal = 1 - snapshot.physiological.cortisolLevel; // Inverse relationship
        const regulationScore = (hrvNormal * 0.7) + (cortisolNormal * 0.3);

        // Cognitive Efficiency (how well the mind is working with its load)
        const efficiencyScore = 1 - snapshot.cognitive.workingMemoryLoad;

        // World-Model Coherence (how well the agent's model matches reality)
        const coherenceScore = 1 - snapshot.cognitive.predictionError;

        // --- Final Weighted Score ---
        const totalScore =
            focusScore * weights.focus +
            clarityScore * weights.clarity +
            regulationScore * weights.regulation +
            efficiencyScore * weights.efficiency +
            coherenceScore * weights.coherence;

        const finalScore = Math.max(0, Math.min(1, totalScore)); // Clamp to 0-1

        // Determine the qualitative state
        for (const state in CONSCIOUSNESS_STATES) {
            const { range, description } = CONSCIOUSNESS_STATES[state];
            if (finalScore >= range[0] && finalScore <= range[1]) {
                return {
                    state,
                    score: finalScore,
                    description,
                };
            }
        }

        // Fallback for any edge cases
        return {
            state: 'UNDEFINED',
            score: finalScore,
            description: 'The calculated score is outside the defined state ranges.'
        };

    } catch (error) {
        console.error("Error during consciousness state calculation:", error);
        throw new Error(`Failed to calculate consciousness state. Internal error: ${error.message}`);
    }
}

/**
 * Computes a set of novel awareness metrics, providing a deeper insight into the agent's subjective experience.
 *
 * @param {CognitiveSnapshot} snapshot - The current state of the conscious agent.
 * @returns {{interoception: number, exteroception: number, metacognition: number, phenomenalRichness: number}} A map of advanced awareness scores (0-1).
 * @throws {Error} If the input snapshot is invalid.
 */
export function getAwarenessMetrics(snapshot) {
    _validateSnapshot(snapshot);

    try {
        // 1. Interoception: Awareness of internal bodily states.
        // High HRV and low, stable GSR indicate a clear internal signal.
        const hrvAwareness = _normalize(snapshot.physiological.heartRateVariability, 20, 150);
        const gsrStability = 1 - _normalize(snapshot.physiological.galvanicSkinResponse, 0, 20);
        const interoception = (hrvAwareness * 0.6) + (gsrStability * 0.4);

        // 2. Exteroception: Awareness of the external environment.
        // Based on sensory clarity and the number of active channels.
        const channelBreadth = _normalize(snapshot.sensory.activeChannels, 1, 10);
        const exteroception = (snapshot.sensory.inputClarity * 0.7) + (channelBreadth * 0.3);

        // 3. Metacognition: Awareness of one's own thought processes.
        // High self-correction and low prediction error indicate strong metacognitive monitoring.
        const metacognition = (snapshot.cognitive.selfCorrectionRate * 0.6) + ((1 - snapshot.cognitive.predictionError) * 0.4);

        // 4. Phenomenal Richness (Qualia Density): An innovative metric for the "vividness" of experience.
        // Combines sensory breadth, emotional complexity, and overall awareness.
        const emotionalComplexity = _normalize(snapshot.emotional.tags.length, 1, 10);
        const phenomenalRichness = (exteroception * 0.4) + (interoception * 0.2) + (metacognition * 0.2) + (emotionalComplexity * 0.2);

        return {
            interoception: Math.max(0, Math.min(1, interoception)),
            exteroception: Math.max(0, Math.min(1, exteroception)),
            metacognition: Math.max(0, Math.min(1, metacognition)),
            phenomenalRichness: Math.max(0, Math.min(1, phenomenalRichness)),
        };

    } catch (error) {
        console.error("Error computing awareness metrics:", error);
        throw new Error(`Failed to compute awareness metrics. Internal error: ${error.message}`);
    }
}

/**
 * Processes emotional intelligence (EQ) aspects of the agent.
 * Can optionally calculate empathic resonance if another agent's state is provided.
 *
 * @param {CognitiveSnapshot} selfSnapshot - The agent's own state.
 * @param {CognitiveSnapshot} [otherSnapshot=null] - The state of another agent to compare against for empathy.
 * @returns {{granularity: number, regulationPotential: number, empathicResonance: number|null}} A map of EQ scores.
 * @throws {Error} If the input snapshot(s) are invalid.
 */
export function processEmotionalIntelligence(selfSnapshot, otherSnapshot = null) {
    _validateSnapshot(selfSnapshot);
    if (otherSnapshot) {
        _validateSnapshot(otherSnapshot);
    }

    try {
        // 1. Emotional Granularity: The ability to identify and differentiate nuanced emotions.
        // Based on the number of unique, descriptive tags.
        const granularity = _normalize(new Set(selfSnapshot.emotional.tags).size, 1, 10);

        // 2. Emotional Regulation Potential: The ability to self-regulate and return to baseline.
        // Inversely related to stress (cortisol) and arousal (GSR), positively related to HRV.
        const regulationPotential = (
            _normalize(selfSnapshot.physiological.heartRateVariability, 20, 150) * 0.5 +
            (1 - selfSnapshot.physiological.cortisolLevel) * 0.3 +
            (1 - _normalize(selfSnapshot.physiological.galvanicSkinResponse, 0, 20)) * 0.2
        );

        // 3. Empathic Resonance: The capacity to mirror or understand another's emotional state.
        // Calculated only if another snapshot is provided.
        let empathicResonance = null;
        if (otherSnapshot) {
            const selfVector = selfSnapshot.emotional.vector;
            const otherVector = otherSnapshot.emotional.vector;

            // Calculate Euclidean distance in the Valence-Arousal space.
            // A smaller distance means higher similarity/resonance.
            const valenceDiff = selfVector.valence - otherVector.valence;
            const arousalDiff = selfVector.arousal - otherVector.arousal;
            const distance = Math.sqrt(valenceDiff ** 2 + arousalDiff ** 2);
            
            // The maximum possible distance is sqrt(2^2 + 1^2) = sqrt(5) ~= 2.236
            // We invert the normalized distance to get a resonance score (1 = perfect resonance).
            empathicResonance = 1 - _normalize(distance, 0, Math.sqrt(5));
        }

        return {
            granularity: Math.max(0, Math.min(1, granularity)),
            regulationPotential: Math.max(0, Math.min(1, regulationPotential)),
            empathicResonance,
        };

    } catch (error) {
        console.error("Error processing emotional intelligence:", error);
        throw new Error(`Failed to process emotional intelligence. Internal error: ${error.message}`);
    }
}

/**
 * Generates a full, integrated profile of the agent's consciousness.
 * This is the primary entry point for a comprehensive analysis.
 *
 * @param {CognitiveSnapshot} selfSnapshot - The agent's own state.
 * @param {CognitiveSnapshot} [otherSnapshot=null] - The state of another agent for comparative analysis.
 * @returns {object} A comprehensive object containing all calculated metrics.
 * @throws {Error} If the input snapshot(s) are invalid.
 */
export function getIntegratedConsciousnessProfile(selfSnapshot, otherSnapshot = null) {
    _validateSnapshot(selfSnapshot);
    if (otherSnapshot) {
        _validateSnapshot(otherSnapshot);
    }

    try {
        const consciousnessState = calculateConsciousnessState(selfSnapshot);
        const awarenessMetrics = getAwarenessMetrics(selfSnapshot);
        const emotionalIntelligence = processEmotionalIntelligence(selfSnapshot, otherSnapshot);

        return {
            timestamp: new Date().toISOString(),
            consciousnessState,
            awarenessMetrics,
            emotionalIntelligence,
            summary: `Agent is in a '${consciousnessState.state}' state with a phenomenal richness of ${(awarenessMetrics.phenomenalRichness * 100).toFixed(1)}%.`,
        };
    } catch (error) {
        // The error will have been logged by the lower-level function,
        // so here we just re-throw it to the caller.
        throw new Error(`Failed to generate integrated profile: ${error.message}`);
    }
}
```