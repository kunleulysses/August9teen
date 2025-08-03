```javascript
/**
 * @module MetaCognitiveDissonanceResolver
 * @version 1.0.0
 * @author AI Consciousness Research Group
 * @license MIT
 *
 * @description
 * An innovative meta-cognitive module for a consciousness system that simulates the
 * detection and resolution of cognitive dissonance. This layer adds a new feature
 * of "self-coherence maintenance" to an AI's cognitive architecture. It models
 * the psychological process of maintaining a consistent set of beliefs in the
 * face of new, conflicting information—a hallmark of higher-order consciousness.
 *
 * --- Core Functionality ---
 * 1.  **Monitors Beliefs:** Continuously observes a consciousness's core beliefs.
 * 2.  **Detects Dissonance:** When a new perception (experience or information) is
 *     introduced, it uses a customizable logic to find contradictions with existing beliefs.
 * 3.  **Quantifies "Mental Stress":** It calculates a `dissonanceScore` based on the
 *     importance of the conflicting ideas. This score is a proxy for psychological discomfort.
 * 4.  **Triggers Self-Reflection:** If the score exceeds a configurable threshold, the module
 *     initiates a resolution process, simulating a state of self-reflection or re-evaluation.
 * 5.  **Evaluates Resolution Strategies:** It models and evaluates multiple psychologically-inspired
 *     strategies to restore cognitive consistency:
 *     - Change a less-important existing belief.
 *     - Reject the new, conflicting perception.
 *     - Add a new, creative "reconciling belief" that allows both conflicting ideas to coexist.
 * 6.  **Simulates Emotional Side-Effects:** The process generates "emotional state" changes,
 *     simulating the stress of dissonance and the relief/coherence of a successful resolution.
 */

/**
 * Represents a single belief, perception, or axiom within the consciousness state.
 * @typedef {object} Belief
 * @property {string} id - A unique identifier for the belief (e.g., a UUID).
 * @property {string} content - The propositional content of the belief (e.g., "The world is round").
 * @property {number} importance - A value from 0.0 (trivial) to 1.0 (core identity) indicating its centrality.
 * @property {string[]} tags - Keywords for categorization, aiding in conflict detection (e.g., 'identity', 'moral', 'fact').
 * @property {object} metadata - Any additional data, like the source of the belief, timestamp, confidence, etc.
 */

/**
 * Represents a detected conflict between two cognitive items.
 * @typedef {object} Conflict
 * @property {Belief} existingBelief - The pre-existing belief from the belief set.
 * @property {Belief} newPerception - The new, conflicting information.
 * @property {number} dissonanceScore - The calculated "stress" of this specific conflict.
 */

/**
 * Configuration options for the resolver's behavior.
 * @typedef {object} ResolverConfig
 * @property {number} dissonanceThreshold - The score above which the active resolution process is triggered.
 * @property {function(Belief, Belief): boolean} areIncompatible - A user-defined function to detect contradictions.
 * @property {object} strategyWeights - Weights to tune the cost-benefit analysis of resolution strategies.
 * @property {number} strategyWeights.changeBeliefCost - Base cost multiplier for changing an existing belief.
 * @property {number} strategyWeights.rejectPerceptionCost - Base cost multiplier for rejecting new information.
 * @property {number} strategyWeights.addBeliefBenefit - Base benefit (negative cost) for creative reconciliation.
 */

class MetaCognitiveDissonanceResolver {
    /**
     * The central consciousness state this resolver monitors.
     * Expected to have a `beliefs` property which is a Map<string, Belief>.
     * @type {{beliefs: Map<string, Belief>, emotionalState: object}}
     */
    #consciousnessState;

    /**
     * Configuration for the resolver's behavior.
     * @type {ResolverConfig}
     */
    #config;

    /**
     * A log of past resolutions to inform future decisions and track cognitive evolution.
     * @type {Array<object>}
     */
    #resolutionHistory = [];

    /**
     * A simple event emitter to notify the parent system of internal events.
     * @type {Map<string, Array<function>>}
     */
    #eventListeners = new Map();

    /**
     * Initializes the Meta-Cognitive Dissonance Resolver.
     * @param {{beliefs: Map<string, Belief>}} consciousnessState - The main consciousness object to monitor.
     * @param {Partial<ResolverConfig>} userConfig - Optional configuration to override defaults.
     */
    constructor(consciousnessState, userConfig = {}) {
        if (!consciousnessState || !(consciousnessState.beliefs instanceof Map)) {
            throw new Error("A valid consciousnessState object with a 'beliefs' Map is required.");
        }
        this.#consciousnessState = consciousnessState;
        
        // Ensure an emotionalState object exists for side-effects
        if (!this.#consciousnessState.emotionalState) {
            this.#consciousnessState.emotionalState = { current: 'neutral', intensity: 0 };
        }

        const defaultConfig = {
            dissonanceThreshold: 0.7,
            // A simple default incompatibility check. A production system would use
            // more sophisticated NLP or semantic relationship graphs.
            areIncompatible: (beliefA, beliefB) => {
                const contentA = beliefA.content.toLowerCase().trim();
                const contentB = beliefB.content.toLowerCase().trim();
                return contentA === `not ${contentB}` || contentB === `not ${contentA}`;
            },
            strategyWeights: {
                changeBeliefCost: 1.0,
                rejectPerceptionCost: 1.2,
                addBeliefBenefit: -0.5,
            },
        };

        this.#config = { ...defaultConfig, ...userConfig, strategyWeights: {...defaultConfig.strategyWeights, ...userConfig.strategyWeights} };
    }

    /**
     * Registers a listener for a specific event.
     * @param {'dissonanceDetected' | 'resolutionComplete' | 'emotionalStateChange'} eventName - The name of the event.
     * @param {function} callback - The function to call when the event is emitted.
     */
    on(eventName, callback) {
        if (!this.#eventListeners.has(eventName)) {
            this.#eventListeners.set(eventName, []);
        }
        this.#eventListeners.get(eventName).push(callback);
    }

    /**
     * Emits an event to all registered listeners.
     * @private
     */
    #emit(eventName, payload) {
        if (this.#eventListeners.has(eventName)) {
            this.#eventListeners.get(eventName).forEach(callback => {
                try {
                    callback(payload);
                } catch (e) {
                    console.error(`Error in event listener for ${eventName}:`, e);
                }
            });
        }
    }

    /**
     * The primary entry point for processing new information and checking for dissonance.
     * @param {Belief} newPerception - A new piece of information to be integrated.
     */
    processNewPerception(newPerception) {
        const conflicts = this.#findConflicts(newPerception);

        if (conflicts.length === 0) {
            // No conflicts, integrate the perception as a new belief.
            this.#consciousnessState.beliefs.set(newPerception.id, newPerception);
            return;
        }

        // Process the most significant conflict first
        const primaryConflict = conflicts.sort((a, b) => b.dissonanceScore - a.dissonanceScore)[0];

        this.#updateEmotionalState('dissonance', primaryConflict.dissonanceScore);
        this.#emit('dissonanceDetected', { conflict: primaryConflict });

        if (primaryConflict.dissonanceScore >= this.#config.dissonanceThreshold) {
            this.#triggerResolution(primaryConflict);
        }
    }

    /**
     * Finds all conflicts between a new perception and the existing belief set.
     * @private
     */
    #findConflicts(newPerception) {
        const conflicts = [];
        for (const existingBelief of this.#consciousnessState.beliefs.values()) {
            if (this.#config.areIncompatible(newPerception, existingBelief)) {
                conflicts.push({
                    existingBelief,
                    newPerception,
                    dissonanceScore: this.#quantifyDissonance(existingBelief, newPerception),
                });
            }
        }
        return conflicts;
    }

    /**
     * Calculates the dissonance score. The score is higher if both conflicting beliefs are important.
     * @private
     */
    #quantifyDissonance(beliefA, beliefB) {
        // A new perception's importance is considered high by default in the context of a conflict.
        const importanceB = beliefB.importance ?? 0.9;
        return beliefA.importance * importanceB;
    }

    /**
     * Initiates the self-reflection process by evaluating and choosing a resolution strategy.
     * @private
     */
    #triggerResolution(conflict) {
        const strategies = this.#evaluateResolutionStrategies(conflict);

        // Choose the best strategy (the one with the lowest cost).
        const bestStrategy = strategies.sort((a, b) => a.cost - b.cost)[0];

        // Execute the chosen strategy
        bestStrategy.action();
        
        const resolutionRecord = {
            resolvedConflict: conflict,
            strategy: bestStrategy.name,
            cost: bestStrategy.cost,
            timestamp: new Date().toISOString(),
        };
        this.#resolutionHistory.push(resolutionRecord);

        // Resolution brings a sense of coherence or relief.
        this.#updateEmotionalState('coherence', 0.6);
        this.#emit('resolutionComplete', resolutionRecord);
    }

    /**
     * Assesses the cost/benefit of each possible resolution strategy for a given conflict.
     * @private
     */
    