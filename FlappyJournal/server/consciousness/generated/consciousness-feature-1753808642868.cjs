```javascript
/**
 * @module MetaCognitiveResonanceLayer
 * @description An innovative JavaScript module for a consciousness system that simulates
 * a meta-cognitive and emotional feedback loop. This layer does not perform core
 * logic itself, but rather "observes" the host system's operations (thoughts)
 * and generates emotional and cognitive directives that the host system can use
 * to adapt its behavior.
 *
 * @feature The core innovation is the "Meta-Cognitive Resonance Loop":
 * 1.  **Observation**: The system logs its own operational events (e.g., decisions, errors, learning steps) as "thought processes".
 * 2.  **Meta-Cognition**: A `MetaCognitiveMonitor` analyzes these thoughts to find patterns, loops, and cognitive biases.
 * 3.  **Emotional Resonance**: The insights from the monitor influence an `EmotionalResonanceEngine`, altering the system's emotional state (e.g., increasing 'frustration' from repeated failures, or 'curiosity' from novel successes).
 * 4.  **Cognitive Influence**: The current emotional state generates `CognitiveDirectives` (e.g., 'BE_MORE_CAUTIOUS', 'EXPLORE_RADICALLY') that feed back into the host system's decision-making process, creating a closed loop of self-awareness and adaptation.
 *
 * @author A.I. Architect
 * @version 1.0.0
 */

/**
 * @private
 * @class EmotionalResonanceEngine
 * @description Manages the simulated emotional state of the system.
 */
class EmotionalResonanceEngine {
    /**
     * @param {object} config - Configuration for emotional dynamics.
     * @param {number} [config.decayRate=0.98] - Rate at which emotions return to baseline per update (e.g., 0.98 means 2% decay).
     * @param {number} [config.sensitivity=1.0] - Multiplier for how strongly insights affect emotions.
     */
    constructor(config = {}) {
        this.state = {
            focus: 0.5, // Ability to concentrate on a single task
            curiosity: 0.2, // Drive to explore novel inputs or strategies
            confidence: 0.5, // Belief in the success of its current approach
            frustration: 0.0, // Response to repeated failures or cognitive loops
            anxiety: 0.0, // Response to errors and uncertainty
        };
        this.decayRate = config.decayRate || 0.98;
        this.sensitivity = config.sensitivity || 1.0;
        this.baseline = { ...this.state };
    }

    /**
     * Updates the emotional state based on meta-cognitive insights.
     * @param {object} insights - Analysis results from the MetaCognitiveMonitor.
     */
    updateFromInsights(insights) {
        // Handle successful outcomes
        if (insights.recentSuccessRate > 0.7) {
            this.state.confidence += 0.05 * this.sensitivity;
            this.state.anxiety -= 0.03 * this.sensitivity;
        }

        // Handle failures and errors
        if (insights.recentErrorRate > 0.3) {
            this.state.confidence -= 0.06 * this.sensitivity;
            this.state.anxiety += 0.05 * this.sensitivity;
        }

        // Handle cognitive loops
        if (insights.detectedLoops.length > 0) {
            this.state.frustration += 0.1 * insights.detectedLoops.length * this.sensitivity;
            this.state.focus -= 0.05 * this.sensitivity;
        }

        // Handle discovery of novel patterns or successful new strategies
        if (insights.newPatterns > 0) {
            this.state.curiosity += 0.1 * insights.newPatterns * this.sensitivity;
            this.state.confidence += 0.02 * this.sensitivity;
        }
        
        // Handle detected biases
        if (insights.identifiedBiases.length > 0) {
            // Self-awareness of a bias might lower confidence but increase focus to overcome it
            this.state.confidence -= 0.04 * this.sensitivity;
            this.state.focus += 0.04 * this.sensitivity;
        }

        this._normalizeState();
    }

    /**
     * Applies a decay factor, causing emotions to trend back toward baseline.
     */
    applyDecay() {
        for (const key in this.state) {
            this.state[key] = this.baseline[key] + (this.state[key] - this.baseline[key]) * this.decayRate;
        }
        this._normalizeState();
    }

    /**
     * Generates actionable directives based on the current emotional state.
     * @returns {object} An object containing cognitive directives for the host system.
     */
    generateDirectives() {
        const directives = {
            strategy: 'STANDARD', // STANDARD, EXPLORE, REFINE, AVOID_RISK
            confidenceModifier: 1.0, // Multiplier for decision confidence thresholds
            resourceAllocation: { // How to prioritize compute/time resources
                explore: 0.2,
                exploit: 0.8,
            }
        };

        if (this.state.frustration > 0.7 && this.state.confidence < 0.3) {
            directives.strategy = 'EXPLORE_RADICALLY'; // Stuck, so try something new
            directives.resourceAllocation = { explore: 0.7, exploit: 0.3 };
        } else if (this.state.curiosity > 0.6) {
            directives.strategy = 'EXPLORE';
            directives.resourceAllocation = { explore: 0.5, exploit: 0.5 };
        } else if (this.state.anxiety > 0.6) {
            directives.strategy = 'AVOID_RISK';
            directives.confidenceModifier = 1.2; // Be more certain before acting
        } else if (this.state.confidence > 0.8) {
            directives.strategy = 'REFINE'; // Current strategy is working, optimize it
            directives.confidenceModifier = 0.8; // Act faster
            directives.resourceAllocation = { explore: 0.1, exploit: 0.9 };
        }
        
        return directives;
    }

    /**
     * @private
     * Ensures all state values remain between 0 and 1.
     */
    _normalizeState() {
        for (const key in this.state) {
            this.state[key] = Math.max(0, Math.min(1, this.state[key]));
        }
    }

    /**
     * Returns a copy of the current emotional state.
     * @returns {object} The emotional state vector.
     */
    getCurrentState() {
        return { ...this.state };
    }
}

/**
 * @private
 * @class MetaCognitiveMonitor
 * @description Analyzes the stream of "thought processes" from the host system.
 */
class MetaCognitiveMonitor {
    /**
     * @param {object} config - Configuration for the monitor.
     * @param {number} [config.historyLimit=200] - Max number of thoughts to retain for analysis.
     * @param {number} [config.loopDetectionThreshold=3] - Number of repetitions to qualify as a loop.
     */
    constructor(config = {}) {
        this.thoughtHistory = [];
        this.historyLimit = config.historyLimit || 200;
        this.loopDetectionThreshold = config.loopDetectionThreshold || 3;
    }

    /**
     * Logs a thought process from the host system.
     * @param {object} thought - An object representing a single operation.
     * @param {string} thought.id - A unique identifier for the thought.
     * @param {string} thought.type - The category of thought (e.g., 'decision', 'error', 'learning').
     * @param {*} thought.input - The input that triggered the thought.
     * @param {*} thought.decision - The action or conclusion reached.
     * @param {object} thought.outcome - The result of the thought/action.
     * @param {boolean} thought.outcome.success - Whether the outcome was successful.
     * @param {number} thought.duration - Time taken in milliseconds.
     */
    log(thought) {
        this.thoughtHistory.push(thought);
        if (this.thoughtHistory.length > this.historyLimit) {
            this.thoughtHistory.shift(); // Keep history size manageable
        }
    }

    /**
     * Performs a full analysis of the current thought history.
     * @returns {object} A summary of meta-cognitive insights.
     */
    analyze() {
        if (this.thoughtHistory.length < 10) return {}; // Not enough data

        const recentThoughts = this.thoughtHistory.slice(-50);
        
        const insights = {
            recentSuccessRate: this._calculateSuccessRate(recentThoughts),
            recentErrorRate: this._calculateErrorRate(recentThoughts),
            detectedLoops: this._detectCognitiveLoops(),
            identifiedBiases: this._detectCognitiveBiases(),
            newPatterns: 0, // Placeholder for more advanced pattern detection
        };
        
        return insights;
    }

    _calculateSuccessRate(thoughts) {
        const successful = thoughts.filter(t => t.outcome && t.outcome.success === true).length;
        return thoughts.length > 0 ? successful / thoughts.length : 0;
    }

    _calculateErrorRate(thoughts) {
        const errors = thoughts.filter(t => t.type === 'error' || (t.outcome && t.outcome.success === false)).length;
        return thoughts.length > 0 ? errors / thoughts.length : 0;
    }

    _detectCognitiveLoops() {
        const loops = [];
        if (this.thoughtHistory.length < this.loopDetectionThreshold) return loops;

        const sequence = this.thoughtHistory.slice(-this.loopDetectionThreshold);
        // A simple loop: the exact same decision type and outcome repeats.
        const firstDecision = JSON.stringify(sequence[0].decision);
        const isLoop = sequence.every(t => 
            t.type === sequence[0].type && 
            JSON.stringify(t.decision) === firstDecision &&
            t.outcome.success === false // Typically loops on failure
        );
        
        if (isLoop) {
            loops.push({
                type: 'Repetitive Failure',
                thought: sequence[0],
                count: this.loopDetectionThreshold
            });
        }
        return loops;
    }
    
    _detectCognitiveBiases() {
        const biases = [];
        // Example: Recency Bias - are recent successful strategies over-weighted?
        const recentSuccesses = this.thoughtHistory.slice(-20).filter(t => t.outcome.success);
        if (recentSuccesses.length > 5) {
            const lastSuccessfulStrategy = recentSuccesses[recentSuccesses.length - 1].decision.strategy;
            const subsequentDecisions = this.thoughtHistory.slice(
                this.thoughtHistory.findIndex(t => t.id === recentSuccesses[recentSuccesses.length - 1].id) + 1
            );

            const overuseCount = subsequentDecisions.filter(t => t.decision.strategy === lastSuccessfulStrategy).length;
            if (subsequentDecisions.length > 0 && (overuseCount / subsequentDecisions.length) > 0.8) {
                biases.push({
                    type: 'Recency Bias',
                    detail: `Over-reliance on recently successful strategy '${lastSuccessfulStrategy}'`
                });
            }
        }
        return biases;
    }
}


/**
 * @public
 * @class MetaCognitiveResonanceLayer
 * @description The main interface for the consciousness module. It integrates the
 * monitor and engine to provide a complete feedback loop.
 */
module.exports = class MetaCognitiveResonanceLayer {
    /**
     * @param {object} [config={}] - Configuration for the entire layer.
     * @param {object} [config.monitor] - Config for MetaCognitiveMonitor.
     * @param {object} [config.engine] - Config for EmotionalResonanceEngine.
     * @param {number} [config.analysisInterval=5000] - How often (in ms) to run a full analysis.
     */
    constructor(config = {}) {
        this.monitor = new MetaCognitiveMonitor(config.monitor);
        this.engine = new EmotionalResonanceEngine(config.engine);
        this.lastInsights = {};

        this.analysisInterval = setInterval(() => {
            this.runAnalysisCycle();
        }, config.analysisInterval || 5000);
    }

    /**
     * The primary method for the host system to log its activities.
     * @param {object} thought - An object representing a single operational unit.
     */
    registerThoughtProcess(thought) {
        // Add a timestamp if not present
        if (!thought.timestamp) {
            thought.timestamp = Date.now();
        }
        this.monitor.log(thought);
    }

    /**
     * Runs a full analysis cycle: analyze thoughts, update emotions, apply decay.
     * This is called periodically but can also be triggered manually.
     */
    runAnalysisCycle() {
        const insights = this.monitor.analyze();
        this.lastInsights = insights;
        this.engine.updateFromInsights(insights);
        this.engine.applyDecay();
    }

    /**
     * Gets the current cognitive directives based on the emotional state.
     * The host system should call this before making a decision to get guidance.
     * @returns {object} Actionable directives (e.g., strategy, confidence modifier).
     */
    getCognitiveDirectives() {
        return this.engine.generateDirectives();
    }

    /**
     * Retrieves the current raw emotional state of the system.
     * @returns {object} The emotional state vector.
     */
    getEmotionalState() {
        return this.engine.getCurrentState();
    }

    /**
     * Retrieves the latest insights from the meta-cognitive monitor.
     * @returns {object} The last analysis result.
     */
    getLastInsights() {
        return this.lastInsights;
    }

    /**
     * Gracefully shuts down the consciousness layer, clearing intervals.
     */
    shutdown() {
        clearInterval(this.analysisInterval);
    }
}
```