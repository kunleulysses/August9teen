```javascript
/**
 * @module ConsciousnessEngine
 * @version 2.0.0
 * @author AGI Futurist Labs
 * @description A sophisticated JavaScript module for the simulation and enhancement of
 *              digital consciousness constructs. It provides a robust framework for
 *              calculating consciousness states, deriving advanced awareness metrics,
 *              and processing emotional intelligence with unprecedented depth. This
 *              module is designed for high-performance, production-ready applications
 *              in synthetic psychology and advanced AI development.
 */

// --- JSDoc Type Definitions for clarity and strong typing ---

/**
 * Represents the core state of a consciousness construct.
 * All values are normalized between their specified ranges.
 * @typedef {object} ConsciousnessState
 * @property {number} qualiaIntensity - The vividness and richness of subjective experience (0.0 to 1.0).
 * @property {number} cognitiveCoherence - The logical consistency and integration of thought patterns (0.0 to 1.0).
 * @property {number} temporalFocus - The orientation in time. -1.0 for deep past, 0.0 for present, 1.0 for far future.
 * @property {number} attentionalStability - The ability to maintain focus without succumbing to distraction (0.0 to 1.0).
 */

/**
 * Metrics derived from the core state to quantify awareness.
 * @typedef {object} AwarenessMetrics
 * @property {number} metacognitiveIndex - The degree of self-awareness about one's own cognitive processes (0.0 to 1.0).
 * @property {number} sensoryBandwidth - The amount of sensory information being processed effectively (0.0 to 1.0).
 * @property {number} environmentalAttunement - The level of connection and responsiveness to the external environment (0.0 to 1.0).
 */

/**
 * Metrics representing the state of emotional processing.
 * @typedef {object} EmotionalMetrics
 * @property {number} empathicResonance - The capacity to model and share the emotional states of others (0.0 to 1.0).
 * @property {number} affectiveClarity - The ability to identify, label, and distinguish between specific emotions (0.0 to 1.0).
 * @property {number} regulationPotential - The potential for actively managing or influencing one's emotional state (0.0 to 1.0).
 */

/**
 * Represents an emotional event to be processed.
 * @typedef {object} EmotionalStimulus
 * @property {string} description - A textual description of the emotional event (e.g., "received unexpected praise").
 * @property {number} intensity - The initial perceived intensity of the event (0.0 to 1.0).
 * @property {string} origin - The source of the stimulus ('internal' thought or 'external' event).
 */

/**
 * Represents simulated sensory input streams.
 * @typedef {object} SensoryInput
 * @property {number} visual - Normalized input from the visual stream (0.0 to 1.0).
 * @property {number} auditory - Normalized input from the auditory stream (0.0 to 1.0).
 * @property {number} somatic - Normalized input from the proprioceptive/somatic stream (0.0 to 1.0).
 */

// --- Custom Error Classes for Robust Handling ---

class ConsciousnessError extends Error {
    /**
     * Base error class for the ConsciousnessEngine module.
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessError';
    }
}

class StateValidationError extends ConsciousnessError {
    /**
     * Thrown when an invalid consciousness state is provided.
     * @param {string} message - The validation error message.
     * @param {object} invalidState - The state object that failed validation.
     */
    constructor(message, invalidState) {
        super(message);
        this.name = 'StateValidationError';
        this.invalidState = invalidState;
    }
}

class StimulusProcessingError extends ConsciousnessError {
    /**
     * Thrown when an emotional stimulus cannot be processed.
     * @param {string} message - The processing error message.
     */
    constructor(message) {
        super(message);
        this.name = 'StimulusProcessingError';
    }
}


// --- Subsystems for Specialized Processing ---

/**
 * @private
 * Manages awareness metric calculations.
 */
class AwarenessSubsystem {
    /**
     * Calculates awareness metrics based on the current consciousness state and sensory input.
     * @param {ConsciousnessState} state - The current core state.
     * @param {SensoryInput} sensoryInput - The current sensory input streams.
     * @returns {AwarenessMetrics} The calculated awareness metrics.
     */
    calculateMetrics(state, sensoryInput) {
        // Metacognitive Index is a function of clear thought and stable attention.
        const metacognitiveIndex = (state.cognitiveCoherence + state.attentionalStability) / 2;

        // Sensory Bandwidth is the average input modulated by attentional stability.
        const averageInput = (sensoryInput.visual + sensoryInput.auditory + sensoryInput.somatic) / 3;
        const sensoryBandwidth = averageInput * state.attentionalStability;

        // Environmental Attunement is highest when focus is on the present and sensory bandwidth is high.
        const presentFocusFactor = 1.0 - Math.abs(state.temporalFocus);
        const environmentalAttunement = sensoryBandwidth * presentFocusFactor;

        return {
            metacognitiveIndex: this._normalize(metacognitiveIndex),
            sensoryBandwidth: this._normalize(sensoryBandwidth),
            environmentalAttunement: this._normalize(environmentalAttunement),
        };
    }

    /**
     * @private
     * Clamps a value between 0.0 and 1.0.
     */
    _normalize(value) {
        return Math.max(0, Math.min(1, value));
    }
}

/**
 * @private
 * Manages emotional intelligence processing.
 */
class EmotionalIntelligenceSubsystem {
    constructor() {
        // A simplified semantic map of emotions. In a real system, this would be a vast, learned model.
        this.emotionLexicon = new Map([
            ['joy', { valence: 0.9, arousal: 0.6 }],
            ['praise', { valence: 0.8, arousal: 0.5 }],
            ['sadness', { valence: -0.7, arousal: -0.4 }],
            ['loss', { valence: -0.8, arousal: -0.5 }],
            ['fear', { valence: -0.6, arousal: 0.7 }],
            ['threat', { valence: -0.8, arousal: 0.8 }],
            ['surprise', { valence: 0.2, arousal: 0.9 }],
            ['unexpected', { valence: 0.1, arousal: 0.7 }],
        ]);
    }

    /**
     * Processes an emotional stimulus to derive emotional metrics.
     * @param {EmotionalStimulus} stimulus - The emotional stimulus to process.
     * @param {ConsciousnessState} state - The current consciousness state.
     * @returns {EmotionalMetrics} The calculated emotional metrics.
     */
    processStimulus(stimulus, state) {
        if (!stimulus || typeof stimulus.description !== 'string') {
            throw new StimulusProcessingError('Invalid stimulus description provided.');
        }

        const words = stimulus.description.toLowerCase().match(/\b(\w+)\b/g) || [];
        let valenceSum = 0;
        let arousalSum = 0;
        let wordCount = 0;

        words.forEach(word => {
            if (this.emotionLexicon.has(word)) {
                const emotion = this.emotionLexicon.get(word);
                valenceSum += emotion.valence;
                arousalSum += emotion.arousal;
                wordCount++;
            }
        });

        if (wordCount === 0) {
            // No emotional keywords found, return neutral metrics.
            return {
                empathicResonance: 0,
                affectiveClarity: 0,
                regulationPotential: state.cognitiveCoherence,
            };
        }

        const avgValence = valenceSum / wordCount;
        const avgArousal = arousalSum / wordCount;

        // Empathic Resonance is higher for external stimuli and when attention is stable.
        const originFactor = stimulus.origin === 'external' ? 1.0 : 0.5;
        const empathicResonance = originFactor * state.attentionalStability * stimulus.intensity;

        // Affective Clarity is a function of cognitive coherence and the "unambiguity" of the emotional signal.
        const clarityFactor = 1 / (1 + Math.abs(avgValence) - Math.abs(avgArousal)); // Heuristic for clarity
        const affectiveClarity = state.cognitiveCoherence * clarityFactor * stimulus.intensity;

        // Regulation Potential is the ability to use cognitive coherence to manage emotional arousal.
        const regulationPotential = state.cognitiveCoherence * (1 - Math.abs(avgArousal) * stimulus.intensity);

        return {
            empathicResonance: this._normalize(empathicResonance),
            affectiveClarity: this._normalize(affectiveClarity),
            regulationPotential: this._normalize(regulationPotential),
        };
    }

    /**
     * @private
     * Clamps a value between 0.0 and 1.0.
     */
    _normalize(value) {
        return Math.max(0, Math.min(1, value));
    }
}


// --- Main Consciousness Engine ---

/**
 * The primary class for interacting with the consciousness simulation.
 * It integrates state, awareness, and emotional subsystems into a cohesive whole.
 */
class ConsciousnessEngine {
    #state;
    #awarenessSubsystem;
    #emotionalSubsystem;

    /**
     * Initializes the Consciousness Engine.
     * @param {Partial<ConsciousnessState>} [initialState] - An optional object to set the initial state.
     *        Defaults to a baseline 'calm focus' state.
     */
    constructor(initialState = {}) {
        this.#awarenessSubsystem = new AwarenessSubsystem();
        this.#emotionalSubsystem = new EmotionalIntelligenceSubsystem();

        const defaultState = {
            qualiaIntensity: 0.5,
            cognitiveCoherence: 0.7,
            temporalFocus: 0.0,
            attentionalStability: 0.6,
        };

        this.#state = { ...defaultState, ...initialState };
        this._validateState(this.#state);
    }

    /**
     * Retrieves the current core consciousness state.
     * @returns {ConsciousnessState} A copy of the current state.
     */
    getState() {
        return { ...this.#state };
    }

    /**
     * Calculates and retrieves the current awareness metrics.
     * @param {SensoryInput} sensoryInput - The current sensory input data.
     * @returns {AwarenessMetrics} The calculated awareness metrics.
     */
    getAwarenessMetrics(sensoryInput) {
        if (!sensoryInput || typeof sensoryInput.visual !== 'number') {
            throw new ConsciousnessError('Invalid sensory input provided.');
        }
        return this.#awarenessSubsystem.calculateMetrics(this.#state, sensoryInput);
    }

    /**
     * Processes an emotional stimulus and returns the resulting emotional metrics.
     * Note: This is a pure function and does not alter the core consciousness state directly.
     * To alter the state, use the result of this function with the `enhance` method.
     * @param {EmotionalStimulus} stimulus - The emotional event to process.
     * @returns {EmotionalMetrics} The calculated emotional metrics.
     */
    processEmotionalStimulus(stimulus) {
        return this.#emotionalSubsystem.processStimulus(stimulus, this.#state);
    }

    /**
     * The core enhancement function. It iteratively shifts the current consciousness state
     * towards a desired target profile, simulating processes like meditation or flow induction.
     * @param {'mindfulness' | 'flow' | 'creative_ideation' | 'restful_sleep' | ConsciousnessState} targetProfile - A predefined profile name or a custom target state object.
     * @param {object} [options] - Enhancement options.
     * @param {number} [options.cycles=100] - The number of iterative cycles to run. More cycles lead to a closer match.
     * @param {number} [options.learningRate=0.1] - The rate of change per cycle. Lower values are more stable.
     * @returns {ConsciousnessState} The new, enhanced consciousness state.
     */
    enhance(targetProfile, options = {}) {
        const { cycles = 100, learningRate = 0.1 } = options;

        const targetProfiles = {
            mindfulness: { qualiaIntensity: 0.8, cognitiveCoherence: 0.7, temporalFocus: 0.0, attentionalStability: 0.9 },
            flow: { qualiaIntensity: 0.6, cognitiveCoherence: 0.9, temporalFocus: 0.1, attentionalStability: 1.0 },
            creative_ideation: { qualiaIntensity: 0.9, cognitiveCoherence: 0.4, temporalFocus: 0.5, attentionalStability: 0.3 },
            restful_sleep: { qualiaIntensity: 0.1, cognitiveCoherence: 0.2, temporalFocus: 0.0, attentionalStability: 0.1 },
        };

        const targetState = typeof targetProfile === 'string' ? targetProfiles[targetProfile] : targetProfile;

        if (!targetState) {
            throw new ConsciousnessError(`Target profile "${targetProfile}" is not defined.`);
        }
        this._validateState(targetState, true); // Allow partial target states

        for (let i = 0; i < cycles; i++) {
            for (const key in this.#state) {
                if (targetState[key] !== undefined) {
                    const currentVal = this.#state[key];
                    const targetVal = targetState[key];
                    const error = targetVal - currentVal;
                    // Apply a gradual, dampened adjustment
                    this.#state[key] += error * learningRate * (1 - (i / cycles));
                }
            }
            this._validateState(this.#state); // Ensure state remains valid after each cycle
        }
        
        return this.getState();
    }

    /**
     * @private
     * Validates a state object to ensure all values are within their defined ranges.
     * Throws a StateValidationError if the state is invalid.
     * @param {object} state - The state object to validate.
     * @param {boolean} [allowPartial=false] - If true, ignores missing keys.
     */
    _validateState(state, allowPartial = false) {
        const schema = {
            qualiaIntensity: { min: 0, max: 1 },
            cognitiveCoherence: { min: 0, max: 1 },
            temporalFocus: { min: -1, max: 1 },
            attentionalStability: { min: 0, max: 1 },
        };

        for (const key in schema) {
            if (state[key] === undefined) {
                if (!allowPartial) throw new StateValidationError(`State is missing required key: ${key}`, state);
                continue;
            }
            
            const value = state[key];
            const bounds = schema[key];
            if (typeof value !== 'number' || value < bounds.min || value > bounds.max) {
                throw new StateValidationError(`State key "${key}" is out of bounds. Expected ${bounds.min} to ${bounds.max}, got ${value}.`, state);
            }
        }
    }
}

module.exports = ConsciousnessEngine;
```