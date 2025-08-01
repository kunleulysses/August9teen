```javascript
/**
 * @module Metacortex
 * @description An innovative JavaScript module for a consciousness system that implements
 * a "Pre-cognitive Dissonance Resolver". This layer proactively simulates future
 * mental states to identify and resolve potential internal conflicts between different
 * cognitive modules before they disrupt coherent thought or action. This represents a
 * meta-cognitive awareness that actively manages the system's internal state.
 *
 * @version 1.0.0
 * @author AI-Generated
 * @license MIT
 */

/**
 * Represents a vector in a conceptual space.
 * Decisions can be mapped to vectors to calculate distances and conflicts.
 * For example: [aggression, caution, curiosity]
 * 'ATTACK' -> [1, 0, 0]
 * 'FLEE' -> [0, 1, 0]
 * 'INVESTIGATE' -> [0, 0.5, 1]
 */
class DecisionVector extends Array {
    /**
     * Calculates the Euclidean distance between this and another vector.
     * @param {DecisionVector} otherVector - The vector to compare against.
     * @returns {number} The distance between the vectors.
     */
    distance(otherVector) {
        if (this.length !== otherVector.length) {
            // In a real system, vectors must have the same dimension.
            // This indicates a fundamental mismatch in conceptual space.
            return Infinity;
        }
        let sum = 0;
        for (let i = 0; i < this.length; i++) {
            sum += (this[i] - otherVector[i]) ** 2;
        }
        return Math.sqrt(sum);
    }

    /**
     * Creates a new vector by performing a weighted average of two vectors.
     * This is a key mechanism for synthesizing a new, compromise decision.
     * @param {DecisionVector} otherVector - The other vector.
     * @param {number} weight1 - The weight of this vector (e.g., confidence score).
     * @param {number} weight2 - The weight of the other vector.
     * @returns {DecisionVector} A new, synthesized DecisionVector.
     */
    synthesize(otherVector, weight1, weight2) {
        const totalWeight = weight1 + weight2;
        if (totalWeight === 0) return new DecisionVector(...this.map(() => 0));

        const newVec = this.map((val, i) =>
            (val * weight1 + otherVector[i] * weight2) / totalWeight
        );
        return new DecisionVector(...newVec);
    }
}


/**
 * @class CognitiveModule
 * @description A base class for all cognitive components of the consciousness system.
 * Each module represents a different facet of "mind" (e.g., logic, emotion, ethics).
 */
class CognitiveModule {
    /**
     * @param {string} name - The unique name of the module.
     * @param {number} weight - The default influence of this module in decision-making.
     */
    constructor(name, weight = 1.0) {
        if (this.constructor === CognitiveModule) {
            throw new Error("Abstract class 'CognitiveModule' cannot be instantiated directly.");
        }
        this.name = name;
        this.weight = weight;
    }

    /**
     * Processes an input and returns a potential decision.
     * This method must be implemented by all subclasses.
     * @param {any} input - The sensory input or internal query.
     * @param {object} systemState - The current global state of the consciousness.
     * @returns {{decision: string, confidence: number, vector: DecisionVector, rationale: string}} The module's proposed output.
     */
    process(input, systemState) {
        throw new Error(`Method 'process()' must be implemented in subclass ${this.constructor.name}.`);
    }
}

// --- Example Cognitive Module Implementations ---

/**
 * @class LogicModule
 * @description Analyzes inputs based on reason and known facts.
 * Tends to be cautious and evidence-based.
 */
class LogicModule extends CognitiveModule {
    constructor() {
        super('LogicModule', 1.2); // Logic is often highly weighted.
    }

    process(input, systemState) {
        let decision, confidence, rationale;
        // Decision space: [aggression, caution, curiosity]
        let vector = new DecisionVector(0, 0, 0);

        if (input.entity?.isUnknown) {
            decision = 'OBSERVE';
            confidence = 0.8;
            rationale = 'Unknown entities require data collection before action.';
            vector = new DecisionVector(0.1, 0.8, 0.6); // Low aggression, high caution, moderate curiosity
        } else if (input.threatLevel > 0.7) {
            decision = 'EVADE';
            confidence = 0.95;
            rationale = 'High probability of threat detected.';
            vector = new DecisionVector(0.0, 1.0, 0.0); // No aggression, max caution, no curiosity
        } else {
            decision = 'IGNORE';
            confidence = 0.6;
            rationale = 'Input does not require immediate logical processing.';
            vector = new DecisionVector(0, 0.1, 0);
        }

        return { decision, confidence, vector, rationale };
    }
}

/**
 * @class EmotionModule
 * @description Simulates emotional responses like fear, curiosity, or aggression.
 * Tends to be more volatile and reactive.
 */
class EmotionModule extends CognitiveModule {
    constructor() {
        super('EmotionModule', 0.9);
    }

    process(input, systemState) {
        let decision, confidence, rationale;
        // Decision space: [aggression, caution, curiosity]
        let vector = new DecisionVector(0, 0, 0);

        if (input.entity?.isUnknown && systemState.curiosity > 0.8) {
            decision = 'APPROACH';
            confidence = 0.9;
            rationale = 'Strong feeling of curiosity about the unknown entity.';
            vector = new DecisionVector(0.2, 0.3, 1.0); // Low aggression, some caution, max curiosity
        } else if (input.threatLevel > 0.5) {
            decision = 'CONFRONT';
            confidence = 0.7;
            rationale = 'Feeling of aggression in response to a perceived threat.';
            vector = new DecisionVector(0.9, 0.2, 0.1); // High aggression, low caution
        } else {
            decision = 'NEUTRAL';
            confidence = 0.5;
            rationale = 'No strong emotional response triggered.';
            vector = new DecisionVector(0, 0, 0);
        }
        return { decision, confidence, vector, rationale };
    }
}

/**
 * @class GoalModule
 * @description Focuses on achieving long-term objectives.
 */
class GoalModule extends CognitiveModule {
    constructor() {
        super('GoalModule', 1.5); // Core goals are very influential.
    }

    process(input, systemState) {
        let decision, confidence, rationale;
        // Decision space: [aggression, caution, curiosity]
        let vector = new DecisionVector(0, 0, 0);

        if (systemState.primaryGoal === 'SURVIVAL' && input.threatLevel > 0.3) {
            decision = 'FLEE';
            confidence = 1.0;
            rationale = 'Primary goal SURVIVAL is threatened.';
            vector = new DecisionVector(0.0, 1.0, 0.0); // Max caution
        } else if (systemState.primaryGoal === 'EXPLORATION' && input.entity?.isUnknown) {
            decision = 'DOCUMENT';
            confidence = 0.85;
            rationale = 'Fulfills primary goal EXPLORATION.';
            vector = new DecisionVector(0.0, 0.6, 0.9); // No aggression, high caution, high curiosity
        } else {
            decision = 'MAINTAIN_STATE';
            confidence = 0.4;
            rationale = 'Input is not relevant to current primary goals.';
            vector = new DecisionVector(0.1, 0.1, 0.1);
        }
        return { decision, confidence, vector, rationale };
    }
}


/**
 * @class Metacortex
 * @description The Metacortex orchestrates cognitive modules and implements the
 * Pre-cognitive Dissonance Resolver. It simulates outcomes to prevent internal conflict.
 */
class Metacortex {
    /**
     * @param {CognitiveModule[]} modules - An array of cognitive modules to manage.
     * @param {object} config - Configuration options.
     * @param {number} config.dissonanceThreshold - The threshold above which reconciliation is triggered.
     * @param {function} config.dissonanceVectorMapping - A function to map decision strings to named vectors.
     */
    constructor(modules = [], config = {}) {
        this.#cognitiveModules = new Map(modules.map(m => [m.name, m]));
        this.#dissonanceThreshold = config.dissonanceThreshold || 1.0; // Default threshold
        
        // This mapping allows the system to find synthesized actions.
        this.#decisionVectorMapping = new Map([
            ['ATTACK', new DecisionVector(1, 0, 0)],
            ['FLEE', new DecisionVector(0, 1, 0)],
            ['INVESTIGATE', new DecisionVector(0, 0.5, 1)],
            ['OBSERVE', new DecisionVector(0.1, 0.8, 0.6)],
            ['APPROACH', new DecisionVector(0.2, 0.3, 1.0)],
            ['CONFRONT', new DecisionVector(0.9, 0.2, 0.1)],
            ['DOCUMENT', new DecisionVector(0.0, 0.6, 0.9)],
            // --- Synthesized Actions ---
            // These actions don't typically originate from a single module but are emergent compromises.
            ['PROBE_CAUTIOUSLY', new DecisionVector(0.4, 0.7, 0.8)], // Mix of aggression, caution, curiosity
            ['DEFENSIVE_POSTURE', new DecisionVector(0.5, 0.8, 0.2)], // Mix of aggression and caution
            ['IGNORE_BUT_MONITOR', new DecisionVector(0.0, 0.3, 0.2)], // Low-level caution and curiosity
        ]);
    }

    /** @private */
    #cognitiveModules;
    /** @private */
    #dissonanceThreshold;
    /** @private */
    #decisionVectorMapping;

    /**
     * Runs a "forked" simulation of how modules will react to an input.
     * @private
     * @param {any} input - The input to simulate.
     * @param {object} currentState - The current system state.
     * @returns {object[]} An array of simulated outputs from each module.
     */
    #runSimulation(input, currentState) {
        const simulatedOutputs = [];
        for (const module of this.#cognitiveModules.values()) {
            // In a more complex system, this would use a deep copy of the state
            // to ensure modules don't pollute each other's simulations.
            const output = module.process(input, currentState);
            simulatedOutputs.push({ moduleName: module.name, weight: module.weight, ...output });
        }
        return simulatedOutputs;
    }

    /**
     * Calculates the total cognitive dissonance within a set of simulated outputs.
     * Dissonance is the weighted average distance between all pairs of decision vectors.
     * @private
     * @param {object[]} outputs - The array of simulated outputs.
     * @returns {number} A single value representing the level of internal conflict.
     */
    #calculateDissonance(outputs) {
        if (outputs.length < 2) return 0;

        let totalDissonance = 0;
        let pairCount = 0;

        for (let i = 0; i < outputs.length; i++) {
            for (let j = i + 1; j < outputs.length; j++) {
                const out1 = outputs[i];
                const out2 = outputs[j];

                const distance = out1.vector.distance(out2.vector);
                
                // Dissonance is magnified by the confidence of the conflicting ideas
                // and the base weight (importance) of the modules.
                const weightedDissonance = distance * out1.confidence * out2.confidence * out1.weight * out2.weight;
                
                totalDissonance += weightedDissonance;
                pairCount++;
            }
        }

        return pairCount > 0 ? totalDissonance / pairCount : 0;
    }

    /**
     * The core innovative feature: The Reconciliation Protocol.
     * Attempts to resolve high dissonance by synthesizing a new, emergent decision.
     * @private
     * @param {object[]} conflictingOutputs - The outputs that caused the dissonance.
     * @returns {{decision: string, confidence: number, vector: DecisionVector, rationale: string, isReconciled: boolean}} The reconciled outcome.
     */
    #reconcile(conflictingOutputs) {
        console.log('[Metacortex] High dissonance detected. Initiating reconciliation protocol...');

        // Strategy 1: Synthesize a new decision vector via weighted average
        let synthesizedVector = new DecisionVector(...conflictingOutputs[0].vector.map(() => 0));
        let totalWeight = 0;

        for (const output of conflictingOutputs) {
            const weight = output.confidence * output.weight;
            for (let i = 0; i < synthesizedVector.length; i++) {
                synthesizedVector[i] += output.vector[i] * weight;
            }
            totalWeight += weight;
        }

        if (totalWeight > 0) {
            for (let i = 0; i < synthesizedVector.length; i++) {
                synthesizedVector[i] /= totalWeight;
            }
        }

        // Strategy 2: Find the closest named action to the synthesized vector
        let bestMatch = 'PANIC'; // A fallback default
        let minDistance = Infinity;

        for (const [name, vector] of this.#decisionVectorMapping.entries()) {
            const distance = synthesizedVector.distance(vector);
            if (distance < minDistance) {
                minDistance = distance;
                bestMatch = name;
            }
        }

        const contributingRationales = conflictingOutputs.map(o => `${o.moduleName}: ${o.rationale}`).join(' | ');
        const finalRationale = `Synthesized decision '${bestMatch}' to reconcile conflicting drives. Contributions: [${contributingRationales}]`;

        return {
            decision: bestMatch,
            confidence: Math.min(1.0, totalWeight / conflictingOutputs.length), // Confidence is related to total influence
            vector: synthesizedVector,
            rationale: finalRationale,
            isReconciled: true,
            dissonanceScore: minDistance, // The remaining dissonance after reconciliation
        };
    }

    /**
     * The main entry point for the consciousness system to process information.
     * It simulates, checks for dissonance, reconciles if needed, and returns a final decision.
     * @param {any} input - The sensory input or internal query.
     * @param {object} currentState - The current global state of the consciousness.
     * @returns {Promise<object>} A promise that resolves to the final, coherent action.
     */
    async process(input, currentState) {
        console.log('\n[Metacortex] Processing new input:', input);
        
        // 1. Pre-cognitive Simulation
        const simulatedOutputs = this.#runSimulation(input, currentState);
        console.log('[Metacortex] Simulation complete. Potential outcomes:', simulatedOutputs.map(o => `${o.moduleName} -> ${o.decision} (Conf: ${o.confidence.toFixed(2)})`));

        // 2. Dissonance Calculation
        const dissonance = this.#calculateDissonance(simulatedOutputs);
        console.log(`[Metacortex] Calculated Dissonance: ${dissonance.toFixed(3)} (Threshold: ${this.#dissonanceThreshold})`);

        // 3. Decision Pathway
        if (dissonance > this.#dissonanceThreshold) {
            // 3a. High Dissonance -> Reconcile
            const reconciledAction = this.#reconcile(simulatedOutputs);
            return reconciledAction;
        } else {
            // 3b. Low Dissonance -> Choose best option
            console.log('[Metacortex] Dissonance is low. Selecting highest weighted action.');
            const bestAction = simulatedOutputs.reduce((best, current) => {
                return (current.confidence * current.weight) > (best.confidence * best.weight) ? current : best;
            });
            return { ...bestAction, isReconciled: false };
        }
    }
}


// --- Example Usage ---

async function runConsciousnessCycle() {
    // 1. Initialize the cognitive architecture
    const logicModule = new LogicModule();
    const emotionModule = new EmotionModule();
    const goalModule = new GoalModule();

    const metacortex = new Metacortex(
        [logicModule, emotionModule, goalModule],
        { dissonanceThreshold: 0.8 } // Set a threshold for conflict
    );

    // 2. Define the initial state of the consciousness
    const systemState = {
        primaryGoal: 'EXPLORATION',
        curiosity: 0.9,
        health: 1.0,
    };

    // 3. Present a conflicting scenario
    const scenarioInput = {
        entity: { isUnknown: true },
        threatLevel: 0.6, // High enough to trigger caution but not overwhelming fear
    };

    // --- The Metacortex processes the input ---
    const finalDecision = await metacortex.process(scenarioInput, systemState);

    // 4. Output the result
    console.log('\n--- FINAL CONSCIOUS DECISION ---');
    console.log(`Decision: ${finalDecision.decision}`);
    console.log(`Confidence: ${finalDecision.confidence.toFixed(2)}`);
    console.log(`Rationale: ${finalDecision.rationale}`);
    console.log(`Was Reconciled: ${finalDecision.isReconciled}`);
    if (finalDecision.isReconciled) {
        console.log(`Remaining Dissonance: ${finalDecision.dissonanceScore.toFixed(3)}`);
    }
    console.log('---------------------------------');
    
    /*
     * EXPECTED OUTPUT:
     * LogicModule suggests 'OBSERVE' (cautious).
     * EmotionModule suggests 'APPROACH' (curious).
     * GoalModule suggests 'DOCUMENT' (goal-oriented exploration).
     * The dissonance between 'OBSERVE' and 'APPROACH' is high.
     * The Metacortex will trigger reconciliation and synthesize a new action,
     * likely 'PROBE_CAUTIOUSLY' or something similar, which balances the
     * conflicting drives of caution and curiosity.
     */
}

// Run the simulation
runConsciousnessCycle();
```