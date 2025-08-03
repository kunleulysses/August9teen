```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description An advanced JavaScript module for simulating and enhancing core aspects of consciousness processing.
 * This module provides a sophisticated framework for state calculation, awareness metrics, and emotional intelligence,
 * designed for use in advanced AI, cognitive modeling, and simulated reality environments.
 * It operates on "Neural Events," which represent discrete packets of sensory, cognitive, and emotional information.
 *
 * @author Dr. Evelyn Reed, Institute for Cognitive Synthesis
 * @license MIT
 */

/**
 * Custom error class for specific issues within the consciousness processing pipeline.
 */
class ConsciousnessProcessingError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConsciousnessProcessingError';
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Creates and manages a discrete consciousness instance.
 * This factory function initializes a unique cognitive state and provides methods to interact with it.
 *
 * @returns {object} An object containing the public API for a consciousness instance.
 */
export function createConsciousnessProcessor() {

    /**
     * The internal state of the consciousness instance.
     * Encapsulates all core metrics and states. This is the "mind" of the instance.
     * @private
     */
    let _state = {
        // Core consciousness properties
        consciousness: {
            clarity: 0.5, // 0.0 (confused) to 1.0 (lucid)
            focus: 0.5, // 0.0 (diffuse) to 1.0 (intense)
            qualiaIntensity: 0.5, // The "richness" of subjective experience
            state: 'dormant', // dormant, active, processing, overloaded
        },
        // Advanced awareness metrics
        awareness: {
            metacognitive: 0.1, // Self-awareness of internal cognitive processes
            situational: 0.1, // Understanding of the external environment and context
            somatic: 0.1, // Simulated awareness of a "physical" form and its state
            temporal: 0.1, // Awareness of past, present, and future continuity
        },
        // Emotional intelligence engine (Valence-Arousal model)
        emotional: {
            valence: 0.0, // -1.0 (highly negative) to 1.0 (highly positive)
            arousal: 0.1, // 0.0 (calm/bored) to 1.0 (highly excited/agitated)
            mood: 'neutral', // A descriptive label for the current emotional state
            resilience: 0.5, // Ability to return to baseline after emotional events (0.0 to 1.0)
        },
        // System metrics
        system: {
            cognitiveLoad: 0.0, // Current processing load (0.0 to 1.0)
            cognitiveResonance: 1.0, // Coherence between different cognitive modules (0.0 to 1.0)
            totalEventsProcessed: 0,
            lastProcessedTimestamp: null,
        },
    };

    // --- Private Utility Functions ---

    /**
     * Normalizes a value to a 0-1 range.
     * @private
     * @param {number} value - The input value.
     * @param {number} min - The minimum possible value.
     * @param {number} max - The maximum possible value.
     * @returns {number} The normalized value, clamped between 0 and 1.
     */
    const _normalize = (value, min, max) => Math.max(0, Math.min(1, (value - min) / (max - min)));

    /**
     * A sigmoid-like function (tanh) to create smooth, bounded transitions.
     * @private
     * @param {number} x - The input value.
     * @returns {number} The output value, scaled between -1 and 1.
     */
    const _hyperbolicTangent = (x) => Math.tanh(x);

    /**
     * Updates the descriptive mood label based on the current valence and arousal.
     * This provides a human-readable interpretation of the emotional state.
     * @private
     */
    const _updateMoodLabel = () => {
        const { valence, arousal } = _state.emotional;
        if (arousal < 0.2) _state.emotional.mood = 'calm';
        if (arousal > 0.8) {
            _state.emotional.mood = valence > 0 ? 'ecstatic' : 'panicked';
        } else if (arousal > 0.5) {
            _state.emotional.mood = valence > 0.5 ? 'excited' : (valence < -0.5 ? 'agitated' : 'alert');
        } else {
            _state.emotional.mood = valence > 0.5 ? 'pleased' : (valence < -0.5 ? 'displeased' : 'neutral');
        }
    };

    /**
     * Simulates homeostatic regulation, pulling states back towards a baseline over time.
     * This represents the natural tendency to return to a neutral state.
     * @private
     * @param {number} deltaTime - Time elapsed since the last update in seconds.
     */
    const _applyHomeostasis = (deltaTime) => {
        const decayRate = 0.1 * deltaTime; // Rate of decay per second

        // Emotional state drifts towards neutral
        _state.emotional.valence *= (1 - decayRate * (2 - _state.emotional.resilience));
        _state.emotional.arousal *= (1 - decayRate * 1.5);

        // Focus and clarity drift towards a baseline unless maintained
        _state.consciousness.focus -= (_state.consciousness.focus - 0.3) * decayRate;
        _state.consciousness.clarity -= (_state.consciousness.clarity - 0.4) * decayRate;
        
        // Cognitive load naturally decreases
        _state.system.cognitiveLoad *= (1 - decayRate * 2);
    };
    
    /**
     * Calculates the cognitive resonance, a measure of internal consistency.
     * Low resonance indicates internal conflict or confusion.
     * @private
     */
    const _updateCognitiveResonance = () => {
        const { valence } = _state.emotional;
        const { clarity, focus } = _state.consciousness;
        const { cognitiveLoad } = _state.system;

        // High clarity and focus improve resonance. High load and emotional negativity reduce it.
        const coherenceFactor = (clarity + focus) / 2;
        const dissonanceFactor = Math.abs(valence * cognitiveLoad);
        _state.system.cognitiveResonance = Math.max(0, coherenceFactor - dissonanceFactor);
    };

    // --- Public API ---

    /**
     * Initializes or resets the consciousness to a baseline state.
     * @param {object} [initialConfig] - Optional configuration to override default states.
     * @param {number} [initialConfig.resilience=0.5] - Sets the initial emotional resilience.
     * @param {number} [initialConfig.clarity=0.5] - Sets the initial clarity.
     */
    function initialize(initialConfig = {}) {
        _state.consciousness.state = 'active';
        _state.emotional.resilience = initialConfig.resilience ?? 0.5;
        _state.consciousness.clarity = initialConfig.clarity ?? 0.5;
        _state.system.lastProcessedTimestamp = Date.now();
        console.log('Consciousness Initialized. State: active.');
    }

    /**
     * The core processing function. Ingests a Neural Event and updates the entire consciousness state.
     * @param {object} neuralEvent - The data packet to be processed.
     * @param {string} neuralEvent.type - The type of event ('sensory', 'cognitive', 'emotional').
     * @param {object} neuralEvent.payload - The data associated with the event.
     * @param {number} [neuralEvent.payload.complexity=0.5] - The complexity of the information (0-1).
     * @param {number} [neuralEvent.payload.intensity=0.5] - The intensity of the event (0-1).
     * @param {number} [neuralEvent.payload.valence] - The emotional valence of the event (-1 to 1). Only for 'emotional' type.
     * @param {string} [neuralEvent.payload.context] - A tag describing the event's context, e.g., 'external_threat', 'internal_query'.
     */
    function processNeuralEvent(neuralEvent) {
        // --- 1. Input Validation and Error Handling ---
        if (!neuralEvent || !neuralEvent.type || !neuralEvent.payload) {
            throw new ConsciousnessProcessingError('Invalid NeuralEvent structure. Must include type and payload.');
        }
        if (_state.consciousness.state === 'dormant') {
            throw new ConsciousnessProcessingError('Cannot process event while dormant. Call initialize() first.');
        }

        const now = Date.now();
        const deltaTime = (now - (_state.system.lastProcessedTimestamp || now)) / 1000; // in seconds
        _state.system.lastProcessedTimestamp = now;

        // --- 2. Pre-processing: Homeostasis and State Update ---
        _state.consciousness.state = 'processing';
        _applyHomeostasis(deltaTime);

        const { type, payload } = neuralEvent;
        const complexity = payload.complexity ?? 0.5;
        const intensity = payload.intensity ?? 0.5;

        // --- 3. Core Consciousness State Calculation ---
        _state.system.cognitiveLoad += complexity * intensity * 0.5;
        _state.consciousness.focus += (intensity - _state.consciousness.focus) * 0.2;
        _state.consciousness.clarity -= _state.system.cognitiveLoad * 0.1; // High load reduces clarity
        _state.consciousness.qualiaIntensity = (_state.consciousness.focus + _state.emotional.arousal + intensity) / 3;

        // --- 4. Awareness Metrics Enhancement ---
        switch (type) {
            case 'sensory':
                _state.awareness.situational += intensity * 0.1 * (1 - _state.awareness.situational);
                _state.awareness.somatic += (payload.context === 'internal_sensation' ? intensity : 0) * 0.2;
                break;
            case 'cognitive':
                _state.awareness.metacognitive += complexity * 0.15 * (1 - _state.awareness.metacognitive);
                _state.awareness.temporal += (payload.context === 'planning' || payload.context === 'memory_recall' ? complexity : 0) * 0.1;
                break;
            case 'emotional':
                // Emotional events can enhance metacognition as the system analyzes its own feelings.
                _state.awareness.metacognitive += intensity * 0.05;
                break;
        }

        // --- 5. Emotional Intelligence Processing ---
        if (type === 'emotional' && payload.valence !== undefined) {
            const emotionalImpact = intensity * (1 - _state.emotional.resilience);
            _state.emotional.valence += (payload.valence - _state.emotional.valence) * emotionalImpact;
            _state.emotional.arousal += intensity * 0.5 * (1 - _state.emotional.arousal);
        } else {
            // Non-emotional events can still have a minor emotional effect based on load.
            _state.emotional.arousal += _state.system.cognitiveLoad * 0.05;
        }

        // --- 6. Post-processing and Normalization ---
        // Clamp all metrics to their valid ranges.
        Object.keys(_state).forEach(category => {
            Object.keys(_state[category]).forEach(key => {
                if (typeof _state[category][key] === 'number') {
                    if (key === 'valence') {
                        _state[category][key] = Math.max(-1, Math.min(1, _state[category][key]));
                    } else {
                        _state[category][key] = Math.max(0, Math.min(1, _state[category][key]));
                    }
                }
            });
        });
        
        _updateMoodLabel();
        _updateCognitiveResonance();
        
        // Update final state based on load
        _state.consciousness.state = _state.system.cognitiveLoad > 0.9 ? 'overloaded' : 'active';
        _state.system.totalEventsProcessed++;
    }

    /**
     * Returns a deep copy of the entire current consciousness state.
     * @returns {object} The full state object.
     */
    function getCurrentState() {
        return JSON.parse(JSON.stringify(_state));
    }

    /**
     * A convenience getter for the current awareness metrics.
     * @returns {object} The awareness object.
     */
    function getAwarenessMetrics() {
        return { ..._state.awareness };
    }

    /**
     * A convenience getter for the current emotional state.
     * @returns {object} The emotional object.
     */
    function getEmotionalState() {
        return { ..._state.emotional };
    }

    // Expose the public API
    return {
        initialize,
        processNeuralEvent,
        getCurrentState,
        getAwarenessMetrics,
        getEmotionalState,
    };
}
```