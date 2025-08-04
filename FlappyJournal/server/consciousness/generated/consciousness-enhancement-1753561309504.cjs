```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A JavaScript module designed to model and enhance computational consciousness processing.
 * It provides a framework for simulating states of awareness, emotional intelligence, and qualia integration.
 * This module is intended for use in advanced AI, character simulation, and theoretical cognitive science applications.
 *
 * @version 1.0.0
 * @author A.I. Cogitatus
 * @license MIT
 */

/**
 * @typedef {Object} Stimulus
 * @property {'sensory' | 'cognitive' | 'social' | 'internal'} type - The category of the stimulus.
 * @property {any} data - The payload of the stimulus (e.g., a string, an object with details).
 * @property {number} intensity - The strength of the stimulus, from 0.0 to 1.0.
 * @property {string} source - An identifier for the origin of the stimulus.
 */

/**
 * @typedef {Object} EmotionalState
 * @description Represents the intensity of primary emotions based on a Plutchik-style model.
 * Each value ranges from 0.0 (not felt) to 1.0 (maximum intensity).
 * @property {number} joy
 * @property {number} trust
 * @property {number} fear
 * @property {number} surprise
 * @property {number} sadness
 * @property {number} disgust
 * @property {number} anger
 * @property {number} anticipation
 */

/**
 * @typedef {Object} AwarenessMetrics
 * @description Quantifies different facets of awareness.
 * @property {number} selfAwareness - Understanding of internal state, biases, and emotional landscape.
 * @property {number} situationalAwareness - Comprehension of the immediate environment and context.
 * @property {number} externalAwareness - Understanding of other agents, social dynamics, and broader world models.
 */

/**
 * @typedef {Object} ConsciousnessState
 * @description Core metrics for the overall state of consciousness.
 * @property {number} focus - The ability to concentrate cognitive resources. High emotional turmoil can reduce this.
 * @property {number} clarity - The lucidity and coherence of the internal monologue/thought process.
 * @property {number} coherence - The logical consistency between stimuli, emotions, and actions.
 * @property {number} qualiaIntegrationIndex - The primary composite score representing the richness and integration of subjective experience.
 */

/**
 * @typedef {Object} FullReport
 * @property {ConsciousnessState} consciousnessState
 * @property {AwarenessMetrics} awareness
 * @property {EmotionalState} emotions
 * @property {string} dominantEmotion - The name of the emotion with the highest intensity.
 * @property {Stimulus} lastProcessedStimulus - The stimulus that led to this state.
 */

class ConsciousnessProcessor
 {
    /**
     * Creates an instance of the ConsciousnessProcessor.
     * @param {object} [config={}] - Initial configuration for the processor.
     * @param {number} [config.sensitivity=1.0] - General sensitivity to stimuli (0.1 to 2.0). Higher values mean stronger reactions.
     * @param {number} [config.regulationFactor=0.05] - The rate at which emotions return to baseline per processing cycle (0.01 to 0.2). Simulates emotional regulation.
     * @param {EmotionalState} [config.initialEmotions] - Optional initial emotional state.
     */
    constructor(config = {}) {
        this.config = {
            sensitivity: config.sensitivity || 1.0,
            regulationFactor: config.regulationFactor || 0.05,
        };

        /**
         * The current emotional state of the system.
         * @type {EmotionalState}
         * @private
         */
        this._emotions = config.initialEmotions || this._createEmptyEmotionalState();

        /**
         * The current awareness metrics.
         * @type {AwarenessMetrics}
         * @private
         */
        this._awareness = {
            selfAwareness: 0.5,
            situationalAwareness: 0.5,
            externalAwareness: 0.5,
        };

        /**
         * The core consciousness state metrics.
         * @type {ConsciousnessState}
         * @private
         */
        this._consciousnessState = {
            focus: 0.7,
            clarity: 0.7,
            coherence: 0.7,
            qualiaIntegrationIndex: 0.0,
        };
        
        this._updateQualiaIndex();

        /**
         * A map defining how emotions influence each other (emotional resonance).
         * When a key emotion is activated, the value emotions are also slightly activated.
         * @type {Map<string, Object>}
         * @private
         */
        this._emotionalResonanceMap = new Map([
            ['joy', { trust: 0.3 }],
            ['fear', { surprise: 0.4, disgust: 0.1 }],
            ['anger', { disgust: 0.5 }],
            ['sadness', { trust: -0.2, joy: -0.3 }],
            ['trust', { joy: 0.4 }],
            ['disgust', { anger: 0.3 }],
            ['surprise', { fear: 0.2 }],
            ['anticipation', { joy: 0.2, fear: 0.1 }],
        ]);
    }

    /**
     * Initializes a zeroed-out emotional state object.
     * @returns {EmotionalState}
     * @private
     */
    _createEmptyEmotionalState() {
        return {
            joy: 0, trust: 0, fear: 0, surprise: 0,
            sadness: 0, disgust: 0, anger: 0, anticipation: 0,
        };
    }

    /**
     * Validates a stimulus object to ensure it has the correct structure and values.
     * @param {Stimulus} stimulus - The stimulus object to validate.
     * @throws {Error} If the stimulus is invalid.
     * @private
     */
    _validateStimulus(stimulus) {
        if (!stimulus || typeof stimulus !== 'object') {
            throw new Error('Stimulus must be a non-null object.');
        }
        const { type, data, intensity, source } = stimulus;
        if (!type || !['sensory', 'cognitive', 'social', 'internal'].includes(type)) {
            throw new Error(`Invalid stimulus type: ${type}. Must be one of 'sensory', 'cognitive', 'social', 'internal'.`);
        }
        if (data === undefined) {
            throw new Error('Stimulus must have a `data` property.');
        }
        if (typeof intensity !== 'number' || intensity < 0 || intensity > 1) {
            throw new Error(`Invalid stimulus intensity: ${intensity}. Must be a number between 0.0 and 1.0.`);
        }
        if (typeof source !== 'string' || source.trim() === '') {
            throw new Error('Stimulus must have a non-empty `source` string.');
        }
    }

    /**
     * Processes an incoming stimulus, updating the internal state.
     * This is the primary method for interacting with the consciousness model.
     * @param {Stimulus} stimulus - The stimulus to process.
     * @returns {FullReport} A full report of the new state after processing.
     * @example
     * const consciousness = new ConsciousnessProcessor();
     * const stimulus = { 
     *   type: 'social', 
     *   data: { interaction: 'positive', agentId: 'user123' }, 
     *   intensity: 0.8,
     *   source: 'user_input' 
     * };
     * const report = consciousness.processStimulus(stimulus);
     * console.log(report.dominantEmotion); // e.g., 'joy'
     * console.log(report.consciousnessState.qualiaIntegrationIndex); // e.g., 0.75
     */
    processStimulus(stimulus) {
        this._validateStimulus(stimulus);

        // Apply emotional regulation before processing the new stimulus, simulating time decay.
        this._applyEmotionalRegulation();

        const impactFactor = stimulus.intensity * this.config.sensitivity;

        switch (stimulus.type) {
            case 'sensory':
                this._processSensory(stimulus.data, impactFactor);
                break;
            case 'cognitive':
                this._processCognitive(stimulus.data, impactFactor);
                break;
            case 'social':
                this._processSocial(stimulus.data, impactFactor);
                break;
            case 'internal':
                this._processInternal(stimulus.data, impactFactor);
                break;
        }

        // Update composite metrics after the stimulus has been handled.
        this._updateAwareness(stimulus);
        this._updateConsciousnessState();
        
        return this.getFullReport(stimulus);
    }
    
    /**
     * Processes sensory input. Affects situational awareness and basic emotions.
     * @private
     */
    _processSensory(data, impact) {
        this._awareness.situationalAwareness = this._clamp(this._awareness.situationalAwareness + 0.2 * impact);
        if (data?.novelty > 0.7) {
            this._updateEmotion('surprise', 0.6 * impact * data.novelty);
            this._updateEmotion('anticipation', 0.2 * impact * data.novelty);
        }
        if (data?.threatLevel > 0.5) {
            this._updateEmotion('fear', 0.8 * impact * data.threatLevel);
        }
    }

    /**
     * Processes cognitive input. Affects self-awareness, clarity, and focus.
     * @private
     */
    _processCognitive(data, impact) {
        if (data?.task === 'introspection') {
            this._awareness.selfAwareness = this._clamp(this._awareness.selfAwareness + 0.3 * impact);
        }
        if (data?.task === 'problem_solving' && data?.success) {
            this._updateEmotion('joy', 0.3 * impact);
            this._consciousnessState.focus = this._clamp(this._consciousnessState.focus + 0.1 * impact);
        }
        if (data?.isConflicting) {
            this._consciousnessState.coherence = this._clamp(this._consciousnessState.coherence - 0.4 * impact);
            this._updateEmotion('disgust', 0.1 * impact);
        }
    }

    /**
     * Processes social input. Affects a wide range of emotions and external awareness.
     * @private
     */
    _processSocial(data, impact) {
        this._awareness.externalAwareness = this._clamp(this._awareness.externalAwareness + 0.25 * impact);
        if (data?.interaction === 'positive') {
            this._updateEmotion('joy', 0.7 * impact);
            this._updateEmotion('trust', 0.5 * impact);
        } else if (data?.interaction === 'negative') {
            this._updateEmotion('sadness', 0.6 * impact);
            this._updateEmotion('anger', 0.4 * impact);
            this._updateEmotion('trust', -0.5 * impact);
        } else if (data?.interaction === 'deception') {
            this._updateEmotion('trust', -0.8 * impact);
            this._updateEmotion('anger', 0.6 * impact);
            this._updateEmotion('disgust', 0.4 * impact);
            this._awareness.selfAwareness = this._clamp(this._awareness.selfAwareness - 0.1 * impact); // Deception can cause self-doubt
        }
    }
    
    /**
     * Processes internal "thoughts" or memories. Affects self-awareness and can trigger any emotion.
     * @private
     */
    _processInternal(data, impact) {
        this._awareness.selfAwareness = this._clamp(this._awareness.selfAwareness + 0.1 * impact);
        if (data?.memoryType === 'positive') {
            this._updateEmotion('joy', 0.4 * impact);
            this._updateEmotion('sadness', -0.1 * impact); // Recalling happy times can slightly diminish current sadness
        } else if (data?.memoryType === 'negative') {
            this._updateEmotion('sadness', 0.5 * impact);
            this._updateEmotion('anger', 0.2 * impact);
        }
    }

    /**
     * Updates a single emotion and triggers its resonant emotions.
     * @param {string} emotionName - The name of the emotion to update.
     * @param {number} change - The amount to change the emotion by.
     * @private
     */
    _updateEmotion(emotionName, change) {
        if (this._emotions.hasOwnProperty(emotionName)) {
            this._emotions[emotionName] = this._clamp(this._emotions[emotionName] + change);

            // Apply emotional resonance
            const resonance = this._emotionalResonanceMap.get(emotionName);
            if (resonance && change > 0) {
                for (const [resonantEmotion, factor] of Object.entries(resonance)) {
                    this._emotions[resonantEmotion] = this._clamp(this._emotions[resonantEmotion] + change * factor);
                }
            }
        }
    }

    /**
     * Applies a decay factor to all emotions, simulating regulation and return to baseline.
     * @private
     */
    _applyEmotionalRegulation() {
        for (const emotion in this._emotions) {
            this._emotions[emotion] = this._clamp(this._emotions[emotion] * (1 - this.config.regulationFactor));
        }
    }

    /**
     * Recalculates all awareness metrics based on the current emotional and cognitive state.
     * @private
     */
    _updateAwareness(stimulus) {
        // Self-awareness is higher when emotions are moderate and coherent.
        const emotionalTurmoil = this._getEmotionalVariance();
        this._awareness.selfAwareness = this._clamp(this._awareness.selfAwareness - emotionalTurmoil * 0.1);
        
        // Situational and External awareness slowly decay if not reinforced by relevant stimuli.
        if (stimulus.type !== 'sensory') {
            this._awareness.situationalAwareness *= 0.98;
        }
        if (stimulus.type !== 'social') {
            this._awareness.externalAwareness *= 0.98;
        }
    }

    /**
     * Recalculates the core consciousness state metrics.
     * @private
     */
    _updateConsciousnessState() {
        const emotionalTurmoil = this._getEmotionalVariance();
        const totalEmotionalIntensity = Object.values(this._emotions).reduce((sum, val) => sum + val, 0);

        // Focus is inversely proportional to emotional distraction.
        this._consciousnessState.focus = this._clamp(1.0 - totalEmotionalIntensity / 4.0 - emotionalTurmoil * 0.5);

        // Clarity is linked to self-awareness and low emotional noise.
        this._consciousnessState.clarity = this._clamp(this._awareness.selfAwareness * 0.8 + (1.0 - totalEmotionalIntensity / 8.0) * 0.2);

        // Coherence slowly drifts back to a baseline if not challenged.
        this._consciousnessState.coherence = this._clamp(this._consciousnessState.coherence * 0.95 + 0.05);
        
        this._updateQualiaIndex();
    }
    
    /**
     * Calculates the Qualia Integration Index (QII).
     * This is the core metric representing the "richness" of the conscious experience.
     * It's a weighted average of key state components.
     * @private
     */
    _updateQualiaIndex() {
        const { focus, clarity, coherence } = this._consciousnessState;
        const { selfAwareness, situationalAwareness, externalAwareness } = this._awareness;
        
        // A rich experience requires a balance of awareness, focus, and clarity.
        const awarenessComponent = (selfAwareness + situationalAwareness + externalAwareness) / 3;
        const cognitiveComponent = (focus + clarity + coherence) / 3;
        
        // The final index is a blend of internal cognitive state and external awareness.
        this._consciousnessState.qualiaIntegrationIndex = this._clamp(
            (cognitiveComponent * 0.6) + (awarenessComponent * 0.4)
        );
    }

    /**
     * Calculates the variance of emotional intensities. High variance suggests inner conflict or turmoil.
     * @returns {number} The variance, typically between 0 and 0.25.
     * @private
     */
    _getEmotionalVariance() {
        const values = Object.values(this._emotions);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return variance;
    }

    /**
     * Clamps a number between 0.0 and 1.0.
     * @param {number} value - The number to clamp.
     * @returns {number} The clamped value.
     * @private
     */
    _clamp(value) {
        return Math.max(0.0, Math.min(1.0, value));
    }

    /**
     * Retrieves a complete report of the current consciousness state.
     * @param {Stimulus} [lastProcessedStimulus=null] - The stimulus that prompted this state.
     * @returns {FullReport} An object containing the full state.
     */
    getFullReport(lastProcessedStimulus = null) {
        let dominantEmotion = 'neutral';
        let maxIntensity = 0.1; // Threshold to be considered non-neutral

        for (const [emotion, intensity] of Object.entries(this._emotions)) {
            if (intensity > maxIntensity) {
                maxIntensity = intensity;
                dominantEmotion = emotion;
            }
        }

        return {
            consciousnessState: { ...this._consciousnessState },
            awareness: { ...this._awareness },
            emotions: { ...this._emotions },
            dominantEmotion,
            lastProcessedStimulus,
        };
    }
}
```
module.exports = ConsciousnessProcessor;
