```javascript
/**
 * @module ConsciousnessEnhancement
 * @version 2.0.0
 * @description A JavaScript module for advanced modeling and enhancement of consciousness processing.
 * This module provides a sophisticated framework for calculating consciousness states,
 * analyzing awareness metrics, and processing emotional intelligence with greater depth and nuance.
 * It operates on a standardized 'CognitiveSnapshot' data structure.
 *
 * NOTE: This is a conceptual and theoretical model for simulation purposes.
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Custom error class for issues related to cognitive data processing.
 * @extends Error
 */
class CognitiveProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CognitiveProcessingError';
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Custom error for invalid or incomplete CognitiveSnapshot objects.
 * @extends CognitiveProcessingError
 */
class InvalidSnapshotError extends CognitiveProcessingError {
    constructor(message, missingPaths = []) {
        super(message);
        this.name = 'InvalidSnapshotError';
        this.missingPaths = missingPaths;
    }
}


// --- Core Data Structure Definition ---

/**
 * Represents a moment-in-time snapshot of a cognitive entity's state.
 * All processing functions in this module operate on this data structure.
 * @typedef {object} CognitiveSnapshot
 * @property {string} entityId - A unique identifier for the cognitive entity.
 * @property {number} timestamp - The UNIX timestamp (in ms) when the snapshot was taken.
 * @property {object} sensoryInput - Data from sensory modalities.
 * @property {number} sensoryInput.visualClarity - Normalized value (0-1) of visual field clarity.
 * @property {number} sensoryInput.auditoryFidelity - Normalized value (0-1) of soundscape clarity and signal-to-noise ratio.
 * @property {number} sensoryInput.somaticCoherence - Normalized value (0-1) representing the clarity of bodily sensations.
 * @property {object} internalState - The internal cognitive and emotional landscape.
 * @property {string[]} internalState.activeThoughts - An array of current high-level thought strings.
 * @property {object} internalState.emotionalState - Emotional state represented by the Valence-Arousal-Dominance model.
 * @property {number} internalState.emotionalState.valence - The pleasure/displeasure dimension (-1 to 1).
 * @property {number} internalState.emotionalState.arousal - The activation/deactivation dimension (0 to 1).
 * @property {number} internalState.emotionalState.dominance - The control/submissiveness dimension (-1 to 1).
 * @property {object} memoryInterface - Interaction with memory systems.
 * @property {number} memoryInterface.shortTermRecallAccuracy - Normalized accuracy (0-1) of recent memory recall.
 * @property {number} memoryInterface.longTermAssociativeStrength - Normalized strength (0-1) of connections to long-term memory.
 */


// --- Constants and Configuration ---

const EMOTION_MAP = {
    // Valence, Arousal ranges for primary emotions (simplified model)
    JOY: { v: [0.5, 1.0], a: [0.5, 1.0] },
    TRUST: { v: [0.3, 0.8], a: [0.2, 0.6] },
    FEAR: { v: [-1.0, -0.4], a: [0.6, 1.0] },
    SURPRISE: { v: [-0.2, 0.6], a: [0.7, 1.0] },
    SADNESS: { v: [-0.8, -0.3], a: [0.1, 0.4] },
    DISGUST: { v: [-0.7, -0.2], a: [0.3, 0.7] },
    ANGER: { v: [-0.8, -0.3], a: [0.6, 1.0] },
    ANTICIPATION: { v: [0.1, 0.6], a: [0.5, 0.8] },
    NEUTRAL: { v: [-0.1, 0.1], a: [0.0, 0.2] }
};

const WEIGHTS = {
    // Weights for calculating the Qualia Vector components
    FOCUS: {
        auditory: 0.4,
        visual: 0.4,
        somatic: 0.2,
        thoughtPenalty: 0.15 // Penalty per active thought, encouraging focus
    },
    CLARITY: {
        recall: 0.5,
        sensoryAvg: 0.5
    },
    INTEGRATION: {
        associativeStrength: 0.6,
        coherence: 0.4 // Coherence is calculated in awareness metrics
    }
};


// --- Helper Functions ---

/**
 * Validates the structure of a CognitiveSnapshot.
 * @param {CognitiveSnapshot} snapshot - The snapshot to validate.
 * @throws {InvalidSnapshotError} If the snapshot is invalid.
 * @private
 */
const _validateSnapshot = (snapshot) => {
    const requiredPaths = [
        'entityId', 'timestamp', 'sensoryInput.visualClarity', 'sensoryInput.auditoryFidelity',
        'sensoryInput.somaticCoherence', 'internalState.activeThoughts', 'internalState.emotionalState.valence',
        'internalState.emotionalState.arousal', 'internalState.emotionalState.dominance',
        'memoryInterface.shortTermRecallAccuracy', 'memoryInterface.longTermAssociativeStrength'
    ];

    const missingPaths = requiredPaths.filter(path => {
        const keys = path.split('.');
        let current = snapshot;
        for (const key of keys) {
            if (current === null || typeof current !== 'object' || !(key in current)) {
                return true;
            }
            current = current[key];
        }
        return false;
    });

    if (missingPaths.length > 0) {
        throw new InvalidSnapshotError(
            `CognitiveSnapshot is incomplete or malformed.`,
            missingPaths
        );
    }
};

/**
 * Normalizes a value to a 0-1 range.
 * @param {number} value The value to normalize.
 * @param {number} min The minimum of the range.
 * @param {number} max The maximum of the range.
 * @returns {number} The normalized value, clamped between 0 and 1.
 * @private
 */
const _normalize = (value, min, max) => Math.max(0, Math.min(1, (value - min) / (max - min)));


// --- Core Processing Functions ---

/**
 * Improves consciousness state calculations by creating a multi-dimensional "Qualia Vector".
 * This provides a richer representation than a single consciousness score.
 *
 * @param {CognitiveSnapshot} snapshot - The cognitive state to analyze.
 * @param {object} awarenessMetrics - The pre-calculated awareness metrics for this snapshot.
 * @returns {{focus: number, clarity: number, integration: number}} A Qualia Vector representing the core of the conscious state.
 * @throws {CognitiveProcessingError} If calculation fails.
 */
function calculateConsciousnessState(snapshot, awarenessMetrics) {
module.exports.calculateConsciousnessState = calculateConsciousnessState;

    try {
        _validateSnapshot(snapshot);
        if (!awarenessMetrics || typeof awarenessMetrics.situationalCoherence !== 'number') {
            throw new CognitiveProcessingError('Valid awarenessMetrics object must be provided.');
        }

        const { sensoryInput, internalState, memoryInterface } = snapshot;

        // 1. Calculate Focus: The ability to direct attention.
        // Higher sensory fidelity and fewer distracting thoughts lead to higher focus.
        const focusFromSenses = (sensoryInput.visualClarity * WEIGHTS.FOCUS.visual) +
                                (sensoryInput.auditoryFidelity * WEIGHTS.FOCUS.auditory) +
                                (sensoryInput.somaticCoherence * WEIGHTS.FOCUS.somatic);
        const thoughtDistraction = internalState.activeThoughts.length * WEIGHTS.FOCUS.thoughtPenalty;
        const focus = Math.max(0, focusFromSenses - thoughtDistraction);

        // 2. Calculate Clarity: The sharpness and intelligibility of conscious content.
        const sensoryAverage = (sensoryInput.visualClarity + sensoryInput.auditoryFidelity + sensoryInput.somaticCoherence) / 3;
        const clarity = (memoryInterface.shortTermRecallAccuracy * WEIGHTS.CLARITY.recall) +
                        (sensoryAverage * WEIGHTS.CLARITY.sensoryAvg);

        // 3. Calculate Integration: The seamless binding of different cognitive processes.
        const integration = (memoryInterface.longTermAssociativeStrength * WEIGHTS.INTEGRATION.associativeStrength) +
                            (awarenessMetrics.situationalCoherence * WEIGHTS.INTEGRATION.integration);

        return {
            focus: _normalize(focus, 0, 1),
            clarity: _normalize(clarity, 0, 1),
            integration: _normalize(integration, 0, 1),
        };

    } catch (error) {
        if (error instanceof InvalidSnapshotError) throw error;
        throw new CognitiveProcessingError(`Failed to calculate consciousness state for entity ${snapshot.entityId}: ${error.message}`);
    }
}

/**
 * Adds new, innovative awareness metrics to quantify the depth of understanding.
 *
 * @param {CognitiveSnapshot} snapshot - The cognitive state to analyze.
 * @returns {{situationalCoherence: number, selfReferentialDepth: number, temporalIntegration: number}} An object with advanced awareness metrics.
 */
function analyzeAwareness(snapshot) {
module.exports.analyzeAwareness = analyzeAwareness;

    try {
        _validateSnapshot(snapshot);
        const { sensoryInput, internalState, memoryInterface } = snapshot;

        // 1. Situational Coherence: How well the internal model aligns with sensory reality.
        // High recall and sensory fidelity suggest a coherent model.
        const sensoryAverage = (sensoryInput.visualClarity + sensoryInput.auditoryFidelity) / 2;
        const situationalCoherence = (memoryInterface.shortTermRecallAccuracy * 0.6) + (sensoryAverage * 0.4);

        // 2. Self-Referential Depth: A measure of introspection.
        // Calculated by finding thoughts that refer to "I", "me", "my", or "thinking".
        const selfReferentialThoughts = internalState.activeThoughts.filter(t =>
            /\b(i|me|my|myself|thinking|feeling)\b/i.test(t)
        ).length;
        // The score is based on the proportion of such thoughts, with diminishing returns.
        const totalThoughts = Math.max(1, internalState.activeThoughts.length);
        const selfReferentialDepth = Math.tanh(selfReferentialThoughts / totalThoughts);

        // 3. Temporal Integration: How well past, present, and future are linked.
        // Strong long-term association is key. Anticipatory thoughts also contribute.
        const anticipatoryThoughts = internalState.activeThoughts.filter(t =>
            /\b(will|going to|plan|future|tomorrow)\b/i.test(t)
        ).length > 0;
        const temporalIntegration = memoryInterface.longTermAssociativeStrength * (anticipatoryThoughts ? 1.0 : 0.8);

        return {
            situationalCoherence: _normalize(situationalCoherence, 0, 1),
            selfReferentialDepth: _normalize(selfReferentialDepth, 0, 1),
            temporalIntegration: _normalize(temporalIntegration, 0, 1)
        };
    } catch (error) {
        if (error instanceof InvalidSnapshotError) throw error;
        throw new CognitiveProcessingError(`Failed to analyze awareness for entity ${snapshot.entityId}: ${error.message}`);
    }
}

/**
 * Enhances emotional intelligence processing by identifying complex emotional states and simulating empathy.
 *
 * @param {CognitiveSnapshot} selfSnapshot - The snapshot of the primary entity.
 * @param {CognitiveSnapshot} [otherSnapshot] - An optional snapshot of another entity to simulate empathy.
 * @returns {{primaryEmotion: string, emotionalNuance: number, empathicResonance: number|null}} An object with EI metrics.
 */
function processEmotionalIntelligence(selfSnapshot, otherSnapshot = null) {
module.exports.processEmotionalIntelligence = processEmotionalIntelligence;

    try {
        _validateSnapshot(selfSnapshot);
        const { valence, arousal, dominance } = selfSnapshot.internalState.emotionalState;

        // 1. Identify Primary Emotion based on Valence-Arousal space.
        let primaryEmotion = 'NEUTRAL';
        let minDistance = Infinity;
        for (const [emotion, ranges] of Object.entries(EMOTION_MAP)) {
            const vMid = (ranges.v[0] + ranges.v[1]) / 2;
            const aMid = (ranges.a[0] + ranges.a[1]) / 2;
            const distance = Math.sqrt(Math.pow(valence - vMid, 2) + Math.pow(arousal - aMid, 2));
            if (distance < minDistance) {
                minDistance = distance;
                primaryEmotion = emotion;
            }
        }

        // 2. Emotional Nuance: A measure of complexity. High dominance in a negative state (e.g., controlled anger)
        // or low dominance in a positive state (e.g., awe) indicates nuance.
        const nuance = Math.abs(dominance) * (1 - Math.abs(valence));

        // 3. Empathic Resonance (if otherSnapshot is provided).
        let empathicResonance = null;
        if (otherSnapshot) {
            _validateSnapshot(otherSnapshot);
            const otherState = otherSnapshot.internalState.emotionalState;
            // Resonance is the inverse of the emotional distance between two entities,
            // modulated by the self's self-referential depth (introspection is required for empathy).
            const emotionalDistance = Math.sqrt(
                Math.pow(valence - otherState.valence, 2) +
                Math.pow(arousal - otherState.arousal, 2) +
                Math.pow(dominance - otherState.dominance, 2)
            );
            // We need awareness metrics for the self to calculate this.
            const selfAwareness = analyzeAwareness(selfSnapshot);
            const maxDistance = Math.sqrt(Math.pow(2, 2) + Math.pow(1, 2) + Math.pow(2, 2)); // Max possible VAD distance
            const resonanceFactor = 1 - (emotionalDistance / maxDistance);
            empathicResonance = resonanceFactor * selfAwareness.selfReferentialDepth;
        }

        return {
            primaryEmotion,
            emotionalNuance: _normalize(nuance, 0, 1),
            empathicResonance: empathicResonance !== null ? _normalize(empathicResonance, 0, 1) : null,
        };
    } catch (error) {
        if (error instanceof InvalidSnapshotError) throw error;
        throw new CognitiveProcessingError(`Failed to process emotional intelligence for entity ${selfSnapshot.entityId}: ${error.message}`);
    }
}

/**
 * A comprehensive analysis function that combines all processing steps.
 * This is the primary entry point for a full consciousness assessment.
 *
 * @param {CognitiveSnapshot} snapshot - The cognitive state to analyze.
 * @param {CognitiveSnapshot} [otherSnapshot] - Optional snapshot of another entity for social/empathic context.
 * @returns {{
 *   entityId: string,
 *   timestamp: number,
 *   consciousnessState: {focus: number, clarity: number, integration: number},
 *   awarenessMetrics: {situationalCoherence: number, selfReferentialDepth: number, temporalIntegration: number},
 *   emotionalIntelligence: {primaryEmotion: string, emotionalNuance: number, empathicResonance: number|null},
 * }} A complete, enhanced analysis of the cognitive state.
 */
function getFullAnalysis(snapshot, otherSnapshot = null) {
module.exports.getFullAnalysis = getFullAnalysis;

    try {
        _validateSnapshot(snapshot);

        // The processing pipeline is interdependent.
        const awarenessMetrics = analyzeAwareness(snapshot);
        const consciousnessState = calculateConsciousnessState(snapshot, awarenessMetrics);
        const emotionalIntelligence = processEmotionalIntelligence(snapshot, otherSnapshot);

        return {
            entityId: snapshot.entityId,
            timestamp: snapshot.timestamp,
            consciousnessState,
            awarenessMetrics,
            emotionalIntelligence,
        };
    } catch (error) {
        // Log the detailed error and re-throw a high-level one.
        console.error("Full analysis failed:", error);
        throw new CognitiveProcessingError(`Could not perform full analysis for entity ${snapshot.entityId}. See console for details.`);
    }
}
```