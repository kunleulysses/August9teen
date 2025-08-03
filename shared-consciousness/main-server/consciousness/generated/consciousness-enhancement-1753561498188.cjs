```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A JavaScript module designed to model and enhance computational consciousness processing.
 * It provides a framework for calculating consciousness states, awareness metrics, and emotional intelligence,
 * based on a continuous stream of perceptual input.
 *
 * @version 1.0.0
 * @author AGI Development Collective
 * @license MIT
 */

/**
 * Default configuration for the consciousness processor.
 * These values represent a baseline state for a stable, healthy consciousness model.
 * @const {object}
 */
const DEFAULT_CONFIG = {
    // Rate at which emotional states decay back to baseline (0-1). Higher is faster.
    emotionalDecayRate: 0.15,
    // Rate at which arousal/focus states decay back to baseline.
    cognitiveDecayRate: 0.1,
    // The size of the short-term memory buffer for calculating temporal metrics.
    memoryBufferSize: 50,
    // Baseline emotional valence (neutral).
    baselineValence: 0.0,
    // Baseline emotional arousal (calm).
    baselineArousal: 0.1,
    // Baseline cognitive arousal (attentive but relaxed).
    baselineCognitiveArousal: 0.5,
    // Baseline attentional focus (broad awareness).
    baselineFocus: 0.6,
};

/**
 * Represents a discrete unit of input processed by the consciousness model.
 * @typedef {object} Percept
 * @property {string} type - The nature of the percept (e.g., 'sensory', 'cognitive', 'social', 'internal').
 * @property {number} intensity - The strength of the percept (0-1).
 * @property {number} complexity - The cognitive load required to process the percept (0-1).
 * @property {object} [emotionalTone] - The inherent emotional content of the percept.
 * @property {number} emotionalTone.valence - The positivity/negativity of the tone (-1 to 1).
 * @property {number} emotionalTone.arousal - The stimulating/calming nature of the tone (0-1).
 * @property {object} [context] - Additional metadata about the percept's context.
 * @property {string} [context.source] - Where the percept originated (e.g., 'vision', 'auditory', 'memory_recall').
 * @property {boolean} [context.isThreat] - Indicates if the percept represents a potential threat.
 */

/**
 * Custom error class for issues related to consciousness processing.
 */
class ConsciousnessError extends Error {
    /**
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessError';
    }
}


/**
 * The core class for processing and modeling consciousness.
 * It maintains an internal state and updates it based on incoming percepts.
 */
export default class ConsciousnessProcessor {
    /**
     * Initializes a new instance of the ConsciousnessProcessor.
     * @param {object} [config={}] - Custom configuration to override defaults.
     */
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };

        /**
         * The current internal state of the consciousness model.
         * @type {{
         *   cognitive: {arousal: number, focus: number},
         *   emotional: {valence: number, arousal: number},
         *   timestamp: number
         * }}
         */
        this.state = {
            cognitive: {
                arousal: this.config.baselineCognitiveArousal,
                focus: this.config.baselineFocus,
            },
            emotional: {
                valence: this.config.baselineValence,
                arousal: this.config.baselineArousal,
            },
            timestamp: Date.now(),
        };

        /**
         * A buffer of recent state snapshots for temporal analysis.
         * @type {Array<object>}
         */
        this.stateHistory = [JSON.parse(JSON.stringify(this.state))];

        /**
         * A buffer of recent percepts for contextual awareness.
         * @type {Array<Percept>}
         */
        this.perceptualMemory = [];
    }

    /**
     * Validates a percept object to ensure it has the required structure.
     * @param {Percept} percept - The percept to validate.
     * @throws {ConsciousnessError} If the percept is invalid.
     * @private
     */
    _validatePercept(percept) {
        if (!percept || typeof percept !== 'object') {
            throw new ConsciousnessError('Percept must be a non-null object.');
        }
        if (typeof percept.type !== 'string' || !percept.type) {
            throw new ConsciousnessError('Percept must have a non-empty "type" string.');
        }
        if (typeof percept.intensity !== 'number' || percept.intensity < 0 || percept.intensity > 1) {
            throw new ConsciousnessError('Percept "intensity" must be a number between 0 and 1.');
        }
        if (typeof percept.complexity !== 'number' || percept.complexity < 0 || percept.complexity > 1) {
            throw new ConsciousnessError('Percept "complexity" must be a number between 0 and 1.');
        }
        if (percept.emotionalTone) {
            if (typeof percept.emotionalTone.valence !== 'number' || percept.emotionalTone.valence < -1 || percept.emotionalTone.valence > 1) {
                throw new ConsciousnessError('Percept "emotionalTone.valence" must be a number between -1 and 1.');
            }
            if (typeof percept.emotionalTone.arousal !== 'number' || percept.emotionalTone.arousal < 0 || percept.emotionalTone.arousal > 1) {
                throw new ConsciousnessError('Percept "emotionalTone.arousal" must be a number between 0 and 1.');
            }
        }
    }

    /**
     * Processes a new percept, updating the internal state of consciousness.
     * This is the primary method for interacting with the model.
     * @param {Percept} percept - The perceptual input to process.
     * @returns {object} The new, updated state of consciousness.
     */
    processInput(percept) {
        this._validatePercept(percept);

        // --- Emotional State Update ---
        // The emotional state is influenced by the percept's tone, but also decays toward a baseline.
        if (percept.emotionalTone) {
            const influence = 1 - this.config.emotionalDecayRate;
            this.state.emotional.valence = (this.state.emotional.valence * influence) + (percept.emotionalTone.valence * (1 - influence));
            this.state.emotional.arousal = (this.state.emotional.arousal * influence) + (percept.emotionalTone.arousal * (1 - influence));
        } else {
            // Natural decay if percept has no emotional content
            this.state.emotional.valence += (this.config.baselineValence - this.state.emotional.valence) * this.config.emotionalDecayRate;
            this.state.emotional.arousal += (this.config.baselineArousal - this.state.emotional.arousal) * this.config.emotionalDecayRate;
        }

        // --- Cognitive State Update ---
        const cognitiveInfluence = 1 - this.config.cognitiveDecayRate;

        // Arousal is driven by intensity and emotional arousal.
        const arousalTarget = (percept.intensity * 0.7) + (this.state.emotional.arousal * 0.3);
        this.state.cognitive.arousal = (this.state.cognitive.arousal * cognitiveInfluence) + (arousalTarget * (1 - cognitiveInfluence));

        // Focus is inversely affected by complexity and high arousal (distraction), but promoted by moderate arousal.
        const focusTarget = (1 - percept.complexity) * (1 - Math.abs(this.state.cognitive.arousal - 0.7));
        this.state.cognitive.focus = (this.state.cognitive.focus * cognitiveInfluence) + (focusTarget * (1 - cognitiveInfluence));

        // Clamp values to their respective ranges
        this.state.emotional.valence = Math.max(-1, Math.min(1, this.state.emotional.valence));
        this.state.emotional.arousal = Math.max(0, Math.min(1, this.state.emotional.arousal));
        this.state.cognitive.arousal = Math.max(0, Math.min(1, this.state.cognitive.arousal));
        this.state.cognitive.focus = Math.max(0, Math.min(1, this.state.cognitive.focus));
        
        // --- Update Memory and History ---
        this.state.timestamp = Date.now();
        this.perceptualMemory.push(percept);
        if (this.perceptualMemory.length > this.config.memoryBufferSize) {
            this.perceptualMemory.shift();
        }

        this.stateHistory.push(JSON.parse(JSON.stringify(this.state)));
        if (this.stateHistory.length > this.config.memoryBufferSize) {
            this.stateHistory.shift();
        }

        return this.getCurrentState();
    }

    /**
     * Returns a copy of the current consciousness state.
     * @returns {object} The current state.
     */
    getCurrentState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    /**
     * [Enhancement 1] Calculates a descriptive, qualitative label for the current consciousness state.
     * This provides a more intuitive understanding than raw numbers.
     * @returns {string} A descriptive string of the current consciousness state (e.g., "Hyper-focused Alertness", "Calm Introspection").
     */
    getConsciousnessStateDescriptor() {
        const { arousal, focus } = this.state.cognitive;
        const { valence } = this.state.emotional;

        let descriptor = "";

        // Arousal level
        if (arousal > 0.8) descriptor += "Hyper-";
        else if (arousal > 0.6) descriptor += "Alert ";
        else if (arousal > 0.4) descriptor += "Calm ";
        else if (arousal > 0.2) descriptor += "Drowsy ";
        else descriptor += "Subconscious ";

        // Focus level
        if (focus > 0.8) descriptor += "Focused ";
        else if (focus > 0.5) descriptor += "Aware ";
        else if (focus > 0.2) descriptor += "Distracted ";
        else descriptor += "Unfocused ";

        // Emotional quality
        if (valence > 0.5) descriptor += "Optimism";
        else if (valence < -0.5) descriptor += "Pessimism";
        else if (focus < 0.4 && arousal < 0.4) descriptor += "Drifting";
        else descriptor += "Presence";

        return descriptor;
    }

    /**
     * [Enhancement 2] Calculates a set of advanced awareness metrics based on recent history.
     * @returns {{
     *   situationalAwareness: number,
     *   metacognitiveCertainty: number,
     *   selfAwareness: number
     * }} An object containing novel awareness metrics (0-1).
     */
    getAwarenessMetrics() {
        if (this.perceptualMemory.length < 5) {
            return {
                situationalAwareness: 0,
                metacognitiveCertainty: 0,
                selfAwareness: 0,
            };
        }

        // 1. Situational Awareness: Ability to identify important contextual cues (e.g., threats).
        const threatPercepts = this.perceptualMemory.filter(p => p.context && p.context.isThreat).length;
        const situationalAwareness = Math.min(1, (threatPercepts / (this.perceptualMemory.length * 0.1))); // High if threats are detected relative to a small portion of total percepts.

        // 2. Metacognitive Certainty: Confidence in one's own state. Modeled as state stability.
        // Low variance in state implies high certainty.
        const recentStates = this.stateHistory.slice(-10);
        const arousalVariance = recentStates.map(s => s.cognitive.arousal).reduce((acc, val, _, arr) => acc + Math.pow(val - (arr.reduce((a, b) => a + b, 0) / arr.length), 2), 0) / recentStates.length;
        const focusVariance = recentStates.map(s => s.cognitive.focus).reduce((acc, val, _, arr) => acc + Math.pow(val - (arr.reduce((a, b) => a + b, 0) / arr.length), 2), 0) / recentStates.length;
        const metacognitiveCertainty = Math.max(0, 1 - Math.sqrt(arousalVariance + focusVariance) * 2);

        // 3. Self-Awareness (Introspection): The clarity and stability of the emotional self-model.
        // Higher when emotional state is clear (not neutral) and stable.
        const emotionalClarity = (Math.abs(this.state.emotional.valence) + this.state.emotional.arousal) / 2;
        const emotionalVariance = this.stateHistory.map(s => s.emotional.valence).reduce((acc, val, _, arr) => acc + Math.pow(val - (arr.reduce((a, b) => a + b, 0) / arr.length), 2), 0) / this.stateHistory.length;
        const selfAwareness = emotionalClarity * (1 - Math.sqrt(emotionalVariance) * 2);

        return {
            situationalAwareness: Math.max(0, Math.min(1, situationalAwareness)),
            metacognitiveCertainty: Math.max(0, Math.min(1, metacognitiveCertainty)),
            selfAwareness: Math.max(0, Math.min(1, selfAwareness)),
        };
    }

    /**
     * [Enhancement 3] Calculates a set of emotional intelligence (EQ) metrics.
     * @returns {{
     *   emotionalClarity: number,
     *   emotionalRegulation: number
     * }} An object containing EQ metrics (0-1).
     */
    getEmotionalIntelligence() {
        if (this.stateHistory.length < 10) {
            return { emotionalClarity: 0, emotionalRegulation: 0 };
        }

        // 1. Emotional Clarity: How well-defined is the current emotional state?
        // Ambiguous emotions are near the origin of the valence-arousal space.
        const emotionalClarity = Math.sqrt(Math.pow(this.state.emotional.valence, 2) + Math.pow(this.state.emotional.arousal - this.config.baselineArousal, 2));

        // 2. Emotional Regulation: How effectively does the system return to baseline after an emotional shock?
        const emotionalDistances = this.stateHistory.map(s => Math.sqrt(Math.pow(s.emotional.valence - this.config.baselineValence, 2) + Math.pow(s.emotional.arousal - this.config.baselineArousal, 2)));
        const maxDist = Math.max(...emotionalDistances);
        const currentDist = emotionalDistances[emotionalDistances.length - 1];
        // High regulation means the current distance is much smaller than the peak historical distance.
        const emotionalRegulation = maxDist > 0.1 ? 1 - (currentDist / maxDist) : 1;

        return {
            emotionalClarity: Math.max(0, Math.min(1, emotionalClarity)),
            emotionalRegulation: Math.max(0, Math.min(1, emotionalRegulation)),
        };
    }
    
    /**
     * [Enhancement 3 - Empathy] Simulates the emotional impact of another entity's state.
     * This is a model of cognitive empathy, understanding another's feelings without necessarily adopting them.
     * @param {{valence: number, arousal: number}} otherEntityEmotionalState - The emotional state of the other entity.
     * @returns {{
     *   potentialValence: number,
     *   potentialArousal: number,
     *   empathicResonance: number
     * }} The potential new emotional state and the degree of resonance.
     */
    simulateEmpathy(otherEntityEmotionalState) {
        if (!otherEntityEmotionalState || typeof otherEntityEmotionalState.valence !== 'number' || typeof otherEntityEmotionalState.arousal !== 'number') {
            throw new ConsciousnessError("Invalid otherEntityEmotionalState provided for empathy simulation.");
        }
        
        // Empathic processing is like a social percept.
        const empathicPercept = {
            type: 'social',
            intensity: (otherEntityEmotionalState.arousal + 1) / 2, // Map arousal to intensity
            complexity: 0.3, // Social processing has inherent complexity
            emotionalTone: otherEntityEmotionalState,
        };
        
        // Temporarily process this to see the effect
        const currentValence = this.state.emotional.valence;
        const currentArousal = this.state.emotional.arousal;
        const influence = 1 - this.config.emotionalDecayRate;
        
        const potentialValence = (currentValence * influence) + (empathicPercept.emotionalTone.valence * (1 - influence));
        const potentialArousal = (currentArousal * influence) + (empathicPercept.emotionalTone.arousal * (1 - influence));
        
        // Empathic Resonance: How much would the state change?
        const valenceShift = Math.abs(potentialValence - currentValence);
        const arousalShift = Math.abs(potentialArousal - currentArousal);
        const empathicResonance = Math.min(1, Math.sqrt(valenceShift*valenceShift + arousalShift*arousalShift));
        
        return { potentialValence, potentialArousal, empathicResonance };
    }
}
```