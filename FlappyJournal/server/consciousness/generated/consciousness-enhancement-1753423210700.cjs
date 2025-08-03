```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for simulating and enhancing the processing of conscious experience.
 * This neuro-symbolic model integrates sensory, cognitive, and emotional data streams to compute
 * advanced metrics of awareness and emotional intelligence. It aims to provide a computational framework
 * for understanding and augmenting subjective states.
 *
 * @version 2.0.0
 * @author AGI Simulation Collective
 * @license MIT
 */

/**
 * Defines the primary archetypal states of consciousness. These are calculated based on a
 * confluence of cognitive load, emotional valence, and sensory clarity.
 * @readonly
 * @enum {string}
 */
export const ConsciousnessState = {
    /** A state of deep, effortless concentration and immersion. High clarity, positive valence, optimal load. */
    FLOW: 'Flow',
    /** A state of heightened, alert, and directed attention. High clarity, neutral valence, high load. */
    FOCUSED_ANALYTICAL: 'Focused Analytical',
    /** A state of restful, open, and non-judgmental awareness. High clarity, positive valence, low load. */
    MINDFUL_PRESENCE: 'Mindful Presence',
    /** A state of imaginative, non-linear, and associative thought. Low external clarity, variable valence, low load. */
    DREAMLIKE_REVERIE: 'Dreamlike Reverie',
    /** A state of cognitive fragmentation and competing attentional demands. Low clarity, negative valence, high load. */
    DISTRACTED_SCATTER: 'Distracted & Scattered',
    /** A state dominated by physiological stress responses. Low clarity, highly negative valence, extreme load. */
    ACUTE_STRESS: 'Acute Stress',
    /** A state of low arousal and minimal processing. */
    QUIESCENT: 'Quiescent',
};

/**
 * A comprehensive neuro-symbolic integrator for consciousness processing.
 * It takes moments of raw subjective data and synthesizes them into a rich,
 * high-dimensional representation of a conscious state.
 *
 * @example
 * import { ConsciousnessIntegrator } from './consciousness.cjs';
 *
 * const consciousness = new ConsciousnessIntegrator({
 *   config: {
 *     emotionalRegulationFactor: 0.8, // High capacity for emotional regulation
 *   }
 * });
 *
 * const momentData = {
 *   sensoryInput: { visual: 0.9, auditory: 0.7, interoceptive: 0.8 },
 *   cognitiveLoad: 0.4, // Moderate load
 *   emotionalCues: { joy: 0.8, curiosity: 0.6 },
 *   externalContext: {
 *     socialComplexity: 0.2,
 *     environmentalThreat: 0.1,
 *   }
 * };
 *
 * const processedState = consciousness.process(momentData);
 * console.log(processedState.currentState); // e.g., 'Mindful Presence'
 * console.log(processedState.awarenessMetrics.qualiaRichness); // e.g., 0.85
 * console.log(processedState.emotionalIntelligence.empathyResonance);
 */
export class ConsciousnessIntegrator {
    #state;
    #config;

    /**
     * Validates the structure and values of an input object.
     * @private
     * @param {object} data - The input data to validate.
     * @param {string} context - The context for the error message.
     */
    #validateInput(data, context) {
        if (!data || typeof data !== 'object') {
            throw new Error(`Invalid input for ${context}: Must be a non-null object.`);
        }
        for (const key in data) {
            const value = data[key];
            if (typeof value !== 'number' || value < 0 || value > 1) {
                throw new Error(`Invalid value for ${context}.${key}: Must be a number between 0 and 1. Received: ${value}`);
            }
        }
    }

    /**
     * Initializes the consciousness processing model.
     * @param {object} [initialization={}] - Optional initial state and configuration.
     * @param {object} [initialization.state={}] - The starting internal state.
     * @param {object} [initialization.state.emotions={ joy: 0.1, neutral: 0.8, sadness: 0.1 }] - Base emotional tone.
     * @param {object} [initialization.config={}] - Configuration for the model's behavior.
     * @param {number} [initialization.config.emotionalRegulationFactor=0.75] - The ability to dampen emotional volatility (0-1). Higher is more stable.
     * @param {number} [initialization.config.emotionalInertia=0.6] - How much the previous emotional state carries over (0-1). Higher is less reactive.
     */
    constructor(initialization = {}) {
        const { state = {}, config = {} } = initialization;

        this.#config = {
            emotionalRegulationFactor: config.emotionalRegulationFactor ?? 0.75,
            emotionalInertia: config.emotionalInertia ?? 0.6,
        };

        this.#state = {
            emotions: state.emotions ?? { joy: 0.1, neutral: 0.8, sadness: 0.1 },
            processedMoments: 0,
            lastProcessedState: null,
        };
    }

    /**
     * Processes a new "moment" of experience, updating the internal state and calculating all metrics.
     * @param {object} momentData - The data for the current moment.
     * @param {object} momentData.sensoryInput - Clarity and intensity of sensory channels (0-1). e.g., { visual, auditory, tactile, olfactory, gustatory, interoceptive }.
     * @param {number} momentData.cognitiveLoad - The amount of mental effort being expended (0-1).
     * @param {object} [momentData.emotionalCues={}] - External or internal emotional stimuli (0-1). e.g., { joy, fear, anger }.
     * @param {object} [momentData.externalContext={}] - Perceived context of the environment.
     * @param {number} [momentData.externalContext.socialComplexity=0] - Complexity of social interactions (0-1).
     * @param {number} [momentData.externalContext.environmentalThreat=0] - Perceived level of danger (0-1).
     * @param {object} [momentData.attentionalFocus={ present: 1.0 }] - Distribution of attention across time (0-1). e.g., { past, present, future }.
     * @returns {object} The newly computed, comprehensive state object.
     * @throws {Error} If input data is malformed.
     */
    process(momentData) {
        // --- 1. Input Validation and Destructuring ---
        if (!momentData || typeof momentData !== 'object') {
            throw new Error('momentData must be a non-null object.');
        }
        const {
            sensoryInput,
            cognitiveLoad,
            emotionalCues = {},
            externalContext = {},
            attentionalFocus = { present: 1.0 },
        } = momentData;

        this.#validateInput(sensoryInput, 'sensoryInput');
        this.#validateInput(emotionalCues, 'emotionalCues');
        this.#validateInput(attentionalFocus, 'attentionalFocus');
        const { socialComplexity = 0, environmentalThreat = 0 } = externalContext;
        if (typeof cognitiveLoad !== 'number' || cognitiveLoad < 0 || cognitiveLoad > 1) {
            throw new Error(`Invalid cognitiveLoad: Must be a number between 0 and 1. Received: ${cognitiveLoad}`);
        }

        // --- 2. Emotional Intelligence Processing ---
        const eiMetrics = this.#calculateEmotionalIntelligence(emotionalCues, environmentalThreat);

        // --- 3. Awareness Metrics Calculation ---
        const awarenessMetrics = this.#calculateAwarenessMetrics(sensoryInput, cognitiveLoad, attentionalFocus, eiMetrics.currentEmotions);

        // --- 4. Consciousness State Calculation ---
        const currentState = this.#calculateConsciousnessState({
            sensoryClarity: awarenessMetrics.sensoryClarity,
            cognitiveLoad,
            emotionalValence: eiMetrics.emotionalValence,
            emotionalIntensity: eiMetrics.emotionalIntensity,
        });

        // --- 5. State Update and Synthesis ---
        this.#state.emotions = { ...eiMetrics.currentEmotions };
        this.#state.processedMoments++;

        const fullProcessedState = {
            timestamp: Date.now(),
            currentState,
            awarenessMetrics,
            emotionalIntelligence: eiMetrics,
            cognitiveLoad,
        };

        this.#state.lastProcessedState = fullProcessedState;
        return fullProcessedState;
    }

    /**
     * Calculates emotional intelligence metrics for the current moment.
     * @private
     * @param {object} emotionalCues - The emotional stimuli for this moment.
     * @param {number} environmentalThreat - The perceived environmental threat level.
     * @returns {object} A collection of EI metrics.
     */
    #calculateEmotionalIntelligence(emotionalCues, environmentalThreat) {
        // Modulate incoming cues by regulation factor and threat
        const regulatedCues = { ...emotionalCues };
        if (environmentalThreat > 0) {
            regulatedCues.fear = (regulatedCues.fear ?? 0) + environmentalThreat;
        }

        // Apply emotional inertia from previous state
        const newEmotions = {};
        const allKeys = new Set([...Object.keys(this.#state.emotions), ...Object.keys(regulatedCues)]);

        for (const key of allKeys) {
            const oldEmotion = this.#state.emotions[key] ?? 0;
            const cueEmotion = regulatedCues[key] ?? 0;
            const regulatedCue = (key === 'fear' || key === 'anger' || key === 'sadness') ?
                cueEmotion * (1 - this.#config.emotionalRegulationFactor) :
                cueEmotion;

            newEmotions[key] = (oldEmotion * this.#config.emotionalInertia) + (regulatedCue * (1 - this.#config.emotionalInertia));
        }

        // Normalize the emotional vector
        const magnitude = Math.sqrt(Object.values(newEmotions).reduce((acc, val) => acc + val * val, 0));
        const normalizedEmotions = {};
        if (magnitude > 0) {
            for (const key in newEmotions) {
                normalizedEmotions[key] = newEmotions[key] / magnitude;
            }
        }

        // Calculate metrics from the new emotional state
        const emotionalIntensity = Math.min(1, magnitude);
        const positiveEmotions = ['joy', 'love', 'curiosity', 'serenity'];
        const negativeEmotions = ['fear', 'anger', 'sadness', 'disgust'];

        let valence = 0;
        for (const key in normalizedEmotions) {
            if (positiveEmotions.includes(key)) valence += normalizedEmotions[key];
            if (negativeEmotions.includes(key)) valence -= normalizedEmotions[key];
        }

        const emotionalNuance = 1 - Math.max(...Object.values(normalizedEmotions));
        const empathyResonance = this.#calculateCosineSimilarity(this.#state.emotions, emotionalCues);

        return {
            currentEmotions: normalizedEmotions,
            emotionalValence: (valence + 1) / 2, // Normalize to 0-1
            emotionalIntensity,
            emotionalNuance,
            empathyResonance,
            regulationCapacityUsed: 1 - this.#config.emotionalRegulationFactor,
        };
    }

    /**
     * Calculates awareness metrics for the current moment.
     * @private
     * @param {object} sensoryInput - The sensory data for this moment.
     * @param {number} cognitiveLoad - The cognitive load for this moment.
     * @param {object} attentionalFocus - The temporal focus distribution.
     * @param {object} currentEmotions - The current emotional state.
     * @returns {object} A collection of awareness metrics.
     */
    #calculateAwarenessMetrics(sensoryInput, cognitiveLoad, attentionalFocus, currentEmotions) {
        const sensoryValues = Object.values(sensoryInput);
        const sensoryBandwidth = sensoryValues.reduce((sum, v) => sum + v, 0) / (sensoryValues.length || 1);
        const sensoryClarity = sensoryBandwidth * (1 - Math.pow(cognitiveLoad, 2));

        const emotionalIntensity = Math.sqrt(Object.values(currentEmotions).reduce((acc, val) => acc + val * val, 0));
        const qualiaRichness = Math.tanh(sensoryClarity * (1 + emotionalIntensity));

        const metacognitiveAcuity = (1 - cognitiveLoad) * (1 - emotionalIntensity * 0.5);

        return {
            sensoryBandwidth: sensoryBandwidth,
            sensoryClarity,
            qualiaRichness,
            metacognitiveAcuity,
            temporalFocus: attentionalFocus, // Pass through for reporting
        };
    }

    /**
     * Determines the primary consciousness state based on key integrated metrics.
     * @private
     * @param {object} metrics - The core metrics to evaluate.
     * @returns {ConsciousnessState} The determined state.
     */
    #calculateConsciousnessState({ sensoryClarity, cognitiveLoad, emotionalValence, emotionalIntensity }) {
        if (sensoryClarity < 0.1 && cognitiveLoad < 0.1) return ConsciousnessState.QUIESCENT;

        if (emotionalValence < 0.3 && cognitiveLoad > 0.7) {
            return ConsciousnessState.ACUTE_STRESS;
        }
        if (sensoryClarity < 0.4 && cognitiveLoad > 0.6) {
            return ConsciousnessState.DISTRACTED_SCATTER;
        }
        if (sensoryClarity > 0.7 && cognitiveLoad > 0.6 && emotionalValence > 0.4 && emotionalValence < 0.6) {
            return ConsciousnessState.FOCUSED_ANALYTICAL;
        }
        if (sensoryClarity > 0.6 && cognitiveLoad < 0.4 && emotionalValence > 0.7 && emotionalIntensity > 0.5) {
            return ConsciousnessState.FLOW;
        }
        if (sensoryClarity > 0.7 && cognitiveLoad < 0.3 && emotionalValence > 0.6) {
            return ConsciousnessState.MINDFUL_PRESENCE;
        }
        if (sensoryClarity < 0.3 && cognitiveLoad < 0.3) {
            return ConsciousnessState.DREAMLIKE_REVERIE;
        }

        // Default fallback state
        return ConsciousnessState.DISTRACTED_SCATTER;
    }

    /**
     * Calculates the cosine similarity between two emotional vectors.
     * @private
     * @param {object} vecA - The first emotional vector.
     * @param {object} vecB - The second emotional vector.
     * @returns {number} The cosine similarity (0-1).
     */
    #calculateCosineSimilarity(vecA, vecB) {
        const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;

        for (const key of allKeys) {
            const valA = vecA[key] || 0;
            const valB = vecB[key] || 0;
            dotProduct += valA * valB;
            magA += valA * valA;
            magB += valB * valB;
        }

        magA = Math.sqrt(magA);
        magB = Math.sqrt(magB);

        if (magA === 0 || magB === 0) {
            return 0;
        }
        // Clamp the result between 0 and 1 as negative similarity isn't meaningful here
        return Math.max(0, dotProduct / (magA * magB));
    }

    /**
     * Retrieves the last processed state without running new calculations.
     * @returns {object | null} The last fully processed state object, or null if no processing has occurred.
     */
    getCurrentState() {
        return this.#state.lastProcessedState;
    }

    /**
     * Gets the current configuration of the integrator.
     * @returns {object} The configuration object.
     */
    getConfig() {
        return { ...this.#config };
    }
}
```