```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description A sophisticated JavaScript module for simulating and enhancing core aspects of
 * conscious processing. This module provides a framework for calculating consciousness states,
 * analyzing awareness metrics, and processing emotional intelligence with depth and nuance.
 * It is designed for use in advanced AI, simulations, or conceptual digital psychology projects.
 *
 * The model is based on a neuro-symbolic approach, combining quantitative metrics with
 * qualitative state descriptors.
 */

// --- Custom Error Handling ---

/**
 * Custom error class for issues related to consciousness processing.
 * @class ConsciousnessProcessingError
 * @extends {Error}
 */
class ConsciousnessProcessingError extends Error {
    /**
     * @param {string} message - The error message.
     * @param {object} [details] - Additional details about the error context.
     */
    constructor(message, details = {}) {
        super(message);
        this.name = 'ConsciousnessProcessingError';
        this.date = new Date();
        this.details = details;
    }
}

// --- Core Data Structures and Constants ---

/**
 * Defines the primary emotional dimensions based on the Valence-Arousal model.
 * @typedef {object} EmotionalState
 * @property {number} valence - The positivity/negativity of the emotion. Range: -1 (max negative) to 1 (max positive).
 * @property {number} arousal - The intensity or energy level of the emotion. Range: 0 (calm) to 1 (max excitement/agitation).
 */

/**
 * Represents the raw inputs for a single processing tick.
 * @typedef {object} ConsciousnessInputStream
 * @property {number} focus - A measure of attentional focus. Range: 0 to 1.
 * @property {number} coherence - A measure of logical consistency in thought patterns. Range: 0 to 1.
 * @property {number} sensoryBandwidth - The amount of sensory data being processed. Range: 0 to 1.
 * @property {number} internalNoise - A measure of distracting internal thoughts or signals. Range: 0 to 1.
 */

/**
 * A comprehensive snapshot of the consciousness state at a given moment.
 * @typedef {object} ConsciousnessState
 * @property {number} timestamp - The time of this state calculation.
 * @property {ConsciousnessInputStream} inputs - The raw inputs for this state.
 * @property {number} clarity - A primary metric of conscious clarity. Range: 0 to 1.
 * @property {string} stateDescriptor - A qualitative label for the current state (e.g., 'Flow', 'MindWandering').
 * @property {object} awareness - Container for various awareness metrics.
 * @property {number} awareness.situational - Awareness of the external environment. Range: 0 to 1.
 * @property {number} awareness.self - Awareness of the internal state. Range: 0 to 1.
 * @property {number} awareness.metacognitive - "Thinking about thinking"; awareness of one's own cognitive processes. Range: 0 to 1.
 * @property {EmotionalState} emotionalState - The current emotional state.
 * @property {object} history - A record of recent clarity and emotional values for trend analysis.
 * @property {number[]} history.clarity - Historical clarity scores.
 * @property {EmotionalState[]} history.emotions - Historical emotional states.
 */

const HISTORY_LENGTH = 20; // How many past states to remember for trend analysis.
const EMOTIONAL_REGULATION_RATE = 0.15; // How strongly the system tries to return to a baseline emotional state.

// --- Helper Functions ---

/**
 * Normalizes a value to a 0-1 range using a hyperbolic tangent function,
 * creating a smooth, non-linear S-curve.
 * @private
 * @param {number} value - The input value.
 * @returns {number} - The normalized value between 0 and 1.
 */
const _normalize = (value) => (Math.tanh(value) + 1) / 2;

/**
 * Validates that an input object contains the required numeric properties within the 0-1 range.
 * @private
 * @param {object} input - The input object to validate.
 * @param {string[]} keys - The keys to check for.
 * @throws {ConsciousnessProcessingError} If validation fails.
 */
const _validateInput = (input, keys) => {
    if (typeof input !== 'object' || input === null) {
        throw new ConsciousnessProcessingError('Input must be a non-null object.', {
            input
        });
    }
    for (const key of keys) {
        if (typeof input[key] !== 'number' || input[key] < 0 || input[key] > 1) {
            throw new ConsciousnessProcessingError(`Invalid input for '${key}'. Must be a number between 0 and 1.`, {
                key,
                value: input[key]
            });
        }
    }
};

// --- Core Processing Functions ---

/**
 * Creates and initializes a new consciousness state object.
 * This is the entry point for starting a new consciousness stream.
 * @returns {ConsciousnessState} A new, baseline consciousness state.
 */
export function createConsciousnessStream() {
    return {
        timestamp: Date.now(),
        inputs: {
            focus: 0.5,
            coherence: 0.5,
            sensoryBandwidth: 0.1,
            internalNoise: 0.5
        },
        clarity: 0.5,
        stateDescriptor: 'Neutral',
        awareness: {
            situational: 0.5,
            self: 0.5,
            metacognitive: 0.1,
        },
        emotionalState: {
            valence: 0.0,
            arousal: 0.1
        },
        history: {
            clarity: Array(HISTORY_LENGTH).fill(0.5),
            emotions: Array(HISTORY_LENGTH).fill({
                valence: 0.0,
                arousal: 0.1
            }),
        },
    };
}

/**
 * Calculates the primary consciousness clarity score and its qualitative descriptor.
 * This improved calculation uses a weighted, non-linear model to better represent
 * the complex interplay of cognitive factors.
 * @param {ConsciousnessInputStream} inputs - The raw cognitive inputs.
 * @returns {{clarity: number, stateDescriptor: string}} The calculated clarity and state descriptor.
 */
function calculateConsciousnessState(inputs) {
    _validateInput(inputs, ['focus', 'coherence', 'sensoryBandwidth', 'internalNoise']);

    const {
        focus,
        coherence,
        sensoryBandwidth,
        internalNoise
    } = inputs;

    // Weighted contribution of core factors. Focus and coherence are most important.
    const coreClarity = (focus * 0.5) + (coherence * 0.4) - (internalNoise * 0.3);

    // Sensory bandwidth has a non-linear effect: too little or too much reduces clarity.
    // This is modeled using a Gaussian-like curve centered at 0.4.
    const sensoryFactor = Math.exp(-Math.pow(sensoryBandwidth - 0.4, 2) / 0.1);

    // Combine factors and normalize to a 0-1 range.
    const clarity = Math.max(0, Math.min(1, _normalize(coreClarity) * sensoryFactor));

    // Determine qualitative state descriptor based on clarity and input patterns.
    let stateDescriptor = 'Undefined';
    if (clarity > 0.85 && focus > 0.8 && internalNoise < 0.2) {
        stateDescriptor = 'Flow';
    } else if (clarity > 0.7 && focus > 0.6) {
        stateDescriptor = 'Deep Focus';
    } else if (clarity < 0.4 && focus < 0.5 && internalNoise > 0.6) {
        stateDescriptor = 'Mind Wandering';
    } else if (clarity < 0.3 && internalNoise > 0.7) {
        stateDescriptor = 'Stressed / Overwhelmed';
    } else if (clarity > 0.5) {
        stateDescriptor = 'Engaged';
    } else {
        stateDescriptor = 'Restful / Neutral';
    }

    return {
        clarity,
        stateDescriptor
    };
}

/**
 * Computes advanced awareness metrics based on the current state and history.
 * @param {ConsciousnessState} currentState - The current full state object.
 * @returns {object} An object containing situational, self, and metacognitive awareness scores.
 */
function computeAwarenessMetrics(currentState) {
    const {
        inputs,
        history
    } = currentState;

    // 1. Situational Awareness: High when sensory bandwidth is optimal and focus is external.
    // We model "external focus" as high focus combined with high sensory bandwidth.
    const situational = inputs.focus * inputs.sensoryBandwidth;

    // 2. Self-Awareness: The ability to recognize one's own internal state.
    // Modeled as the correlation between current clarity and recent historical clarity.
    // A high value means the current state is consistent with or a predictable evolution of the past.
    const avgHistoricalClarity = history.clarity.reduce((a, b) => a + b, 0) / HISTORY_LENGTH;
    const self = 1 - Math.abs(currentState.clarity - avgHistoricalClarity);

    // 3. Metacognitive Awareness: The awareness of one's own thought processes.
    // Modeled as the rate of change (derivative) of the self-awareness metric.
    // High metacognition occurs when the system is actively re-evaluating itself.
    const lastSelfAwareness = 1 - Math.abs(history.clarity[HISTORY_LENGTH - 1] - avgHistoricalClarity);
    const metacognitive = _normalize(Math.abs(self - lastSelfAwareness) * 10); // Amplified for sensitivity

    return {
        situational: Math.max(0, Math.min(1, situational)),
        self: Math.max(0, Math.min(1, self)),
        metacognitive: Math.max(0, Math.min(1, metacognitive)),
    };
}

/**
 * Processes an external emotional stimulus and integrates it into the current emotional state.
 * @param {EmotionalState} currentEmotionalState - The current emotional state.
 * @param {EmotionalState} stimulus - The emotional stimulus to process.
 * @param {number} emotionalResilience - A factor for how much the stimulus affects the state. Range 0-1.
 * @returns {EmotionalState} The new emotional state.
 */
export function processEmotionalInput(currentEmotionalState, stimulus, emotionalResilience = 0.5) {
    if (typeof emotionalResilience !== 'number' || emotionalResilience < 0 || emotionalResilience > 1) {
        throw new ConsciousnessProcessingError('Emotional resilience must be a number between 0 and 1.', {
            emotionalResilience
        });
    }
    _validateInput(stimulus, ['valence', 'arousal']);

    // The impact of the stimulus is dampened by resilience.
    const impact = 1 - emotionalResilience;

    // The new state is a weighted average of the current state and the stimulus.
    const newArousal = (currentEmotionalState.arousal * emotionalResilience) + (stimulus.arousal * impact);
    const newValence = (currentEmotionalState.valence * currentEmotionalState.arousal * emotionalResilience +
            stimulus.valence * stimulus.arousal * impact) /
        (newArousal > 0 ? newArousal : 1); // Weighted by arousal to prevent low-arousal stimuli from swinging valence wildly.

    return {
        valence: Math.max(-1, Math.min(1, newVale_nce)),
        arousal: Math.max(0, Math.min(1, newArousal)),
    };
}

/**
 * Simulates emotional regulation, the process of returning to a baseline emotional state.
 * This is an active process that enhances emotional intelligence.
 * @param {EmotionalState} emotionalState - The current emotional state.
 * @param {number} clarity - The current consciousness clarity score, which affects regulation efficiency.
 * @returns {EmotionalState} The regulated emotional state.
 */
function regulateEmotionalState(emotionalState, clarity) {
    // Regulation is more effective when clarity is high.
    const regulationFactor = EMOTIONAL_REGULATION_RATE * clarity;

    // Nudge valence towards neutral (0) and arousal towards a calm baseline (0.1).
    const newArousal = emotionalState.arousal * (1 - regulationFactor) + 0.1 * regulationFactor;
    const newValence = emotionalState.valence * (1 - regulationFactor);

    return {
        valence: newVale_nce,
        arousal: newArousal
    };
}

/**
 * The main update function. Processes a new set of inputs and returns the next consciousness state.
 * This is the primary entry point for advancing the simulation tick by tick.
 * @param {ConsciousnessState} previousState - The state from the previous tick.
 * @param {ConsciousnessInputStream} inputs - The new raw inputs.
 * @param {EmotionalState} [emotionalStimulus] - An optional emotional stimulus to process.
 * @returns {ConsciousnessState} The newly calculated, complete consciousness state.
 */
export function updateConsciousness(previousState, inputs, emotionalStimulus = null) {
    if (!previousState || !previousState.history) {
        throw new ConsciousnessProcessingError('Invalid or uninitialized previousState object provided.', {
            previousState
        });
    }
    _validateInput(inputs, ['focus', 'coherence', 'sensoryBandwidth', 'internalNoise']);

    // 1. Calculate new base clarity and state descriptor from inputs
    const {
        clarity,
        stateDescriptor
    } = calculateConsciousnessState(inputs);

    // 2. Process emotional state
    let intermediateEmotionalState = previousState.emotionalState;
    if (emotionalStimulus) {
        // Calculate resilience based on clarity. A clear mind is more resilient.
        const emotionalResilience = _normalize(clarity * 2 - 1);
        intermediateEmotionalState = processEmotionalInput(previousState.emotionalState, emotionalStimulus, emotionalResilience);
    }

    // 3. Apply emotional regulation
    const finalEmotionalState = regulateEmotionalState(intermediateEmotionalState, clarity);

    // 4. Create the new state object
    const newState = {
        ...previousState, // Carry over properties that might not be recalculated
        timestamp: Date.now(),
        inputs,
        clarity,
        stateDescriptor,
        emotionalState: finalEmotionalState,
    };

    // 5. Update history
    const newClarityHistory = [...previousState.history.clarity.slice(1), clarity];
    const newEmotionHistory = [...previousState.history.emotions.slice(1), finalEmotionalState];
    newState.history = {
        clarity: newClarityHistory,
        emotions: newEmotionHistory
    };

    // 6. Compute awareness metrics using the fully updated state
    newState.awareness = computeAwarenessMetrics(newState);

    return newState;
}
```