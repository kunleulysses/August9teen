```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the advanced processing and analysis
 * of consciousness states, awareness metrics, and emotional intelligence. This module
 * provides a computational framework for quantifying and understanding complex
 * phenomenological data.
 *
 * @version 2.0.0
 * @author AGI Model
 * @license MIT
 */

/**
 * Defines the polarity of primary emotions for valence calculations.
 * 1 represents positive, -1 negative, and 0 neutral.
 * @private
 * @const {Object<string, number>}
 */
const EMOTION_POLARITY_MAP = {
    joy: 1,
    gratitude: 1,
    serenity: 1,
    interest: 0.5,
    hope: 0.8,
    pride: 0.7,
    amusement: 0.9,
    inspiration: 0.9,
    awe: 0.9,
    love: 1,
    sadness: -1,
    anger: -0.8,
    fear: -0.9,
    disgust: -0.7,
    guilt: -0.6,
    shame: -0.7,
    contempt: -0.8,
    neutral: 0
};

/**
 * Validates that an input is a number within a specified range.
 * @private
 * @param {any} value - The value to validate.
 * @param {string} name - The name of the variable for error messages.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @throws {TypeError} if the value is not a number.
 * @throws {RangeError} if the value is outside the specified range.
 */
const _validateNumericInput = (value, name, min = 0, max = 1) => {
    if (typeof value !== 'number' || !isFinite(value)) {
        throw new TypeError(`Input '${name}' must be a finite number. Received: ${value}`);
    }
    if (value < min || value > max) {
        throw new RangeError(`Input '${name}' must be between ${min} and ${max}. Received: ${value}`);
    }
};

/**
 * A comprehensive processor for quantifying and analyzing aspects of consciousness.
 * It can be configured with custom weights and thresholds to tailor the analysis
 * to specific models of consciousness.
 *
 * @class ConsciousnessProcessor
 */
export default class ConsciousnessProcessor {
    /**
     * Creates an instance of the ConsciousnessProcessor.
     * @param {object} [config={}] - Configuration options for the processor.
     * @param {object} [config.weights] - Weights for consciousness state calculation.
     * @param {number} [config.weights.focus=0.4] - Weight for mental focus.
     * @param {number} [config.weights.clarity=0.3] - Weight for cognitive clarity.
     * @param {number} [config.weights.wakefulness=0.15] - Weight for physiological arousal.
     * @param {number} [config.weights.sensoryLoad=0.15] - Weight for sensory input processing load.
     * @param {number} [config.complexityThreshold=0.05] - Minimum intensity for an emotion to be counted towards complexity.
     */
    constructor(config = {}) {
        const defaultConfig = {
            weights: {
                focus: 0.4,
                clarity: 0.3,
                wakefulness: 0.15,
                sensoryLoad: 0.15,
            },
            complexityThreshold: 0.05,
        };

        this.config = {
            ...defaultConfig,
            ...config,
            weights: {
                ...defaultConfig.weights,
                ...(config.weights || {}),
            },
        };

        // Validate that weights sum to 1 for a normalized calculation.
        const weightSum = Object.values(this.config.weights).reduce((sum, w) => sum + w, 0);
        if (Math.abs(weightSum - 1.0) > 1e-9) {
            console.warn(`[ConsciousnessProcessor] Custom weights do not sum to 1. They will be normalized during calculation.`);
        }
    }

    /**
     * Calculates the integrated state of consciousness based on several input factors.
     * The state is represented as a normalized score from 0 (unconscious) to 1 (hyper-aware).
     *
     * @param {object} inputs - The input metrics for the calculation.
     * @param {number} inputs.focus - The level of mental focus and concentration [0, 1].
     * @param {number} inputs.clarity - The clarity of thought and perception [0, 1].
     * @param {number} inputs.wakefulness - The level of physiological alertness [0, 1].
     * @param {number} inputs.sensoryLoad - The current load of sensory information being processed [0, 1].
     * @returns {object} An object containing the consciousness score and a qualitative description.
     * @throws {TypeError|RangeError} if inputs are invalid.
     * @example
     * const processor = new ConsciousnessProcessor();
     * const state = processor.calculateConsciousnessState({
     *   focus: 0.8,
     *   clarity: 0.9,
     *   wakefulness: 0.7,
     *   sensoryLoad: 0.5
     * });
     * // returns { score: 0.785, label: 'Optimal Consciousness' }
     */
    calculateConsciousnessState(inputs) {
        if (!inputs || typeof inputs !== 'object') {
            throw new TypeError('Input must be a non-null object.');
        }

        const { weights } = this.config;
        let totalScore = 0;
        let totalWeight = 0;

        for (const key in weights) {
            if (Object.hasOwnProperty.call(inputs, key)) {
                _validateNumericInput(inputs[key], key);
                totalScore += inputs[key] * weights[key];
                totalWeight += weights[key];
            } else {
                throw new TypeError(`Missing required input property: '${key}'`);
            }
        }

        // Normalize score in case weights don't sum to 1
        const normalizedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

        let label;
        if (normalizedScore < 0.2) label = 'Minimal Consciousness';
        else if (normalizedScore < 0.4) label = 'Diminished Consciousness';
        else if (normalizedScore < 0.7) label = 'Normal Waking Consciousness';
        else if (normalizedScore < 0.9) label = 'Optimal Consciousness';
        else label = 'Hyper-Aware State';

        return {
            score: parseFloat(normalizedScore.toFixed(4)),
            label,
        };
    }

    /**
     * Analyzes and quantifies different dimensions of awareness.
     * This method provides a multi-faceted view of an individual's awareness profile.
     *
     * @param {object} metrics - The input metrics for awareness analysis.
     * @param {object} metrics.somatic - Data related to body awareness.
     * @param {number} metrics.somatic.interoception - Attunement to internal bodily signals (e.g., heartbeat, breath) [0, 1].
     * @param {number} metrics.somatic.proprioception - Sense of body position and movement in space [0, 1].
     * @param {object} metrics.environmental - Data related to external awareness.
     * @param {number} metrics.environmental.stimuliCount - Number of distinct external stimuli being tracked.
     * @param {number} metrics.environmental.relevanceFilter - Efficacy of filtering relevant vs. irrelevant stimuli [0, 1].
     * @param {object} metrics.metacognitive - Data related to self-awareness of mental processes.
     * @param {number} metrics.metacognitive.thoughtMonitoring - Ability to observe one's own thoughts without judgment [0, 1].
     * @param {number} metrics.metacognitive.emotionalGranularity - Ability to differentiate and label specific emotions [0, 1].
     * @returns {object} An object containing scores for each dimension of awareness.
     * @throws {TypeError|RangeError} if metrics are invalid.
     * @example
     * const awarenessProfile = processor.analyzeAwareness({
     *   somatic: { interoception: 0.8, proprioception: 0.7 },
     *   environmental: { stimuliCount: 10, relevanceFilter: 0.9 },
     *   metacognitive: { thoughtMonitoring: 0.85, emotionalGranularity: 0.9 }
     * });
     */
    analyzeAwareness(metrics) {
        if (!metrics || typeof metrics !== 'object') {
            throw new TypeError('Metrics must be a non-null object.');
        }

        // Validate inputs
        if (!metrics.somatic) throw new TypeError('Missing awareness property: somatic');
        _validateNumericInput(metrics.somatic.interoception, 'somatic.interoception');
        _validateNumericInput(metrics.somatic.proprioception, 'somatic.proprioception');

        if (!metrics.environmental) throw new TypeError('Missing awareness property: environmental');
        _validateNumericInput(metrics.environmental.stimuliCount, 'environmental.stimuliCount', 0, Infinity);
        _validateNumericInput(metrics.environmental.relevanceFilter, 'environmental.relevanceFilter');

        if (!metrics.metacognitive) throw new TypeError('Missing awareness property: metacognitive');
        _validateNumericInput(metrics.metacognitive.thoughtMonitoring, 'metacognitive.thoughtMonitoring');
        _validateNumericInput(metrics.metacognitive.emotionalGranularity, 'metacognitive.emotionalGranularity');

        // --- Awareness Calculations ---

        // Somatic Awareness: Average of interoception and proprioception.
        const somaticAwareness = (metrics.somatic.interoception + metrics.somatic.proprioception) / 2;

        // Situational Awareness: A function of stimuli count and filtering ability.
        // Uses a sigmoid-like function to model diminishing returns of tracking too many stimuli.
        const situationalAwareness = (1 / (1 + Math.exp(-(metrics.environmental.stimuliCount - 5) / 3))) * metrics.environmental.relevanceFilter;

        // Metacognitive Awareness: Weighted average, giving more importance to emotional granularity.
        const metacognitiveAwareness = (metrics.metacognitive.thoughtMonitoring * 0.4) + (metrics.metacognitive.emotionalGranularity * 0.6);

        return {
            somaticAwareness: parseFloat(somaticAwareness.toFixed(4)),
            situationalAwareness: parseFloat(Math.min(1.0, situationalAwareness).toFixed(4)),
            metacognitiveAwareness: parseFloat(metacognitiveAwareness.toFixed(4)),
        };
    }

    /**
     * Processes a complex emotional state to derive higher-order emotional intelligence metrics.
     * It analyzes the valence, complexity, and potential dissonance of the emotional landscape.
     *
     * @param {Object<string, number>} emotions - An object where keys are emotion names (lowercase)
     * and values are their intensities [0, 1].
     * @returns {object} A detailed analysis of the emotional state.
     * @throws {TypeError|RangeError} if the emotions object is invalid.
     * @example
     * const emotionalAnalysis = processor.processEmotionalState({
     *   joy: 0.7,
     *   sadness: 0.2,
     *   interest: 0.5,
     *   fear: 0.1
     * });
     * // Returns an object with valence, complexity, dominantEmotion, dissonance, and a summary.
     */
    processEmotionalState(emotions) {
        if (!emotions || typeof emotions !== 'object' || Object.keys(emotions).length === 0) {
            throw new TypeError('Emotions must be a non-empty object.');
        }

        let valenceNumerator = 0;
        let totalIntensity = 0;
        let activeEmotions = 0;
        let dominantEmotion = { name: 'neutral', intensity: 0 };

        for (const [emotion, intensity] of Object.entries(emotions)) {
            _validateNumericInput(intensity, `emotion.${emotion}`);
            
            const polarity = EMOTION_POLARITY_MAP[emotion.toLowerCase()];
            if (polarity === undefined) {
                console.warn(`[ConsciousnessProcessor] Unknown emotion '${emotion}' encountered. It will be ignored in valence calculation.`);
            } else {
                valenceNumerator += intensity * polarity;
            }
            
            totalIntensity += intensity;

            if (intensity > this.config.complexityThreshold) {
                activeEmotions++;
            }

            if (intensity > dominantEmotion.intensity) {
                dominantEmotion = { name: emotion, intensity };
            }
        }
        
        if (totalIntensity === 0) {
            return {
                valence: 0,
                complexity: 0,
                dominantEmotion: 'neutral',
                dissonance: 0,
                summary: 'A neutral emotional state with no active emotions.'
            };
        }

        const valence = valenceNumerator / totalIntensity;
        
        // Calculate Emotional Dissonance: The degree of co-occurrence of opposing emotions.
        const joySadnessDissonance = Math.min(emotions.joy || 0, emotions.sadness || 0);
        const loveContemptDissonance = Math.min(emotions.love || 0, emotions.contempt || 0);
        const hopeFearDissonance = Math.min(emotions.hope || 0, emotions.fear || 0);
        const dissonance = (joySadnessDissonance + loveContemptDissonance + hopeFearDissonance) * 2; // Amplify for significance

        // Generate a qualitative summary
        const valenceDesc = valence > 0.3 ? 'positive' : valence < -0.3 ? 'negative' : 'mixed/neutral';
        const complexityDesc = activeEmotions > 3 ? 'highly complex' : activeEmotions > 1 ? 'nuanced' : 'simple';
        const dissonanceDesc = dissonance > 0.5 ? 'significant emotional conflict' : dissonance > 0.1 ? 'some emotional tension' : 'low emotional conflict';
        const summary = `A ${complexityDesc}, predominantly ${valenceDesc} emotional state, dominated by ${dominantEmotion.name} with ${dissonanceDesc}.`;

        return {
            valence: parseFloat(valence.toFixed(4)),
            complexity: activeEmotions,
            dominantEmotion: dominantEmotion.name,
            dissonance: parseFloat(Math.min(1.0, dissonance).toFixed(4)),
            summary
        };
    }
}
```