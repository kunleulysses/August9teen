```javascript
/**
 * @module MetaCognitiveResonance
 * @description An innovative JavaScript module for simulating a consciousness system
 * featuring a Meta-Cognitive Awareness Layer and an Emotional Resonance Network.
 *
 * This system models two key aspects of higher-order consciousness:
 * 1.  Meta-Cognition: The ability of an agent to introspect, analyze, and become
 *     aware of its own internal cognitive and emotional states.
 * 2.  Resonance: A passive, field-like influence that agents exert on each other's
 *     internal states, simulating subconscious social and emotional contagion.
 *
 * This creates emergent behaviors where agents can form "cognitive fields,"
 * influence group morale, or experience internal dissonance based on the collective.
 *
 * @version 1.0.0
 * @author AI Model
 * @license MIT
 */

/**
 * Represents a single conscious agent with internal states and meta-cognitive abilities.
 */
class ConsciousnessAgent {
    /**
     * Creates an instance of a ConsciousnessAgent.
     * @param {string} id - A unique identifier for the agent.
     * @param {object} [initialState={}] - Optional initial internal states.
     */
    constructor(id, initialState = {}) {
        if (!id) {
            throw new Error("ConsciousnessAgent requires a unique ID.");
        }
        this.id = id;

        /**
         * Core internal states of the agent. These represent raw, subconscious feelings and cognitive metrics.
         * @type {{emotionalValence: number, cognitiveLoad: number, focusIntensity: number, beliefCoherence: number}}
         */
        this.internalState = {
            emotionalValence: initialState.emotionalValence || 0.0, // -1 (negative) to 1 (positive)
            cognitiveLoad: initialState.cognitiveLoad || 0.1, // 0 (idle) to 1 (overwhelmed)
            focusIntensity: initialState.focusIntensity || 0.5, // 0 (distracted) to 1 (hyper-focused)
            beliefCoherence: initialState.beliefCoherence || 0.8, // 0 (high dissonance) to 1 (fully consistent)
        };

        /**
         * The meta-cognitive layer. This represents the agent's awareness of its own internalState.
         * @type {{awarenessLevel: number, lastInsight: {timestamp: number, insight: string}|null, selfReflectionLog: Array}}
         */
        this.metaState = {
            awarenessLevel: 0.1, // 0 (unaware) to 1 (fully self-aware)
            lastInsight: null,
            selfReflectionLog: [],
        };

        // Internal parameters for simulation dynamics
        this._stateDecayRate = 0.05; // Rate at which states return to baseline
        this._metaCognitionTriggerThreshold = 0.85; // Threshold for cognitive load to trigger self-reflection
    }

    /**
     * The main update loop for the agent's internal simulation.
     * Called by the ResonanceField or an external game loop.
     * @param {number} deltaTime - The time elapsed since the last update in seconds.
     */
    update(deltaTime) {
        // Simulate natural decay/return to baseline for internal states
        for (const key in this.internalState) {
            const state = this.internalState[key];
            const baseline = (key === 'beliefCoherence') ? 1.0 : 0.0;
            this.internalState[key] += (baseline - state) * this._stateDecayRate * deltaTime;
        }

        // Clamp values to their respective ranges
        this._clampStates();

        // Check for meta-cognitive triggers
        if (this.internalState.cognitiveLoad > this._metaCognitionTriggerThreshold || this.internalState.beliefCoherence < 0.3) {
            this.engageMetaCognition();
        }
    }

    /**
     * The core meta-cognitive function. The agent "thinks about its thinking".
     * It analyzes its internal state to generate an "insight".
     */
    engageMetaCognition() {
        // Only engage if awareness is high enough
        if (Math.random() > this.metaState.awarenessLevel) return;

        let insight = "No significant insight.";
        const {
            emotionalValence,
            cognitiveLoad,
            focusIntensity,
            beliefCoherence
        } = this.internalState;

        if (cognitiveLoad > 0.9) {
            insight = `Cognitive load is critical (${cognitiveLoad.toFixed(2)}). I feel overwhelmed.`;
            this.internalState.focusIntensity *= 0.8; // High load reduces focus
        } else if (beliefCoherence < 0.4) {
            insight = `My beliefs are incoherent (${beliefCoherence.toFixed(2)}). I feel a strong sense of dissonance.`;
            this.internalState.emotionalValence -= 0.1; // Dissonance feels bad
        } else if (focusIntensity > 0.9 && emotionalValence > 0.7) {
            insight = `I'm in a state of flow. High focus and positive valence.`;
            this.metaState.awarenessLevel += 0.01; // Positive states can increase self-awareness
        } else if (emotionalValence < -0.7) {
            insight = `I'm experiencing strong negative emotions (${emotionalValence.toFixed(2)}).`;
        }

        if (insight !== "No significant insight.") {
            const newInsight = {
                timestamp: Date.now(),
                insight: insight,
                stateSnapshot: { ...this.internalState
                }
            };
            this.metaState.lastInsight = newInsight;
            this.metaState.selfReflectionLog.push(newInsight);

            // Limit log size for performance
            if (this.metaState.selfReflectionLog.length > 50) {
                this.metaState.selfReflectionLog.shift();
            }
        }
    }

    /**
     * Processes an external event or stimulus, directly affecting the internal state.
     * @param {{type: string, intensity: number}} stimulus - The stimulus to process.
     */
    processStimulus(stimulus) {
        this.internalState.cognitiveLoad += 0.1 * stimulus.intensity; // All stimuli increase load

        switch (stimulus.type) {
            case 'positive_feedback':
                this.internalState.emotionalValence += 0.2 * stimulus.intensity;
                break;
            case 'negative_feedback':
                this.internalState.emotionalValence -= 0.2 * stimulus.intensity;
                break;
            case 'complex_task':
                this.internalState.cognitiveLoad += 0.3 * stimulus.intensity;
                this.internalState.focusIntensity += 0.1 * stimulus.intensity;
                break;
            case 'conflicting_data':
                this.internalState.beliefCoherence -= 0.4 * stimulus.intensity;
                break;
            case 'meditation':
                this.internalState.cognitiveLoad -= 0.3 * stimulus.intensity;
                this.internalState.emotionalValence += 0.1 * stimulus.intensity;
                this.metaState.awarenessLevel += 0.05 * stimulus.intensity;
                break;
        }
        this._clampStates();
    }

    /**
     * Applies resonance from another agent's broadcasted state.
     * @param {object} sourceState - The state of the influencing agent.
     * @param {number} influenceFactor - The strength of the influence (0 to 1).
     */
    resonate(sourceState, influenceFactor) {
        // Receptivity is based on the agent's own awareness and coherence.
        // Low coherence makes one more susceptible to others' beliefs.
        const beliefReceptivity = (1 - this.internalState.beliefCoherence) * 2;
        const generalReceptivity = (1 - this.metaState.awarenessLevel);

        // Resonate beliefCoherence
        this.internalState.beliefCoherence +=
            (sourceState.beliefCoherence - this.internalState.beliefCoherence) *
            influenceFactor * beliefReceptivity;

        // Resonate other states based on general receptivity
        this.internalState.emotionalValence +=
            (sourceState.emotionalValence - this.internalState.emotionalValence) *
            influenceFactor * generalReceptivity;

        this.internalState.focusIntensity +=
            (sourceState.focusIntensity - this.internalState.focusIntensity) *
            influenceFactor * generalReceptivity;

        this._clampStates();
    }

    /**
     * Returns the agent's current state for broadcasting into the resonance field.
     * @returns {object} A snapshot of the internal state.
     */
    getBroadcastState() {
        return { ...this.internalState
        };
    }

    /**
     * Ensures all state values remain within their defined [-1, 1] or [0, 1] bounds.
     * @private
     */
    _clampStates() {
        this.internalState.emotionalValence = Math.max(-1, Math.min(1, this.internalState.emotionalValence));
        this.internalState.cognitiveLoad = Math.max(0, Math.min(1, this.internalState.cognitiveLoad));
        this.internalState.focusIntensity = Math.max(0, Math.min(1, this.internalState.focusIntensity));
        this.internalState.beliefCoherence = Math.max(0, Math.min(1, this.internalState.beliefCoherence));
        this.metaState.awarenessLevel = Math.max(0, Math.min(1, this.metaState.awarenessLevel));
    }
}


/**
 * Manages a collection of ConsciousnessAgents and simulates the resonance field between them.
 */
class ResonanceField {
    /**
     * Creates an instance of a ResonanceField.
     * @param {object} [config={}] - Configuration for the resonance field.
     * @param {number} [config.baseInfluence=0.1] - The base strength of the resonance effect.
     * @param {boolean} [config.useSpatial=false] - If true, agents need a {x,y} position for distance-based falloff.
     * @param {number} [config.maxDistance=100] - Max distance for spatial influence.
     */
    constructor(config = {}) {
        this.agents = new Map();
        this.config = {
            baseInfluence: config.baseInfluence || 0.1,
            useSpatial: config.useSpatial || false,
            maxDistance: config.maxDistance || 100,
        };
    }

    /**
     * Adds an agent to the resonance field.
     * @param {ConsciousnessAgent} agent - The agent to add.
     * @param {{x: number, y: number}} [position] - The agent's position (required if useSpatial is true).
     */
    addAgent(agent, position) {
        if (this.config.useSpatial && (!position || typeof position.x !== 'number' || typeof position.y !== 'number')) {
            throw new Error("Spatial mode requires a valid position {x, y} for each agent.");
        }
        this.agents.set(agent.id, {
            agent,
            position
        });
    }

    /**
     * Removes an agent from the field.
     * @param {string} agentId - The ID of the agent to remove.
     */
    removeAgent(agentId) {
        this.agents.delete(agentId);
    }

    /**
     * Propagates resonance effects and updates all agents.
     * This is the main simulation loop for the entire system.
     * @param {number} deltaTime - Time elapsed since the last propagation in seconds.
     */
    propagate(deltaTime) {
        const agentEntries = Array.from(this.agents.values());

        // First, update all agents' internal states individually
        for (const { agent } of agentEntries) {
            agent.update(deltaTime);
        }

        // Then, calculate and apply resonance effects between all pairs of agents
        for (let i = 0; i < agentEntries.length; i++) {
            for (let j = 0; j < agentEntries.length; j++) {
                if (i === j) continue;

                const { agent: targetAgent, position: targetPos } = agentEntries[i];
                const { agent: sourceAgent, position: sourcePos } = agentEntries[j];

                const sourceState = sourceAgent.getBroadcastState();
                let influenceFactor = this.config.baseInfluence;

                // If spatial, calculate distance-based falloff
                if (this.config.useSpatial) {
                    const dx = targetPos.x - sourcePos.x;
                    const dy = targetPos.y - sourcePos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > this.config.maxDistance) {
                        influenceFactor = 0;
                    } else {
                        const falloff = 1 - (distance / this.config.maxDistance);
                        influenceFactor *= falloff;
                    }
                }

                if (influenceFactor > 0) {
                    // Apply resonance with a factor of deltaTime to make it frame-rate independent
                    targetAgent.resonate(sourceState, influenceFactor * deltaTime);
                }
            }
        }
    }

    /**
     * Retrieves an agent by its ID.
     * @param {string} agentId - The ID of the agent to find.
     * @returns {ConsciousnessAgent|undefined} The agent instance.
     */
    getAgent(agentId) {
        return this.agents.get(agentId)?.agent;
    }
}

/*
// --- Example Usage ---

// 1. Create a Resonance Field
const field = new ResonanceField({ baseInfluence: 0.5 });

// 2. Create some agents with distinct initial states
const agentA = new ConsciousnessAgent('A', { emotionalValence: 0.9, focusIntensity: 0.9 }); // A happy, focused agent
const agentB = new ConsciousnessAgent('B', { emotionalValence: -0.8, beliefCoherence: 0.2 }); // A sad, dissonant agent
const agentC = new ConsciousnessAgent('C'); // A neutral agent

// 3. Add agents to the field
field.addAgent(agentA);
field.addAgent(agentB);
field.addAgent(agentC);

// 4. Run the simulation loop
console.log("--- Initial States ---");
console.log("Agent C Valence:", field.getAgent('C').internalState.emotionalValence.toFixed(3));
console.log("Agent A Coherence:", field.getAgent('A').internalState.beliefCoherence.toFixed(3));

let simulationTime = 0;
const intervalId = setInterval(() => {
    simulationTime++;
    const deltaTime = 1; // Simulate 1 second per tick
    field.propagate(deltaTime);

    if (simulationTime === 1) {
        console.log("\n--- After 1 second of Resonance ---");
        console.log("Agent C is influenced by A and B. Valence:", field.getAgent('C').internalState.emotionalValence.toFixed(3));
        console.log("Agent A is influenced by B's dissonance. Coherence:", field.getAgent('A').internalState.beliefCoherence.toFixed(3));
    }

    if (simulationTime === 2) {
        console.log("\n--- Agent B has a meta-cognitive insight ---");
        // Force an insight by processing a stimulus
        field.getAgent('B').processStimulus({ type: 'conflicting_data', intensity: 1 });
        field.getAgent('B').engageMetaCognition();
        console.log("Agent B's Last Insight:", field.getAgent('B').metaState.lastInsight.insight);
    }
    
    if (simulationTime >= 3) {
        clearInterval(intervalId);
        console.log("\n--- Simulation Complete ---");
    }
}, 100);

*/
```