```javascript
/**
 * @module ConsciousnessAura
 * @description A sophisticated JavaScript module for simulating and enhancing core aspects of consciousness.
 * This module provides a framework for processing sensory, cognitive, and physiological inputs
 * to compute advanced metrics for consciousness state, multi-faceted awareness, and emotional intelligence.
 * It is designed to be a "production-ready" simulation core for applications in AI character development,
 * digital wellness, and theoretical cognitive modeling.
 *
 * @version 2.0.0
 * @author AGI Simulation Collective
 * @license MIT
 */

// --- Custom Error Types for Clearer Diagnostics ---

/**
 * @class ConsciousnessProcessingError
 * @extends Error
 * @description Custom error for issues arising during the consciousness calculation pipeline.
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
 * @extends Error
 * @description Custom error for malformed or incomplete input data.
 */
class InvalidInputError extends Error {
    constructor(message, missingFields = []) {
        super(message);
        this.name = 'InvalidInputError';
        this.missingFields = missingFields;
    }
}


// --- Core Constants and Configuration ---

const DEFAULTS = {
    HISTORY_LENGTH: 50, // Number of past states to remember for trend analysis
    REGULATION_FACTOR: 0.1, // How strongly the system self-regulates emotion (0 to 1)
    EMPATHY_FACTOR: 0.25, // How strongly the system resonates with external emotions (0 to 1)
    QUANTUM_FLUCTUATION_INTENSITY: 0.01 // A small, random factor to prevent deterministic loops
};

const CONSCIOUSNESS_STATES = {
    DEEP_SLEEP: 'DEEP_SLEEP',
    DREAMING: 'DREAMING',
    MEDITATIVE: 'MEDITATIVE',
    DISTRACTED: 'DISTRACTED',
    FOCUSED: 'FOCUSED',
    FLOW: 'FLOW',
    HYPER_AWARE: 'HYPER_AWARE'
};

const EMOTIONAL_LABELS = {
    // Valence (V) and Arousal (A) mappings
    // Format: [minV, maxV, minA, maxA]
    SERENE: [0.5, 1.0, 0.0, 0.5],
    HAPPY: [0.5, 1.0, 0.5, 1.0],
    ANXIOUS: [-0.7, 0.0, 0.6, 1.0],
    BORED: [-0.6, 0.0, 0.0, 0.4],
    SAD: [-1.0, -0.5, 0.0, 0.5],
    ANGRY: [-1.0, -0.5, 0.6, 1.0],
    NEUTRAL: [-0.2, 0.2, 0.3, 0.7]
};


/**
 * The main class representing a single stream of consciousness.
 * It maintains state, processes inputs, and generates high-level cognitive metrics.
 * @class ConsciousnessAura
 */
export class ConsciousnessAura {
    /**
     * @constructor
     * @param {object} [config={}] - Configuration options.
     * @param {number} [config.historyLength=50] - Number of past states to maintain.
     * @param {number} [config.regulationFactor=0.1] - Strength of emotional self-regulation.
     * @param {number} [config.empathyFactor=0.25] - Strength of emotional resonance.
     * @param {number} [config.fluctuationIntensity=0.01] - Magnitude of random state fluctuation.
     */
    constructor(config = {}) {
        this.config = { ...DEFAULTS,
            ...config
        };

        this.stateHistory = [];
        this.currentState = this._getInitialState();

        console.log("ConsciousnessAura instantiated. Ready to process reality stream.");
    }

    /**
     * Generates the default initial state for the consciousness stream.
     * @private
     * @returns {object} The initial state object.
     */
    _getInitialState() {
        return {
            timestamp: Date.now(),
            consciousnessState: CONSCIOUSNESS_STATES.MEDITATIVE,
            awareness: {
                self: 0.5, // Introspection, understanding of own state
                situational: 0.5, // Perception of external environment
                somatic: 0.5, // Perception of internal "body" state
                metacognitive: 0.1 // Awareness of being aware, confidence in own thoughts
            },
            emotion: {
                valence: 0.0, // Pleasantness (-1) to Unpleasantness (1)
                arousal: 0.2, // Intensity/Energy from Calm (0) to Excited (1)
                label: 'NEUTRAL'
            },
            cognitiveLoad: 0.1,
            focusQuotient: 0.5,
            rawInput: null
        };
    }

    /**
     * The primary method to process a new "moment" of experience.
     * It takes raw input, validates it, and runs the full consciousness processing pipeline.
     *
     * @param {object} input - An object containing data for the current moment.
     * @param {object} input.sensory - Data from external senses.
     * @param {number} input.sensory.clarity - Normalized clarity of sensory input (0-1).
     * @param {number} input.sensory.complexity - Normalized complexity of sensory input (0-1).
     * @param {object} input.cognitive - Data about internal thought processes.
     * @param {number} input.cognitive.load - Current mental workload (0-1).
     * @param {number} input.cognitive.taskAffinity - How engaging the current task is (0-1).
     * @param {object} [input.physiological] - Simulated physiological markers.
     * @param {number} [input.physiological.hrv=0.5] - Heart Rate Variability, higher is calmer (0-1).
     * @param {number} [input.physiological.gsr=0.1] - Galvanic Skin Response, higher is more aroused (0-1).
     * @returns {object} The newly calculated, complete state of consciousness.
     * @throws {InvalidInputError} If the input object is malformed.
     */
    process(input) {
        try {
            this._validateInput(input);

            // Create a new state object based on the previous state
            const newState = JSON.parse(JSON.stringify(this.currentState));
            newState.timestamp = Date.now();
            newState.rawInput = input;
            newState.cognitiveLoad = input.cognitive.load;

            // --- Pipeline Execution ---
            this._updateEmotionalState(newState, input);
            this._applyEmotionalRegulation(newState);
            this._updateAwarenessMetrics(newState, input);
            this._updateConsciousnessState(newState, input);
            this._introduceQuantumFluctuation(newState);

            this._updateHistory(newState);
            this.currentState = newState;

            return this.getFullState();

        } catch (error) {
            if (error instanceof InvalidInputError) {
                throw error; // Re-throw for the caller to handle
            }
            // Wrap other errors for context
            throw new ConsciousnessProcessingError(`Failed during consciousness pipeline: ${error.message}`);
        }
    }

    /**
     * Simulates an empathetic response to an external emotional state.
     * @param {object} externalEmotion - The emotional state of an external entity.
     * @param {number} externalEmotion.valence - The valence of the external entity.
     * @param {number} externalEmotion.arousal - The arousal of the external entity.
     */
    resonateWith(externalEmotion) {
        if (typeof externalEmotion?.valence !== 'number' || typeof externalEmotion?.arousal !== 'number') {
            throw new InvalidInputError("External emotion must have numeric valence and arousal properties.");
        }

        const {
            valence,
            arousal
        } = this.currentState.emotion;
        const {
            empathyFactor
        } = this.config;

        // Move own emotion slightly towards the external emotion
        this.currentState.emotion.valence += (externalEmotion.valence - valence) * empathyFactor;
        this.currentState.emotion.arousal += (externalEmotion.arousal - arousal) * empathyFactor;

        this._clampEmotion();
        this.currentState.emotion.label = this._getEmotionalLabel(this.currentState.emotion);
        console.log(`Resonated with external emotion. New V/A: ${this.currentState.emotion.valence.toFixed(2)}/${this.currentState.emotion.arousal.toFixed(2)}`);
    }

    /**
     * Validates the structure and types of the input object.
     * @private
     */
    _validateInput(input) {
        const required = {
            'sensory.clarity': 'number',
            'sensory.complexity': 'number',
            'cognitive.load': 'number',
            'cognitive.taskAffinity': 'number'
        };
        const missing = [];

        for (const path in required) {
            const keys = path.split('.');
            let current = input;
            let key;
            while ((key = keys.shift())) {
                if (current === undefined || current === null || typeof current[key] === 'undefined') {
                    missing.push(path);
                    break;
                }
                current = current[key];
            }
            if (missing.includes(path)) continue;

            if (typeof current !== required[path]) {
                throw new InvalidInputError(`Invalid type for '${path}'. Expected '${required[path]}', got '${typeof current}'.`);
            }
            if (current < 0 || current > 1) {
                throw new InvalidInputError(`Value for '${path}' must be between 0 and 1.`);
            }
        }

        if (missing.length > 0) {
            throw new InvalidInputError('Input data is missing required fields.', missing);
        }
    }

    /**
     * Updates the emotional state (valence and arousal) based on inputs.
     * @private
     */
    _updateEmotionalState(state, input) {
        const {
            cognitive
        } = input;
        const hrv = input.physiological?.hrv ?? 0.5; // Default if not provided
        const gsr = input.physiological?.gsr ?? 0.1;

        // Valence is influenced by task enjoyment and cognitive ease
        const valenceDelta = (cognitive.taskAffinity - 0.5) * 0.2 - (cognitive.load - 0.5) * 0.1;
        state.emotion.valence += valenceDelta;

        // Arousal is influenced by cognitive load and physiological markers
        const arousalDelta = (cognitive.load * 0.2) + (gsr * 0.15) - ((hrv - 0.5) * 0.2);
        state.emotion.arousal += arousalDelta;

        this._clampEmotion(state);
        state.emotion.label = this._getEmotionalLabel(state.emotion);
    }

    /**
     * Applies a gentle "pull" towards a more neutral emotional state, simulating self-regulation.
     * The strength is determined by metacognitive awareness.
     * @private
     */
    _applyEmotionalRegulation(state) {
        const regulationStrength = this.config.regulationFactor * state.awareness.metacognitive;

        // Regulate towards a baseline (e.g., slightly positive valence, low arousal)
        const targetValence = 0.1;
        const targetArousal = 0.3;

        state.emotion.valence += (targetValence - state.emotion.valence) * regulationStrength;
        state.emotion.arousal += (targetArousal - state.emotion.arousal) * regulationStrength;
    }

    /**
     * Updates all awareness metrics based on the current state and inputs.
     * @private
     */
    _updateAwarenessMetrics(state, input) {
        const {
            sensory,
            cognitive
        } = input;
        const hrv = input.physiological?.hrv ?? 0.5;

        // Situational Awareness: High with clear, moderate complexity input
        state.awareness.situational = sensory.clarity * (1 - Math.abs(sensory.complexity - 0.5));

        // Somatic Awareness: High with high HRV (calm nervous system) and low cognitive load
        state.awareness.somatic = hrv * (1 - cognitive.load);

        // Self Awareness: Consistency between emotion and situation.
        // e.g., feeling good (high valence) when task affinity is high.
        const emotionalCongruence = 1 - Math.abs(state.emotion.valence - (cognitive.taskAffinity - 0.5));
        state.awareness.self = (state.awareness.self * 0.8) + (emotionalCongruence * 0.2); // Smooth over time

        // Metacognitive Awareness: Emerges from stable, high overall awareness.
        const totalAwareness = (state.awareness.situational + state.awareness.somatic + state.awareness.self) / 3;
        const stability = this._calculateStateStability();
        state.awareness.metacognitive = totalAwareness * stability * (1 - cognitive.load);

        // Clamp all awareness values
        for (const key in state.awareness) {
            state.awareness[key] = Math.max(0, Math.min(1, state.awareness[key]));
        }
    }

    /**
     * Calculates the primary consciousness state by scoring potential states.
     * @private
     */
    _updateConsciousnessState(state, input) {
        const {
            awareness,
            emotion,
            cognitiveLoad
        } = state;
        const {
            taskAffinity
        } = input.cognitive;

        // Calculate a "focus quotient"
        state.focusQuotient = (awareness.situational * 0.5 + awareness.self * 0.3 + (1 - cognitiveLoad) * 0.2);

        // Score each possible state
        const scores = {
            [CONSCIOUSNESS_STATES.DEEP_SLEEP]: (1 - emotion.arousal) * (1 - awareness.situational) * 0.5,
            [CONSCIOUSNESS_STATES.DREAMING]: emotion.arousal * (1 - awareness.situational) * 0.7,
            [CONSCIOUSNESS_STATES.MEDITATIVE]: awareness.somatic * awareness.self * (1 - cognitiveLoad) * (1 - emotion.arousal),
            [CONSCIOUSNESS_STATES.DISTRACTED]: cognitiveLoad * (1 - state.focusQuotient) * emotion.arousal,
            [CONSCIOUSNESS_STATES.FOCUSED]: state.focusQuotient * (1 - awareness.somatic) * taskAffinity,
            [CONSCIOUSNESS_STATES.HYPER_AWARE]: awareness.situational * awareness.metacognitive * emotion.arousal,
        };

        // The "Flow" state is special and requires a unique combination of factors
        const isFlowPossible = state.focusQuotient > 0.7 &&
            cognitiveLoad > 0.5 &&
            cognitiveLoad < 0.9 &&
            taskAffinity > 0.8 &&
            awareness.self > 0.6 &&
            Math.abs(emotion.valence) < 0.3; // Not distracted by strong emotions

        scores[CONSCIOUSNESS_STATES.FLOW] = isFlowPossible ? state.focusQuotient * taskAffinity : 0;

        // Determine the dominant state
        let maxScore = -1;
        let dominantState = CONSCIOUSNESS_STATES.DISTRACTED;
        for (const S in scores) {
            if (scores[S] > maxScore) {
                maxScore = scores[S];
                dominantState = S;
            }
        }
        state.consciousnessState = dominantState;
    }

    /**
     * Introduces a small amount of non-determinism to prevent the model from getting stuck.
     * This simulates the inherent unpredictability of thought.
     * @private
     */
    _introduceQuantumFluctuation(state) {
        const intensity = this.config.QUANTUM_FLUCTUATION_INTENSITY;
        state.emotion.valence += (Math.random() - 0.5) * intensity;
        state.emotion.arousal += (Math.random() - 0.5) * intensity;
        state.awareness.self += (Math.random() - 0.5) * intensity / 2;
        this._clampEmotion(state);
    }

    /**
     * Adds the new state to the history and trims the history to the configured length.
     * @private
     */
    _updateHistory(newState) {
        this.stateHistory.push(newState);
        if (this.stateHistory.length > this.config.historyLength) {
            this.stateHistory.shift();
        }
    }

    /**
     * Calculates the stability of the consciousness state over the recent history.
     * @returns {number} A stability score from 0 (chaotic) to 1 (stable).
     * @private
     */
    _calculateStateStability() {
        if (this.stateHistory.length < 10) return 0.5; // Not enough data for a meaningful calculation

        const recentStates = this.stateHistory.slice(-10);
        let changes = 0;
        for (let i = 1; i < recentStates.length; i++) {
            if (recentStates[i].consciousnessState !== recentStates[i - 1].consciousnessState) {
                changes++;
            }
        }
        return 1 - (changes / (recentStates.length - 1));
    }

    /**
     * Maps a valence/arousal pair to a descriptive emotional label.
     * @private
     */
    _getEmotionalLabel(emotion) {
        for (const label in EMOTIONAL_LABELS) {
            const [minV, maxV, minA, maxA] = EMOTIONAL_LABELS[label];
            if (emotion.valence >= minV && emotion.valence <= maxV &&
                emotion.arousal >= minA && emotion.arousal <= maxA) {
                return label;
            }
        }
        return 'AMBIGUOUS';
    }

    /**
     * Ensures emotion values stay within their valid ranges.
     * @private
     */
    _clampEmotion(state = this) {
        state.emotion.valence = Math.max(-1, Math.min(1, state.emotion.valence));
        state.emotion.arousal = Math.max(0, Math.min(1, state.emotion.arousal));
    }

    // --- Public Getters for Easy Access ---

    /**
     * Returns the full, current state of the consciousness aura.
     * @returns {object} A deep copy of the current state.
     */
    getFullState() {
        return JSON.parse(JSON.stringify(this.currentState));
    }

    /**
     * Gets the recent history of consciousness states.
     * @returns {Array<object>} A copy of the state history array.
     */
    getHistory() {
        return JSON.parse(JSON.stringify(this.stateHistory));
    }
}
```