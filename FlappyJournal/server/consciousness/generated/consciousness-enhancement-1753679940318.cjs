```javascript
/**
 * @module NeuroQuanta
 * @version 2.0.0
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This module provides a sophisticated framework for calculating consciousness states, analyzing
 * awareness metrics, and processing emotional intelligence with high granularity. It is designed
 * for use in theoretical modeling, advanced human-computer interfaces, and digital wellness
 * applications.
 *
 * NOTE: This module is based on a theoretical model of consciousness and its outputs are
 * interpretive. It synthesizes complex data into understandable metrics.
 */

// --- Custom Error Types for Robust Handling ---

/**
 * @class ConsciousnessProcessingError
 * @classdesc Base error class for all module-specific exceptions.
 */
class ConsciousnessProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessProcessingError';
        this.timestamp = new Date().toISOString();
    }
}

/**
 * @class InvalidInputError
 * @classdesc Thrown when input data is malformed, missing, or outside expected ranges.
 */
class InvalidInputError extends ConsciousnessProcessingError {
    constructor(message, details) {
        super(message);
        this.name = 'InvalidInputError';
        this.details = details; // e.g., { expected: 'number', got: 'string' }
    }
}

/**
 * @class DataUnfittableError
 * @classdesc Thrown when data, while valid, cannot be processed by the model (e.g., too noisy).
 */
class DataUnfittableError extends ConsciousnessProcessingError {
    constructor(message) {
        super(message);
        this.name = 'DataUnfittableError';
    }
}


// --- Core Constants and Models ---

/**
 * @const {object} CONSCIOUSNESS_STATES
 * @description Defines descriptive labels for Consciousness Quotient (CQ) ranges.
 * The model maps a numerical CQ score (0-100) to a qualitative state.
 */
const CONSCIOUSNESS_STATES = {
    0: 'Non-Responsive',
    10: 'Deep Unconsciousness',
    25: 'Subconscious Processing',
    40: 'Drowsy / Hypnagogic',
    55: 'Baseline Waking Consciousness',
    70: 'Focused Awareness',
    85: 'Flow State / Heightened Focus',
    95: 'Hyper-Awareness / Transcendental',
    100: 'Peak Experience'
};

/**
 * @const {object} EMOTIONAL_VECTORS
 * @description A simplified model for representing emotional states along key axes.
 * Used for enhancing emotional intelligence processing.
 * - valence: negative (-1) to positive (1)
 * - arousal: calm (0) to excited (1)
 * - dominance: submissive (0) to in-control (1)
 */
const EMOTIONAL_VECTORS = {
    joy: { valence: 0.9, arousal: 0.7, dominance: 0.6 },
    sadness: { valence: -0.8, arousal: 0.2, dominance: 0.1 },
    anger: { valence: -0.7, arousal: 0.8, dominance: 0.7 },
    fear: { valence: -0.7, arousal: 0.9, dominance: 0.2 },
    surprise: { valence: 0.4, arousal: 0.9, dominance: 0.4 },
    disgust: { valence: -0.8, arousal: 0.5, dominance: 0.3 },
    serenity: { valence: 0.8, arousal: 0.1, dominance: 0.8 },
    ambivalence: { valence: 0.0, arousal: 0.4, dominance: 0.3 },
    empathy: { valence: 0.7, arousal: 0.5, dominance: 0.5 }, // Represents resonance with another's state
};


/**
 * @class ConsciousnessProcessor
 * @description The main class for interfacing with the NeuroQuanta engine.
 * It provides methods to calculate and analyze various aspects of a conscious state.
 */
export class ConsciousnessProcessor {
    /**
     * @constructor
     * @param {object} [config={}] - Configuration options for the processor.
     * @param {number} [config.noiseThreshold=0.9] - Signal-to-noise ratio below which data is considered unfittable.
     */
    constructor(config = {}) {
        this.config = {
            noiseThreshold: 0.9,
            ...config
        };
        this.lastState = null;
    }

    /**
     * Normalizes a value to a 0-1 scale.
     * @private
     * @param {number} value - The input value.
     * @param {number} min - The minimum of the value's range.
     * @param {number} max - The maximum of the value's range.
     * @returns {number} The normalized value, clamped between 0 and 1.
     */
    _normalize(value, min, max) {
        if (max === min) return 0;
        const normalized = (value - min) / (max - min);
        return Math.max(0, Math.min(1, normalized)); // Clamp between 0 and 1
    }

    /**
     * Validates the structure and types of an input data object.
     * @private
     * @param {object} data - The data object to validate.
     * @param {object} schema - An object defining the expected keys and types.
     * @throws {InvalidInputError} If validation fails.
     */
    _validateInput(data, schema) {
        if (!data || typeof data !== 'object') {
            throw new InvalidInputError('Input data must be a non-null object.', { got: typeof data });
        }
        for (const key in schema) {
            if (!(key in data)) {
                throw new InvalidInputError(`Missing required input key: '${key}'.`);
            }
            const expectedType = schema[key];
            const actualType = typeof data[key];
            if (actualType !== expectedType) {
                throw new InvalidInputError(`Invalid type for key '${key}'.`, { expected: expectedType, got: actualType });
            }
        }
    }

    /**
     * Calculates the Consciousness Quotient (CQ), a holistic measure of the state of consciousness.
     * It integrates physiological, cognitive, and subjective data streams.
     *
     * @param {object} data - The input data streams.
     * @param {object} data.physiological - Physiological measurements.
     * @param {number} data.physiological.heartRateVariability - HRV in ms. Higher is better. (Range: 10-150)
     * @param {number} data.physiological.brainwaveCoherence - Global coherence index. (Range: 0.1-0.9)
     * @param {number} data.physiological.signalToNoiseRatio - Quality of the physiological signal. (Range: 0-1)
     * @param {object} data.cognitive - Cognitive performance metrics.
     * @param {number} data.cognitive.attentionalFocus - Sustained attention duration in seconds. (Range: 1-600)
     * @param {number} data.cognitive.workingMemorySpan - Number of items held in working memory. (Range: 2-9)
     * @param {object} data.subjective - Self-reported experiential data.
     * @param {number} data.subjective.clarity - Reported mental clarity. (Scale: 1-10)
     * @param {number} data.subjective.selfAwareness - Reported level of self-awareness. (Scale: 1-10)
     * @returns {object} An object containing the CQ score and its qualitative description.
     * @throws {InvalidInputError} If input data is malformed.
     * @throws {DataUnfittableError} If physiological signal quality is too low.
     */
    calculateConsciousnessQuotient(data) {
        const schema = {
            physiological: 'object',
            cognitive: 'object',
            subjective: 'object',
        };
        this._validateInput(data, schema);
        this._validateInput(data.physiological, { heartRateVariability: 'number', brainwaveCoherence: 'number', signalToNoiseRatio: 'number' });
        this._validateInput(data.cognitive, { attentionalFocus: 'number', workingMemorySpan: 'number' });
        this._validateInput(data.subjective, { clarity: 'number', selfAwareness: 'number' });

        if (data.physiological.signalToNoiseRatio < this.config.noiseThreshold) {
            throw new DataUnfittableError(`Physiological signal-to-noise ratio (${data.physiological.signalToNoiseRatio}) is below the threshold of ${this.config.noiseThreshold}.`);
        }

        // --- Normalization ---
        const normHRV = this._normalize(data.physiological.heartRateVariability, 10, 150);
        const normCoherence = this._normalize(data.physiological.brainwaveCoherence, 0.1, 0.9);
        const normFocus = this._normalize(data.cognitive.attentionalFocus, 1, 600);
        const normMemory = this._normalize(data.cognitive.workingMemorySpan, 2, 9);
        const normClarity = this._normalize(data.subjective.clarity, 1, 10);
        const normSelfAwareness = this._normalize(data.subjective.selfAwareness, 1, 10);

        // --- Weighted Calculation Model ---
        // Weights are derived from theoretical importance.
        const physiologicalFactor = (normHRV * 0.4) + (normCoherence * 0.6); // 35% weight
        const cognitiveFactor = (normFocus * 0.6) + (normMemory * 0.4); // 40% weight
        const subjectiveFactor = (normClarity * 0.5) + (normSelfAwareness * 0.5); // 25% weight

        const cqScore = (physiologicalFactor * 0.35) + (cognitiveFactor * 0.40) + (subjectiveFactor * 0.25);
        const cqFinal = Math.round(cqScore * 100);

        // --- Determine Qualitative State ---
        const stateKey = Object.keys(CONSCIOUSNESS_STATES).reverse().find(key => cqFinal >= key);
        const qualitativeState = CONSCIOUSNESS_STATES[stateKey];

        const result = {
            consciousnessQuotient: cqFinal,
            qualitativeState: qualitativeState,
            factors: {
                physiological: parseFloat(physiologicalFactor.toFixed(3)),
                cognitive: parseFloat(cognitiveFactor.toFixed(3)),
                subjective: parseFloat(subjectiveFactor.toFixed(3)),
            }
        };

        this.lastState = result;
        return result;
    }

    /**
     * Analyzes the spectrum of awareness, providing novel metrics for different domains.
     *
     * @param {object} data - The input data for awareness analysis.
     * @param {number} data.metacognitiveInsight - Score from a thought-monitoring task. (Scale: 0-1)
     * @param {number} data.somaticClarity - Accuracy in an interoceptive (body scan) task. (Scale: 0-1)
     * @param {number} data.environmentalTuning - Ability to detect subtle environmental changes. (Scale: 0-1)
     * @returns {object} An object containing scores for different facets of awareness.
     * @throws {InvalidInputError} If input data is malformed.
     */
    analyzeAwarenessSpectrum(data) {
        const schema = {
            metacognitiveInsight: 'number',
            somaticClarity: 'number',
            environmentalTuning: 'number',
        };
        this._validateInput(data, schema);

        // The scores are already expected to be normalized (0-1).
        // Here we can apply a non-linear transform to emphasize higher levels of skill.
        const metacognitiveAwareness = Math.pow(data.metacognitiveInsight, 0.8);
        const somaticAwareness = Math.pow(data.somaticClarity, 1.2); // Somatic skill is weighted slightly higher.
        const externalFieldAwareness = Math.pow(data.environmentalTuning, 1.0);

        // Overall awareness is a geometric mean, which rewards balanced development.
        const overallAwareness = Math.pow(metacognitiveAwareness * somaticAwareness * externalFieldAwareness, 1 / 3);

        return {
            metacognitive: parseFloat(metacognitiveAwareness.toFixed(3)),
            somatic: parseFloat(somaticAwareness.toFixed(3)),
            externalField: parseFloat(externalFieldAwareness.toFixed(3)),
            overall: parseFloat(overallAwareness.toFixed(3)),
            profile: (overallAwareness > 0.7) ? 'Integrated' : (overallAwareness > 0.4) ? 'Developing' : 'Fragmented'
        };
    }

    /**
     * Processes emotional data to provide a deep, nuanced analysis of the affective state.
     * This goes beyond basic emotion labels to capture complexity.
     *
     * @param {object} emotionalInput - The input containing emotional cues.
     * @param {string} [emotionalInput.textualContent=""] - Self-reported text about feelings.
     * @param {number[]} [emotionalInput.affectiveResonance=[0,0,0]] - Simulated biosignal mapping to [valence, arousal, dominance].
     * @returns {object} A detailed emotional intelligence profile.
     * @throws {InvalidInputError} If input data is malformed.
     */
    processEmotionalIntelligence(emotionalInput) {
        const schema = {};
        if ('textualContent' in emotionalInput) schema.textualContent = 'string';
        if ('affectiveResonance' in emotionalInput) schema.affectiveResonance = 'object'; // Array is an object
        this._validateInput(emotionalInput, schema);

        let textVector = { valence: 0, arousal: 0, dominance: 0 };
        const text = (emotionalInput.textualContent || "").toLowerCase();
        let emotionsFound = 0;

        // Simple keyword-based analysis to derive a vector from text
        for (const emotion in EMOTIONAL_VECTORS) {
            if (text.includes(emotion)) {
                textVector.valence += EMOTIONAL_VECTORS[emotion].valence;
                textVector.arousal += EMOTIONAL_VECTORS[emotion].arousal;
                textVector.dominance += EMOTIONAL_VECTORS[emotion].dominance;
                emotionsFound++;
            }
        }

        if (emotionsFound > 0) {
            textVector = {
                valence: textVector.valence / emotionsFound,
                arousal: textVector.arousal / emotionsFound,
                dominance: textVector.dominance / emotionsFound
            };
        }

        // Combine text-based vector with bio-signal vector
        const bioVector = emotionalInput.affectiveResonance || [0, 0, 0];
        const combinedVector = {
            valence: (textVector.valence * 0.4) + (bioVector[0] * 0.6),
            arousal: (textVector.arousal * 0.4) + (bioVector[1] * 0.6),
            dominance: (textVector.dominance * 0.4) + (bioVector[2] * 0.6),
        };

        // Find the closest primary emotion
        let closestEmotion = 'neutral';
        let minDistance = Infinity;
        for (const emotion in EMOTIONAL_VECTORS) {
            const vec = EMOTIONAL_VECTORS[emotion];
            const distance = Math.sqrt(
                Math.pow(combinedVector.valence - vec.valence, 2) +
                Math.pow(combinedVector.arousal - vec.arousal, 2) +
                Math.pow(combinedVector.dominance - vec.dominance, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestEmotion = emotion;
            }
        }

        // --- Calculate Novel Metrics ---
        // Emotional Granularity: How many distinct emotions were detected? High granularity is a sign of EI.
        const emotionalGranularity = this._normalize(emotionsFound, 0, 5);
        // Affective Dissonance: The difference between text-based and biosignal-based analysis.
        const affectiveDissonance = Math.sqrt(
             Math.pow(textVector.valence - bioVector[0], 2) +
             Math.pow(textVector.arousal - bioVector[1], 2)
        ) / 2; // Normalize roughly

        return {
            primaryEmotion: closestEmotion,
            emotionalVector: {
                valence: parseFloat(combinedVector.valence.toFixed(3)),
                arousal: parseFloat(combinedVector.arousal.toFixed(3)),
                dominance: parseFloat(combinedVector.dominance.toFixed(3)),
            },
            emotionalGranularity: parseFloat(emotionalGranularity.toFixed(3)),
            affectiveDissonance: parseFloat(affectiveDissonance.toFixed(3)),
            commentary: affectiveDissonance > 0.5 ? "Potential conflict between expressed feelings and physiological state." : "Expressed feelings appear aligned with physiological state."
        };
    }

    /**
     * Synthesizes all processed data into a single, holistic "Phenomenal State" report.
     * This is the capstone function, providing a rich, multi-dimensional snapshot.
     *
     * @param {object} fullDataSet - An object containing all necessary data for sub-processors.
     * @param {object} fullDataSet.consciousnessData - Data for `calculateConsciousnessQuotient`.
     * @param {object} fullDataSet.awarenessData - Data for `analyzeAwarenessSpectrum`.
     * @param {object} fullDataSet.emotionData - Data for `processEmotionalIntelligence`.
     * @returns {object} A comprehensive report on the phenomenal state.
     * @throws {ConsciousnessProcessingError} Can throw errors from underlying methods.
     */
    synthesizePhenomenalState(fullDataSet) {
        if (!fullDataSet.consciousnessData || !fullDataSet.awarenessData || !fullDataSet.emotionData) {
            throw new InvalidInputError("Full data set requires 'consciousnessData', 'awarenessData', and 'emotionData' keys.");
        }

        const cqReport = this.calculateConsciousnessQuotient(fullDataSet.consciousnessData);
        const awarenessReport = this.analyzeAwarenessSpectrum(fullDataSet.awarenessData);
        const emotionReport = this.processEmotionalIntelligence(fullDataSet.emotionData);

        // The "binding" process: how do these states interact?
        // High CQ + High Awareness = Lucid, insightful state.
        // High CQ + Low Awareness = Distracted or "autopilot" state.
        let stateBindingProfile;
        if (cqReport.consciousnessQuotient > 75 && awarenessReport.overall > 0.7) {
            stateBindingProfile = "Integrated Lucidity";
        } else if (cqReport.consciousnessQuotient > 60 && awarenessReport.overall < 0.4) {
            stateBindingProfile = "Focused Autopilot";
        } else if (emotionReport.affectiveDissonance > 0.6) {
            stateBindingProfile = "Cognitive-Emotional Dissonance";
        } else {
            stateBindingProfile = "Standard Waking Integration";
        }

        return {
            timestamp: new Date().toISOString(),
            reportId: `ps-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            phenomenalState: {
                bindingProfile: stateBindingProfile,
                consciousness: cqReport,
                awareness: awarenessReport,
                emotion: emotionReport,
            }
        };
    }
}
```