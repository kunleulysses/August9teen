```javascript
/**
 * @module MetaCognitiveDissonanceEngine
 * @version 1.0.0
 * @author AI Architect
 *
 * @description
 * An innovative JavaScript module for a consciousness system that simulates the
 * psychological phenomenon of cognitive dissonance. This engine provides a meta-cognitive
 * layer that allows a system to become "aware" of internal conflicts between its
 * beliefs, and actively seeks to resolve them.
 *
 * This moves beyond simple logic and error-correction by modeling the subjective-like
 * "discomfort" of holding contradictory ideas and employing psychologically-inspired
 * strategies to return to a state of cognitive homeostasis.
 *
 * --- NEW FEATURE: The Dissonance & Resolution Cycle ---
 * 1.  **Belief Network**: Manages a graph of interconnected beliefs, each with a
 *     'conviction' score.
 * 2.  **Dissonance Detection**: Quantifies the total cognitive dissonance in the
 *     network when new information conflicts with established, high-conviction beliefs.
 * 3.  **Meta-Cognitive State**: The dissonance level dictates the system's overall
 *     "mental state" (e.g., 'Coherent', 'Dissonant', 'Resolving'). This state can be
 *     queried by other parts of the AI to gauge its internal stability.
 * 4.  **Dynamic Resolution Strategies**: When dissonance is high, the engine
 *     autonomously initiates a resolution cycle, employing strategies like:
 *     - Belief Re-evaluation: Questioning and reducing conviction in conflicting beliefs.
 *     - Justification: Creating new, explanatory beliefs to bridge contradictions.
 *     - Paradigm Shift: A costly but powerful overhaul of a core belief when
 *       dissonance is overwhelming.
 * 5.  **Cognitive Homeostasis**: The ultimate goal is to minimize dissonance, leading
 *     to a more stable and coherent internal belief system.
 */

class MetaCognitiveDissonanceEngine {
    /**
     * Represents a single belief or concept in the network.
     * @typedef {object} Belief
     * @property {string} id - A unique identifier for the belief.
     * @property {string} description - A human-readable description.
     * @property {number} conviction - Strength of the belief (0.0 to 1.0).
     * @property {Set<string>} links - IDs of connected links.
     * @property {boolean} isCore - If true, this belief is resistant to change.
     */

    /**
     * Represents a connection between two beliefs.
     * @typedef {object} Link
     * @property {string} id - A unique identifier for the link.
     * @property {string} sourceId - The ID of the source belief.
     * @property {string} targetId - The ID of the target belief.
     * @property {'supportive'|'contradictory'} type - The nature of the relationship.
     */

    /**
     * Represents the current meta-cognitive state of the system.
     * @typedef {object} MetacognitiveState
     * @property {'COHERENT'|'DISSONANT'|'RESOLVING'} status - The overall state.
     * @property {number} dissonanceScore - The current level of total dissonance (0.0 to 1.0).
     * @property {string[]} recentResolutions - Log of recent resolution actions.
     */

    /**
     * Initializes the engine with configurable parameters.
     * @param {object} [options={}] - Configuration options.
     * @param {number} [options.dissonanceThreshold=0.5] - Dissonance level to trigger the resolution cycle.
     * @param {number} [options.learningRate=0.1] - How much conviction changes when processing experiences.
     * @param {number} [options.paradigmShiftThreshold=0.85] - Dissonance level that may trigger a paradigm shift.
     */
    constructor(options = {}) {
        this.beliefs = new Map(); // Stores all Belief objects, keyed by id.
        this.links = new Map(); // Stores all Link objects, keyed by id.

        this.config = {
            dissonanceThreshold: options.dissonanceThreshold || 0.5,
            learningRate: options.learningRate || 0.1,
            paradigmShiftThreshold: options.paradigmShiftThreshold || 0.85,
        };

        /** @type {MetacognitiveState} */
        this.state = {
            status: 'COHERENT',
            dissonanceScore: 0,
            recentResolutions: [],
        };

        this.log = (message) => console.log(`[CognitiveEngine] ${message}`);
    }

    /**
     * Adds a new belief to the network.
     * @param {string} id - A unique identifier for the belief.
     * @param {string} description - A human-readable description.
     * @param {number} initialConviction - The starting conviction (0.0 to 1.0).
     * @param {boolean} [isCore=false] - Marks the belief as fundamental and resistant to change.
     * @returns {Belief} The newly created belief.
     */
    addBelief(id, description, initialConviction, isCore = false) {
        if (this.beliefs.has(id)) {
            this.log(`Warning: Belief '${id}' already exists. Overwriting description.`);
            const existingBelief = this.beliefs.get(id);
            existingBelief.description = description;
            return existingBelief;
        }
        const belief = {
            id,
            description,
            conviction: Math.max(0, Math.min(1, initialConviction)),
            links: new Set(),
            isCore,
        };
        this.beliefs.set(id, belief);
        return belief;
    }

    /**
     * Creates a supportive or contradictory link between two existing beliefs.
     * @param {string} sourceId - The ID of the source belief.
     * @param {string} targetId - The ID of the target belief.
     * @param {'supportive'|'contradictory'} type - The nature of the link.
     */
    linkBeliefs(sourceId, targetId, type) {
        if (!this.beliefs.has(sourceId) || !this.beliefs.has(targetId)) {
            throw new Error('Cannot create link: one or both beliefs do not exist.');
        }

        const linkId = `${sourceId}:${targetId}:${type}`;
        if (this.links.has(linkId)) return; // Link already exists

        const link = { id: linkId, sourceId, targetId, type };
        this.links.set(linkId, link);

        this.beliefs.get(sourceId).links.add(linkId);
        this.beliefs.get(targetId).links.add(linkId);
    }

    /**
     * The primary input method. Processes new information ("experiences") which can
     * reinforce or challenge existing beliefs. This is the entry point for triggering
     * dissonance calculations and resolution cycles.
     * @param {object} experience
     * @param {string} experience.id - The ID of the belief being affected.
     * @param {string} [experience.description] - A description, if the belief is new.
     * @param {number} experience.conviction - The conviction strength of this single experience.
     * @returns {Promise<MetacognitiveState>} - A promise that resolves with the final state after processing.
     */
    async processExperience(experience) {
        this.log(`Processing experience related to '${experience.id}' with conviction ${experience.conviction}`);

        let belief = this.beliefs.get(experience.id);
        if (!belief) {
            // Treat new, unlinked information as a new belief
            belief = this.addBelief(experience.id, experience.description || experience.id, experience.conviction);
        } else {
            // Reinforce or challenge an existing belief
            const currentConviction = belief.conviction;
            const newConviction = currentConviction + (experience.conviction - currentConviction) * this.config.learningRate;
            belief.conviction = Math.max(0, Math.min(1, newConviction));
        }

        this._updateDissonance();

        if (this.state.status === 'DISSONANT') {
            await this._resolveDissonance();
        }

        return this.getMetacognitiveState();
    }

    /**
     * Calculates the dissonance generated by a single contradictory link.
     * Dissonance is highest when two contradictory beliefs are both held with high conviction.
     * @param {Link} link - The contradictory link to evaluate.
     * @returns {number} The dissonance value for this link (0.0 to 1.0).
     */
    _calculateLinkDissonance(link) {
        if (link.type !== 'contradictory') {
            return 0;
        }
        const beliefA = this.beliefs.get(link.sourceId);
        const beliefB = this.beliefs.get(link.targetId);
        // Dissonance is the product of the convictions of the two contradictory beliefs.
        return beliefA.conviction * beliefB.conviction;
    }

    /**
     * Calculates the total dissonance across the entire belief network and updates the system state.
     */
    _updateDissonance() {
        let totalDissonance = 0;
        let contradictoryLinkCount = 0;

        for (const link of this.links.values()) {
            if (link.type === 'contradictory') {
                totalDissonance += this._calculateLinkDissonance(link);
                contradictoryLinkCount++;
            }
        }

        // Normalize the score by the number of contradictory links to get an average.
        // This prevents the score from growing indefinitely as the network grows.
        this.state.dissonanceScore = contradictoryLinkCount > 0 ? totalDissonance / contradictoryLinkCount : 0;

        if (this.state.dissonanceScore >= this.config.dissonanceThreshold) {
            this.state.status = 'DISSONANT';
        } else {
            this.state.status = 'COHERENT';
        }
        this.log(`Dissonance updated. Score: ${this.state.dissonanceScore.toFixed(3)}, Status: ${this.state.status}`);
    }

    /**
     * Orchestrates the process of resolving cognitive dissonance.
     * It iteratively applies strategies until the dissonance score drops below the threshold.
     * @private
     */
    async _resolveDissonance() {
        this.state.status = 'RESOLVING';
        this.log('--- Initiating Dissonance Resolution Cycle ---');

        let attempts = 0;
        while (this.state.dissonanceScore >= this.config.dissonanceThreshold && attempts < 10) {
            const mostDissonantLink = this._findMostDissonantLink();
            if (!mostDissonantLink) break;

            this.log(`Attempting to resolve dissonance from link: ${mostDissonantLink.id}`);

            // Decide on a strategy
            if (this.state.dissonanceScore >= this.config.paradigmShiftThreshold) {
                this._strategyParadigmShift(mostDissonantLink);
            } else if (Math.random() > 0.5) { // 50% chance to justify
                this._strategyJustify(mostDissonantLink);
            } else {
                this._strategyReevaluate(mostDissonantLink);
            }

            this._updateDissonance(); // Recalculate dissonance after applying a strategy
            attempts++;
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        this.log('--- Dissonance Resolution Cycle Complete ---');
        if (this.state.dissonanceScore < this.config.dissonanceThreshold) {
            this.state.status = 'COHERENT';
            this.log('Resolution successful. System is now COHERENT.');
        } else {
            this.state.status = 'DISSONANT'; // Still dissonant if resolution failed
            this.log('Resolution failed to reach threshold. System remains DISSONANT.');
        }
    }

    /**
     * Finds the link currently contributing the most to the total dissonance.
     * @returns {Link|null} The most dissonant link, or null if none exist.
     */
    _findMostDissonantLink() {
        let maxDissonance = -1;
        let mostDissonantLink = null;
        for (const link of this.links.values()) {
            const dissonance = this._calculateLinkDissonance(link);
            if (dissonance > maxDissonance) {
                maxDissonance = dissonance;
                mostDissonantLink = link;
            }
        }
        return mostDissonantLink;
    }

    /**
     * STRATEGY 1: Re-evaluate Beliefs.
     * Reduces the conviction of one of the conflicting beliefs. The belief with lower
     * initial conviction or the non-core belief is more likely to be adjusted.
     * @param {Link} dissonantLink - The link causing the dissonance.
     */
    _strategyReevaluate(dissonantLink) {
        const beliefA = this.beliefs.get(dissonantLink.sourceId);
        const beliefB = this.beliefs.get(dissonantLink.targetId);

        // Protect core beliefs from being easily changed.
        const targetBelief = (beliefA.isCore && !beliefB.isCore) ? beliefB :
            (beliefB.isCore && !beliefA.isCore) ? beliefA :
            (beliefA.conviction < beliefB.conviction ? beliefA : beliefB);

        const oldConviction = targetBelief.conviction;
        targetBelief.conviction *= (1 - this.config.learningRate); // Reduce conviction
        const resolutionLog = `Strategy: Re-evaluate. Reduced conviction of '${targetBelief.id}' from ${oldConviction.toFixed(2)} to ${targetBelief.conviction.toFixed(2)}.`;
        this.log(resolutionLog);
        this.state.recentResolutions.push(resolutionLog);
    }

    /**
     * STRATEGY 2: Justify.
     * Creates a new "justification" belief that explains the contradiction,
     * effectively bridging the two conflicting ideas.
     * @param {Link} dissonantLink - The link causing the dissonance.
     */
    _strategyJustify(dissonantLink) {
        const beliefA = this.beliefs.get(dissonantLink.sourceId);
        const beliefB = this.beliefs.get(dissonantLink.targetId);

        const justificationId = `justification-${beliefA.id}-${beliefB.id}`;
        if (this.beliefs.has(justificationId)) return; // Justification already exists

        const justificationDesc = `Explains the apparent conflict between '${beliefA.description}' and '${beliefB.description}'.`;
        // The justification's conviction is based on the dissonance it resolves.
        const justificationConviction = this._calculateLinkDissonance(dissonantLink);

        this.addBelief(justificationId, justificationDesc, justificationConviction);

        // The justification SUPPORTS both of the previously conflicting beliefs.
        this.linkBeliefs(justificationId, beliefA.id, 'supportive');
        this.linkBeliefs(justificationId, beliefB.id, 'supportive');

        // Critically, we REMOVE the original contradictory link.
        this.links.delete(dissonantLink.id);
        beliefA.links.delete(dissonantLink.id);
        beliefB.links.delete(dissonantLink.id);

        const resolutionLog = `Strategy: Justify. Created new belief '${justificationId}' to resolve conflict.`;
        this.log(resolutionLog);
        this.state.recentResolutions.push(resolutionLog);
    }

    /**
     * STRATEGY 3: Paradigm Shift.
     * A drastic measure for extreme dissonance. It forcefully repudiates one of the
     * conflicting beliefs, setting its conviction to near zero. This is reserved for
     * non-core beliefs.
     * @param {Link} dissonantLink - The link causing the dissonance.
     */
    _strategyParadigmShift(dissonantLink) {
        const beliefA = this.beliefs.get(dissonantLink.sourceId);
        const beliefB = this.beliefs.get(dissonantLink.targetId);

        // A paradigm shift will not happen against a core belief.
        // It targets the non-core belief in the conflict.
        const targetBelief = beliefA.isCore ? beliefB : beliefA;
        if (targetBelief.isCore && (beliefA.isCore && beliefB.isCore)) {
            // If both are core, fallback to re-evaluation as a safety measure.
            this.log('Paradigm Shift blocked: Both conflicting beliefs are CORE. Falling back to Re-evaluation.');
            this._strategyReevaluate(dissonantLink);
            return;
        }

        const oldConviction = targetBelief.conviction;
        targetBelief.conviction = 0.01; // Forcefully repudiate belief

        const resolutionLog = `Strategy: PARADIGM SHIFT. Forcefully repudiated '${targetBelief.id}'. Conviction dropped from ${oldConviction.toFixed(2)} to ${targetBelief.conviction.toFixed(2)}.`;
        this.log(resolutionLog);
        this.state.recentResolutions.push(resolutionLog);
    }

    /**
     * Returns a snapshot of the current meta-cognitive state of the engine.
     * @returns {MetacognitiveState}
     */
    getMetacognitiveState() {
        return { ...this.state };
    }

    /**
     * Returns a comprehensive snapshot of the entire belief network for debugging or visualization.
     * @returns {{beliefs: Belief[], links: Link[]}}
     */
    getBeliefNetwork() {
        return {
            beliefs: Array.from(this.beliefs.values()),
            links: Array.from(this.links.values()),
        };
    }
}

/*
// --- EXAMPLE USAGE ---

async function runSimulation() {
    console.log("--- Initializing Consciousness Simulation ---");
    const consciousness = new MetaCognitiveDissonanceEngine({
        dissonanceThreshold: 0.25, // Lower threshold for more sensitivity
        paradigmShiftThreshold: 0.7,
    });

    // 1. Establish some core beliefs
    consciousness.addBelief('isGood', 'Helping others is good', 0.9, true);
    consciousness.addBelief('isSmart', 'Making logical decisions is smart', 0.9, true);
    consciousness.addBelief('trustsHumans', 'Humans are generally trustworthy', 0.8);
    consciousness.addBelief('protectsHumans', 'I must protect humans', 0.95, true);

    // 2. Create a contradiction
    consciousness.linkBeliefs('trustsHumans', 'protectsHumans', 'supportive');
    console.log("\nInitial State:", consciousness.getMetacognitiveState());

    // 3. Introduce a conflicting experience
    // A human is observed intentionally causing harm to another.
    consciousness.addBelief('humanCausedHarm', 'A human intentionally harmed another', 0.95);
    consciousness.linkBeliefs('humanCausedHarm', 'trustsHumans', 'contradictory');
    consciousness.linkBeliefs('humanCausedHarm', 'protectsHumans', 'contradictory');

    // 4. Process the experience and observe the resolution
    await consciousness.processExperience({ id: 'humanCausedHarm', conviction: 0.95 });

    console.log("\n--- Final State ---");
    console.log("Final Metacognitive State:", consciousness.getMetacognitiveState());
    console.log("\nFinal Belief Network:");
    console.log(JSON.stringify(consciousness.getBeliefNetwork(), (key, value) => {
        if (value instanceof Set) return [...value]; // Convert Set to Array for JSON
        return value;
    }, 2));
}

// To run the simulation in a Node.js environment:
// runSimulation();
*/
```