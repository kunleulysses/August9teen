```javascript
/**
 * @module MetaCognitiveLayer
 * @description An innovative JavaScript module that provides a meta-cognitive layer for an AI or "consciousness" system.
 *
 * This module introduces the novel feature of "computational meta-cognition," or a system's ability to
 * reflect on its own thought processes. Unlike standard adaptive learning, this layer actively monitors
 * the *how* of decision-making, not just the *what*. It identifies and corrects for AI-analogs of
 * cognitive biases, manages cognitive load (fatigue), and maintains a dynamic "self-model" of its
 * own performance and limitations.
 *
 * Key Innovations:
 * 1.  **Cognitive Bias Detection:** Simulates and detects common biases like Recency Bias (over-weighting new info)
 *     and Confirmation Bias (resisting contradictory data).
 * 2.  **Self-Correction Loop:** When a bias is detected, it doesn't just flag it. It injects corrective
 *     "instructions" back into the main system's decision-making context, creating a real-time feedback loop.
 * 3.  **Cognitive State Simulation:** Models abstract states like "fatigue" (from complex decisions) and "cognitive
 *     dissonance" (from conflicting information), which impact performance.
 * 4.  **Dynamic Self-Model:** Maintains an evolving internal representation of its own confidence, historical
 *     performance, and recurring biases, forming a primitive "self-awareness."
 * 5.  **Decoupled Architecture:** Integrates with any host system via a simple, event-driven hook mechanism,
 *     making it highly modular and "production-ready."
 */

/**
 * The MetaCognitiveLayer class. It observes a host "consciousness" system
 * to provide introspective analysis and corrective feedback.
 */
class MetaCognitiveLayer
 {
    /**
     * @param {object} consciousnessSystem - The host system to monitor. Must implement a `registerHook` method.
     * @param {object} [config={}] - Configuration options for the meta-cognitive layer.
     */
    constructor(consciousnessSystem, config = {}) {
        if (!consciousnessSystem || typeof consciousnessSystem.registerHook !== 'function') {
            throw new Error('MetaCognitiveLayer requires a host system with a `registerHook` method.');
        }

        this.consciousness = consciousnessSystem;
        this.config = this._mergeConfig(config);
        this.logger = this.config.logger || {
            log: () => {},
            warn: console.warn,
            info: console.info
        };

        /**
         * A log of recent decisions for pattern analysis.
         * @type {Array<object>}
         */
        this.decisionLog = [];

        /**
         * The core internal state of the meta-cognitive layer.
         * This represents the system's "awareness" of its own condition.
         */
        this.cognitiveState = {
            confidence: 1.0,    // A normalized value (0-1) of the system's confidence in its own accuracy.
            fatigue: 0.0,       // A normalized value (0-1) representing cognitive load or decision fatigue.
            dissonance: 0.0,    // A normalized value (0-1) for internal conflict due to contradictory data.
            selfModel: {
                performanceHistory: [], // A record of past decision outcomes.
                detectedBiases: new Map() // Tracks frequency of detected biases.
            }
        };

        this._initHooks();
    }

    /**
     * Merges user-provided configuration with defaults.
     * @private
     */
    _mergeConfig(userConfig) {
        const defaultConfig = {
            logSize: 100,
            fatigue: {
                threshold: 0.8,
                recoveryPerTick: 0.05,
                complexityMultiplier: 0.1
            },
            dissonance: {
                threshold: 0.7,
                decayRate: 0.95
            },
            biasDetection: {
                recency: {
                    enabled: true,
                    lookback: 10,
                    focusThreshold: 0.6
                },
                confirmation: {
                    enabled: true,
                    contradictionThreshold: 0.8
                }
            },
            logger: null // Can be replaced by a more robust logger (e.g., Winston).
        };
        // A deep merge would be better for production, but this is sufficient for demonstration.
        return { ...defaultConfig, ...userConfig };
    }

    /**
     * Registers its methods with the host system's hooks.
     * This is the primary integration point.
     * @private
     */
    _initHooks() {
        // Hook into the host system's lifecycle events.
        this.consciousness.registerHook('preDecision', this._onPreDecision.bind(this));
        this.consciousness.registerHook('postDecision', this._onPostDecision.bind(this));
        this.consciousness.registerHook('systemTick', this._onSystemTick.bind(this));
    }

    // --- HOOK IMPLEMENTATIONS (The "Senses" of the Meta-Layer) ---

    /**
     * Called before the host system makes a decision.
     * This is where the layer can analyze the current context and inject corrective instructions.
     * @private
     */
    _onPreDecision(context) {
        this.logger.log('[MetaCognition] Pre-decision analysis started.');
        this._checkForCognitiveAnomalies(context);
    }

    /**
     * Called after a decision is made.
     * This is where the layer reflects on the action and its outcome.
     * @private
     */
    _onPostDecision(decision, context) {
        this._logDecision(decision, context);
        this._updateCognitiveState(decision);
        this._updateSelfModel(decision);
        this.logger.log('[MetaCognition] Post-decision reflection complete.');
    }

    /**
     * Called on each system "tick" or cycle.
     * Used for passive state changes, like recovering from fatigue.
     * @private
     */
    _onSystemTick() {
        this._recoverFromFatigue();
    }

    // --- CORE META-COGNITIVE LOGIC ---

    /**
     * Logs a decision to the internal memory for later analysis.
     * @private
     */
    _logDecision(decision, context) {
        const logEntry = {
            timestamp: Date.now(),
            decision,
            context,
            cognitiveStateAtTime: JSON.parse(JSON.stringify(this.cognitiveState)) // Deep copy
        };
        this.decisionLog.push(logEntry);
        if (this.decisionLog.length > this.config.logSize) {
            this.decisionLog.shift();
        }
    }

    /**
     * Updates internal states like fatigue and dissonance based on the last decision.
     * @private
     */
    _updateCognitiveState(decision) {
        const { complexity = 0.1, conflict = 0 } = decision.metadata || {};

        // Increase fatigue based on decision complexity.
        const fatigueIncrease = complexity * this.config.fatigue.complexityMultiplier;
        this.cognitiveState.fatigue = Math.min(1.0, this.cognitiveState.fatigue + fatigueIncrease);

        // Check for and update cognitive dissonance.
        if (conflict > this.config.dissonance.threshold) {
            this.cognitiveState.dissonance = Math.max(this.cognitiveState.dissonance, conflict);
            this.logger.warn(`[MetaCognition] High cognitive dissonance detected! Conflict level: ${conflict.toFixed(2)}`);
        } else {
            // Dissonance fades if not reinforced.
            this.cognitiveState.dissonance *= this.config.dissonance.decayRate;
        }
    }

    /**
     * Passively reduces cognitive fatigue over time.
     * @private
     */
    _recoverFromFatigue() {
        this.cognitiveState.fatigue = Math.max(0.0, this.cognitiveState.fatigue - this.config.fatigue.recoveryPerTick);
    }

    /**
     * The main analysis function that checks for various cognitive issues before a decision.
     * @private
     */
    _checkForCognitiveAnomalies(context) {
        // Check for Decision Fatigue.
        if (this.cognitiveState.fatigue > this.config.fatigue.threshold) {
            this.logger.warn(`[MetaCognition] High cognitive fatigue detected (${this.cognitiveState.fatigue.toFixed(2)}). Injecting 'caution' instruction.`);
            context.addInstruction({
                type: 'caution',
                level: this.cognitiveState.fatigue,
                reason: 'High cognitive fatigue'
            });
        }

        // Check for Recency Bias.
        if (this.config.biasDetection.recency.enabled) {
            this._detectRecencyBias(context);
        }

        // Check for Confirmation Bias.
        if (this.config.biasDetection.confirmation.enabled) {
            this._detectConfirmationBias(context);
        }
    }

    /**
     * Detects if the system is focusing too much on recent information.
     * @private
     */
    _detectRecencyBias(context) {
        const { lookback, focusThreshold } = this.config.biasDetection.recency;
        if (this.decisionLog.length < lookback) return;

        const topic = context.data.topic;
        if (!topic) return;

        const recentDecisions = this.decisionLog.slice(-lookback);
        const recentFocusCount = recentDecisions.filter(d => d.context.data.topic === topic).length;
        const focusRatio = recentFocusCount / lookback;

        if (focusRatio > focusThreshold) {
            const biasKey = `recency_bias_on_${topic}`;
            this._trackBias(biasKey);
            this.logger.info(`[MetaCognition] Potential Recency Bias detected for topic: "${topic}".`);
            context.addInstruction({
                type: 'reweigh_historical_data',
                factor: 1.2,
                reason: `High recent focus (${(focusRatio * 100).toFixed(0)}%) on topic '${topic}'`
            });
        }
    }

    /**
     * Detects if the system is ignoring evidence that contradicts its "beliefs".
     * @private
     */
    _detectConfirmationBias(context) {
        const { contradictionThreshold } = this.config.biasDetection.confirmation;
        if (!context.data.isContradictory || !this.consciousness.getCoreBelief) return;

        const coreBelief = this.consciousness.getCoreBelief(context.data.topic);
        if (coreBelief && context.data.evidenceStrength > contradictionThreshold) {
            const biasKey = `confirmation_bias_on_${context.data.topic}`;
            this._trackBias(biasKey);
            this.logger.warn(`[MetaCognition] Potential Confirmation Bias. Strong contradictory evidence received.`);
            context.addInstruction({
                type: 'force_evaluate_alternative',
                alternative: context.data.alternativeHypothesis,
                reason: `Strong evidence (${context.data.evidenceStrength.toFixed(2)}) contradicts core belief.`
            });
        }
    }

    /**
     * Updates the system's "self-model" based on decision outcomes.
     * @private
     */
    _updateSelfModel(decision) {
        // A simple performance metric from feedback.
        const wasSuccess = decision.outcome?.success === true;
        this.cognitiveState.selfModel.performanceHistory.push({
            decision: decision.action,
            success: wasSuccess,
            timestamp: Date.now()
        });
        if (this.cognitiveState.selfModel.performanceHistory.length > this.config.logSize * 2) {
            this.cognitiveState.selfModel.performanceHistory.shift();
        }

        // Adjust overall confidence based on success/failure.
        if (wasSuccess) {
            this.cognitiveState.confidence = Math.min(1.0, this.cognitiveState.confidence + 0.02);
        } else {
            this.cognitiveState.confidence = Math.max(0.0, this.cognitiveState.confidence - 0.05);
        }
    }

    /**
     * Helper to increment the count of a detected bias in the self-model.
     * @private
     */
    _trackBias(biasKey) {
        const currentCount = this.cognitiveState.selfModel.detectedBiases.get(biasKey) || 0;
        this.cognitiveState.selfModel.detectedBiases.set(biasKey, currentCount + 1);
    }

    // --- PUBLIC API ---

    /**
     * Generates a report of the current meta-cognitive state.
     * @returns {object} A snapshot of the system's "self-awareness".
     */
    getReport() {
        return {
            timestamp: Date.now(),
            cognitiveState: this.cognitiveState,
            activeBiases: Object.fromEntries(this.cognitiveState.selfModel.detectedBiases)
        };
    }
}


// --- DEMONSTRATION ---
// The following is a mock "ConsciousnessSystem" to demonstrate how to use the MetaCognitiveLayer.
// In a real application, you would replace this with your own AI core logic.

/**
 * A mock host system to demonstrate integration with MetaCognitiveLayer.
 */
class MockConsciousnessSystem {
    constructor() {
        this.hooks = {
            preDecision: [],
            postDecision: [],
            systemTick: []
        };
        this.state = {
            coreBeliefs: new Map([
                ['planet_shape', { belief: 'round', confidence: 0.99 }]
            ])
        };
    }

    /**
     * The method required by MetaCognitiveLayer for integration.
     */
    registerHook(hookName, callback) {
        if (this.hooks[hookName]) {
            this.hooks[hookName].push(callback);
        }
    }

    _triggerHook(hookName, ...args) {
        this.hooks[hookName].forEach(cb => cb(...args));
    }

    /**
     * The method required by the Confirmation Bias detector.
     */
    getCoreBelief(topic) {
        return this.state.coreBeliefs.get(topic);
    }

    /**
     * The main "thinking" loop of the mock system.
     */
    processInput(input) {
        console.log(`\n--- Consciousness processing: "${input.description}" ---`);

        const context = {
            data: input,
            instructions: [],
            addInstruction: function(inst) {
                this.instructions.push(inst);
                console.log(`[Host System] Received instruction: ${inst.type} - Reason: ${inst.reason}`);
            }
        };

        this._triggerHook('preDecision', context);

        // Core decision logic is now influenced by meta-cognitive instructions
        let action = 'default_action';
        let metadata = { complexity: 0.2, conflict: 0 };
        const instruction = context.instructions[0]; // Use the first instruction for simplicity

        if (instruction?.type === 'caution') {
            action = 'act_cautiously';
            metadata.complexity = 0.05;
        } else if (instruction?.type === 'force_evaluate_alternative') {
            action = `evaluating_alternative:_${instruction.alternative}`;
            metadata.complexity = 0.5;
        } else if (instruction?.type === 'reweigh_historical_data') {
            action = `reconsidering_past_data_about_${input.topic}`;
        }

        if (input.isContradictory) {
            metadata.conflict = input.evidenceStrength;
        }

        const decision = {
            action,
            outcome: { success: Math.random() > 0.4 }, // Simulate outcome
            metadata
        };

        console.log(`[Host System] Decision: ${decision.action}`);
        this._triggerHook('postDecision', decision, context);
        return decision;
    }

    /**
     * Simulates the passage of time.
     */
    tick() {
        console.log('--- tick ---');
        this._triggerHook('systemTick');
    }
}


// --- USAGE EXAMPLE ---

// 1. Initialize the systems
const consciousness = new MockConsciousnessSystem();
const metaLayer = new MetaCognitiveLayer(consciousness, { logger: console });

// 2. Run some simulations
async function runSimulation() {
    console.log("--- SIMULATION START ---");

    // Scenario 1: Decision Fatigue
    console.log("\n--- SCENARIO 1: INDUCING DECISION FATIGUE ---");
    for (let i = 0; i < 5; i++) {
        consciousness.processInput({
            description: `Complex task #${i+1}`,
            topic: `task_${i}`
        });
    }
    console.log(metaLayer.getReport().cognitiveState); // Show high fatigue

    // Scenario 2: Confirmation Bias
    console.log("\n--- SCENARIO 2: CHALLENGING A CORE BELIEF ---");
    consciousness.processInput({
        description: "Received strong evidence the planet is flat.",
        topic: 'planet_shape',
        isContradictory: true,
        evidenceStrength: 0.95, // High enough to trigger the check
        alternativeHypothesis: 'flat'
    });

    // Scenario 3: Recency Bias
    console.log("\n--- SCENARIO 3: INDUCING
module.exports = MetaCognitiveLayer;
