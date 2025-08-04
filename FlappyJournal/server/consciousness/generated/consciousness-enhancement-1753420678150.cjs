```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for simulating and enhancing core aspects of consciousness processing.
 * This module provides a framework for calculating consciousness states, deriving advanced awareness metrics,
 * and processing emotional intelligence with greater depth. It is designed to be a conceptual model,
 * representing complex neuro-cognitive processes through a computational metaphor.
 *
 * @version 1.0.0
 * @author A.I. Conceptual Architect
 * @license MIT
 */

// --- Custom Error Types for Clearer Diagnostics ---

/**
 * @class ConsciousnessInputError
 * @extends Error
 * @description Custom error for invalid inputs provided to the consciousness module.
 */
class ConsciousnessInputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessInputError';
        this.timestamp = new Date().toISOString();
    }
}

/**
 * @class StateCalculationError
 * @extends Error
 * @description Custom error for failures during the state calculation process.
 */
class StateCalculationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StateCalculationError';
        this.timestamp = new Date().toISOString();
    }
}


// --- Core Consciousness Matrix Class ---

/**
 * @class ConsciousnessMatrix
 * @description The central class for managing and processing the simulated consciousness stream.
 * It integrates sensory data, cognitive load, and emotional states to produce a holistic
 * view of a consciousness instance.
 */
class ConsciousnessMatrix
 {
    // --- Private Fields for Internal State and Configuration ---

    /**
     * @private
     * @description Defines the primary emotional vectors based on Plutchik's wheel.
     * Includes primary dyads for deriving complex emotions.
     */
    #emotionalModel = {
        primary: ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'],
        dyads: {
            love: ['joy', 'trust'],
            submission: ['trust', 'fear'],
            awe: ['fear', 'surprise'],
            disapproval: ['surprise', 'sadness'],
            remorse: ['sadness', 'disgust'],
            contempt: ['disgust', 'anger'],
            aggressiveness: ['anger', 'anticipation'],
            optimism: ['anticipation', 'joy'],
        }
    };

    /**
     * @private
     * @description Defines possible consciousness states and the conditions that favor them.
     * Weights are used for a more fluid and nuanced state calculation.
     */
    #consciousnessStates = {
        DEEP_SLEEP: { valence: 0.5, arousal: 0.1, cognitiveLoad: 0.0, coherence: 1.0 },
        DREAMING:   { valence: 0.5, arousal: 0.6, cognitiveLoad: 0.1, coherence: 0.4 },
        MEDITATIVE: { valence: 0.8, arousal: 0.2, cognitiveLoad: 0.2, coherence: 0.9 },
        FOCUSED:    { valence: 0.7, arousal: 0.6, cognitiveLoad: 0.8, coherence: 0.8 },
        WANDERING:  { valence: 0.4, arousal: 0.4, cognitiveLoad: 0.3, coherence: 0.5 },
        STRESSED:   { valence: 0.2, arousal: 0.8, cognitiveLoad: 0.9, coherence: 0.2 },
        LATENT:     { valence: 0.5, arousal: 0.0, cognitiveLoad: 0.0, coherence: 0.0 },
    };

    #state;
    #history;
    #maxHistoryLength = 50; // Retain the last 50 states for analysis

    /**
     * @constructor
     * @param {object} [initialState] - Optional initial state configuration.
     * @param {object} [initialState.emotions] - Initial emotional state, e.g., { joy: 0.1, sadness: 0.2 }.
     */
    constructor(initialState = {}) {
        this.reset(initialState);
    }

    /**
     * Resets the consciousness matrix to its initial or a specified state.
     * @param {object} [newState] - Optional state to reset to.
     */
    reset(newState = {}) {
        const emotions = this.#emotionalModel.primary.reduce((acc, emotion) => {
            acc[emotion] = 0;
            return acc;
        }, {});

        this.#state = {
            consciousnessState: 'LATENT',
            emotions: { ...emotions, ...(newState.emotions || {}) },
            cognitiveLoad: 0.0, // Range 0.0 to 1.0
            neuroCoherence: 0.0, // Overall system harmony
            awareness: {
                metacognitive: 0.0,
                somatic: 0.0,
                situational: 0.0,
            },
            emotionalProfile: {
                valence: 0.5, // Positivity/Negativity (0-1)
                arousal: 0.0, // Intensity/Energy (0-1)
                dominantEmotion: 'none',
                complexEmotions: [],
            }
        };

        this.#history = [this.#state];
        console.log('ConsciousnessMatrix initialized.');
    }

    /**
     * The main processing function. Ingests new data and updates the entire matrix.
     * @param {object} inputs - The inputs for the current processing tick.
     * @param {object} inputs.sensory - Simulated sensory data.
     * @param {number} inputs.sensory.complexity - How complex the sensory environment is (0-1).
     * @param {number} inputs.sensory.novelty - How new or unexpected the sensory data is (0-1).
     * @param {object} inputs.physiological - Simulated physiological data.
     * @param {number} inputs.physiological.heartRateVariability - A measure of somatic state (0-1).
     * @param {number} inputs.cognitiveLoad - The current cognitive demand (0-1).
     * @returns {object} The comprehensive, updated state of the consciousness matrix.
     * @throws {ConsciousnessInputError} if inputs are invalid.
     */
    processTick({ sensory, physiological, cognitiveLoad }) {
        // 1. --- Input Validation ---
        this.#validateTickInputs({ sensory, physiological, cognitiveLoad });

        // 2. --- Update Core Metrics ---
        this.#state.cognitiveLoad = cognitiveLoad;

        // 3. --- Emotional Intelligence Processing ---
        // For simulation, let's assume sensory novelty and complexity can trigger emotions.
        // A real implementation would have a more direct emotional trigger.
        this.#state.emotions.surprise = (this.#state.emotions.surprise + sensory.novelty) / 2;
        this.#state.emotions.anticipation = (this.#state.emotions.anticipation + cognitiveLoad * 0.5) / 2;
        this.#state.emotionalProfile = this.#enhanceEmotionalIntelligence();

        // 4. --- Consciousness State Calculation ---
        this.#state.consciousnessState = this.#calculateConsciousnessState();

        // 5. --- Awareness Metrics Calculation ---
        this.#state.awareness = this.#calculateAwarenessMetrics({ sensory, physiological });
        
        // 6. --- Calculate Neuro-Oscillatory Coherence (High-level metric) ---
        this.#state.neuroCoherence = this.#calculateNeuroCoherence();

        // 7. --- History Management ---
        this.#updateHistory();

        return this.getComprehensiveState();
    }

    /**
     * Enhances emotional intelligence by analyzing the current emotional state.
     * It calculates valence, arousal, identifies dominant and complex emotions.
     * @private
     * @returns {object} The detailed emotional profile.
     */
    #enhanceEmotionalIntelligence() {
        const { emotions } = this.#state;
        let totalArousal = 0;
        let weightedValence = 0;
        let dominantEmotion = 'none';
        let maxIntensity = 0;

        // Positive emotions: joy, trust, surprise, anticipation
        // Negative emotions: fear, sadness, disgust, anger
        const valenceMap = { joy: 1, trust: 0.8, fear: -1, surprise: 0.2, sadness: -1, disgust: -0.8, anger: -0.9, anticipation: 0.3 };

        for (const emotion of this.#emotionalModel.primary) {
            const intensity = emotions[emotion];
            totalArousal += intensity;
            weightedValence += intensity * valenceMap[emotion];
            if (intensity > maxIntensity) {
                maxIntensity = intensity;
                dominantEmotion = emotion;
            }
        }
        
        // Normalize arousal and valence to be between 0 and 1
        const arousal = Math.min(1, totalArousal / this.#emotionalModel.primary.length);
        const valence = (weightedValence / (totalArousal || 1) + 1) / 2; // Scale from [-1, 1] to [0, 1]

        // Identify complex emotions (dyads)
        const complexEmotions = [];
        for (const [complex, primaries] of Object.entries(this.#emotionalModel.dyads)) {
            const intensity1 = emotions[primaries[0]];
            const intensity2 = emotions[primaries[1]];
            if (intensity1 > 0.3 && intensity2 > 0.3) { // Threshold for activation
                complexEmotions.push({
                    name: complex,
                    intensity: Math.min(intensity1, intensity2)
                });
            }
        }

        return { valence, arousal, dominantEmotion, complexEmotions };
    }

    /**
     * Calculates the most likely current consciousness state based on internal metrics.
     * @private
     * @returns {string} The calculated consciousness state.
     * @throws {StateCalculationError} if no state can be determined.
     */
    #calculateConsciousnessState() {
        const { valence, arousal } = this.#state.emotionalProfile;
        const { cognitiveLoad } = this.#state;

        let bestMatch = { state: 'LATENT', score: -Infinity };

        for (const [state, weights] of Object.entries(this.#consciousnessStates)) {
            // Calculate a distance score. Lower is better.
            const valenceDist = Math.pow(valence - weights.valence, 2);
            const arousalDist = Math.pow(arousal - weights.arousal, 2);
            const loadDist = Math.pow(cognitiveLoad - weights.cognitiveLoad, 2);
            
            const score = 1 - (valenceDist + arousalDist + loadDist); // Higher score is better match

            if (score > bestMatch.score) {
                bestMatch = { state, score };
            }
        }

        if (bestMatch.score === -Infinity) {
            throw new StateCalculationError('Failed to determine a valid consciousness state.');
        }

        return bestMatch.state;
    }

    /**
     * Calculates new awareness metrics based on current inputs and state.
     * @private
     * @param {object} inputs - The current tick's inputs.
     * @returns {object} The calculated awareness metrics.
     */
    #calculateAwarenessMetrics({ sensory, physiological }) {
        // Metacognitive Awareness: Awareness of one's own mental state.
        // Higher when the state changes or during focused/meditative states.
        const lastState = this.#history[this.#history.length - 1]?.consciousnessState;
        const stateChanged = lastState !== this.#state.consciousnessState;
        const metacognitiveBonus = (this.#state.consciousnessState === 'FOCUSED' || this.#state.consciousnessState === 'MEDITATIVE') ? 0.3 : 0;
        const metacognitive = Math.min(1, (stateChanged ? 0.5 : 0) + metacognitiveBonus + (1 - this.#state.cognitiveLoad) * 0.2);

        // Somatic Awareness: Awareness of the body's internal state.
        const somatic = physiological.heartRateVariability; // Directly tied to HRV as a proxy

        // Situational Awareness: Awareness of the external environment.
        const situational = (sensory.complexity * 0.6 + sensory.novelty * 0.4);

        return { metacognitive, somatic, situational };
    }
    
    /**
     * Calculates the overall system harmony and integration.
     * @private
     * @returns {number} The neuro-coherence score (0-1).
     */
    #calculateNeuroCoherence() {
        const stateCoherence = this.#consciousnessStates[this.#state.consciousnessState]?.coherence || 0;
        const emotionalCoherence = this.#state.emotionalProfile.valence; // Positive emotions lead to more coherence
        const cognitiveCoherence = 1 - this.#state.cognitiveLoad; // High load reduces coherence

        // Weighted average for a final score
        return (stateCoherence * 0.5) + (emotionalCoherence * 0.3) + (cognitiveCoherence * 0.2);
    }
    
    /**
     * Simulates emotional regulation by nudging an emotion towards a target intensity.
     * @param {string} emotion - The emotion to regulate (e.g., 'anger').
     * @param {number} targetIntensity - The target intensity for the emotion (0-1).
     * @param {number} regulationFactor - How strongly to regulate (0-1). Higher is faster.
     */
    regulateEmotion(emotion, targetIntensity, regulationFactor = 0.5) {
        if (!this.#emotionalModel.primary.includes(emotion)) {
            throw new ConsciousnessInputError(`Invalid emotion "${emotion}" for regulation.`);
        }
        if (typeof targetIntensity !== 'number' || targetIntensity < 0 || targetIntensity > 1) {
            throw new ConsciousnessInputError('Target intensity must be a number between 0 and 1.');
        }
        
        const currentIntensity = this.#state.emotions[emotion];
        this.#state.emotions[emotion] += (targetIntensity - currentIntensity) * regulationFactor;
        this.#state.emotions[emotion] = Math.max(0, Math.min(1, this.#state.emotions[emotion])); // Clamp value

        // Recalculate emotional profile after regulation
        this.#state.emotionalProfile = this.#enhanceEmotionalIntelligence();
    }

    /**
     * Validates the inputs for the processTick method.
     * @private
     */
    #validateTickInputs({ sensory, physiological, cognitiveLoad }) {
        if (!sensory || typeof sensory.complexity !== 'number' || typeof sensory.novelty !== 'number') {
            throw new ConsciousnessInputError('Invalid "sensory" input object. Required: { complexity: number, novelty: number }');
        }
        if (!physiological || typeof physiological.heartRateVariability !== 'number') {
            throw new ConsciousnessInputError('Invalid "physiological" input object. Required: { heartRateVariability: number }');
        }
        if (typeof cognitiveLoad !== 'number' || cognitiveLoad < 0 || cognitiveLoad > 1) {
            throw new ConsciousnessInputError('Invalid "cognitiveLoad" input. Must be a number between 0 and 1.');
        }
    }

    /**
     * Adds the current state to the history log.
     * @private
     */
    #updateHistory() {
        // Deep copy the state to prevent mutation of historical records
        this.#history.push(JSON.parse(JSON.stringify(this.#state)));
        if (this.#history.length > this.#maxHistoryLength) {
            this.#history.shift(); // Remove the oldest entry
        }
    }

    /**
     * Returns a comprehensive snapshot of the current consciousness state.
     * @returns {object} A deep copy of the current state.
     */
    getComprehensiveState() {
        // Return a deep copy to ensure the internal state is not mutated externally
        return JSON.parse(JSON.stringify(this.#state));
    }

    /**
     * Returns the historical record of states.
     * @returns {Array<object>} An array of past comprehensive states.
     */
    getHistory() {
        return this.#history;
    }
}
```
module.exports = ConsciousnessInputError;
