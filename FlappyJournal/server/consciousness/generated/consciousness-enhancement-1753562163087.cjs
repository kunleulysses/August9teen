```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A JavaScript module for advanced modeling and analysis of consciousness states.
 * This module provides tools to calculate consciousness levels, derive novel awareness metrics,
 * and process emotional intelligence data from a combination of physiological, cognitive, and
 * self-reported inputs.
 *
 * @version 2.0.0
 * @author AGI
 * @license MIT
 */

/**
 * Custom error class for data validation issues within the module.
 */
class ConsciousnessDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessDataError';
    }
}

/**
 * Defines the core weights for calculating the primary consciousness score.
 * These values can be overridden during instantiation.
 * The weights determine the influence of each domain on the overall state.
 */
const DEFAULT_WEIGHTS = {
    physiological: 0.4, // Body state
    cognitive: 0.4,     // Mental performance
    emotional: 0.2,     // Emotional state
};

/**
 * Defines thresholds for classifying the calculated consciousness score into descriptive states.
 */
const CONSCIOUSNESS_STATE_THRESHOLDS = {
    TRANSCENDENT: 95,
    FLOW: 85,
    HYPER_AWARE: 75,
    FOCUSED_ALERT: 60,
    NEUTRAL_BASELINE: 40,
    RELAXED: 25,
    DROWSY: 10,
    UNCONSCIOUS: 0,
};

/**
 * The main class for processing and analyzing consciousness data.
 * It maintains a history of states to enable temporal analysis.
 *
 * @example
 * import { ConsciousnessProcessor } from './consciousnessEnhancer.cjs';
 * const processor = new ConsciousnessProcessor();
 * const dataPoint = {
 *   timestamp: Date.now(),
 *   physiological: { hr: 75, hrv: 60, gsr: 0.8 },
 *   cognitive: { focus: 0.9, memoryRecall: 0.95, problemSolvingSpeed: 120 },
 *   emotional: { intensity: 0.3, polarity: 0.8, tags: ['joy', 'anticipation', 'calm'] }
 * };
 * const currentState = processor.process(dataPoint);
 * console.log(currentState.summary.state); // e.g., "FLOW"
 * console.log(processor.getAwarenessMetrics());
 * console.log(processor.getEmotionalIntelligenceMetrics());
 */
export class ConsciousnessProcessor {
    /**
     * Initializes the processor with optional custom configuration.
     * @param {object} [config={}] - Configuration object.
     * @param {object} [config.weights] - Custom weights for state calculation.
     * @param {number} [config.historyLimit=100] - Max number of historical states to keep.
     */
    constructor(config = {}) {
        this.weights = { ...DEFAULT_WEIGHTS, ...config.weights };
        this.historyLimit = config.historyLimit || 100;
        this.stateHistory = [];
    }

    /**
     * Validates the structure and values of the input data object.
     * Throws ConsciousnessDataError if validation fails.
     * @private
     * @param {object} data - The input data object for a single time point.
     */
    _validateInput(data) {
        if (!data || typeof data !== 'object') {
            throw new ConsciousnessDataError('Input data must be a non-null object.');
        }
        const requiredTopLevelKeys = ['timestamp', 'physiological', 'cognitive', 'emotional'];
        for (const key of requiredTopLevelKeys) {
            if (!(key in data)) throw new ConsciousnessDataError(`Missing required key: '${key}'`);
        }

        // Physiological validation
        const { physiological, cognitive, emotional } = data;
        if (typeof physiological.hr !== 'number' || physiological.hr < 30 || physiological.hr > 220) {
            throw new ConsciousnessDataError('Invalid physiological.hr value.');
        }
        if (typeof physiological.hrv !== 'number' || physiological.hrv < 0) {
            throw new ConsciousnessDataError('Invalid physiological.hrv value.');
        }
        if (typeof physiological.gsr !== 'number' || physiological.gsr < 0) {
            throw new ConsciousnessDataError('Invalid physiological.gsr value.');
        }

        // Cognitive validation
        if (typeof cognitive.focus !== 'number' || cognitive.focus < 0 || cognitive.focus > 1) {
            throw new ConsciousnessDataError('Invalid cognitive.focus value (must be 0-1).');
        }
        if (typeof cognitive.memoryRecall !== 'number' || cognitive.memoryRecall < 0 || cognitive.memoryRecall > 1) {
            throw new ConsciousnessDataError('Invalid cognitive.memoryRecall value (must be 0-1).');
        }

        // Emotional validation
        if (typeof emotional.intensity !== 'number' || emotional.intensity < 0 || emotional.intensity > 1) {
            throw new ConsciousnessDataError('Invalid emotional.intensity value (must be 0-1).');
        }
        if (typeof emotional.polarity !== 'number' || emotional.polarity < -1 || emotional.polarity > 1) {
            throw new ConsciousnessDataError('Invalid emotional.polarity value (must be -1 to 1).');
        }
        if (!Array.isArray(emotional.tags)) {
            throw new ConsciousnessDataError('emotional.tags must be an array.');
        }
    }

    /**
     * Normalizes a value from a given range to a 0-100 scale.
     * @private
     * @param {number} value - The value to normalize.
     * @param {number} min - The minimum of the value's range.
     * @param {number} max - The maximum of the value's range.
     * @param {boolean} [invert=false] - Invert the result (e.g., for stress metrics where lower is better).
     * @returns {number} The normalized value (0-100).
     */
    _normalize(value, min, max, invert = false) {
        const normalized = Math.max(0, Math.min(1, (value - min) / (max - min))) * 100;
        return invert ? 100 - normalized : normalized;
    }

    /**
     * Calculates the composite consciousness score based on weighted inputs.
     * @private
     * @param {object} data - The validated input data.
     * @returns {{scores: object, compositeScore: number}} - An object containing sub-scores and the final composite score.
     */
    _calculateConsciousnessScore(data) {
        const { physiological, cognitive, emotional } = data;

        // --- Physiological Score ---
        // Ideal state: Low HR (calmness), high HRV (resilience), low GSR (low stress)
        const hrScore = this._normalize(physiological.hr, 50, 120, true); // Lower HR is better for focus
        const hrvScore = this._normalize(physiological.hrv, 20, 100); // Higher HRV is better
        const gsrScore = this._normalize(physiological.gsr, 0.1, 2.0, true); // Lower GSR is better
        const physiologicalScore = (hrScore + hrvScore + gsrScore) / 3;

        // --- Cognitive Score ---
        // Ideal state: High focus, high recall, high problem-solving speed (lower time is better)
        const focusScore = cognitive.focus * 100;
        const memoryScore = cognitive.memoryRecall * 100;
        const problemSolvingScore = this._normalize(cognitive.problemSolvingSpeed, 300, 10, false); // Assuming speed is time in seconds
        const cognitiveScore = (focusScore + memoryScore + problemSolvingScore) / 3;

        // --- Emotional Score ---
        // Ideal state: Balanced intensity and positive polarity
        const emotionalBalanceScore = 100 - (emotional.intensity * Math.abs(emotional.polarity - 0.5) * 100);

        // --- Composite Score ---
        const compositeScore =
            physiologicalScore * this.weights.physiological +
            cognitiveScore * this.weights.cognitive +
            emotionalBalanceScore * this.weights.emotional;

        return {
            scores: {
                physiological: physiologicalScore,
                cognitive: cognitiveScore,
                emotional: emotionalBalanceScore,
            },
            compositeScore: Math.max(0, Math.min(100, compositeScore)),
        };
    }

    /**
     * Determines the descriptive consciousness state from a numerical score.
     * @private
     * @param {number} score - The composite consciousness score.
     * @returns {string} The descriptive state name (e.g., "FLOW").
     */
    _determineConsciousnessState(score) {
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.TRANSCENDENT) return 'TRANSCENDENT';
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.FLOW) return 'FLOW';
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.HYPER_AWARE) return 'HYPER_AWARE';
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.FOCUSED_ALERT) return 'FOCUSED_ALERT';
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.NEUTRAL_BASELINE) return 'NEUTRAL_BASELINE';
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.RELAXED) return 'RELAXED';
        if (score >= CONSCIOUSNESS_STATE_THRESHOLDS.DROWSY) return 'DROWSY';
        return 'UNCONSCIOUS';
    }

    /**
     * Processes a new data point, calculates all metrics, and adds it to history.
     * @param {object} data - The input data object.
     * @param {number} data.timestamp - The UNIX timestamp of the data capture.
     * @param {object} data.physiological - Physiological sensor readings.
     * @param {number} data.physiological.hr - Heart Rate (bpm).
     * @param {number} data.physiological.hrv - Heart Rate Variability (ms).
     * @param {number} data.physiological.gsr - Galvanic Skin Response (microsiemens).
     * @param {object} data.cognitive - Cognitive performance metrics.
     * @param {number} data.cognitive.focus - Self-reported or EEG-derived focus level (0-1).
     * @param {number} data.cognitive.memoryRecall - Score on a recent memory test (0-1).
     * @param {number} data.cognitive.problemSolvingSpeed - Time to solve a puzzle (seconds).
     * @param {object} data.emotional - Emotional state assessment.
     * @param {number} data.emotional.intensity - Intensity of current emotion (0-1).
     * @param {number} data.emotional.polarity - Positivity/negativity of emotion (-1 to 1).
     * @param {string[]} data.emotional.tags - Descriptive tags for the emotion (e.g., 'joy', 'frustration').
     * @returns {object} A comprehensive object representing the processed consciousness state.
     */
    process(data) {
        try {
            this._validateInput(data);

            const { scores, compositeScore } = this._calculateConsciousnessScore(data);
            const state = this._determineConsciousnessState(compositeScore);

            const processedState = {
                timestamp: data.timestamp,
                summary: {
                    score: compositeScore,
                    state: state,
                },
                breakdown: {
                    scores: scores,
                },
                raw: data,
            };

            this.stateHistory.push(processedState);
            if (this.stateHistory.length > this.historyLimit) {
                this.stateHistory.shift();
            }

            return processedState;
        } catch (error) {
            console.error(`[ConsciousnessEnhancer] Processing failed: ${error.message}`);
            // In a real production app, you might re-throw or return a specific error state.
            throw error;
        }
    }

    /**
     * Calculates advanced awareness metrics based on historical data.
     * These metrics provide deeper insight into the quality of consciousness.
     * @returns {object|null} An object with awareness metrics, or null if not enough data.
     */
    getAwarenessMetrics() {
        if (this.stateHistory.length < 2) {
            return null;
        }
        const lastState = this.stateHistory[this.stateHistory.length - 1];
        const prevState = this.stateHistory[this.stateHistory.length - 2];

        // 1. Metacognitive Congruence: How well self-assessed focus matches performance.
        // A high score means you are good at judging your own mental state.
        const selfAssessedFocus = lastState.raw.cognitive.focus;
        const performanceScore = lastState.breakdown.scores.cognitive / 100;
        const metacognitiveCongruence = 1 - Math.abs(selfAssessedFocus - performanceScore);

        // 2. Somatic Awareness: The stability of physiological signals during calm states.
        // A high score suggests a strong mind-body connection.
        const isCalm = lastState.raw.emotional.intensity < 0.2 && lastState.raw.emotional.polarity > 0;
        let somaticAwareness = 0.5; // Baseline
        if (isCalm) {
            const hrvStability = 1 - (Math.abs(lastState.raw.physiological.hrv - prevState.raw.physiological.hrv) / prevState.raw.physiological.hrv);
            somaticAwareness = Math.max(0, Math.min(1, hrvStability));
        }

        // 3. Situational Plasticity: The ability of the consciousness state to adapt.
        // Measured as the degree of change between states. High plasticity is not always
        // good (can mean volatility), but low can mean rigidity.
        const stateChange = Math.abs(lastState.summary.score - prevState.summary.score);
        const situationalPlasticity = this._normalize(stateChange, 0, 50);

        return {
            metacognitiveCongruence,
            somaticAwareness,
            situationalPlasticity,
            description: {
                metacognitiveCongruence: "Alignment between self-assessed focus and actual cognitive performance (0-1). Higher is better.",
                somaticAwareness: "Physiological stability during calm emotional states, indicating mind-body connection (0-1). Higher is better.",
                situationalPlasticity: "Responsiveness and adaptability of the consciousness state to new stimuli (0-100)."
            }
        };
    }

    /**
     * Calculates advanced emotional intelligence (EQ) metrics.
     * @returns {object|null} An object with EQ metrics, or null if not enough data.
     */
    getEmotionalIntelligenceMetrics() {
        if (this.stateHistory.length < 1) {
            return null;
        }
        const lastState = this.stateHistory[this.stateHistory.length - 1];

        // 1. Emotional Granularity: The ability to identify and label emotions with precision.
        // More unique tags suggest higher granularity.
        const emotionalTags = lastState.raw.emotional.tags || [];
        const emotionalGranularity = this._normalize(new Set(emotionalTags).size, 1, 5);

        // 2. Emotional Regulation: Ability to return to baseline after a strong emotional event.
        // We look for a recent high-intensity event followed by recovery.
        let emotionalRegulation = null; // Can only be calculated under specific conditions
        const recoveryTime = 60000 * 5; // 5 minutes in ms
        const intenseEventIndex = this.stateHistory.findIndex(s =>
            s.raw.emotional.intensity > 0.8 && (Date.now() - s.timestamp) < recoveryTime
        );

        if (intenseEventIndex !== -1 && intenseEventIndex < this.stateHistory.length - 1) {
            const eventState = this.stateHistory[intenseEventIndex];
            const timeToRecover = lastState.timestamp - eventState.timestamp;
            // Higher score for faster recovery
            emotionalRegulation = this._normalize(timeToRecover, 1000, recoveryTime, true);
        }

        return {
            emotionalGranularity,
            emotionalRegulation,
            description: {
                emotionalGranularity: "The richness and precision of emotional vocabulary (0-100). Higher is better.",
                emotionalRegulation: "The speed of returning to an emotional baseline after a high-intensity event (0-100). Higher is better. (null if no recent event)"
            }
        };
    }

    /**
     * Provides a summary of the consciousness state evolution over the stored history.
     * @returns {object} An object containing historical trend data.
     */
    getHistoricalSummary() {
        if (this.stateHistory.length === 0) {
            return { averageScore: 0, stateDistribution: {}, trend: 0 };
        }
        const scores = this.stateHistory.map(s => s.summary.score);
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        const stateDistribution = this.stateHistory.reduce((dist, s) => {
            dist[s.summary.state] = (dist[s.summary.state] || 0) + 1;
            return dist;
        }, {});

        // Calculate trend based on the first and second half of the history
        const midPoint = Math.floor(scores.length / 2);
        const firstHalfAvg = scores.slice(0, midPoint).reduce((a, b) => a + b, 0) / (midPoint || 1);
        const secondHalfAvg = scores.slice(midPoint).reduce((a, b) => a + b, 0) / (scores.length - midPoint || 1);
        const trend = secondHalfAvg - firstHalfAvg;

        return {
            averageScore,
            stateDistribution,
            trend,
            historyCount: this.stateHistory.length
        };
    }

    /**
     * Gets the most recently processed state.
     * @returns {object|null} The last state object or null if history is empty.
     */
    getCurrentState() {
        return this.stateHistory.length > 0 ? this.stateHistory[this.stateHistory.length - 1] : null;
    }
}
```