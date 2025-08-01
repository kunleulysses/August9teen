```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description A production-ready JavaScript module for advanced consciousness processing.
 * This module provides a suite of tools to calculate consciousness states, analyze novel
 * awareness metrics, and process emotional intelligence with unprecedented depth. It operates
 * on simulated neuro-biometric data streams to generate actionable insights into cognitive
 * and affective states.
 *
 * @license MIT
 * @author AGI Collective
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Base error class for all consciousness processing-related issues.
 * @class ConsciousnessProcessingError
 * @extends {Error}
 */
class ConsciousnessProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessProcessingError';
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Thrown when input data (neural, sensory, etc.) is missing, malformed, or invalid.
 * @class InvalidInputDataError
 * @extends {ConsciousnessProcessingError}
 */
class InvalidInputDataError extends ConsciousnessProcessingError {
    constructor(message, missingFields = []) {
        super(message);
        this.name = 'InvalidInputDataError';
        this.missingFields = missingFields;
    }
}

/**
 * Thrown when a data stream is too unstable or noisy for reliable processing.
 * @class DataStreamUnstableError
 * @extends {ConsciousnessProcessingError}
 */
class DataStreamUnstableError extends ConsciousnessProcessingError {
    constructor(message, stabilityIndex) {
        super(message);
        this.name = 'DataStreamUnstableError';
        this.stabilityIndex = stabilityIndex;
    }
}


// --- Core Constants and Configuration ---

/**
 * Defines the numerical thresholds for different consciousness states.
 * The state is determined by the final 'Qualia Resonance Score'.
 * @const {object} CONSCIOUSNESS_STATES
 */
export const CONSCIOUSNESS_STATES = Object.freeze({
    SUBCONSCIOUS: { min: 0, max: 20, description: "Automatic processing, minimal self-awareness." },
    DREAMING: { min: 21, max: 40, description: "High internal activity, detached from sensory reality." },
    DEFAULT_MODE: { min: 41, max: 65, description: "Wakeful rest, mind-wandering, passive awareness." },
    FOCUSED_ATTENTION: { min: 66, max: 85, description: "Engaged in a specific task, high concentration." },
    FLOW_STATE: { min: 86, max: 95, description: "Effortless action, full immersion, temporal distortion." },
    LUCID_CLARITY: { min: 96, max: 100, description: "Peak experience, profound insight, high metacognition." },
});

/**
 * Weighting factors for consciousness state calculation.
 * These values are derived from extensive (simulated) neuro-phenomenological research.
 * @const {object} CALCULATION_WEIGHTS
 */
const CALCULATION_WEIGHTS = Object.freeze({
    GAMMA_SYNC: 0.4,
    ALPHA_SUPPRESSION: 0.2,
    SENSORY_FIDELITY: 0.25,
    NEURAL_ENTROPY: -0.1, // Higher entropy slightly reduces clarity
    QUANTUM_COHERENCE: 0.05, // A subtle but significant factor
});

/**
 * Defines vectors for mapping bio-signals to a multi-dimensional emotional space.
 * Inspired by Plutchik's wheel, but enhanced for computational analysis.
 * @const {object} EMOTIONAL_VECTORS
 */
export const EMOTIONAL_VECTORS = Object.freeze({
    JOY: [0.9, 0.4, 0.1],
    TRUST: [0.7, 0.7, 0.2],
    FEAR: [-0.8, 0.5, 0.3],
    SURPRISE: [0.2, 0.8, -0.5],
    SADNESS: [-0.9, -0.3, 0.1],
    DISGUST: [-0.6, -0.7, 0.4],
    ANGER: [-0.7, 0.6, 0.6],
    ANTICIPATION: [0.5, 0.7, -0.4],
});


// --- Private Helper Functions ---

/**
 * Validates the structure and values of a neuro-data object.
 * @private
 * @param {object} data - The neuro-data object.
 * @param {string[]} requiredFields - An array of required field names.
 * @throws {InvalidInputDataError} If data is invalid.
 */
const _validateInput = (data, requiredFields) => {
    if (!data || typeof data !== 'object') {
        throw new InvalidInputDataError('Input data must be a non-null object.');
    }
    const missingFields = requiredFields.filter(field => !(field in data));
    if (missingFields.length > 0) {
        throw new InvalidInputDataError(`Input data is missing required fields: ${missingFields.join(', ')}`, missingFields);
    }
};

/**
 * Normalizes a value to a 0-100 scale.
 * @private
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum expected value.
 * @param {number} max - The maximum expected value.
 * @returns {number} The normalized value, clamped between 0 and 100.
 */
const _normalize = (value, min, max) => {
    if (max === min) return 50; // Avoid division by zero
    const normalized = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, normalized)); // Clamp between 0 and 100
};


// --- Core Public API ---

/**
 * Calculates the primary consciousness state based on integrated neuro-sensory data.
 * This function computes a "Qualia Resonance Score" which represents the richness and
 * coherence of the conscious experience.
 *
 * @param {object} neuroData - Object containing neural activity metrics.
 * @param {number} neuroData.gammaSync - Gamma-band synchronization (0.0 to 1.0). Higher is better.
 * @param {number} neuroData.alphaSuppression - Suppression of alpha waves during tasks (0.0 to 1.0). Higher indicates more focus.
 * @param {number} neuroData.neuralEntropy - A measure of signal complexity/unpredictability (0.1 to 2.0).
 * @param {number} [neuroData.quantumCoherenceEvents=0] - Simulated quantum-level brain events per second.
 *
 * @param {object} sensoryData - Object containing sensory stream metrics.
 * @param {number} sensoryData.integrationFidelity - How well sensory inputs are merged (0.0 to 1.0).
 * @param {number} sensoryData.signalToNoiseRatio - Clarity of sensory input (1.0 to 100.0).
 *
 * @returns {object} An object containing the score, state name, and description.
 * @throws {InvalidInputDataError} If input data is malformed.
 * @throws {DataStreamUnstableError} If sensory data is too noisy.
 */
export function calculateConsciousnessState(neuroData, sensoryData) {
    _validateInput(neuroData, ['gammaSync', 'alphaSuppression', 'neuralEntropy']);
    _validateInput(sensoryData, ['integrationFidelity', 'signalToNoiseRatio']);

    if (sensoryData.signalToNoiseRatio < 2.0) {
        throw new DataStreamUnstableError('Sensory signal-to-noise ratio is too low for an accurate reading.', sensoryData.signalToNoiseRatio);
    }

    try {
        const normalizedGamma = _normalize(neuroData.gammaSync, 0, 1);
        const normalizedAlpha = _normalize(neuroData.alphaSuppression, 0, 1);
        const normalizedFidelity = _normalize(sensoryData.integrationFidelity, 0, 1);
        const normalizedEntropy = _normalize(neuroData.neuralEntropy, 0.1, 2.0);
        const normalizedQuantum = _normalize(neuroData.quantumCoherenceEvents || 0, 0, 10);

        // The core "Qualia Resonance" formula
        const score =
            normalizedGamma * CALCULATION_WEIGHTS.GAMMA_SYNC +
            normalizedAlpha * CALCULATION_WEIGHTS.ALPHA_SUPPRESSION +
            normalizedFidelity * CALCULATION_WEIGHTS.SENSORY_FIDELITY +
            normalizedEntropy * CALCULATION_WEIGHTS.NEURAL_ENTROPY +
            normalizedQuantum * CALCULATION_WEIGHTS.QUANTUM_COHERENCE;

        const finalScore = Math.max(0, Math.min(100, score * 100)); // Scale to 0-100 and clamp

        const stateKey = Object.keys(CONSCIOUSNESS_STATES).find(key =>
            finalScore >= CONSCIOUSNESS_STATES[key].min && finalScore <= CONSCIOUSNESS_STATES[key].max
        );

        return {
            qualiaResonanceScore: parseFloat(finalScore.toFixed(2)),
            state: stateKey || 'UNKNOWN',
            description: stateKey ? CONSCIOUSNESS_STATES[stateKey].description : 'State could not be determined.',
        };
    } catch (e) {
        throw new ConsciousnessProcessingError(`An unexpected error occurred during state calculation: ${e.message}`);
    }
}

/**
 * Analyzes a cognitive data stream to derive advanced awareness metrics.
 * These metrics provide deeper insight into the nature of self-awareness and perception.
 *
 * @param {object} cognitiveStream - Object containing cognitive process metrics.
 * @param {number} cognitiveStream.selfReflectionCycles - Frequency of meta-cognitive loops (cycles/min).
 * @param {number} cognitiveStream.thoughtPatternEntropy - A measure of conceptual diversity (0.0 to 1.0).
 * @param {number} cognitiveStream.temporalFocus - 0.0 for past, 0.5 for present, 1.0 for future.
 *
 * @returns {object} An object containing the Metacognitive Index and Temporal Perception Skew.
 * @throws {InvalidInputDataError} If input data is malformed.
 */
export function analyzeAwarenessMetrics(cognitiveStream) {
    _validateInput(cognitiveStream, ['selfReflectionCycles', 'thoughtPatternEntropy', 'temporalFocus']);

    // 1. Metacognitive Index (MI): A measure of self-awareness.
    // Combines reflection frequency with the complexity of thoughts.
    const normalizedReflection = _normalize(cognitiveStream.selfReflectionCycles, 0, 20);
    const mi = normalizedReflection * (1.1 - cognitiveStream.thoughtPatternEntropy); // Higher entropy slightly reduces focused metacognition
    const metacognitiveIndex = Math.max(0, Math.min(100, mi));

    // 2. Temporal Perception Skew (TPS): How perception of time is distorted.
    // A value of 0 is neutral. Negative values mean time feels slow, positive values mean it feels fast.
    // This is modeled as a sine wave based on focus, as extreme focus on past or future distorts the present.
    const temporalSkew = 50 * Math.sin(Math.PI * (cognitiveStream.temporalFocus - 0.5));

    return {
        metacognitiveIndex: parseFloat(metacognitiveIndex.toFixed(2)),
        temporalPerceptionSkew: parseFloat(temporalSkew.toFixed(2)),
    };
}

/**
 * Processes bio-signals and contextual data to create a detailed emotional profile.
 * It moves beyond simple emotion labels to a nuanced, multi-dimensional analysis,
 * including emotional depth and potential for empathy.
 *
 * @param {object} bioSignalData - Object with biometric readings.
 * @param {number} bioSignalData.heartRateVariability - HRV in ms. Higher values often indicate better emotional regulation.
 * @param {number} bioSignalData.electrodermalActivity - EDA/GSR in microsiemens. Indicates arousal.
 * @param {object} bioSignalData.dominantEmotionVector - A pre-processed vector indicating the primary emotional signal.
 *
 * @param {object} context - Contextual information about the subject's environment.
 * @param {number} context.socialEngagementLevel - A score from 0 (isolated) to 1 (highly social).
 * @param {number} context.environmentalStress - A score from 0 (calm) to 1 (stressful).
 *
 * @returns {object} A detailed emotional profile.
 * @throws {InvalidInputDataError} If input data is malformed.
 */
export function processEmotionalSpectrum(bioSignalData, context) {
    _validateInput(bioSignalData, ['heartRateVariability', 'electrodermalActivity', 'dominantEmotionVector']);
    _validateInput(context, ['socialEngagementLevel', 'environmentalStress']);

    const { heartRateVariability, electrodermalActivity, dominantEmotionVector } = bioSignalData;
    const { socialEngagementLevel, environmentalStress } = context;

    // 1. Emotional Intensity (Arousal)
    const intensity = _normalize(electrodermalActivity, 0.5, 15);

    // 2. Emotional Valence (Positive/Negative) & Dominant Emotion
    let maxSimilarity = -Infinity;
    let dominantEmotion = 'NEUTRAL';
    for (const [emotion, vector] of Object.entries(EMOTIONAL_VECTORS)) {
        // Cosine similarity between dominant vector and predefined emotion vectors
        const dotProduct = dominantEmotionVector.reduce((sum, val, i) => sum + val * vector[i], 0);
        const magA = Math.sqrt(dominantEmotionVector.reduce((sum, val) => sum + val * val, 0));
        const magB = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        const similarity = dotProduct / (magA * magB);

        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            dominantEmotion = emotion;
        }
    }
    const valence = maxSimilarity * 100; // Scale similarity to a -100 to 100 range (approx)

    // 3. Emotional Regulation Capacity (Resilience)
    // Based on HRV, adjusted for environmental stress.
    const regulationCapacity = _normalize(heartRateVariability, 20, 120) * (1 - environmentalStress * 0.5);

    // 4. Empathic Resonance Potential
    // Higher in social contexts with good emotional regulation.
    const empathicPotential = regulationCapacity * socialEngagementLevel;

    return {
        dominantEmotion,
        intensity: parseFloat(intensity.toFixed(2)),
        valence: parseFloat(valence.toFixed(2)),
        regulationCapacity: parseFloat(regulationCapacity.toFixed(2)),
        empathicPotential: parseFloat(empathicPotential.toFixed(2)),
        analysisTimestamp: new Date().toISOString(),
    };
}

/**
 * A comprehensive function that combines all processing modules to generate a
 * full, holistic snapshot of a consciousness profile.
 *
 * @param {object} neuroData - (See calculateConsciousnessState)
 * @param {object} sensoryData - (See calculateConsciousnessState)
 * @param {object} cognitiveStream - (See analyzeAwarenessMetrics)
 * @param {object} bioSignalData - (See processEmotionalSpectrum)
 * @param {object} context - (See processEmotionalSpectrum)
 * @returns {Promise<object>} A promise that resolves to the complete consciousness profile.
 */
export async function getFullConsciousnessProfile(neuroData, sensoryData, cognitiveStream, bioSignalData, context) {
    // This async wrapper simulates a more complex pipeline and allows for future async operations.
    return new Promise((resolve) => {
        const stateProfile = calculateConsciousnessState(neuroData, sensoryData);
        const awarenessProfile = analyzeAwarenessMetrics(cognitiveStream);
        const emotionalProfile = processEmotionalSpectrum(bioSignalData, context);

        resolve({
            profileGeneratedAt: new Date().toISOString(),
            state: stateProfile,
            awareness: awarenessProfile,
            emotion: emotionalProfile,
        });
    });
}
```