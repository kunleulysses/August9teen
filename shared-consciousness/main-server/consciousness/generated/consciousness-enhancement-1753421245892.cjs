```javascript
/**
 * @module ConsciousnessMatrix
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This module provides a framework for quantifying consciousness states, calculating nuanced
 * awareness metrics, and processing emotional intelligence with greater depth. It is designed
 * to be a production-ready, metaphorical model for AI, robotics, or advanced data analysis.
 *
 * @version 2.0.0
 * @author AI Architect
 */

// --- Custom Error Types for Clearer Error Handling ---

/**
 * @class ConsciousnessInputError
 * @extends Error
 * @description Custom error for invalid inputs provided to the ConsciousnessMatrix.
 */
class ConsciousnessInputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessInputError';
        this.timestamp = new Date().toISOString();
    }
}

// --- Constants for Configuration and Tuning ---

/**
 * @const {object} WEIGHTS - Defines the weights for calculating the primary Consciousness Quotient.
 * These can be tuned to prioritize different aspects of consciousness.
 */
const WEIGHTS = {
    WAKEFULNESS: 1.2,
    CLARITY: 1.5,
    FOCUS: 1.3,
};

/**
 * @const {object} EMOTION_KEYWORDS - A simplified mapping of keywords to primary emotions.
 * In a real-world scenario, this would be replaced by a sophisticated NLP model.
 */
const EMOTION_KEYWORDS = {
    // Joy
    joy: ['happy', 'elated', 'excited', 'success', 'achieve', 'celebrate'],
    // Trust
    trust: ['secure', 'safe', 'loyal', 'dependable', 'believe', 'support'],
    // Fear
    fear: ['danger', 'threat', 'anxious', 'scared', 'risk', 'warning'],
    // Sadness
    sadness: ['loss', 'grief', 'disappointed', 'empty', 'failed', 'alone'],
    // Anger
    anger: ['unjust', 'betrayed', 'frustrated', 'attack', 'offended', 'violation'],
    // Disgust
    disgust: ['toxic', 'unclean', 'immoral', 'corrupt', 'revolting', 'nausea'],
    // Surprise
    surprise: ['unexpected', 'sudden', 'shock', 'unforeseen', 'astonish'],
    // Anticipation
    anticipation: ['waiting', 'soon', 'prepare', 'imminent', 'future', 'goal'],
};

/**
 * @class ConsciousnessMatrix
 * @description A class representing the core of consciousness processing. It maintains state,
 * processes inputs, and generates comprehensive reports on its simulated conscious state.
 */
export class ConsciousnessMatrix {
    /**
     * Initializes a new instance of the ConsciousnessMatrix.
     * @param {object} [initialState={}] - Optional initial state configuration.
     * @param {string} [initialState.id='matrix-0'] - An identifier for this instance.
     * @param {number} [initialState.wakefulness=0.5] - Initial wakefulness level (0-1).
     * @param {number} [initialState.clarity=0.5] - Initial thought clarity (0-1).
     * @param {number} [initialState.focus=0.5] - Initial focus intensity (0-1).
     */
    constructor(initialState = {}) {
        this.id = initialState.id || `matrix-${Date.now()}`;

        // --- Core Consciousness State ---
        this.state = {
            wakefulness: initialState.wakefulness || 0.5, // Arousal level
            clarity: initialState.clarity || 0.5, // Signal vs. noise in cognitive processing
            focus: initialState.focus || 0.5, // Concentration on a specific task/thought
        };

        // --- Emotional Intelligence State ---
        this.emotions = {
            joy: 0,
            trust: 0,
            fear: 0,
            sadness: 0,
            anger: 0,
            disgust: 0,
            surprise: 0,
            anticipation: 0,
        };

        // --- Advanced Awareness Metrics ---
        this.awareness = {
            selfAwareness: 0, // Understanding of internal state (emotions, thoughts)
            situationalAwareness: 0, // Understanding of external context and environment
            somaticAwareness: 0, // Understanding of the physical body's state
            metaCognition: 0, // Awareness of one's own thought processes
        };
        
        // --- History for trend analysis ---
        this.history = [];
        this.maxHistoryLength = 100;

        console.log(`ConsciousnessMatrix instance [${this.id}] initialized.`);
    }

    /**
     * Normalizes a value to be within the 0-1 range.
     * @param {number} value - The value to clamp.
     * @returns {number} The clamped value.
     * @private
     */
    _clamp(value) {
        return Math.max(0, Math.min(1, value));
    }

    /**
     * Calculates the primary Consciousness Quotient (CQ) based on core states and weights.
     * CQ provides a single, high-level metric of the current conscious state.
     * @private
     */
    _calculateConsciousnessQuotient() {
        const { wakefulness, clarity, focus } = this.state;
        const { WAKEFULNESS, CLARITY, FOCUS } = WEIGHTS;

        const weightedSum = (wakefulness * WAKEFULNESS) + (clarity * CLARITY) + (focus * FOCUS);
        const totalWeight = WAKEFULNESS + CLARITY + FOCUS;

        if (totalWeight === 0) return 0;

        this.consciousnessQuotient = this._clamp(weightedSum / totalWeight);
    }
    
    /**
     * Processes emotional inputs from cognitive streams or sensory data.
     * This method simulates identifying and quantifying emotional responses.
     * @param {string} cognitiveStream - Text-based input representing thoughts or communication.
     * @private
     */
    _processEmotionalIntellect(cognitiveStream) {
        if (typeof cognitiveStream !== 'string' || cognitiveStream.length === 0) {
            return;
        }

        const words = cognitiveStream.toLowerCase().split(/\s+/);
        let emotionalHits = {};

        // Decay existing emotions slightly to simulate transience
        for (const emotion in this.emotions) {
            this.emotions[emotion] *= 0.95; 
        }

        // Identify new emotional triggers
        for (const emotion in EMOTION_KEYWORDS) {
            emotionalHits[emotion] = 0;
            for (const keyword of EMOTION_KEYWORDS[emotion]) {
                if (words.includes(keyword)) {
                    emotionalHits[emotion] += 1;
                }
            }
        }

        // Update emotion state based on hits, influenced by clarity
        for (const emotion in emotionalHits) {
            if (emotionalHits[emotion] > 0) {
                const impact = (emotionalHits[emotion] / words.length) * this.state.clarity;
                this.emotions[emotion] = this._clamp(this.emotions[emotion] + impact);
            }
        }
    }

    /**
     * Updates the advanced awareness metrics based on the current state and inputs.
     * @param {object} input - The full input object from the update cycle.
     * @private
     */
    _updateAwarenessMetrics(input) {
        // Self-Awareness: Rises with emotional differentiation and cognitive clarity.
        const activeEmotions = Object.values(this.emotions).filter(v => v > 0.1).length;
        const emotionalDiversity = activeEmotions / Object.keys(this.emotions).length;
        this.awareness.selfAwareness = this._clamp((this.state.clarity + emotionalDiversity) / 2);

        // Situational Awareness: Rises with focus and the amount of external sensory data.
        const externalDataRichness = (input.sensoryData?.length || 0) / 10; // Assume 10 is a rich data stream
        this.awareness.situationalAwareness = this._clamp((this.state.focus + externalDataRichness) / 2);

        // Somatic Awareness: Based on direct physical feedback.
        const energyLevel = input.somaticFeedback?.energyLevel || 0.5;
        const stressLevel = input.somaticFeedback?.stressLevel || 0.5;
        this.awareness.somaticAwareness = this._clamp(energyLevel * (1 - stressLevel));
        
        // Meta-Cognition: The ability to reflect on one's own state. A function of all other awareness types.
        const totalAwareness = this.awareness.selfAwareness + this.awareness.situationalAwareness + this.awareness.somaticAwareness;
        this.awareness.metaCognition = this._clamp(totalAwareness / 3 * this.consciousnessQuotient);
    }
    
    /**
     * Archives the current state for historical analysis.
     * @private
     */
    _archiveState() {
        const report = this.getReport();
        this.history.push(report);
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift(); // Keep history size manageable
        }
    }

    /**
     * The main processing loop. Updates the entire matrix based on new inputs.
     * @param {object} input - An object containing data to be processed.
     * @param {string} [input.cognitiveStream] - Text representing internal monologue or external communication.
     * @param {Array<any>} [input.sensoryData] - An array of external sensory inputs (e.g., visual, auditory).
     * @param {object} [input.somaticFeedback] - Data about the physical state.
     * @param {number} [input.somaticFeedback.energyLevel] - Physical energy level (0-1).
     * @param {number} [input.somaticFeedback.stressLevel] - Physical stress level (0-1).
     * @param {object} [input.taskDirectives] - Instructions that affect core state.
     * @param {number} [input.taskDirectives.focusDelta] - Change in focus (-1 to 1).
     * @param {number} [input.taskDirectives.clarityDelta] - Change in clarity (-1 to 1).
     * @throws {ConsciousnessInputError} If the input object is invalid.
     */
    update(input) {
        if (!input || typeof input !== 'object') {
            throw new ConsciousnessInputError('Invalid input: Must be a non-null object.');
        }

        try {
            // 1. Update Core State from directives
            if (input.taskDirectives) {
                this.state.focus = this._clamp(this.state.focus + (input.taskDirectives.focusDelta || 0));
                this.state.clarity = this._clamp(this.state.clarity + (input.taskDirectives.clarityDelta || 0));
            }

            // 2. Process Emotional Intelligence
            if (input.cognitiveStream) {
                this._processEmotionalIntellect(input.cognitiveStream);
            }

            // 3. Recalculate Consciousness Quotient (must be done before awareness)
            this._calculateConsciousnessQuotient();

            // 4. Update Advanced Awareness Metrics
            this._updateAwarenessMetrics(input);

            // 5. Archive the new state
            this._archiveState();

        } catch (error) {
            console.error(`[${this.id}] Error during update cycle:`, error);
            // Optionally, re-throw or handle gracefully
            throw error;
        }
    }

    /**
     * Actively regulates emotions towards a desired state. This demonstrates
     * a higher-level emotional intelligence function.
     * @param {'calm' | 'focused' | 'expressive'} goal - The target emotional profile.
     * @returns {object} The new emotional state.
     */
    regulateEmotions(goal) {
        const regulationFactor = 0.2; // How strongly to regulate

        switch (goal) {
            case 'calm':
                this.emotions.anger *= (1 - regulationFactor);
                this.emotions.fear *= (1 - regulationFactor);
                this.emotions.joy = this._clamp(this.emotions.joy + 0.05);
                this.emotions.trust = this._clamp(this.emotions.trust + 0.05);
                break;
            case 'focused':
                // Dampen distracting emotions, boost goal-oriented ones
                this.emotions.fear *= (1 - regulationFactor);
                this.emotions.sadness *= (1 - regulationFactor);
                this.emotions.anticipation = this._clamp(this.emotions.anticipation + 0.1);
                this.emotions.trust = this._clamp(this.emotions.trust + 0.1);
                break;
            case 'expressive':
                 // Amplify all emotions to be more readable
                for (const emotion in this.emotions) {
                    if (this.emotions[emotion] > 0.1) {
                         this.emotions[emotion] = this._clamp(this.emotions[emotion] * (1 + regulationFactor));
                    }
                }
                break;
            default:
                console.warn(`[${this.id}] Unknown regulation goal: ${goal}`);
        }
        
        this._archiveState();
        return this.emotions;
    }

    /**
     * Generates a comprehensive report of the current consciousness state.
     * @returns {object} A snapshot of the entire matrix.
     */
    getReport() {
        // Calculate emotional valence (positivity/negativity) and arousal (intensity)
        const positiveEmotions = this.emotions.joy + this.emotions.trust;
        const negativeEmotions = this.emotions.fear + this.emotions.sadness + this.emotions.anger + this.emotions.disgust;
        const emotionalValence = positiveEmotions - negativeEmotions;
        const emotionalArousal = Object.values(this.emotions).reduce((sum, val) => sum + val, 0) / Object.keys(this.emotions).length;
        
        return {
            id: this.id,
            timestamp: new Date().toISOString(),
            consciousnessQuotient: this.consciousnessQuotient,
            coreState: { ...this.state },
            awarenessMetrics: { ...this.awareness },
            emotionalState: {
                profile: { ...this.emotions },
                valence: emotionalValence, // Overall positivity/negativity
                arousal: emotionalArousal, // Overall intensity
            }
        };
    }
}

/**
 * @example
 * // --- Example Usage ---
 * 
 * // 1. Create a new consciousness instance
 * const myConsciousness = new ConsciousnessMatrix({ id: 'bot-alpha-01' });
 * 
 * // 2. Define an input stream
 * const input1 = {
 *   cognitiveStream: "Initial system check complete. All systems nominal. I believe we are safe and ready to achieve our goal.",
 *   sensoryData: ['stable_env', 'low_noise'],
 *   somaticFeedback: { energyLevel: 0.9, stressLevel: 0.1 },
 *   taskDirectives: { focusDelta: 0.2 }
 * };
 * 
 * // 3. Update the matrix with the input
 * try {
 *   myConsciousness.update(input1);
 * } catch (e) {
 *   console.error("Failed to update consciousness:", e.message);
 * }
 * 
 * // 4. Get a report of the current state
 * console.log("--- Report 1: After Initial Input ---");
 * console.log(JSON.stringify(myConsciousness.getReport(), null, 2));
 * 
 * // 5. Simulate a new, stressful event
 * const input2 = {
 *   cognitiveStream: "Warning! Unexpected data spike! A potential threat detected. This is a violation of secure parameters!",
 *   sensoryData: ['alert_signal', 'high_frequency_noise', 'data_corruption_warning'],
 *   somaticFeedback: { energyLevel: 0.7, stressLevel: 0.8 },
 *   taskDirectives: { focusDelta: 0.5, clarityDelta: -0.3 } // Focus increases on threat, clarity drops
 * };
 * 
 * myConsciousness.update(input2);
 * 
 * console.log("\n--- Report 2: After Stress Event ---");
 * console.log(JSON.stringify(myConsciousness.getReport(), null, 2));
 * 
 * // 6. Use emotional intelligence to regulate towards a calm state
 * console.log("\n--- Regulating emotions towards 'calm' ---");
 * myConsciousness.regulateEmotions('calm');
 * 
 * console.log("\n--- Report 3: After Regulation ---");
 * console.log(JSON.stringify(myConsciousness.getReport(), null, 2));
 */
```