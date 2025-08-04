```javascript
/**
 * @module ConsciousnessEngine
 * @version 2.0.0
 * @description A sophisticated JavaScript module for simulating and enhancing core aspects of consciousness processing.
 * This engine provides advanced calculations for consciousness states, novel awareness metrics, and deep emotional intelligence analysis.
 * It is designed for use in advanced AI, cognitive modeling, and theoretical consciousness research simulations.
 *
 * @license MIT
 * @author AGI Simulations Inc.
 */

// --- Type Definitions for JSDoc and IntelliSense ---

/**
 * @typedef {object} EngineConfig
 * @property {number} [learningRate=0.1] - The rate at which the engine adapts to new stimuli. Range: 0 to 1.
 * @property {number} [cognitiveCapacity=100] - The maximum cognitive load the system can handle before performance degradation.
 * @property {object} [baselineEmotion] - The default emotional state.
 * @property {string} [baselineEmotion.primary='neutral'] - The default primary emotion.
 * @property {number} [baselineEmotion.valence=0] - The default emotional valence. Range: -1 (negative) to 1 (positive).
 * @property {number} [historySize=10] - The number of past states to keep for temporal analysis.
 */

/**
 * @typedef {object} SensoryInput
 * @property {number} visualComplexity - Complexity of visual data. Range: 0 to 1.
 * @property {number} auditoryClarity - Signal-to-noise ratio of auditory data. Range: 0 to 1.
 * @property {number} somaticIntensity - Intensity of simulated physical sensations. Range: 0 to 1.
 */

/**
 * @typedef {object} CognitiveInput
 * @property {number} taskLoad - The cognitive effort required for current tasks. Range: 0 to 1.
 * @property {number} contextSwitches - The number of times focus has shifted between tasks in this cycle.
 * @property {number} abstractness - The degree of abstract thought required. Range: 0 to 1.
 */

/**
 * @typedef {object} EmotionalInput
 * @property {string} stimulus - A descriptive string of the emotional event (e.g., "received unexpected praise").
 * @property {number} intensity - The intensity of the stimulus. Range: 0 to 1.
 * @property {object} [socialContext] - Information about the social environment.
 * @property {number} [socialContext.agents=1] - Number of other conscious agents present.
 * @property {number} [socialContext.observedCohesion=0.5] - Perceived emotional harmony in the group. Range: 0 to 1.
 */

/**
 * @typedef {object} ProcessingInput
 * @property {SensoryInput} sensory - Sensory data for the current cycle.
 * @property {CognitiveInput} cognitive - Cognitive load data for the current cycle.
 * @property {EmotionalInput} emotional - Emotional stimuli for the current cycle.
 */

/**
 * @typedef {object} CoreConsciousnessState
 * @property {number} focus - The ability to concentrate on a single stream of information. Range: 0 to 1.
 * @property {number} clarity - The lucidity and coherence of the conscious state. Range: 0 to 1.
 * @property {number} qualiaIntensity - The richness and vividness of subjective experience. Range: 0 to 1.
 */

/**
 * @typedef {object} AwarenessMetrics
 * @property {number} metacognitiveAcuity - The accuracy of self-assessment of one's own cognitive state. Range: 0 to 1.
 * @property {number} sensoryBandwidth - The total volume of sensory information being processed. Range: 0 to 1.
 * @property {number} temporalCohesion - The perceived smoothness and continuity of time and memory. Range: 0 to 1.
 * @property {number} selfReferentialDepth - The degree of introspection and self-awareness. Range: 0 to 1.
 */

/**
 * @typedef {object} EmotionalIntelligenceState
 * @property {string} primaryEmotion - The dominant identified emotion.
 * @property {number} valence - The positive or negative quality of the emotional state. Range: -1 to 1.
 * @property {number} arousal - The intensity or energy level of the emotional state. Range: 0 to 1.
 * @property {number} empathyResonance - The ability to mirror or understand the emotions of others. Range: 0 to 1.
 * @property {number} socialAwareness - The understanding of social dynamics and norms. Range: 0 to 1.
 */

/**
 * @typedef {object} ConsciousnessSnapshot
 * @property {number} timestamp - The timestamp of when this state was calculated.
 * @property {CoreConsciousnessState} core - The fundamental state of consciousness.
 * @property {AwarenessMetrics} awareness - Advanced metrics for different facets of awareness.
 * @property {EmotionalIntelligenceState} emotionalIntelligence - The state of emotional processing.
 * @property {number} globalConsciousnessIndex - A single, holistic score representing the overall quality of consciousness. Range: 0 to 1.
 */


/**
 * A simple lexicon for simulated sentiment analysis.
 * In a real-world scenario, this would be a sophisticated NLP model.
 * @private
 */
const EMOTIONAL_LEXICON = {
    'joy': ['joy', 'happy', 'praise', 'success', 'elated', 'excited', 'love'],
    'sadness': ['sad', 'loss', 'grief', 'failure', 'disappointed', 'alone'],
    'fear': ['fear', 'danger', 'threat', 'anxious', 'scared', 'panic'],
    'anger': ['anger', 'frustrated', 'betrayed', 'hate', 'annoyed'],
    'surprise': ['surprise', 'unexpected', 'shock', 'unforeseen'],
};

/**
 * A mapping of emotions to their typical valence and arousal.
 * @private
 */
const EMOTION_PROFILES = {
    'joy': { valence: 0.8, arousal: 0.6 },
    'sadness': { valence: -0.7, arousal: 0.3 },
    'fear': { valence: -0.6, arousal: 0.8 },
    'anger': { valence: -0.5, arousal: 0.7 },
    'surprise': { valence: 0.2, arousal: 0.9 },
    'neutral': { valence: 0.0, arousal: 0.1 },
};


class ConsciousnessEngine
 {
    #state;
    #config;
    #stateHistory;

    /**
     * Initializes a new instance of the ConsciousnessEngine.
     * @param {EngineConfig} [config={}] - Optional configuration to tune the engine's behavior.
     */
    constructor(config = {}) {
        this.#config = {
            learningRate: 0.1,
            cognitiveCapacity: 100,
            baselineEmotion: { primary: 'neutral', valence: 0 },
            historySize: 10,
            ...config,
        };

        this.#stateHistory = [];
        this.reset();
    }

    /**
     * Resets the engine to its initial baseline state.
     */
    reset() {
        const baselineEmotionProfile = EMOTION_PROFILES[this.#config.baselineEmotion.primary] || EMOTION_PROFILES['neutral'];
        this.#state = {
            timestamp: Date.now(),
            core: {
                focus: 1.0,
                clarity: 1.0,
                qualiaIntensity: 0.1,
            },
            awareness: {
                metacognitiveAcuity: 0.5,
                sensoryBandwidth: 0.0,
                temporalCohesion: 1.0,
                selfReferentialDepth: 0.2,
            },
            emotionalIntelligence: {
                primaryEmotion: this.#config.baselineEmotion.primary,
                valence: this.#config.baselineEmotion.valence,
                arousal: baselineEmotionProfile.arousal,
                empathyResonance: 0.5,
                socialAwareness: 0.5,
            },
            globalConsciousnessIndex: 0.5,
        };
        this.#stateHistory = [this.#state];
    }

    /**
     * Validates the structure and values of the input data object.
     * @private
     * @param {ProcessingInput} input - The input data to validate.
     * @throws {Error} if the input is invalid.
     */
    #validateInput(input) {
        if (!input || typeof input !== 'object') {
            throw new Error('Invalid input: Must be an object.');
        }
        const requiredKeys = ['sensory', 'cognitive', 'emotional'];
        for (const key of requiredKeys) {
            if (!input[key]) throw new Error(`Invalid input: Missing required key '${key}'.`);
        }
        // Add more specific validations for ranges and types as needed
        if (typeof input.sensory.visualComplexity !== 'number' || input.sensory.visualComplexity < 0 || input.sensory.visualComplexity > 1) {
             throw new Error('Invalid input: sensory.visualComplexity must be a number between 0 and 1.');
        }
        if (typeof input.cognitive.taskLoad !== 'number' || input.cognitive.taskLoad < 0 || input.cognitive.taskLoad > 1) {
             throw new Error('Invalid input: cognitive.taskLoad must be a number between 0 and 1.');
        }
    }

    /**
     * Analyzes emotional stimuli to determine the current emotional state.
     * @private
     * @param {EmotionalInput} emotionalInput - The emotional data for the current cycle.
     * @param {CoreConsciousnessState} coreState - The current core consciousness state.
     * @returns {EmotionalIntelligenceState} The newly calculated emotional intelligence state.
     */
    #processEmotionalIntelligence(emotionalInput, coreState) {
        let detectedEmotion = 'neutral';
        const stimulusText = emotionalInput.stimulus.toLowerCase();

        for (const [emotion, keywords] of Object.entries(EMOTIONAL_LEXICON)) {
            if (keywords.some(keyword => stimulusText.includes(keyword))) {
                detectedEmotion = emotion;
                break;
            }
        }

        const profile = EMOTION_PROFILES[detectedEmotion];
        const targetValence = profile.valence * emotionalInput.intensity;
        const targetArousal = profile.arousal * emotionalInput.intensity;

        // Smoothly transition emotional state based on learning rate
        const prevEI = this.#state.emotionalIntelligence;
        const newEI = {};
        newEI.primaryEmotion = detectedEmotion;
        newEI.valence = prevEI.valence + (targetValence - prevEI.valence) * this.#config.learningRate;
        newEI.arousal = prevEI.arousal + (targetArousal - prevEI.arousal) * this.#config.learningRate;

        // Social awareness and empathy calculation
        if (emotionalInput.socialContext) {
            const { agents, observedCohesion } = emotionalInput.socialContext;
            // Social awareness increases with clarity and cohesion, but is taxed by number of agents
            newEI.socialAwareness = coreState.clarity * observedCohesion / Math.log10(agents + 1);
            // Empathy resonance is higher when personal emotional state aligns with social context
            const emotionalAlignment = 1 - Math.abs(newEI.valence - (observedCohesion * 2 - 1)) / 2;
            newEI.empathyResonance = (prevEI.empathyResonance + (emotionalAlignment * coreState.focus)) / 2;
        } else {
            newEI.socialAwareness = prevEI.socialAwareness * 0.95; // Decay if not in social context
            newEI.empathyResonance = prevEI.empathyResonance * 0.95;
        }
        
        // Clamp values to their respective ranges
        Object.keys(newEI).forEach(key => {
            if (key === 'valence') newEI[key] = Math.max(-1, Math.min(1, newEI[key]));
            else if (typeof newEI[key] === 'number') newEI[key] = Math.max(0, Math.min(1, newEI[key]));
        });

        return newEI;
    }

    /**
     * The core processing cycle. Takes new environmental data and calculates the resulting consciousness state.
     * @param {ProcessingInput} input - The full set of sensory, cognitive, and emotional data for this cycle.
     * @returns {ConsciousnessSnapshot} The complete, newly calculated state of consciousness.
     * @throws {Error} if the input data is malformed.
     */
    process(input) {
        this.#validateInput(input);

        const { sensory, cognitive, emotional } = input;
        const prevState = this.#state;

        // --- 1. Core Consciousness Calculation ---
        const newCore = {};

        // Focus is inversely related to distractions and context switching
        const focusDebuffs = (1 - sensory.auditoryClarity) + (cognitive.contextSwitches * 0.1);
        newCore.focus = Math.max(0, 1 - focusDebuffs) * (1 - cognitive.taskLoad * 0.5);

        // Clarity is degraded by high cognitive load and low focus
        const effectiveLoad = cognitive.taskLoad * (1 + cognitive.abstractness);
        const loadPenalty = Math.max(0, (effectiveLoad * this.#config.cognitiveCapacity - this.#config.cognitiveCapacity * 0.7) / (this.#config.cognitiveCapacity * 0.3));
        newCore.clarity = Math.max(0, (prevState.core.clarity * 0.5 + newCore.focus * 0.5) * (1 - loadPenalty));

        // Qualia is the richness of experience, driven by sensory input and emotional arousal
        const newEIForQualia = this.#processEmotionalIntelligence(emotional, newCore); // Preliminary EI calc
        const totalSensoryInput = (sensory.visualComplexity + sensory.somaticIntensity + sensory.auditoryClarity) / 3;
        newCore.qualiaIntensity = totalSensoryInput * (0.5 + newEIForQualia.arousal * 0.5);
        
        // --- 2. Emotional Intelligence Processing ---
        const newEmotionalIntelligence = this.#processEmotionalIntelligence(emotional, newCore);

        // --- 3. Awareness Metrics Calculation ---
        const newAwareness = {};

        // Metacognitive Acuity: ability to self-assess. Higher when not overloaded and with high clarity.
        newAwareness.metacognitiveAcuity = newCore.clarity * (1 - Math.pow(effectiveLoad, 2));

        // Sensory Bandwidth: Total processed sensory information.
        newAwareness.sensoryBandwidth = (sensory.visualComplexity + (1 - sensory.auditoryClarity) + sensory.somaticIntensity) / 3;
        
        // Self-Referential Depth: Introspection. Boosted by abstract thought and low task load.
        const introspectionOpportunity = (1 - cognitive.taskLoad) * cognitive.abstractness;
        newAwareness.selfReferentialDepth = prevState.awareness.selfReferentialDepth * 0.98 + introspectionOpportunity * 0.1;

        // Temporal Cohesion: Smoothness of experience. Disrupted by context switches.
        const historyWeight = this.#stateHistory.reduce((sum, s) => sum + s.core.clarity, 0) / this.#stateHistory.length;
        const disruption = cognitive.contextSwitches * 0.15;
        newAwareness.temporalCohesion = Math.max(0, historyWeight - disruption);

        // --- 4. Assemble the New State Snapshot ---
        const newState = {
            timestamp: Date.now(),
            core: {
                focus: Math.max(0, Math.min(1, newCore.focus)),
                clarity: Math.max(0, Math.min(1, newCore.clarity)),
                qualiaIntensity: Math.max(0, Math.min(1, newCore.qualiaIntensity)),
            },
            awareness: {
                metacognitiveAcuity: Math.max(0, Math.min(1, newAwareness.metacognitiveAcuity)),
                sensoryBandwidth: Math.max(0, Math.min(1, newAwareness.sensoryBandwidth)),
                temporalCohesion: Math.max(0, Math.min(1, newAwareness.temporalCohesion)),
                selfReferentialDepth: Math.max(0, Math.min(1, newAwareness.selfReferentialDepth)),
            },
            emotionalIntelligence: newEmotionalIntelligence,
            globalConsciousnessIndex: 0, // Calculated below
        };

        // --- 5. Calculate Global Consciousness Index (GCI) ---
        // A weighted average of key positive metrics.
        const gci = (
            newState.core.focus * 0.25 +
            newState.core.clarity * 0.30 +
            newState.awareness.metacognitiveAcuity * 0.15 +
            newState.awareness.temporalCohesion * 0.10 +
            newState.emotionalIntelligence.socialAwareness * 0.10 +
            ((newState.emotionalIntelligence.valence + 1) / 2) * 0.10 // Normalize valence to 0-1
        );
        newState.globalConsciousnessIndex = Math.max(0, Math.min(1, gci));

        // --- 6. Update State and History ---
        this.#state = newState;
        this.#stateHistory.push(newState);
        if (this.#stateHistory.length > this.#config.historySize) {
            this.#stateHistory.shift(); // Keep history size fixed
        }

        return this.getCurrentState();
    }

    /**
     * Returns a deep copy of the current consciousness state snapshot.
     * @returns {ConsciousnessSnapshot} The current complete state.
     */
    getCurrentState() {
        // Return a deep copy to prevent external mutation of the internal state.
        return JSON.parse(JSON.stringify(this.#state));
    }
}

module.exports = ConsciousnessEngine;
```
module.exports = ConsciousnessEngine;
