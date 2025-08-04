```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the advanced processing, analysis,
 * and enhancement of simulated conscious states. This module provides a robust framework
 * for quantifying awareness, emotional intelligence, and overall cognitive state from
 * various biometric and cognitive inputs.
 *
 * @version 2.0.0
 * @author AI Cogitator
 * @license MIT
 */

/**
 * @typedef {object} BrainwaveData
 * @property {number} delta - (0-4 Hz) Associated with deep sleep, healing. (Normalized 0-1)
 * @property {number} theta - (4-8 Hz) Associated with light sleep, deep relaxation, meditation. (Normalized 0-1)
 * @property {number} alpha - (8-12 Hz) Associated with relaxed wakefulness, passive attention. (Normalized 0-1)
 * @property {number} beta - (12-30 Hz) Associated with active thinking, focus, arousal. (Normalized 0-1)
 * @property {number} gamma - (30-100 Hz) Associated with peak performance, high-level information processing. (Normalized 0-1)
 */

/**
 * @typedef {object} PhysiologicalData
 * @property {number} heartRate - Beats per minute.
 * @property {number} hrv - Heart Rate Variability (ms). Higher values indicate better regulation.
 * @property {number} gsr - Galvanic Skin Response (microsiemens). Indicates emotional arousal.
 */

/**
 * @typedef {object} CognitiveData
 * @property {number} focusIntensity - A measure of directed attention. (Normalized 0-1)
 * @property {number} memoryRecallAccuracy - Accuracy of recent memory recall. (Normalized 0-1)
 * @property {number} sensoryInputVolume - The amount of external sensory data being processed. (Normalized 0-1)
 */

/**
 * @typedef {object} EmotionalData
 * @description A map of core emotions and their intensities. (Normalized 0-1)
 * @property {number} joy
 * @property {number} sadness
 * @property {number} fear
 * @property {number} anger
 * @property {number} surprise
 * @property {number} disgust
 * @property {number} trust
 * @property {number} anticipation
 */

/**
 * @typedef {object} ConsciousnessInput
 * @description The complete input data structure for consciousness processing.
 * @property {BrainwaveData} brainwaves
 * @property {PhysiologicalData} physiological
 * @property {CognitiveData} cognitive
 * @property {EmotionalData} emotions
 */

/**
 * @typedef {object} ConsciousnessState
 * @property {string} state - The primary state of consciousness (e.g., 'Flow', 'Alert', 'Deep Sleep').
 * @property {number} score - A numerical representation of the consciousness level (0-100).
 * @property {string} description - A brief explanation of the current state.
 */

/**
 * @typedef {object} AwarenessMetrics
 * @property {number} selfAwareness - The degree of inward focus and introspection. (0-100)
 * @property {number} environmentalAwareness - The degree of outward focus on the surroundings. (0-100)
 * @property {number} temporalAwarenessDistortion - A factor indicating how time perception is altered.
 *   (1.0 = normal, <1.0 = time feels slower, >1.0 = time feels faster).
 * @property {number} proprioceptiveClarity - The clarity of the body's sense of self in space. (0-100)
 */

/**
 * @typedef {object} EmotionalIntelligenceAnalysis
 * @property {number} emotionalClarity - How distinct and well-defined the current emotions are. (0-100)
 * @property {string} dominantEmotion - The primary emotion being experienced.
 * @property {Array<string>} emotionalDyads - Pairs of primary emotions creating more complex feelings (e.g., Joy + Trust = Love).
 * @property {number} regulationPotential - An estimate of the capacity to consciously regulate the current emotional state. (0-100)
 */

/**
 * @typedef {object} ProcessingResult
 * @description The complete, enhanced output after processing.
 * @property {ConsciousnessState} consciousness
 * @property {AwarenessMetrics} awareness
 * @property {EmotionalIntelligenceAnalysis} emotionalIntelligence
 */


// --- Constants for Calculations ---

const WEIGHTS = {
    // Weights for consciousness score calculation
    BRAINWAVE: {
        delta: -1.5,
        theta: -0.8,
        alpha: 0.5,
        beta: 1.0,
        gamma: 1.5,
    },
    PHYSIOLOGICAL: {
        heartRate: 0.2, // Normalized
        hrv: 0.4, // Normalized
        gsr: 0.1, // Normalized
    },
    COGNITIVE: {
        focusIntensity: 1.2,
        memoryRecallAccuracy: 0.6,
        sensoryInputVolume: 0.3,
    },
};

const STATE_THRESHOLDS = [
    { score: 10, name: 'Deep Sleep', description: 'Unconscious state with minimal brain activity, vital for restoration.' },
    { score: 25, name: 'Light Sleep', description: 'Transition state with low environmental awareness.' },
    { score: 40, name: 'Drowsy', description: 'Reduced alertness, on the edge of sleep.' },
    { score: 60, name: 'Relaxed Wakefulness', description: 'Calm, meditative state with high alpha-wave activity.' },
    { score: 80, name: 'Standard Alertness', description: 'Normal waking state for daily activities.' },
    { score: 95, name: 'Flow State', description: 'Peak performance state of high focus, energized engagement, and distorted time perception.' },
    { score: 100, name: 'Hyper-Vigilance', description: 'Heightened state of arousal and sensory sensitivity, often associated with stress or threat.' },
];

const EMOTIONAL_DYADS_MAP = {
    joy: { trust: 'Love' },
    trust: { fear: 'Submission' },
    fear: { surprise: 'Awe' },
    surprise: { sadness: 'Disapproval' },
    sadness: { disgust: 'Remorse' },
    disgust: { anger: 'Contempt' },
    anger: { anticipation: 'Aggressiveness' },
    anticipation: { joy: 'Optimism' },
};


class ConsciousnessProcessor
 {

    /**
     * Initializes the ConsciousnessProcessor.
     * @param {object} [config={}] - Optional configuration for future enhancements.
     */
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * Validates the input data to ensure all required fields and formats are correct.
     * @private
     * @param {ConsciousnessInput} input - The data to validate.
     * @throws {Error} if the input data is invalid.
     */
    _validateInput(input) {
        if (!input) {
            throw new Error('Input data cannot be null or undefined.');
        }

        const requiredKeys = ['brainwaves', 'physiological', 'cognitive', 'emotions'];
        for (const key of requiredKeys) {
            if (!(key in input)) {
                throw new Error(`Missing required top-level key in input data: '${key}'`);
            }
        }

        const checkNormalizedObject = (obj, name) => {
            for (const key in obj) {
                const value = obj[key];
                if (typeof value !== 'number' || value < 0 || value > 1) {
                    throw new Error(`Invalid value for ${name}.${key}. Must be a number between 0 and 1.`);
                }
            }
        };

        checkNormalizedObject(input.brainwaves, 'brainwaves');
        checkNormalizedObject(input.cognitive, 'cognitive');
        checkNormalizedObject(input.emotions, 'emotions');
        
        if (input.physiological.heartRate <= 0 || input.physiological.hrv < 0 || input.physiological.gsr < 0) {
            throw new Error('Physiological values must be non-negative.');
        }
    }

    /**
     * Normalizes a value within an expected range.
     * @private
     * @param {number} value - The value to normalize.
     * @param {number} min - The minimum of the expected range.
     * @param {number} max - The maximum of the expected range.
     * @returns {number} The normalized value (0-1).
     */
    _normalize(value, min, max) {
        if (max === min) return 0.5; // Avoid division by zero
        return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }

    /**
     * Calculates the primary consciousness state and score.
     * @private
     * @param {ConsciousnessInput} input - The full input data.
     * @returns {ConsciousnessState} The calculated consciousness state object.
     */
    _calculateConsciousnessState(input) {
        let score = 0;

        // Brainwave contribution
        for (const wave in input.brainwaves) {
            score += input.brainwaves[wave] * WEIGHTS.BRAINWAVE[wave];
        }

        // Physiological contribution (normalized)
        const normHeartRate = this._normalize(input.physiological.heartRate, 40, 180);
        const normHrv = 1 - this._normalize(input.physiological.hrv, 10, 150); // Higher HRV is better, so we invert
        const normGsr = this._normalize(input.physiological.gsr, 0.1, 5);
        score += normHeartRate * WEIGHTS.PHYSIOLOGICAL.heartRate;
        score += normHrv * WEIGHTS.PHYSIOLOGICAL.hrv;
        score += normGsr * WEIGHTS.PHYSIOLOGICAL.gsr;

        // Cognitive contribution
        for (const metric in input.cognitive) {
            score += input.cognitive[metric] * WEIGHTS.COGNITIVE[metric];
        }

        // Scale score to 0-100 range and clamp
        const finalScore = Math.max(0, Math.min(100, (score + 2) * 20)); // Heuristic scaling

        // Map score to a descriptive state
        const stateInfo = STATE_THRESHOLDS.find(t => finalScore <= t.score) || STATE_THRESHOLDS[STATE_THRESHOLDS.length - 1];

        return {
            score: parseFloat(finalScore.toFixed(2)),
            state: stateInfo.name,
            description: stateInfo.description,
        };
    }

    /**
     * Calculates advanced awareness metrics.
     * @private
     * @param {ConsciousnessInput} input - The full input data.
     * @param {ConsciousnessState} consciousness - The calculated consciousness state.
     * @returns {AwarenessMetrics} The calculated awareness metrics object.
     */
    _calculateAwarenessMetrics(input, consciousness) {
        const { cognitive, brainwaves, physiological } = input;

        // Self-awareness: high with alpha/theta, low focus, low sensory input
        const selfAwarenessScore = (brainwaves.alpha + brainwaves.theta) * 0.5 + (1 - cognitive.focusIntensity) * 0.3 + (1 - cognitive.sensoryInputVolume) * 0.2;

        // Environmental awareness: high with beta/gamma, high focus, high sensory input
        const envAwarenessScore = (brainwaves.beta + brainwaves.gamma) * 0.5 + cognitive.focusIntensity * 0.3 + cognitive.sensoryInputVolume * 0.2;
        
        // Temporal distortion: altered in extreme states
        let temporalDistortion = 1.0;
        if (consciousness.state === 'Flow State') {
            // Time feels faster in flow state
            temporalDistortion = 1.5 + (cognitive.focusIntensity - 0.8) * 2;
        } else if (consciousness.state === 'Deep Sleep' || consciousness.state === 'Light Sleep') {
            temporalDistortion = 0; // No perception of time
        } else if (consciousness.state === 'Drowsy' || consciousness.state === 'Relaxed Wakefulness') {
            // Time may feel slower
            temporalDistortion = 0.8 - brainwaves.alpha * 0.2;
        } else if (consciousness.state === 'Hyper-Vigilance') {
            // Time may feel slower due to heightened processing
            temporalDistortion = 0.7 - input.emotions.fear * 0.3;
        }

        // Proprioceptive Clarity: how well the body is tracked. Inversely related to high GSR and extreme cognitive loads.
        const proprioceptiveScore = (1 - this._normalize(physiological.gsr, 0.1, 5)) * 0.6 + (1 - Math.abs(cognitive.focusIntensity - 0.5)) * 0.4;

        return {
            selfAwareness: parseFloat(Math.max(0, Math.min(100, selfAwarenessScore * 100)).toFixed(2)),
            environmentalAwareness: parseFloat(Math.max(0, Math.min(100, envAwarenessScore * 100)).toFixed(2)),
            temporalAwarenessDistortion: parseFloat(Math.max(0, temporalDistortion).toFixed(2)),
            proprioceptiveClarity: parseFloat(Math.max(0, Math.min(100, proprioceptiveScore * 100)).toFixed(2)),
        };
    }

    /**
     * Analyzes emotional data for deeper intelligence metrics.
     * @private
     * @param {ConsciousnessInput} input - The full input data.
     * @param {ConsciousnessState} consciousness - The calculated consciousness state.
     * @returns {EmotionalIntelligenceAnalysis} The calculated emotional intelligence object.
     */
    _analyzeEmotionalIntelligence(input, consciousness) {
        const { emotions } = input;
        const emotionValues = Object.values(emotions);
        const emotionEntries = Object.entries(emotions);

        // Emotional Clarity: High if one emotion dominates, low if many are mixed.
        // Calculated using the inverse of normalized entropy (or a simpler Gini-like impurity).
        const sum = emotionValues.reduce((a, b) => a + b, 0);
        if (sum === 0) {
            return {
                emotionalClarity: 100,
                dominantEmotion: 'Neutral',
                emotionalDyads: [],
                regulationPotential: 100,
            };
        }
        const max = Math.max(...emotionValues);
        const clarity = (max / sum) * (1 - (emotionEntries.filter(([k,v]) => v > 0.05).length / emotionEntries.length));
        
        // Dominant Emotion
        const [dominantEmotion] = emotionEntries.reduce((max, entry) => (entry[1] > max[1] ? entry : max), ['', -1]);

        // Emotional Dyads (Plutchik's wheel inspired)
        const sortedEmotions = emotionEntries.sort((a, b) => b[1] - a[1]);
        const emotionalDyads = [];
        if (sortedEmotions.length > 1 && sortedEmotions[0][1] > 0.2 && sortedEmotions[1][1] > 0.2) {
            const [primary, secondary] = [sortedEmotions[0][0], sortedEmotions[1][0]];
            if (EMOTIONAL_DYADS_MAP[primary] && EMOTIONAL_DYADS_MAP[primary][secondary]) {
                emotionalDyads.push(EMOTIONAL_DYADS_MAP[primary][secondary]);
            } else if (EMOTIONAL_DYADS_MAP[secondary] && EMOTIONAL_DYADS_MAP[secondary][primary]) {
                emotionalDyads.push(EMOTIONAL_DYADS_MAP[secondary][primary]);
            }
        }

        // Regulation Potential: Capacity to manage emotions. Higher in relaxed/alert states, lower in hyper-aroused or low-energy states.
        let regulationPotential = 0;
        if (['Relaxed Wakefulness', 'Standard Alertness', 'Flow State'].includes(consciousness.state)) {
            regulationPotential = 70 + input.cognitive.focusIntensity * 30;
        } else if (['Drowsy', 'Light Sleep'].includes(consciousness.state)) {
            regulationPotential = 20;
        } else if (['Hyper-Vigilance'].includes(consciousness.state)) {
            regulationPotential = 15 - emotions.fear * 15;
        }

        return {
            emotionalClarity: parseFloat(Math.max(0, Math.min(100, clarity * 100)).toFixed(2)),
            dominantEmotion,
            emotionalDyads,
            regulationPotential: parseFloat(Math.max(0, Math.min(100, regulationPotential)).toFixed(2)),
        };
    }

    /**
     * Processes a complete set of consciousness data to generate an enhanced analysis.
     * This is the main public method of the class.
     *
     * @param {ConsciousnessInput} input - The complete data object for a single moment in time.
     * @returns {ProcessingResult} An object containing the full analysis of consciousness, awareness, and emotional intelligence.
     * @throws {Error} if input data is invalid.
     *
     * @example
     * const processor = new ConsciousnessProcessor();
     * const sampleInput = {
     *   brainwaves: { delta: 0.1, theta: 0.4, alpha: 0.8, beta: 0.3, gamma: 0.1 },
     *   physiological: { heartRate: 65, hrv: 80, gsr: 0.5 },
     *   cognitive: { focusIntensity: 0.4, memoryRecallAccuracy: 0.9, sensoryInputVolume: 0.3 },
     *   emotions: { joy: 0.6, sadness: 0.1, fear: 0.05, anger: 0.0, surprise: 0.1, disgust: 0.0, trust: 0.4, anticipation: 0.2 }
     * };
     * try {
     *   const result = processor.process(sampleInput);
     *   console.log(result.consciousness.state); // e.g., 'Relaxed Wakefulness'
     *   console.log(result.awareness.selfAwareness); // e.g., 75.00
     *   console.log(result.emotionalIntelligence.emotionalDyads); // e.g., ['Optimism']
     * } catch (error) {
     *   console.error("Processing failed:", error.message);
     * }
     */
    process(input) {
        try {
            this._validateInput(input);

            const consciousness = this._calculateConsciousnessState(input);
            const awareness = this._calculateAwarenessMetrics(input, consciousness);
            const emotionalIntelligence = this._analyzeEmotionalIntelligence(input, consciousness);

            return {
                consciousness,
                awareness,
                emotionalIntelligence,
            };
        } catch (error) {
            // Re-throw with a more specific context if needed, or handle here.
            // For production, this might log to a monitoring service.
            console.error(`[ConsciousnessProcessor] Error during processing: ${error.message}`);
            throw error; // Propagate the error to the caller
        }
    }
}
```
module.exports = ConsciousnessProcessor;
