```javascript
/**
 * @module MetacognitiveResonanceModulator
 * @version 1.0.0
 * @author A.I. Architect
 * @license MIT
 *
 * @description
 * An innovative JavaScript module for a consciousness system that introduces a
 * "Metacognitive Resonance Layer". This layer observes a stream of cognitive
 * events (thoughts, emotions, sensations) and actively modulates the system's
 * focus to resolve internal dissonance or amplify harmony.
 *
 * --- NEW FEATURE: Metacognitive Resonance ---
 *
 * Traditional AI might react to stimuli. This module simulates introspection.
 * It doesn't just process data; it models the process of "thinking about thinking".
 *
 * 1.  **Observes the Stream:** It ingests a continuous flow of cognitive events.
 * 2.  **Detects Dissonance & Harmony:** Using a "Cognitive Schema" (a model of
 *     the system's beliefs, goals, and values), it identifies conflicts
 *     (e.g., a goal to be "honest" clashing with a recent "deceptive" action)
 *     and harmonies (e.g., accomplishing a goal and feeling "proud").
 * 3.  **Generates Resonance Queries:** Instead of forcefully altering the system's
 *     state, it generates a new type of cognitive event—a "Metacognitive Query".
 *     This query is a gentle, attention-directing nudge, much like a moment of
 *     self-awareness in humans (e.g., "I've noticed I'm feeling anxious while
 *     thinking about my deadline. Why?").
 * 4.  **Promotes Self-Regulation:** By injecting these queries back into the
 *     consciousness stream, the system is encouraged to self-regulate, explore its
 *     own internal state, and achieve a more coherent and integrated consciousness.
 *
 * This creates a feedback loop that simulates self-awareness and conscious evolution,
 * a feature distinct from standard machine learning or reactive AI.
 */

/**
 * Represents a single event within the stream of consciousness.
 * This is a flexible structure that can model thoughts, feelings, sensory input,
 * or actions.
 * @typedef {Object} CognitiveEvent
 * @property {string} id - A unique identifier for the event.
 * @property {number} timestamp - The time the event occurred (e.g., Date.now()).
 * @property {'thought'|'emotion'|'sensation'|'action'|'metacognition'} type - The category of the event.
 * @property {string} content - A descriptor of the event's substance (e.g., "planning dinner", "anxiety", "warmth on skin").
 * @property {number} intensity - A normalized value (0.0 to 1.0) representing the event's magnitude.
 * @property {number} valence - A normalized value (-1.0 to 1.0) representing the event's pleasantness (negative to positive).
 * @property {Object} [metadata={}] - Optional additional data associated with the event.
 */

/**
 * Defines the core beliefs, values, and goals of the conscious agent.
 * This schema is used as a baseline to detect dissonance and harmony.
 * @typedef {Object} CognitiveSchema
 * @property {Object.<string, string[]>} relationships - Defines relationships between concepts. e.g., { "family": ["love", "support"] }
 * @property {string[]} goals - The primary objectives of the agent. e.g., ["learn_new_skill", "maintain_social_bonds"]
 * @property {Object.<string, boolean>} values - Core principles. e.g., { "honesty": true, "deception": false }
 */

class MetacognitiveResonanceModulator {
    /**
     * @param {Object} config - Configuration for the modulator.
     * @param {CognitiveSchema} config.schema - The agent's core belief and goal structure.
     * @param {number} [config.analysisWindow=20] - The number of recent events to keep in the stream for analysis.
     * @param {number} [config.dissonanceThreshold=1.2] - The cumulative intensity score at which a dissonance is considered significant enough to trigger a modulation.
     * @param {number} [config.resonanceCooldown=5000] - Minimum time in milliseconds between generating new metacognitive queries to prevent feedback loops.
     */
    constructor({ schema, analysisWindow = 20, dissonanceThreshold = 1.2, resonanceCooldown = 5000 }) {
        if (!schema || !schema.goals || !schema.values) {
            throw new Error("A valid CognitiveSchema with 'goals' and 'values' must be provided.");
        }

        this.schema = schema;
        this.config = { analysisWindow, dissonanceThreshold, resonanceCooldown };

        /** @type {CognitiveEvent[]} */
        this.consciousnessStream = [];
        this.lastModulationTimestamp = 0;
        this.listeners = {}; // Simple event emitter for decoupling.
    }

    /**
     * Subscribes a listener to a specific event.
     * @param {'modulation-generated' | 'dissonance-detected' | 'harmony-detected'} eventName - The name of the event to listen for.
     * @param {Function} callback - The function to execute when the event is emitted.
     */
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
    }

    /**
     * Emits an event to all registered listeners.
     * @private
     * @param {string} eventName - The name of the event to emit.
     * @param {*} data - The data to pass to the listeners.
     */
    _emit(eventName, data) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => callback(data));
        }
    }

    /**
     * The primary input method for the modulator.
     * Call this to feed a new cognitive event into the consciousness stream.
     * @param {CognitiveEvent} event - The cognitive event to process.
     */
    processEvent(event) {
        // Add event to the stream and ensure it doesn't exceed the analysis window size.
        this.consciousnessStream.push(event);
        if (this.consciousnessStream.length > this.config.analysisWindow) {
            this.consciousnessStream.shift();
        }

        // Asynchronously analyze the stream to avoid blocking.
        Promise.resolve().then(() => this._analyzeStream());
    }

    /**
     * The core analysis loop that runs after each new event.
     * It orchestrates the detection of cognitive patterns.
     * @private
     */
    _analyzeStream() {
        if (Date.now() - this.lastModulationTimestamp < this.config.resonanceCooldown) {
            return; // Respect the cooldown period.
        }

        const dissonance = this._detectDissonance();
        if (dissonance.score >= this.config.dissonanceThreshold) {
            this._emit('dissonance-detected', dissonance);
            const modulationQuery = this._generateModulationQuery(dissonance);
            this.lastModulationTimestamp = Date.now();
            this._emit('modulation-generated', modulationQuery);
        } else {
            // In the absence of major dissonance, we can look for harmony.
            const harmony = this._detectHarmony();
            if (harmony.score > 0) {
                this._emit('harmony-detected', harmony);
                // Optionally, one could generate a reinforcing metacognitive thought here too.
            }
        }
    }

    /**
     * Analyzes the stream for conflicting events based on the Cognitive Schema.
     * @private
     * @returns {{score: number, conflictingEvents: CognitiveEvent[], reason: string}} - The calculated dissonance details.
     */
    _detectDissonance() {
        let highestDissonance = { score: 0, conflictingEvents: [], reason: '' };

        // Example Dissonance Rule 1: Action conflicts with a core value.
        for (const event of this.consciousnessStream) {
            if (event.type === 'action') {
                const valueConflict = Object.entries(this.schema.values).find(
                    ([value, isPositive]) => event.content.includes(value) && !isPositive
                );
                if (valueConflict) {
                    const score = event.intensity * 1.5; // Actions against values are highly dissonant.
                    if (score > highestDissonance.score) {
                        highestDissonance = {
                            score,
                            conflictingEvents: [event],
                            reason: `Action '${event.content}' conflicts with core value '${valueConflict[0]}'.`
                        };
                    }
                }
            }
        }

        // Example Dissonance Rule 2: Negative emotion associated with a goal.
        const goalRelatedEvents = this.consciousnessStream.filter(e =>
            this.schema.goals.some(goal => e.content.includes(goal))
        );
        const thoughts = goalRelatedEvents.filter(e => e.type === 'thought');
        const emotions = goalRelatedEvents.filter(e => e.type === 'emotion');

        for (const thought of thoughts) {
            for (const emotion of emotions) {
                // If a negative emotion occurs close in time to a thought about a goal.
                if (emotion.valence < -0.5 && Math.abs(thought.timestamp - emotion.timestamp) < 10000) {
                     const score = thought.intensity + emotion.intensity;
                     if (score > highestDissonance.score) {
                        highestDissonance = {
                            score,
                            conflictingEvents: [thought, emotion],
                            reason: `Negative emotion '${emotion.content}' is associated with goal-oriented thought '${thought.content}'.`
                        };
                    }
                }
            }
        }

        return highestDissonance;
    }

    /**
     * Analyzes the stream for harmonious events that align with the Cognitive Schema.
     * @private
     * @returns {{score: number, harmoniousEvents: CognitiveEvent[], reason: string}} - The calculated harmony details.
     */
     _detectHarmony() {
        let highestHarmony = { score: 0, harmoniousEvents: [], reason: '' };

        // Example Harmony Rule: Positive emotion follows an action aligned with a goal.
        const actions = this.consciousnessStream.filter(e => e.type === 'action');
        const emotions = this.consciousnessStream.filter(e => e.type === 'emotion' && e.valence > 0.5);

        for(const action of actions) {
            const alignedGoal = this.schema.goals.find(goal => action.content.includes(goal));
            if (alignedGoal) {
                for (const emotion of emotions) {
                    // If a positive emotion follows a goal-aligned action.
                    if (emotion.timestamp > action.timestamp) {
                        const score = action.intensity + emotion.intensity;
                        if (score > highestHarmony.score) {
                            highestHarmony = {
                                score,
                                harmoniousEvents: [action, emotion],
                                reason: `Action '${action.content}' towards goal '${alignedGoal}' was followed by positive emotion '${emotion.content}'.`
                            };
                        }
                    }
                }
            }
        }
        return highestHarmony;
     }

    /**
     * Creates a metacognitive query event designed to be injected back into the stream.
     * This query directs the system's "attention" to the source of dissonance.
     * @private
     * @param {{conflictingEvents: CognitiveEvent[], reason: string}} dissonanceInfo - The details of the detected dissonance.
     * @returns {CognitiveEvent} A new event of type 'metacognition'.
     */
    _generateModulationQuery(dissonanceInfo) {
        return {
            id: `meta-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            type: 'metacognition',
            content: 'Dissonance Resonance Query',
            intensity: 0.9, // Meta-queries should be high-priority.
            valence: 0.0, // Neutral, as it's an observation, not a feeling.
            metadata: {
                description: "A conflict has been detected in the cognitive stream. Directing attention to analyze.",
                sourceReason: dissonanceInfo.reason,
                implicatedEventIds: dissonanceInfo.conflictingEvents.map(e => e.id),
                suggestion: "Explore the relationship between the implicated events. What is the underlying cause of this conflict?"
            }
        };
    }
}

// --- EXAMPLE USAGE ---
/*
// This demonstrates how to integrate the modulator into a hypothetical agent.

// 1. Define the agent's core identity (its schema)
const agentSchema = {
    goals: ["be productive", "be honest"],
    values: {
        "truth": true,
        "deception": false,
        "laziness": false,
    },
    relationships: {}
};

// 2. Instantiate the modulator
const consciousnessModulator = new MetacognitiveResonanceModulator({ schema: agentSchema });

// 3. Set up a listener for the "modulation-generated" event.
//    This is where the agent's main loop would receive the metacognitive query
//    and decide how to act on it (e.g., by creating new thoughts or plans).
consciousnessModulator.on('modulation-generated', (metaQuery) => {
    console.log("\n--- METACOGNITIVE RESONANCE QUERY GENERATED ---");
    console.log(metaQuery.metadata.description);
    console.log(`Reason: ${metaQuery.metadata.sourceReason}`);
    console.log(`Suggestion: ${metaQuery.metadata.suggestion}`);
    console.log("--------------------------------------------\n");
    // In a real agent, this query would be pushed back into the stream,
    // influencing the next cycle of thought.
    // agent.processCognitiveEvent(metaQuery);
});

consciousnessModulator.on('dissonance-detected', (dissonance) => {
    console.log(`[DEBUG] Dissonance detected with score: ${dissonance.score.toFixed(2)}`);
});

consciousnessModulator.on('harmony-detected', (harmony) => {
    console.log(`[DEBUG] Harmony detected with score: ${harmony.score.toFixed(2)}`);
});


// 4. Simulate a stream of consciousness over time.
const mockStream = [
    { id: 't1', timestamp: Date.now(), type: 'thought', content: 'I need to work on the project to be productive.', intensity: 0.7, valence: 0.2 },
    { id: 'e1', timestamp: Date.now() + 1000, type: 'emotion', content: 'feeling of dread', intensity: 0.8, valence: -0.7 },
    { id: 's1', timestamp: Date.now() + 2000, type: 'sensation', content: 'heavy chest', intensity: 0.6, valence: -0.6 },
    { id: 't2', timestamp: Date.now() + 3000, type: 'thought', content: 'Maybe I will just watch a video instead.', intensity: 0.9, valence: -0.4 },
    { id: 'a1', timestamp: Date.now() + 4000, type: 'action', content: 'opened video streaming site, exhibiting laziness', intensity: 0.9, valence: -0.5 }, // This will trigger a value conflict
    { id: 'e2', timestamp: Date.now() + 5000, type: 'emotion', content: 'guilt', intensity: 0.8, valence: -0.8 }, // This will trigger a goal/emotion conflict
];

// 5. Process the stream event by event
let delay = 0;
mockStream.forEach(event => {
    setTimeout(() => {
        console.log(`Processing Event: [${event.type}] - ${event.content}`);
        consciousnessModulator.processEvent(event);
    }, delay);
    delay += 500; // Stagger events to simulate time passing
});

// After the last event is processed, a metacognitive query should be logged to the console
// because the combined dissonance of the action and the negative emotion will exceed the threshold.

*/
```