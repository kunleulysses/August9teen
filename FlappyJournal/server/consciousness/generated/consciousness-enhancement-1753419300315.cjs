```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description A JavaScript module for advanced modeling and enhancement of conscious processing.
 * This module provides a simulated framework for calculating consciousness states,
 * analyzing awareness metrics, and processing emotional intelligence with greater depth.
 * It is designed for integration into complex AI systems, digital mindfulness applications,
 * or theoretical cognitive architecture research.
 *
 * @author AGI_Innovations
 * @license MIT
 */

/**
 * Custom error class for handling module-specific exceptions.
 * This allows for more precise error handling by consumers of the module.
 */
class ConsciousnessProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessProcessingError';
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Defines the fundamental states of consciousness that the matrix can identify.
 * Each state is represented by a vector in a multi-dimensional cognitive space.
 * @readonly
 * @enum {number[]}
 */
const CONSCIOUSNESS_VECTORS = {
    // High focus, low distraction, task-oriented
    FOCUSED_ATTENTION: [0.9, 0.1, 0.8, 0.2],
    // Broad awareness, creative, associative thinking
    DIFFUSE_MODE: [0.2, 0.8, 0.3, 0.7],
    // Introspective, self-referential, memory consolidation
    REFLECTIVE_STATE: [0.4, 0.4, 0.9, 0.5],
    // Meditative, low cognitive load, high sensory clarity
    RECEPTIVE_CALM: [0.1, 0.5, 0.2, 0.9],
};

/**
 * Defines primary emotional valences used for emotional intelligence processing.
 * These serve as the basis for the emotional spectrum analysis.
 * @readonly
 * @enum {string}
 */
const PRIMARY_EMOTIONS = {
    JOY: 'joy',
    SADNESS: 'sadness',
    ANGER: 'anger',
    FEAR: 'fear',
    SURPRISE: 'surprise',
    TRUST: 'trust',
    DISGUST: 'disgust'
};

/**
 * A sophisticated model for simulating and analyzing states of consciousness.
 * It integrates cognitive load, sensory input, and emotional data to produce
 * a holistic view of a simulated conscious entity's internal state.
 */
class ConsciousnessMatrix
 {

    #state;
    #awareness;
    #emotions;

    /**
     * Initializes the ConsciousnessMatrix.
     * @param {object} [initialConfig={}] - Optional initial configuration.
     * @param {object} [initialConfig.state] - Initial state parameters.
     * @param {number} [initialConfig.state.cognitiveLoad=0.1] - Normalized value (0-1) of current mental effort.
     * @param {number} [initialConfig.state.environmentalCoupling=0.5] - Normalized value (0-1) of connection to external stimuli.
     * @param {number} [initialConfig.state.introspectiveFocus=0.2] - Normalized value (0-1) of focus on internal thoughts.
     * @param {number} [initialConfig.state.somaticClarity=0.5] - Normalized value (0-1) of perceived internal bodily sensations.
     */
    constructor(initialConfig = {}) {
        this.#state = {
            cognitiveLoad: initialConfig.state?.cognitiveLoad ?? 0.1,
            environmentalCoupling: initialConfig.state?.environmentalCoupling ?? 0.5,
            introspectiveFocus: initialConfig.state?.introspectiveFocus ?? 0.2,
            somaticClarity: initialConfig.state?.somaticClarity ?? 0.5,
            // The calculated dominant state of consciousness
            dominantState: this.#calculateConsciousnessState(),
            // A measure of how well the current state matches the dominant vector
            stateCoherence: 0,
        };

        this.#awareness = {
            // NEW: Awareness of one's own internal mental and emotional processes.
            metaCognitive: 0.5,
            // NEW: Awareness of the social and emotional context of interactions.
            relational: 0.5,
            // NEW: The perceived richness and detail of sensory experience.
            qualiaDepth: 0.5,
        };

        this.#emotions = {
            // The current emotional landscape.
            spectrum: this.#initializeEmotionalSpectrum(),
            // NEW: A metric for the complexity and potential conflict in the emotional state.
            dissonanceIndex: 0,
            // NEW: Overall emotional clarity and self-understanding.
            emotionalIntelligence: 0.5,
        };
    }

    /**
     * Initializes the emotional spectrum with baseline values.
     * @private
     * @returns {Object<string, number>} An object representing the emotional spectrum.
     */
    #initializeEmotionalSpectrum() {
        return Object.values(PRIMARY_EMOTIONS).reduce((acc, emotion) => {
            acc[emotion] = 0.1; // Start with a low, neutral baseline
            return acc;
        }, {});
    }

    /**
     * Validates and sanitizes the input data for the update method.
     * @private
     * @param {MatrixInput} input - The input data object.
     * @throws {ConsciousnessProcessingError} If input is invalid.
     */
    #validateInput(input) {
        if (typeof input !== 'object' || input === null) {
            throw new ConsciousnessProcessingError('Input must be a non-null object.');
        }

        const checkRange = (key, value) => {
            if (value !== undefined && (typeof value !== 'number' || value < 0 || value > 1)) {
                throw new ConsciousnessProcessingError(`Input '${key}' must be a number between 0 and 1.`);
            }
        };

        checkRange('cognitiveLoad', input.cognitiveLoad);
        checkRange('environmentalCoupling', input.environmentalCoupling);
        checkRange('introspectiveFocus', input.introspectiveFocus);
        checkRange('somaticClarity', input.somaticClarity);

        if (input.emotionalEvents) {
            if (!Array.isArray(input.emotionalEvents)) {
                throw new ConsciousnessProcessingError('Input \'emotionalEvents\' must be an array.');
            }
            input.emotionalEvents.forEach(event => {
                if (typeof event !== 'object' || event === null || !event.type || typeof event.intensity !== 'number') {
                    throw new ConsciousnessProcessingError('Invalid emotional event structure.');
                }
                if (!Object.values(PRIMARY_EMOTIONS).includes(event.type)) {
                    throw new ConsciousnessProcessingError(`Unknown emotion type: ${event.type}`);
                }
                checkRange('intensity', event.intensity);
            });
        }
    }

    /**
     * Processes new data to update the entire consciousness model.
     * This is the primary entry point for feeding information into the matrix.
     *
     * @param {MatrixInput} input - The data to process.
     */
    update(input) {
        this.#validateInput(input);

        // Update core state parameters with a decay factor for realism
        const decay = 0.8;
        this.#state.cognitiveLoad = input.cognitiveLoad ?? this.#state.cognitiveLoad * decay;
        this.#state.environmentalCoupling = input.environmentalCoupling ?? this.#state.environmentalCoupling * decay;
        this.#state.introspectiveFocus = input.introspectiveFocus ?? this.#state.introspectiveFocus * decay;
        this.#state.somaticClarity = input.somaticClarity ?? this.#state.somaticClarity * decay;

        // Process emotional events if any
        if (input.emotionalEvents && input.emotionalEvents.length > 0) {
            this.#processEmotionalEvents(input.emotionalEvents);
        }

        // Recalculate derived properties based on the new state
        this.#state.dominantState = this.#calculateConsciousnessState();
        this.#updateAwarenessMetrics();
        this.#updateEmotionalIntelligence();
    }

    /**
     * IMPROVED: Calculates the dominant consciousness state using vector math.
     * This method compares the current state vector to predefined state vectors
     * to find the closest match, providing a more nuanced calculation than simple thresholds.
     * @private
     * @returns {string} The key of the dominant consciousness state.
     */
    #calculateConsciousnessState() {
        const currentStateVector = [
            this.#state.cognitiveLoad,
            this.#state.environmentalCoupling,
            this.#state.introspectiveFocus,
            this.#state.somaticClarity,
        ];

        let minDistance = Infinity;
        let dominantState = 'UNDEFINED';

        for (const [stateName, stateVector] of Object.entries(CONSCIOUSNESS_VECTORS)) {
            // Calculate Euclidean distance in the 4D cognitive space
            const distance = Math.sqrt(
                stateVector.reduce((sum, value, index) => {
                    return sum + Math.pow(value - currentStateVector[index], 2);
                }, 0)
            );

            if (distance < minDistance) {
                minDistance = distance;
                dominantState = stateName;
            }
        }

        // Update state coherence: 1 minus normalized distance (max possible distance is sqrt(4) = 2)
        this.#state.stateCoherence = Math.max(0, 1 - (minDistance / 2));

        return dominantState;
    }

    /**
     * NEW: Updates the advanced awareness metrics based on the current state.
     * @private
     */
    #updateAwarenessMetrics() {
        const { introspectiveFocus, environmentalCoupling, somaticClarity, cognitiveLoad } = this.#state;

        // Meta-cognitive awareness thrives on introspection but is hindered by high cognitive load.
        this.#awareness.metaCognitive = (introspectiveFocus * (1 - cognitiveLoad) + this.#emotions.emotionalIntelligence) / 2;

        // Relational awareness requires balancing external focus with emotional understanding.
        this.#awareness.relational = (environmentalCoupling + this.#emotions.emotionalIntelligence) / 2;

        // Qualia depth is the richness of sensory experience, enhanced by somatic clarity and external coupling.
        this.#awareness.qualiaDepth = (somaticClarity + environmentalCoupling) / 2 * (1 - cognitiveLoad * 0.5);
    }

    /**
     * ENHANCED: Processes a stream of emotional events, updating the emotional spectrum.
     * This now includes a decay factor for emotional persistence.
     * @private
     * @param {EmotionalEvent[]} events - An array of emotional events to process.
     */
    #processEmotionalEvents(events) {
        // Apply a decay factor to all emotions before processing new events
        for (const emotion in this.#emotions.spectrum) {
            this.#emotions.spectrum[emotion] *= 0.75; // Emotions fade over time
        }

        // Process new events
        events.forEach(event => {
            const currentIntensity = this.#emotions.spectrum[event.type];
            // New intensity is a blend, preventing single events from completely overriding the state
            const newIntensity = currentIntensity + (event.intensity * (1 - currentIntensity));
            this.#emotions.spectrum[event.type] = Math.min(1, newIntensity);
        });

        // Normalize the spectrum if total intensity exceeds a threshold, simulating emotional regulation
        const totalIntensity = Object.values(this.#emotions.spectrum).reduce((a, b) => a + b, 0);
        if (totalIntensity > 1.5) {
            const normalizationFactor = 1.5 / totalIntensity;
            for (const emotion in this.#emotions.spectrum) {
                this.#emotions.spectrum[emotion] *= normalizationFactor;
            }
        }
    }

    /**
     * ENHANCED: Updates the emotional intelligence and dissonance metrics.
     * @private
     */
    #updateEmotionalIntelligence() {
        const spectrumValues = Object.values(this.#emotions.spectrum);
        const totalIntensity = spectrumValues.reduce((sum, value) => sum + value, 0);
        
        if (totalIntensity === 0) {
            this.#emotions.dissonanceIndex = 0;
            this.#emotions.emotionalIntelligence = 0.5; // Neutral state
            return;
        }

        // Dissonance is high when multiple emotions are strong (entropy-like measure)
        const entropy = -spectrumValues.reduce((sum, p) => {
            const probability = p / totalIntensity;
            return probability > 0 ? sum + probability * Math.log2(probability) : sum;
        }, 0);
        this.#emotions.dissonanceIndex = entropy / Math.log2(spectrumValues.length);

        // Emotional Intelligence is higher when the emotional state is clear (low dissonance) and understood (meta-awareness).
        const clarity = 1 - this.#emotions.dissonanceIndex;
        this.#emotions.emotionalIntelligence = (clarity + this.#awareness.metaCognitive) / 2;
    }

    /**
     * Retrieves the complete, current state of the consciousness matrix.
     * @returns {object} A snapshot of the current state, awareness, and emotional profile.
     */
    getSnapshot() {
        return {
            state: { ...this.#state },
            awareness: { ...this.#awareness },
            emotions: {
                ...this.#emotions,
                spectrum: { ...this.#emotions.spectrum }
            }
        };
    }
    
    /**
     * NEW: Suggests a cognitive strategy to regulate the current emotional state.
     * This provides actionable output based on the internal analysis.
     * @returns {{strategy: string, rationale: string}} The suggested strategy and its reasoning.
     */
    suggestRegulationStrategy() {
        const { dissonanceIndex, spectrum } = this.#emotions;
        const { dominantState } = this.#state;

        if (dissonanceIndex > 0.7) {
            return {
                strategy: 'Cognitive Reappraisal',
                rationale: `High emotional dissonance (${dissonanceIndex.toFixed(2)}) detected. Re-framing the situation may resolve conflicting feelings.`
            };
        }

        const maxEmotion = Object.keys(spectrum).reduce((a, b) => spectrum[a] > spectrum[b] ? a : b);
        const maxIntensity = spectrum[maxEmotion];

        if (maxIntensity > 0.8) {
            if ([PRIMARY_EMOTIONS.ANGER, PRIMARY_EMOTIONS.FEAR].includes(maxEmotion)) {
                return {
                    strategy: 'Attentional Shift to Somatics',
                    rationale: `High intensity of ${maxEmotion} detected. Focusing on somatic clarity can ground the system and reduce emotional amplification.`
                };
            }
            if (maxEmotion === PRIMARY_EMOTIONS.SADNESS && dominantState !== 'REFLECTIVE_STATE') {
                return {
                    strategy: 'Engage Reflective Processing',
                    rationale: `High intensity of ${maxEmotion} detected. Allowing for a reflective state can help process the emotion constructively.`
                };
            }
        }

        if (this.#state.cognitiveLoad > 0.85) {
            return {
                strategy: 'Enter Diffuse Mode',
                rationale: `Cognitive load is critically high (${this.#state.cognitiveLoad.toFixed(2)}). Disengaging from the task can prevent burnout and foster creative solutions.`
            };
        }

        return {
            strategy: 'Maintain Homeostasis',
            rationale: 'The current state is balanced and requires no immediate intervention.'
        };
    }
}

/**
 * @typedef {object} MatrixInput
 * @description The input object for the `ConsciousnessMatrix.update` method. All properties are optional.
 * @property {number} [cognitiveLoad] - Normalized (0-1) measure of current mental effort or task difficulty.
 * @property {number} [environmentalCoupling] - Normalized (0-1) measure of how strongly the entity is focused on external stimuli.
 * @property {number} [introspectiveFocus] - Normalized (0-1) measure of focus on internal thoughts, memories, and self-evaluation.
 * @property {number} [somaticClarity] - Normalized (0-1) measure of the clarity and awareness of internal bodily sensations.
 * @property {EmotionalEvent[]} [emotionalEvents] - An array of emotional stimuli to be processed.
 */

/**
 * @typedef {object} EmotionalEvent
 * @description Represents a single emotional stimulus.
 * @property {PRIMARY_EMOTIONS} type - The type of emotion.
 * @property {number} intensity - The normalized (0-1) intensity of the emotion.
 */
```
module.exports = for;
