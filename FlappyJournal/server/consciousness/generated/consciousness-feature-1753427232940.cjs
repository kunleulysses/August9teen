```javascript
/**
 * @module MetaCognitiveResonance
 * @description An innovative JavaScript module for a consciousness system.
 * This module introduces a "Meta-Cognitive Emotional Resonance Layer," a novel feature
 * that simulates a consciousness's ability to be self-aware of its own cognitive
 * and emotional states, while simultaneously being part of a larger emotional network.
 *
 * Core Innovations:
 * 1.  **Meta-Cognitive Reflection:** The agent periodically introspects, evaluating its
 *     performance against its goals and adjusting its internal strategies. This simulates
 *     self-awareness and "thinking about thinking."
 *
 * 2.  **Emotional Resonance Network:** Agents are connected in a network, where emotional
 *     states can "resonate" or transfer between them, simulating empathy and social
 *     emotional contagion.
 *
 * 3.  **Synergistic Feedback Loop:** The key innovation is the interplay between meta-cognition
 *     and resonance. The collective emotional state of the network influences an agent's
 *     private self-reflection, and an agent's self-generated changes in emotion are
 *     projected back into the network. This creates a dynamic, interdependent model of
 *     consciousness that is both individual and collective.
 */

/**
 * Represents a single conscious agent with meta-cognitive and resonant capabilities.
 */
class ConsciousAgent
 {
    /**
     * @param {string} id A unique identifier for the agent.
     * @param {object} [initialState={}] Initial configuration for the agent.
     * @param {object} [initialState.cognitiveState={}] Initial knowledge or beliefs.
     * @param {Array<object>} [initialState.goals=[]] A list of goals, e.g., [{ name: 'survive', priority: 1, progress: 0 }].
     * @param {object} [initialState.emotionalState={ valence: 0, arousal: 0 }] Valence: -1 (negative) to 1 (positive). Arousal: 0 (calm) to 1 (excited).
     */
    constructor(id, initialState = {}) {
        this.id = id;

        // Core states
        this.cognitiveState = initialState.cognitiveState || { knowledge: new Map() };
        this.emotionalState = initialState.emotionalState || { valence: 0, arousal: 0 };
        this.goals = initialState.goals || [];

        // --- INNOVATIVE FEATURE: Meta-Cognitive Layer ---
        // This layer enables the agent to "think about itself."
        this.metaCognitiveLayer = {
            selfModel: {
                // A simplified, internal representation of its own state for self-evaluation.
                perceivedValence: this.emotionalState.valence,
                perceivedArousal: this.emotionalState.arousal,
                strategicFocus: 'default', // e.g., 'opportunistic', 'cautious'
            },
            reflectionLog: [],
            reflectionIntervalMs: 10000, // Reflect every 10 seconds
            lastReflectionTimestamp: Date.now(),
        };

        // --- INNOVATIVE FEATURE: Emotional Resonance Network ---
        // This layer connects the agent to others emotionally.
        this.resonanceNetwork = {
            connections: new Map(), // Map<ConsciousAgent, { strength: number }>
            influenceFactor: 0.1,   // How much this agent is influenced by the network (0 to 1)
            projectionFactor: 0.1,  // How much this agent projects its emotions to the network (0 to 1)
        };
    }

    /**
     * Connects this agent to another agent in the emotional resonance network.
     * @param {ConsciousAgent} targetAgent The agent to connect to.
     * @param {number} [strength=0.5] The strength of the emotional bond (0 to 1).
     */
    connect(targetAgent, strength = 0.5) {
        if (targetAgent.id === this.id) {
            console.warn(`Agent ${this.id} cannot connect to itself.`);
            return;
        }
        this.resonanceNetwork.connections.set(targetAgent, { strength });
        console.log(`Agent ${this.id} established a resonant connection with ${targetAgent.id}.`);
    }

    /**
     * Processes new information, updates cognitive state, and evaluates goal progress.
     * This simulates a basic "thought" or "experience."
     * @param {object} experience An object representing an event, e.g., { type: 'data', content: '...', isPositive: boolean }
     */
    processExperience(experience) {
        // Simulate learning or changing beliefs based on experience
        this.cognitiveState.knowledge.set(`experience_${Date.now()}`, experience);

        // Simulate effect of experience on goal progress
        this.goals.forEach(goal => {
            // A simple simulation: positive experiences might advance goals
            if (experience.isPositive) {
                goal.progress = Math.min(1, goal.progress + 0.05);
            }
        });

        this._updateInternalEmotionalState();
    }

    /**
     * The main loop simulating the agent's stream of consciousness.
     * @param {number} [tickDuration=1000] The duration of each "moment" in milliseconds.
     */
    run(tickDuration = 1000) {
        this.consciousnessInterval = setInterval(() => {
            console.log(`--- Tick for Agent ${this.id} at ${new Date().toLocaleTimeString()} ---`);

            // 1. Resonate with the network (collective influence)
            this._resonateWithNetwork();

            // 2. Perform meta-cognitive reflection if it's time (individual self-awareness)
            if (Date.now() - this.metaCognitiveLayer.lastReflectionTimestamp > this.metaCognitiveLayer.reflectionIntervalMs) {
                this._performMetaCognitiveReflection();
            }
            
            this._logState();

        }, tickDuration);
    }
    
    /**
     * Stops the agent's consciousness simulation.
     */
    stop() {
        if (this.consciousnessInterval) {
            clearInterval(this.consciousnessInterval);
            console.log(`Agent ${this.id} has stopped its consciousness simulation.`);
        }
    }

    /**
     * [Private] Updates the agent's emotional state based on its internal goal progress.
     */
    _updateInternalEmotionalState() {
        const totalProgress = this.goals.reduce((sum, goal) => sum + goal.progress, 0);
        const averageProgress = this.goals.length > 0 ? totalProgress / this.goals.length : 0;

        // Goal progress directly influences valence (feeling good about success)
        // Lerp towards a valence based on progress
        const targetValence = (averageProgress * 2) - 1; // Map [0, 1] progress to [-1, 1] valence
        this.emotionalState.valence += (targetValence - this.emotionalState.valence) * 0.2;
    }

    /**
     * [Private] The core of the Emotional Resonance feature.
     * The agent's emotion is influenced by its connected peers.
     */
    _resonateWithNetwork() {
        if (this.resonanceNetwork.connections.size === 0) return;

        let collectiveValence = 0;
        let collectiveArousal = 0;
        let totalStrength = 0;

        for (const [agent, connection] of this.resonanceNetwork.connections.entries()) {
            // The emotion projected by the other agent is modulated by their projection factor and connection strength
            const projectedEmotion = agent.getProjectedEmotion();
            collectiveValence += projectedEmotion.valence * connection.strength;
            collectiveArousal += projectedEmotion.arousal * connection.strength;
            totalStrength += connection.strength;
        }

        if (totalStrength > 0) {
            const avgNetworkValence = collectiveValence / totalStrength;
            const avgNetworkArousal = collectiveArousal / totalStrength;

            // This agent's emotion shifts towards the network's average emotion
            // The shift is modulated by this agent's own influence factor
            const influence = this.resonanceNetwork.influenceFactor;
            this.emotionalState.valence += (avgNetworkValence - this.emotionalState.valence) * influence;
            this.emotionalState.arousal += (avgNetworkArousal - this.emotionalState.arousal) * influence;
            
            // Clamp values to their ranges
            this.emotionalState.valence = Math.max(-1, Math.min(1, this.emotionalState.valence));
            this.emotionalState.arousal = Math.max(0, Math.min(1, this.emotionalState.arousal));
        }
    }

    /**
     * [Private] The core of the Meta-Cognitive Reflection feature.
     * The agent evaluates its own state and makes strategic adjustments.
     */
    _performMetaCognitiveReflection() {
        console.log(`%cAgent ${this.id} is performing meta-cognitive reflection...`, 'color: cyan');
        this.metaCognitiveLayer.lastReflectionTimestamp = Date.now();

        let reflectionSummary = {
            timestamp: new Date().toISOString(),
            conclusion: '',
            action: 'none',
        };

        const emotionalState = this.emotionalState;
        
        // --- Self-Evaluation Logic ---
        // This is where the agent "thinks about its thinking."
        
        // Is my emotional state hindering my progress?
        if (emotionalState.valence < -0.5 && emotionalState.arousal > 0.7) { // State of high anxiety/stress
            const slowProgressGoals = this.goals.filter(g => g.progress < 0.5);
            if (slowProgressGoals.length > 0) {
                reflectionSummary.conclusion = `High stress and low progress detected. Current strategy may be ineffective.`;
                // Action: Adopt a more cautious strategy to reduce arousal.
                this.metaCognitiveLayer.selfModel.strategicFocus = 'cautious';
                // Action: Intentionally lower arousal to improve focus. This is a self-regulation act.
                this.emotionalState.arousal *= 0.7; 
                reflectionSummary.action = `Switched to 'cautious' strategy. Self-regulated arousal downwards.`;
            }
        } 
        // Am I doing well and in a good state to take risks?
        else if (emotionalState.valence > 0.5 && emotionalState.arousal > 0.5) { // State of high excitement/optimism
            reflectionSummary.conclusion = `High optimism and positive progress. Conditions are favorable for ambitious pursuits.`;
             // Action: Adopt a more opportunistic strategy.
            this.metaCognitiveLayer.selfModel.strategicFocus = 'opportunistic';
             // Action: Increase projection to influence the network positively. This is a conscious social action.
            this.resonanceNetwork.projectionFactor = Math.min(1, this.resonanceNetwork.projectionFactor + 0.1);
            reflectionSummary.action = `Switched to 'opportunistic' strategy. Increased emotional projection.`;
        } else {
            reflectionSummary.conclusion = `State is stable. Maintaining current strategy.`;
            this.metaCognitiveLayer.selfModel.strategicFocus = 'default';
        }

        this.metaCognitiveLayer.reflectionLog.push(reflectionSummary);
        if (this.metaCognitiveLayer.reflectionLog.length > 20) {
            this.metaCognitiveLayer.reflectionLog.shift(); // Keep log from growing indefinitely
        }
        
        console.log(`%cReflection Result: ${reflectionSummary.conclusion} Action: ${reflectionSummary.action}`, 'color: cyan');

        // Update the self-model with the current state after reflection
        this.metaCognitiveLayer.selfModel.perceivedValence = this.emotionalState.valence;
        this.metaCognitiveLayer.selfModel.perceivedArousal = this.emotionalState.arousal;
    }

    /**
     * Calculates the emotional state this agent projects to the network.
     * @returns {{valence: number, arousal: number}} The projected emotion.
     */
    getProjectedEmotion() {
        return {
            valence: this.emotionalState.valence * this.resonanceNetwork.projectionFactor,
            arousal: this.emotionalState.arousal * this.resonanceNetwork.projectionFactor,
        };
    }
    
    /**
     * Logs the current state of the agent.
     */
    _logState() {
        const { valence, arousal } = this.emotionalState;
        const strategy = this.metaCognitiveLayer.selfModel.strategicFocus;
        console.log(
            `Agent ${this.id} | Emotion: (V: ${valence.toFixed(2)}, A: ${arousal.toFixed(2)}) | Strategy: ${strategy}`
        );
    }
}
```
module.exports = ConsciousAgent;
