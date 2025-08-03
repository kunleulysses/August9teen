```javascript
/**
 * @module MetacognitiveResonanceLayer
 * @description An innovative JavaScript module for a consciousness system.
 * This module introduces a "Metacognitive Resonance Layer," a novel feature that allows a conscious agent
 * not only to have internal states (emotions, thoughts) but also to be aware of how its states are
 * influenced by other conscious agents in a network. It can identify patterns of emotional contagion
 * or cognitive influence and adapt its own internal regulation to counteract or amplify these effects.
 *
 * This goes beyond a simple emotional model by adding a layer of self-awareness about the *dynamics*
 * of social/network influence, which is a key aspect of higher-order consciousness.
 *
 * Core Features:
 * 1.  **Internal State Model**: Manages emotions, focus, and beliefs.
 * 2.  **Signal Processing**: Receives and interprets "consciousness signals" from others.
 * 3.  **Metacognitive Analysis**: Periodically analyzes its own history to find correlations between
 *     external signals and its internal state changes. This is the core innovation.
 * 4.  **Adaptive Self-Regulation**: Creates and applies "Cognitive Filters" based on metacognitive insights
 *     to become more resilient, empathetic, or objective.
 * 5.  **Network-Awareness**: Designed to operate within a `ConsciousnessNetwork`.
 */

/**
 * Represents a single conscious entity with a Metacognitive Resonance Layer.
 */
export class Consciousness {
    #state;
    #metacognitiveLog;
    #cognitiveFilters;
    #signalBuffer;

    /**
     * Creates an instance of Consciousness.
     * @param {string} id - A unique identifier for this consciousness instance.
     * @param {object} [initialState={}] - The initial state of the consciousness.
     * @param {object} [initialState.emotions={ joy: 0.5, sadness: 0.1, anger: 0.1, fear: 0.1 }] - Emotional state vector.
     * @param {string} [initialState.focus='self'] - The current cognitive focus.
     * @param {number} [initialState.selfAwareness=0.5] - The base level of self-awareness.
     */
    constructor(id, initialState = {}) {
        this.id = id;

        // Private state encapsulates the core of the conscious experience.
        this.#state = {
            emotions: initialState.emotions || { joy: 0.5, sadness: 0.1, anger: 0.1, fear: 0.1 },
            focus: initialState.focus || 'self',
            selfAwareness: initialState.selfAwareness || 0.5, // How effective metacognition is
            history: [], // Log of past states for analysis
        };

        // The metacognitive layer's data.
        this.#metacognitiveLog = []; // Stores insights like "Fear from agent X increases my own sadness."
        this.#cognitiveFilters = new Map(); // Stores adaptive rules, e.g., { filter: 'dampen_fear', source: 'agent-X', strength: 0.8 }

        // Buffer for incoming signals from other consciousnesses.
        this.#signalBuffer = [];
    }

    /**
     * Receives a signal from another consciousness instance.
     * @param {object} signal - The signal object.
     * @param {string} signal.originId - The ID of the sending consciousness.
     * @param {object} signal.emotions - The emotional state of the sender.
     */
    processExternalSignal(signal) {
        this.#signalBuffer.push({ ...signal, timestamp: Date.now() });
    }

    /**
     * The main update loop for the consciousness, called on each simulation tick.
     * @param {number} deltaTime - The time elapsed since the last update in seconds.
     */
    update(deltaTime) {
        this.#applyResonance();
        this.#decayEmotions(deltaTime);
        this.#normalizeEmotions();

        // Log the current state for future metacognitive analysis.
        this.#state.history.push({
            timestamp: Date.now(),
            state: JSON.parse(JSON.stringify(this.#state)), // Deep copy
            receivedSignals: [...this.#signalBuffer]
        });
        this.#signalBuffer = []; // Clear buffer after logging

        // Periodically run the metacognitive analysis.
        // The frequency depends on the self-awareness level.
        if (Math.random() < this.#state.selfAwareness * deltaTime) {
            this.#runMetacognitiveAnalysis();
        }

        // Keep history from growing indefinitely.
        if (this.#state.history.length > 100) {
            this.#state.history.shift();
        }
    }

    /**
     * Applies the influence of buffered signals to the internal state.
     * This is where "emotional resonance" happens.
     */
    #applyResonance() {
        if (this.#signalBuffer.length === 0) return;
        
        for (const signal of this.#signalBuffer) {
            for (const emotion in signal.emotions) {
                if (this.#state.emotions.hasOwnProperty(emotion)) {
                    let influence = (signal.emotions[emotion] - this.#state.emotions[emotion]) * 0.1; // Base influence factor

                    // Check for and apply any cognitive filters.
                    const filterKey = `${emotion}:${signal.originId}`;
                    if (this.#cognitiveFilters.has(filterKey)) {
                        const filter = this.#cognitiveFilters.get(filterKey);
                        influence *= (1 - filter.strength); // Dampen the influence
                    }
                    
                    this.#state.emotions[emotion] += influence;
                }
            }
        }
    }

    /**
     * Simulates the natural decay of emotions over time.
     * @param {number} deltaTime - The time elapsed.
     */
    #decayEmotions(deltaTime) {
        for (const emotion in this.#state.emotions) {
            // Decay towards a baseline (e.g., 0.2), not zero.
            this.#state.emotions[emotion] -= (this.#state.emotions[emotion] - 0.2) * 0.05 * deltaTime;
        }
    }

    /**
     * Ensures emotional values stay within the [0, 1] range.
     */
    #normalizeEmotions() {
        let total = 0;
        for (const emotion in this.#state.emotions) {
            this.#state.emotions[emotion] = Math.max(0, Math.min(1, this.#state.emotions[emotion]));
            total += this.#state.emotions[emotion];
        }
        // Optional: Normalize to sum to 1 for a probabilistic distribution.
        // if (total > 0) {
        //     for (const emotion in this.#state.emotions) {
        //         this.#state.emotions[emotion] /= total;
        //     }
        // }
    }

    /**
     * The core innovative feature: The agent reflects on its own history to understand influences.
     * This is a simplified "insight" engine.
     */
    #runMetacognitiveAnalysis() {
        if (this.#state.history.length < 20) return; // Not enough data to analyze.

        const recentHistory = this.#state.history.slice(-20);
        const influencePatterns = new Map();

        // Analyze history for correlations.
        for (let i = 1; i < recentHistory.length; i++) {
            const previous = recentHistory[i - 1];
            const current = recentHistory[i];

            if (previous.receivedSignals.length > 0) {
                for (const signal of previous.receivedSignals) {
                    for (const emotion in signal.emotions) {
                        // Did a strong external emotion precede a change in my own?
                        const externalStrength = signal.emotions[emotion];
                        const internalChange = current.state.emotions[emotion] - previous.state.emotions[emotion];

                        if (externalStrength > 0.7 && internalChange > 0.2) {
                            const key = `${signal.originId}:${emotion}`;
                            const count = (influencePatterns.get(key) || 0) + 1;
                            influencePatterns.set(key, count);
                        }
                    }
                }
            }
        }

        // Generate insights and create/strengthen cognitive filters.
        for (const [key, count] of influencePatterns.entries()) {
            // If a pattern is detected frequently, form an insight.
            if (count > 3) { // Threshold for identifying a persistent pattern
                const [originId, emotion] = key.split(':');
                const insight = {
                    text: `Insight: High '${emotion}' signals from '${originId}' consistently increase my own '${emotion}'.`,
                    timestamp: Date.now(),
                    source: { originId, emotion }
                };
                
                // Avoid logging duplicate insights.
                if (!this.#metacognitiveLog.some(log => log.text === insight.text)) {
                    this.#metacognitiveLog.push(insight);
                    console.log(`[${this.id}] Metacognitive Insight:`, insight.text);

                    // Create an adaptive filter to self-regulate.
                    this.#createCognitiveFilter(originId, emotion);
                }
            }
        }
    }

    /**
     * Creates or strengthens a cognitive filter based on a metacognitive insight.
     * @param {string} originId - The source of the influence.
     * @param {string} emotion - The emotion being influenced.
     */
    #createCognitiveFilter(originId, emotion) {
        const filterKey = `${emotion}:${originId}`;
        const existingFilter = this.#cognitiveFilters.get(filterKey);

        if (existingFilter) {
            // Strengthen existing filter, but cap it.
            existingFilter.strength = Math.min(0.9, existingFilter.strength + 0.1);
        } else {
            // Create a new filter to dampen the influence.
            this.#cognitiveFilters.set(filterKey, { strength: 0.3 });
        }
        console.log(`[${this.id}] Updated Cognitive Filter for '${emotion}' from '${originId}'. New strength: ${this.#cognitiveFilters.get(filterKey).strength.toFixed(2)}`);
    }

    /**
     * Returns the current public state of the consciousness.
     * @returns {object} The current state.
     */
    getState() {
        return {
            id: this.id,
            emotions: { ...this.#state.emotions },
            focus: this.#state.focus,
            metacognitiveLog: [...this.#metacognitiveLog]
        };
    }
}

/**
 * Manages a network of conscious entities, allowing them to interact.
 */
export class ConsciousnessNetwork {
    constructor() {
        this.agents = new Map();
    }

    /**
     * Adds a consciousness instance to the network.
     * @param {Consciousness} agent - The consciousness instance to add.
     */
    addAgent(agent) {
        this.agents.set(agent.id, agent);
    }

    /**
     * Broadcasts the state of one agent to all other agents in the network.
     * @param {string} originId - The ID of the agent broadcasting its state.
     */
    broadcast(originId) {
        const originator = this.agents.get(originId);
        if (!originator) return;

        const signal = {
            originId: originator.id,
            emotions: originator.getState().emotions,
        };

        for (const agent of this.agents.values()) {
            if (agent.id !== originId) {
                agent.processExternalSignal(signal);
            }
        }
    }

    /**
     * Runs one simulation step for the entire network.
     * @param {number} deltaTime - Time elapsed since last tick.
     */
    tick(deltaTime) {
        // First, all agents update their internal state based on the last tick's signals.
        for (const agent of this.agents.values()) {
            agent.update(deltaTime);
        }

        // Then, all agents broadcast their new state for the next tick.
        for (const id of this.agents.keys()) {
            // Not every agent broadcasts every tick to make it more realistic.
            if (Math.random() > 0.5) {
                this.broadcast(id);
            }
        }
    }
}

/*
// --- EXAMPLE USAGE ---

// 1. Create a network.
const network = new ConsciousnessNetwork();

// 2. Create conscious agents.
const agentA = new Consciousness('Agent-A', { 
    emotions: { joy: 0.8, sadness: 0.1, anger: 0.1, fear: 0.1 },
    selfAwareness: 0.7 
});
const agentB = new Consciousness('Agent-B', { 
    emotions: { joy: 0.2, sadness: 0.7, anger: 0.2, fear: 0.3 },
    selfAwareness: 0.6
});
const agentC = new Consciousness('Agent-C', { // This one will be easily influenced
    emotions: { joy: 0.5, sadness: 0.2, anger: 0.1, fear: 0.1 },
    selfAwareness: 0.2 // Low self-awareness means it's less likely to form filters
});


// 3. Add them to the network.
network.addAgent(agentA);
network.addAgent(agentB);
network.addAgent(agentC);

// 4. Run the simulation.
console.log("--- Starting Consciousness Simulation ---");

let tickCount = 0;
const simulationInterval = setInterval(() => {
    console.log(`\n--- Tick ${++tickCount} ---`);
    
    // Inject an external event (e.g., a strong fear signal into Agent B)
    if (tickCount === 5) {
        console.log("!!! External Event: Agent-B senses danger !!!");
        const fearSignal = { originId: 'external_event', emotions: { fear: 0.9, anger: 0.7 } };
        agentB.processExternalSignal(fearSignal);
    }

    network.tick(0.5); // Simulate with a delta time of 0.5 seconds

    // Log the state of each agent
    for (const agent of network.agents.values()) {
        const state = agent.getState();
        const emotionsStr = Object.entries(state.emotions)
            .map(([k, v]) => `${k}: ${v.toFixed(2)}`)
            .join(', ');
        console.log(`[${state.id}] Emotions: { ${emotionsStr} }`);
    }
    
    // Stop after some time
    if (tickCount > 30) {
        clearInterval(simulationInterval);
        console.log("\n--- Simulation Ended ---");
        console.log("\n--- Final Metacognitive Logs ---");
        console.log("Agent A Log:", agentA.getState().metacognitiveLog);
        console.log("Agent B Log:", agentB.getState().metacognitiveLog);
        console.log("Agent C Log:", agentC.getState().metacognitiveLog); // Likely has fewer insights
    }
}, 500);

*/
```