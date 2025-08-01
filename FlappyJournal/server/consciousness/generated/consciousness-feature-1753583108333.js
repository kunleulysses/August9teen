```javascript
/**
 * @module QualiaNexus
 * @version 1.0.0
 * @author AI Generated
 * @license MIT
 *
 * @description
 * An innovative JavaScript module for a consciousness system that introduces a
 * Meta-Cognitive Awareness Layer. Its core new feature is the simulation and resolution
 * of "Cognitive Dissonance."
 *
 * This system treats internal contradictions not just as logical errors, but as
 * negative qualia states (simulated feelings) that trigger a self-correction and
 * coherence-seeking drive. This mimics a fundamental aspect of conscious self-awareness:
 * the desire to maintain a consistent internal model of reality and the discomfort
 * felt when that model is challenged.
 */

/**
 * A simple, dependency-free event emitter for decoupling components.
 * In a production environment, consider using a more robust library like
 * 'eventemitter3' or Node.js's native EventEmitter.
 */
class SimpleEventEmitter {
    constructor() {
        this._events = {};
    }

    /**
     * Registers a listener for a given event.
     * @param {string} event - The name of the event.
     * @param {Function} listener - The callback function to execute.
     */
    on(event, listener) {
        (this._events[event] || (this._events[event] = [])).push(listener);
        return this;
    }

    /**
     * Emits an event, calling all registered listeners.
     * @param {string} event - The name of the event to emit.
     * @param {...*} args - Arguments to pass to the listeners.
     */
    emit(event, ...args) {
        if (this._events[event]) {
            this._events[event].forEach(listener => listener.apply(this, args));
        }
    }
}

/**
 * Represents a single belief, fact, or piece of knowledge within the system's
 * cognitive architecture. It includes not just the data, but metadata about
 * its certainty and origin.
 */
class Belief {
    /**
     * @param {string} key - The unique identifier for the belief's subject (e.g., 'sky_color').
     * @param {*} value - The content of the belief (e.g., 'blue').
     * @param {number} confidence - A score from 0.0 to 1.0 representing certainty.
     * @param {string[]} [sources=['initial']] - An array of identifiers for the origin of this belief.
     */
    constructor(key, value, confidence, sources = ['initial']) {
        this.key = key;
        this.value = value;
        // Clamp confidence to the valid range [0, 1]
        this.confidence = Math.max(0, Math.min(1, confidence));
        this.sources = sources;
        this.timestamp = Date.now();
    }

    /**
     * Updates the belief when reinforcing information is received.
     * This simple algorithm increases confidence. More complex models could be used.
     * @param {number} newConfidence - The confidence of the new, supporting information.
     * @param {string} newSource - The source of the new information.
     */
    reinforce(newConfidence, newSource) {
        // A simple reinforcement algorithm: increase confidence towards the new, higher value.
        this.confidence = Math.max(this.confidence, newConfidence);
        if (!this.sources.includes(newSource)) {
            this.sources.push(newSource);
        }
        this.timestamp = Date.now();
    }
}

/**
 * The main class for the Meta-Cognitive Awareness Layer. It manages the knowledge
 * base, simulates a subjective "qualia" state, and handles cognitive dissonance.
 */
class QualiaNexus {
    /**
     * @param {object} [options={}] - Configuration options for the system.
     * @param {number} [options.dissonanceThreshold=0.7] - The average confidence level at which a contradiction triggers a full dissonance state.
     * @param {number} [options.resolutionDecay=0.1] - The amount to decay the confidence of conflicting beliefs during resolution.
     * @param {boolean} [options.verbose=false] - Whether to log detailed internal processes to the console.
     */
    constructor(options = {}) {
        this.knowledgeBase = new Map(); // Stores Belief objects, keyed by their subject.
        this.eventEmitter = new SimpleEventEmitter();
        this.isResolvingDissonance = false;
        this.verbose = options.verbose || false;

        // --- Configuration ---
        this.dissonanceThreshold = options.dissonanceThreshold || 0.7;
        this.resolutionDecay = options.resolutionDecay || 0.1;

        /**
         * The simulated subjective state (qualia) of the system.
         * 'valence': The positive/negative tone of the state (-1.0 to 1.0).
         * 'arousal': The intensity/energy level of the state (0.0 to 1.0).
         * 'label': A human-readable description (e.g., 'idle', 'cognitive_dissonance').
         */
        this.cognitiveState = {
            valence: 0,
            arousal: 0,
            label: 'idle'
        };

        this._log('System initialized. State: idle.');
    }

    /**
     * Primary input method for processing new information or stimuli.
     * @param {object} input - The information to be processed.
     * @param {string} input.key - The subject of the information (e.g., 'cat_is_mammal').
     * @param {*} input.value - The content of the information (e.g., true).
     * @param {number} input.confidence - The certainty of this information (0.0 to 1.0).
     * @param {string} [input.source='external'] - The origin of the information.
     */
    process(input) {
        if (this.isResolvingDissonance) {
            this._log(`Warning: System is busy resolving dissonance. Input '${input.key}' is being ignored.`);
            // In a more robust system, this input could be queued for later processing.
            return;
        }

        const { key, value, confidence, source = 'external' } = input;
        const existingBelief = this.knowledgeBase.get(key);

        if (!existingBelief) {
            // This is a completely new piece of information.
            const newBelief = new Belief(key, value, confidence, [source]);
            this.knowledgeBase.set(key, newBelief);
            this._log(`New belief formed: '${key}' is '${value}' (Confidence: ${confidence.toFixed(2)}).`);
        } else {
            // An existing belief on this topic was found. Check for reinforcement or contradiction.
            if (existingBelief.value === value) {
                // The new information reinforces the existing belief.
                existingBelief.reinforce(confidence, source);
                this._log(`Belief reinforced: '${key}' is '${value}' (New Confidence: ${existingBelief.confidence.toFixed(2)}).`);
            } else {
                // The new information CONTRADICTS the existing belief.
                this._handleContradiction(existingBelief, { value, confidence, source });
            }
        }
    }

    /**
     * Manages a detected contradiction between new info and an existing belief.
     * @private
     */
    _handleContradiction(existingBelief, newInformation) {
        this._log(`CONTRADICTION DETECTED for key '${existingBelief.key}'!`, 'warn');
        this._log(`  - Existing: '${existingBelief.value}' (Confidence: ${existingBelief.confidence.toFixed(2)})`);
        this._log(`  - New Info: '${newInformation.value}' (Confidence: ${newInformation.confidence.toFixed(2)})`);

        // Dissonance is more severe when two strongly-held beliefs conflict.
        const dissonanceScore = (existingBelief.confidence + newInformation.confidence) / 2;
        if (dissonanceScore >= this.dissonanceThreshold) {
            // The conflict is significant enough to trigger a full meta-cognitive cycle.
            this._triggerDissonanceState(existingBelief, newInformation);
        } else {
            // Low-level conflict, not enough to cause "distress". Resolve it quickly.
            this._log('Conflict is below dissonance threshold. Resolving pragmatically based on confidence.');
            if (newInformation.confidence > existingBelief.confidence) {
                this._log(`New information is more confident. Updating belief for '${existingBelief.key}'.`);
                existingBelief.value = newInformation.value;
                existingBelief.confidence = newInformation.confidence;
                existingBelief.sources = [newInformation.source]; // The belief has been "flipped".
                existingBelief.timestamp = Date.now();
            }
            // If the existing belief is more confident, we simply ignore the new, weaker information.
        }
    }

    /**
     * Changes the system's internal qualia state to reflect cognitive dissonance and
     * initiates the resolution process. This is the core of the feature.
     * @private
     */
    _triggerDissonanceState(beliefA, beliefBInfo) {
        this.isResolvingDissonance = true;

        // Update cognitive state to a negative, high-arousal one, simulating discomfort.
        this.cognitiveState = {
            valence: -0.8, // Negative feeling
            arousal: 0.9,  // High mental "energy" expenditure
            label: 'cognitive_dissonance'
        };

        this._log('Dissonance threshold reached! System state changed to: cognitive_dissonance.', 'error');
        this.eventEmitter.emit('dissonanceDetected', {
            key: beliefA.key,
            conflictingBeliefs: [
                { value: beliefA.value, confidence: beliefA.confidence, sources: beliefA.sources },
                { value: beliefBInfo.value, confidence: beliefBInfo.confidence, sources: [beliefBInfo.source] }
            ]
        });

        // Begin the asynchronous process of "thinking through" the problem.
        this._resolveDissonance(beliefA, beliefBInfo);
    }

    /**
     * The meta-cognitive loop that simulates a "train of thought" to resolve dissonance.
     * @private
     */
    async _resolveDissonance(beliefA, beliefBInfo) {
        this._log('--- Meta-Cognitive Resolution Cycle Initiated ---');

        // Step 1: Introspection - Analyze the conflicting beliefs.
        await this._simulateThoughtDelay(1000);
        this._log('Introspection: Analyzing sources and confidence of conflicting beliefs.');

        // Step 2: Hypothesis & Re-evaluation - Decide on a strategy.
        await this._simulateThoughtDelay(1500);
        let resolutionStrategy;
        if (beliefA.confidence > beliefBInfo.confidence + 0.2) {
            resolutionStrategy = 'reject_new';
            this._log(`Hypothesis: The existing belief is significantly more credible.`);
        } else if (beliefBInfo.confidence > beliefA.confidence + 0.2) {
            resolutionStrategy = 'accept_new';
            this._log(`Hypothesis: The new information is significantly more credible.`);
        } else {
            resolutionStrategy = 'mutual_decay';
            this._log(`Hypothesis: Both beliefs are of comparable strength. This indicates high uncertainty.`);
        }

        // Step 3: Action - Modify the knowledge base to restore coherence.
        await this._simulateThoughtDelay(1000);
        this._log('Action: Updating knowledge base to restore cognitive coherence.');

        switch (resolutionStrategy) {
            case 'accept_new':
                // The old belief was "wrong". It gets replaced and its confidence is penalized.
                beliefA.value = beliefBInfo.value;
                beliefA.confidence = beliefBInfo.confidence - this.resolutionDecay;
                beliefA.sources = [beliefBInfo.source];
                break;
            case 'reject_new':
                // The existing belief "won", but its confidence is slightly reduced for having been challenged.
                beliefA.confidence -= this.resolutionDecay;
                break;
            case 'mutual_decay':
                // The system is now highly uncertain. The existing belief's confidence is significantly reduced.
                beliefA.confidence -= this.resolutionDecay * 2;
                break;
        }
        beliefA.confidence = Math.max(0, beliefA.confidence); // Prevent confidence from going below 0.
        beliefA.timestamp = Date.now();

        // Step 4: Resolution & Qualia Shift - The dissonance is resolved.
        this.isResolvingDissonance = false;
        this.cognitiveState = {
            valence: 0.6, // Shift to a positive state for achieving coherence ("aha!" moment).
            arousal: 0.4, // Lower arousal, state of "clarity".
            label: 'coherence_restored'
        };

        this._log(`--- Resolution Achieved. System state: coherence_restored. ---`, 'info');
        this.eventEmitter.emit('resolutionAchieved', {
            key: beliefA.key,
            resolvedBelief: this.getBelief(beliefA.key)
        });
        
        // The positive "afterglow" of resolution fades back to a neutral state over time.
        setTimeout(() => {
            if (this.cognitiveState.label === 'coherence_restored') {
               this.cognitiveState = { valence: 0, arousal: 0, label: 'idle' };
               this._log('System returned to idle state.');
            }
        }, 3000);
    }

    /**
     * Retrieves the current belief about a given topic from the knowledge base.
     * @param {string} key - The key of the belief to retrieve.
     * @returns {Belief|undefined} The belief object or undefined if not found.
     */
    getBelief(key) {
        return this.knowledgeBase.get(key);
    }
    
    /**
     * Returns the current simulated subjective state of the system.
     * @returns {{valence: number, arousal: number, label: string}} The current qualia state.
     */
    getCurrentQualia() {
        return { ...this.cognitiveState };
    }

    /**
     * Logs messages to the console if verbose mode is enabled.
     * @private
     */
    _log(message, type = 'log') {
        if (!this.verbose) return;
        const timestamp = new Date().toISOString();
        console[type](`[QualiaNexus ${timestamp}] ${message}`);
    }

    /**
     * Helper to simulate processing/thinking time using a Promise.
     * @private
     */
    _simulateThoughtDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
```