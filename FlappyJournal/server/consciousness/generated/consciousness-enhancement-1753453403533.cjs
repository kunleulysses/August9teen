```javascript
/**
 * @module ConsciousnessEngine
 * @version 1.0.0
 * @description A sophisticated JavaScript module for simulating and enhancing consciousness processing.
 * This engine models consciousness through a multi-faceted approach, integrating state calculations,
 * awareness metrics, and advanced emotional intelligence. It's designed as a theoretical framework
 * for AI, robotics, or digital psychology research, providing a dynamic, production-ready simulation
 * of a conscious entity's inner world.
 *
 * NOTE: This is a conceptual and artistic implementation based on principles from neuroscience,
 * psychology, and philosophy of mind. It does not represent a biologically accurate model but
 * rather a functional simulation for creative and technical exploration.
 */

// --- UTILITY & HELPER FUNCTIONS ---

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum boundary.
 * @param {number} max - The maximum boundary.
 * @returns {number} The clamped value.
 */
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

/**
 * A sigmoid function for creating non-linear, smooth transitions.
 * Useful for modeling biological-like responses.
 * @param {number} x - The input value.
 * @returns {number} A value between 0 and 1.
 */
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

/**
 * Normalizes a value from a given range to a 0-1 scale.
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum of the original range.
 * @param {number} max - The maximum of the original range.
 * @returns {number} The normalized value.
 */
const normalize = (value, min, max) => (clamp(value, min, max) - min) / (max - min);


// --- CUSTOM ERROR HANDLING ---

/**
 * Custom error class for issues related to consciousness processing.
 * @class ConsciousnessProcessingError
 * @extends {Error}
 */
class ConsciousnessProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessProcessingError';
        this.timestamp = new Date().toISOString();
    }
}


// --- TYPE DEFINITIONS FOR DOCUMENTATION ---

/**
 * Represents biometric data inputs.
 * @typedef {object} BiometricData
 * @property {number} heartRate - Beats per minute (e.g., 40-180).
 * @property {number} galvanicSkinResponse - Microsiemens, indicates arousal (e.g., 1-20).
 * @property {number} corticalArousal - Simulated EEG-based arousal level (0 to 1).
 */

/**
 * Represents cognitive task performance inputs.
 * @typedef {object} CognitiveInput
 * @property {number} focusLevel - Performance on attention tasks (0 to 1).
 * @property {number} memoryRecallAccuracy - Accuracy of recent memory recall (0 to 1).
 * @property {number} problemSolvingSpeed - Inverse of time taken for a complex task (higher is better).
 */

/**
 * Represents an external or internal emotional stimulus.
 * Uses the Valence-Arousal-Dominance (VAD) model.
 * @typedef {object} EmotionalStimulus
 * @property {string} source - A descriptor for the stimulus (e.g., 'observed_face', 'internal_memory').
 * @property {number} valence - The pleasantness of the stimulus (-1 to 1).
 * @property {number} arousal - The intensity of the stimulus (-1 to 1).
 * @property {number} dominance - The sense of control related to the stimulus (-1 to 1).
 * @property {number} weight - The impact of this stimulus (0 to 1).
 */

/**
 * The core calculated state of consciousness.
 * @typedef {object} ConsciousnessState
 * @property {number} level - The overall level of consciousness (0=Coma, 1=Normal, >1=Heightened).
 * @property {number} clarity - The focus and coherence of conscious thought (0 to 1).
 * @property {number} qualiaRichness - The depth and complexity of subjective experience (0 to 1).
 */

/**
 * Advanced metrics for different facets of awareness.
 * @typedef {object} AwarenessMetrics
 * @property {number} interoceptiveFocus - Awareness of internal bodily states (0 to 1).
 * @property {number} exteroceptiveBandwidth - Capacity to process external sensory data (0 to 1).
 * @property {number} metacognitiveInsight - Ability to self-reflect on one's own mental state (0 to 1).
 */

/**
 * The state of the emotional intelligence subsystem.
 * @typedef {object} EmotionalIntelligence
 * @property {object} currentVAD - The current emotional state.
 * @property {number} currentVAD.valence - Current valence (-1 to 1).
 * @property {number} currentVAD.arousal - Current arousal (-1 to 1).
 * @property {number} currentVAD.dominance - Current dominance (-1 to 1).
 * @property {number} emotionalGranularity - Ability to differentiate between nuanced emotions (0 to 1).
 * @property {number} empathyResonance - Tendency to mirror perceived external emotions (0 to 1).
 * @property {number} regulationPotential - Ability to return to an emotional baseline (0 to 1).
 */


// --- THE MAIN ENGINE CLASS ---

class ConsciousnessEngine
 {
    /**
     * Initializes a new instance of the ConsciousnessEngine.
     * @param {object} [config={}] - Configuration for the engine's behavior.
     * @param {object} [config.emotionalBaseline={valence: 0, arousal: -0.2, dominance: 0.1}] - The default emotional state.
     * @param {number} [config.emotionalDecayRate=0.3] - How quickly emotions fade towards baseline per second.
     * @param {number} [config.empathyFactor=0.5] - The strength of empathetic resonance.
     * @param {number} [config.maxEmotionalHistory=50] - Number of past emotional states to track for granularity calculation.
     */
    constructor(config = {}) {
        this.config = {
            emotionalBaseline: { valence: 0.0, arousal: -0.2, dominance: 0.1 },
            emotionalDecayRate: 0.3,
            empathyFactor: 0.5,
            maxEmotionalHistory: 50,
            ...config
        };

        // --- INTERNAL STATE INITIALIZATION ---
        this.state = {
            consciousness: {
                level: 1.0,
                clarity: 1.0,
                qualiaRichness: 0.8,
            },
            awareness: {
                interoceptiveFocus: 0.5,
                exteroceptiveBandwidth: 0.8,
                metacognitiveInsight: 0.6,
            },
            emotion: {
                currentVAD: { ...this.config.emotionalBaseline },
                emotionalGranularity: 0.5,
                empathyResonance: this.config.empathyFactor,
                regulationPotential: 0.7,
            },
            // Private state for internal calculations
            _internal: {
                lastUpdateTimestamp: Date.now(),
                emotionalHistory: [JSON.stringify(this.config.emotionalBaseline)],
            }
        };
    }

    /**
     * The main processing function. Call this on a regular interval with new sensory data.
     * It updates all internal states based on the inputs and the passage of time.
     * @param {object} inputs - The combined inputs for the current processing tick.
     * @param {BiometricData} inputs.biometrics - Physiological data.
     * @param {CognitiveInput} inputs.cognitive - Cognitive performance data.
     * @param {EmotionalStimulus[]} [inputs.emotionalStimuli=[]] - Array of emotional events.
     * @throws {ConsciousnessProcessingError} If inputs are invalid.
     */
    processTick(inputs) {
        this._validateInputs(inputs);

        const now = Date.now();
        const deltaTime = (now - this.state._internal.lastUpdateTimestamp) / 1000; // Delta time in seconds
        this.state._internal.lastUpdateTimestamp = now;

        // The processing cascade: Emotions influence consciousness, which in turn gates awareness.
        this._updateEmotionalState(inputs.emotionalStimuli || [], deltaTime);
        this._updateConsciousnessState(inputs.biometrics, inputs.cognitive, deltaTime);
        this._updateAwarenessMetrics();
    }

    /**
     * Validates the structure and values of the input object.
     * @private
     * @param {object} inputs - The input object for processTick.
     */
    _validateInputs(inputs) {
        if (!inputs || typeof inputs !== 'object') {
            throw new ConsciousnessProcessingError('Inputs object is missing or not an object.');
        }
        if (!inputs.biometrics || !inputs.cognitive) {
            throw new ConsciousnessProcessingError('Biometrics and Cognitive inputs are required.');
        }
        if (typeof inputs.biometrics.heartRate !== 'number' || typeof inputs.biometrics.corticalArousal !== 'number') {
            throw new ConsciousnessProcessingError('Invalid biometric data format.');
        }
        if (typeof inputs.cognitive.focusLevel !== 'number' || typeof inputs.cognitive.memoryRecallAccuracy !== 'number') {
            throw new ConsciousnessProcessingError('Invalid cognitive data format.');
        }
    }

    /**
     * Updates the emotional intelligence state.
     * @private
     * @param {EmotionalStimulus[]} stimuli - An array of emotional stimuli.
     * @param {number} deltaTime - Time elapsed since the last update.
     */
    _updateEmotionalState(stimuli, deltaTime) {
        let weightedValence = 0;
        let weightedArousal = 0;
        let weightedDominance = 0;
        let totalWeight = 0;

        // Process incoming stimuli
        for (const stimulus of stimuli) {
            const weight = stimulus.weight || 1.0;
            // Apply empathy factor for external stimuli
            const empathyMod = stimulus.source.startsWith('internal') ? 1.0 : this.state.emotion.empathyResonance;
            weightedValence += stimulus.valence * weight * empathyMod;
            weightedArousal += stimulus.arousal * weight * empathyMod;
            weightedDominance += stimulus.dominance * weight * empathyMod;
            totalWeight += weight * empathyMod;
        }

        const { currentVAD } = this.state.emotion;
        const { emotionalBaseline, emotionalDecayRate } = this.config;

        // If there are new stimuli, move towards them
        if (totalWeight > 0) {
            const avgValence = weightedValence / totalWeight;
            const avgArousal = weightedArousal / totalWeight;
            const avgDominance = weightedDominance / totalWeight;
            
            currentVAD.valence += (avgValence - currentVAD.valence) * 0.5; // Move halfway
            currentVAD.arousal += (avgArousal - currentVAD.arousal) * 0.5;
            currentVAD.dominance += (avgDominance - currentVAD.dominance) * 0.5;
        }

        // Apply natural decay towards baseline (homeostasis)
        const decayFactor = 1 - (emotionalDecayRate * deltaTime);
        currentVAD.valence = currentVAD.valence * decayFactor + emotionalBaseline.valence * (1 - decayFactor);
        currentVAD.arousal = currentVAD.arousal * decayFactor + emotionalBaseline.arousal * (1 - decayFactor);
        currentVAD.dominance = currentVAD.dominance * decayFactor + emotionalBaseline.dominance * (1 - decayFactor);

        // Clamp values to ensure they stay within the -1 to 1 range
        currentVAD.valence = clamp(currentVAD.valence, -1, 1);
        currentVAD.arousal = clamp(currentVAD.arousal, -1, 1);
        currentVAD.dominance = clamp(currentVAD.dominance, -1, 1);
        
        this._updateEmotionalGranularity();
    }
    
    /**
     * Updates the emotional granularity metric based on historical emotional states.
     * @private
     */
    _updateEmotionalGranularity() {
        const { currentVAD } = this.state.emotion;
        const { emotionalHistory, maxEmotionalHistory } = this.config;
        
        // Discretize current state to avoid floating point noise
        const quantizedState = JSON.stringify({
            v: currentVAD.valence.toFixed(2),
            a: currentVAD.arousal.toFixed(2),
            d: currentVAD.dominance.toFixed(2)
        });

        // Add to history if it's a new distinct state
        if (this.state._internal.emotionalHistory[this.state._internal.emotionalHistory.length - 1] !== quantizedState) {
            this.state._internal.emotionalHistory.push(quantizedState);
        }
        
        // Keep history size bounded
        if (this.state._internal.emotionalHistory.length > maxEmotionalHistory) {
            this.state._internal.emotionalHistory.shift();
        }
        
        // Granularity is the ratio of unique states to total history size
        const uniqueStates = new Set(this.state._internal.emotionalHistory).size;
        this.state.emotion.emotionalGranularity = clamp(uniqueStates / this.state._internal.emotionalHistory.length, 0, 1);
    }

    /**
     * Updates the core consciousness state based on biometrics, cognition, and emotion.
     * @private
     * @param {BiometricData} biometrics - Physiological data.
     * @param {CognitiveInput} cognitive - Cognitive performance data.
     */
    _updateConsciousnessState(biometrics, cognitive) {
        const { consciousness, emotion } = this.state;
        const emotionalArousal = (emotion.currentVAD.arousal + 1) / 2; // Normalize to 0-1

        // 1. Calculate Consciousness Level (how "awake" the system is)
        // A combination of cortical arousal and physiological arousal.
        const arousalScore = (biometrics.corticalArousal * 0.7) + (normalize(biometrics.heartRate, 40, 180) * 0.3);
        consciousness.level = clamp(arousalScore * 1.5, 0, 2.0); // Allow for "heightened" states > 1

        // 2. Calculate Clarity (how "clear" the mental state is)
        // High cognitive focus improves clarity. Extreme emotional arousal (panic, rage) or very low arousal (drowsiness) reduces it.
        const emotionalClarityFactor = 1 - Math.abs(emotion.currentVAD.arousal); // Peak clarity at neutral arousal
        consciousness.clarity = clamp((cognitive.focusLevel * 0.6) + (emotionalClarityFactor * 0.4), 0, 1);
        
        // 3. Calculate Qualia Richness (the "vividness" of experience)
        // Richness is enhanced by moderate-to-high emotional and physiological arousal, and memory engagement.
        const richnessFromEmotion = sigmoid(emotion.currentVAD.arousal * 3); // Emphasize positive arousal
        const richnessFromCognition = cognitive.memoryRecallAccuracy;
        consciousness.qualiaRichness = clamp((richnessFromEmotion * 0.5) + (richnessFromCognition * 0.3) + (biometrics.galvanicSkinResponse / 20 * 0.2), 0, 1);
    }

    /**
     * Updates the advanced awareness metrics based on the current consciousness state.
     * @private
     */
    _updateAwarenessMetrics() {
        const { consciousness, awareness, emotion } = this.state;

        // 1. Interoceptive Focus (awareness of body)
        // Increases with low-to-moderate arousal and clarity. Reduced during intense external focus.
        const arousalFactor = 1 - Math.abs(emotion.currentVAD.arousal * 0.8); // Best when calm
        awareness.interoceptiveFocus = clamp(arousalFactor * consciousness.clarity, 0, 1);

        // 2. Exteroceptive Bandwidth (awareness of environment)
        // Directly tied to consciousness level and clarity.
        awareness.exteroceptiveBandwidth = clamp(consciousness.level * consciousness.clarity, 0, 1);

        // 3. Metacognitive Insight (self-reflection)
        // Requires high clarity, emotional regulation, and a sense of control (dominance).
        const emotionalStability = 1 - Math.abs(emotion.currentVAD.arousal);
        const controlFactor = (emotion.currentVAD.dominance + 1) / 2;
        awareness.metacognitiveInsight = clamp((consciousness.clarity * 0.5) + (emotionalStability * 0.3) + (controlFactor * 0.2), 0, 1);
        
        // Update regulation potential based on metacognition
        this.state.emotion.regulationPotential = awareness.metacognitiveInsight;
    }

    // --- PUBLIC GETTERS ---

    /**
     * Returns the current calculated consciousness state.
     * @returns {ConsciousnessState}
     */
    getConsciousnessState() {
        return { ...this.state.consciousness };
    }

    /**
     * Returns the current awareness metrics.
     * @returns {AwarenessMetrics}
     */
    getAwarenessMetrics() {
        return { ...this.state.awareness };
    }

    /**
     * Returns the current emotional intelligence state.
     * @returns {EmotionalIntelligence}
     */
    getEmotionalIntelligence() {
        // Exclude private properties from the returned object
        const { _internal, ...publicState } = this.state;
        return { ...publicState.emotion };
    }

    /**
     * Returns the complete public state of the engine.
     * @returns {{consciousness: ConsciousnessState, awareness: AwarenessMetrics, emotion: EmotionalIntelligence}}
     */
    getFullState() {
        return {
            consciousness: this.getConsciousnessState(),
            awareness: this.getAwarenessMetrics(),
            emotion: this.getEmotionalIntelligence(),
        };
    }
}
```
module.exports = for;
