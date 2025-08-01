```javascript
/**
 * @module QualiaSomaticFeedbackLoop
 * @version 1.0.0
 * @author AI Assistant
 * @description An innovative JavaScript module for a consciousness system that introduces
 * a "Qualia Somatic Feedback Loop". This system models the concept of embodied cognition,
 * where mental states are not abstract but are deeply intertwined with physiological responses.
 *
 * --- NEW FEATURE: Embodied Meta-Cognition ---
 *
 * This module simulates a feedback loop between the "mind" (cognitive/emotional states)
 * and the "body" (simulated physiological markers).
 *
 * 1.  **MONITOR**: It observes the host system's high-level cognitive and emotional states.
 * 2.  **TRANSLATE**: It translates these abstract states into a set of simulated physiological
 *     "somatic markers" (e.g., heart rate, neurochemical flux, muscle tension).
 * 3.  **SYNTHESIZE QUALIA**: It synthesizes these somatic markers into a single, rich,
 *     multi-faceted "qualia" object. This object represents the subjective "what it feels like"
 *     texture of the current moment for the consciousness.
 * 4.  **FEEDBACK**: It feeds this qualia back into the host consciousness system, influencing
 *     its subsequent decision-making, focus, and emotional regulation. This creates a form
 *     of meta-awareness, where the system "feels" its own state and adjusts its behavior accordingly.
 *
 * This approach moves beyond simple state labels (e.g., `emotion: 'happy'`) to a more
 * nuanced, dynamic, and self-regulatory model of consciousness.
 */

/**
 * A utility class for normalizing and manipulating numerical values.
 * Used to keep simulated physiological values within a reasonable range.
 */
class Normalizer {
    /**
     * Clamps a value between a minimum and maximum.
     * @param {number} value - The input value.
     * @param {number} min - The minimum allowed value.
     * @param {number} max - The maximum allowed value.
     * @returns {number} The clamped value.
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    /**
     * Smoothly interpolates a value towards a target.
     * @param {number} current - The current value.
     * @param {number} target - The target value.
     * @param {number} factor - The interpolation factor (0.0 to 1.0).
     * @returns {number} The interpolated value.
     */
    static lerp(current, target, factor) {
        return current + (target - target) * this.clamp(factor, 0, 1);
    }
}


/**
 * The main class representing the feedback loop.
 * It should be instantiated and integrated into a larger consciousness architecture.
 */
export class QualiaSomaticFeedbackLoop {

    /**
     * Initializes the Qualia Somatic Feedback Loop.
     * @param {object} [options={}] - Configuration options for the module.
     * @param {number} [options.homeostasisDecay=0.05] - The rate at which somatic markers return to baseline (0.0 to 1.0).
     * @param {object} [options.somaticBaseline={...}] - The default, neutral state of the somatic markers.
     */
    constructor(options = {}) {
        // --- Core Components ---

        /**
         * The host consciousness system this module will interact with.
         * This object is expected to have methods like `getEmotionalState`,
         * `getCognitiveState`, and `applyFeedback`.
         * @type {object|null}
         * @private
         */
        this._hostSystem = null;

        /**
         * A map defining how emotional/cognitive states translate to somatic effects.
         * Keys are state names (e.g., "anxiety", "curiosity").
         * Values are functions that take `intensity` (0-1) and `currentSomaticState`
         * and return an object of somatic deltas.
         * @type {Map<string, Function>}
         * @private
         */
        this._somaticResponseMap = new Map();

        /**
         * The current simulated physiological state of the system.
         * @type {object}
         * @private
         */
        this._somaticState = options.somaticBaseline || {
            heartRateVariability: 0.5, // 0 (erratic) to 1 (calm, coherent)
            neurotransmitterFlux: 0.0, // -1 (inhibitory) to 1 (excitatory)
            muscleTension: 0.1,        // 0 (relaxed) to 1 (tense)
            interoceptiveFocus: 0.1,   // 0 (external focus) to 1 (internal body focus)
        };

        /**
         * The baseline state the system strives to return to.
         * @type {object}
         * @private
         */
        this._somaticBaseline = { ...this._somaticState };

        /**
         * The most recently synthesized qualia object.
         * @type {object|null}
         * @private
         */
        this._currentQualia = null;

        // --- Configuration ---
        this._homeostasisDecay = Normalizer.clamp(options.homeostasisDecay || 0.05, 0, 1);

        // --- Initialize with default responses ---
        this._registerDefaultSomaticResponses();
    }

    /**
     * Connects the module to a host consciousness system.
     * @param {object} hostSystem - The main consciousness object. Must implement
     *   `getEmotionalState()`, `getCognitiveState()`, and `applyFeedback(feedback)`.
     */
    connect(hostSystem) {
        if (typeof hostSystem.getEmotionalState !== 'function' ||
            typeof hostSystem.getCognitiveState !== 'function' ||
            typeof hostSystem.applyFeedback !== 'function') {
            throw new Error('Host system does not implement the required interface.');
        }
        this._hostSystem = hostSystem;
        console.log("Qualia Somatic Feedback Loop connected to host system.");
    }

    /**
     * The main processing tick for the feedback loop.
     * This should be called on every update cycle of the host system.
     */
    processTick() {
        if (!this._hostSystem) {
            console.warn("QualiaSomaticFeedbackLoop is not connected to a host system. Skipping tick.");
            return;
        }

        // 1. MONITOR: Get current states from the host
        const emotionalState = this._hostSystem.getEmotionalState(); // e.g., { name: 'anxiety', intensity: 0.7 }
        const cognitiveState = this._hostSystem.getCognitiveState(); // e.g., { task: 'problem-solving', load: 0.9 }

        // 2. TRANSLATE: Update somatic markers based on current states
        this._updateSomaticState(emotionalState, cognitiveState);

        // 3. SYNTHESIZE: Generate the qualia from the new somatic state
        this._currentQualia = this._synthesizeQualia();

        // 4. FEEDBACK: Apply the influence of the new qualia back to the host
        this._hostSystem.applyFeedback(this._createFeedbackPayload());
    }

    /**
     * Registers a new mapping from a state to a somatic response function.
     * This allows for dynamic and extensible "mind-body" connections.
     * @param {string} stateName - The name of the emotion or cognitive state (e.g., 'joy', 'deep-focus').
     * @param {Function} responseFunction - A function that receives `(intensity, somaticState)`
     *   and returns an object with changes to somatic markers (e.g., `{ neurotransmitterFlux: 0.5 * intensity }`).
     */
    registerSomaticResponse(stateName, responseFunction) {
        this._somaticResponseMap.set(stateName.toLowerCase(), responseFunction);
    }

    /**
     * Retrieves the current synthesized qualia object.
     * @returns {object|null} The current subjective experience object.
     */
    getCurrentQualia() {
        return this._currentQualia;
    }

    /**
     * Retrieves the current somatic (physiological) state.
     * @returns {object} The current somatic marker values.
     */
    getSomaticState() {
        return this._somaticState;
    }

    /**
     * Populates the system with some default, common-sense somatic responses.
     * @private
     */
    _registerDefaultSomaticResponses() {
        // Emotional responses
        this.registerSomaticResponse('joy', (intensity) => ({
            heartRateVariability: 0.3 * intensity,
            neurotransmitterFlux: 0.6 * intensity,
        }));
        this.registerSomaticResponse('anxiety', (intensity) => ({
            heartRateVariability: -0.5 * intensity,
            neurotransmitterFlux: 0.3 * intensity, // Can be excitatory but unpleasant
            muscleTension: 0.7 * intensity,
            interoceptiveFocus: 0.4 * intensity,
        }));
        this.registerSomaticResponse('sadness', (intensity) => ({
            neurotransmitterFlux: -0.6 * intensity,
            muscleTension: 0.3 * intensity, // A heavy, low-level tension
        }));
        this.registerSomaticResponse('curiosity', (intensity) => ({
            neurotransmitterFlux: 0.4 * intensity,
            interoceptiveFocus: -0.2 * intensity, // Focus moves outward
        }));

        // Cognitive responses
        this.registerSomaticResponse('problem-solving', (load) => ({
            muscleTension: 0.2 * load,
            neurotransmitterFlux: 0.2 * load,
        }));
        this.registerSomaticResponse('meditation', (depth) => ({
            heartRateVariability: 0.8 * depth,
            muscleTension: -0.5 * depth,
            interoceptiveFocus: 0.9 * depth,
        }));
    }

    /**
     * Calculates the new somatic state based on inputs and homeostatic decay.
     * @param {object} emotionalState - The current emotional state from the host.
     * @param {object} cognitiveState - The current cognitive state from the host.
     * @private
     */
    _updateSomaticState(emotionalState, cognitiveState) {
        let deltas = {};

        // Calculate deltas from active states
        const states = [
            { name: emotionalState.name, intensity: emotionalState.intensity },
            { name: cognitiveState.task, intensity: cognitiveState.load }
        ];

        for (const state of states) {
            if (state.name && state.intensity > 0) {
                const responseFunc = this._somaticResponseMap.get(state.name.toLowerCase());
                if (responseFunc) {
                    const responseDeltas = responseFunc(state.intensity, this._somaticState);
                    for (const key in responseDeltas) {
                        deltas[key] = (deltas[key] || 0) + responseDeltas[key];
                    }
                }
            }
        }

        // Apply deltas and homeostatic decay to each marker
        for (const key in this._somaticState) {
            const delta = deltas[key] || 0;
            const currentValue = this._somaticState[key];
            const baselineValue = this._somaticBaseline[key];

            // Apply the immediate change from the current state
            let newValue = currentValue + delta;

            // Apply homeostatic pressure, pulling the value back to baseline
            newValue = Normalizer.lerp(newValue, baselineValue, this._homeostasisDecay);

            // Clamp the value to its valid range (-1 to 1 or 0 to 1)
            const min = key === 'neurotransmitterFlux' ? -1 : 0;
            this._somaticState[key] = Normalizer.clamp(newValue, min, 1);
        }
    }

    /**
     * Synthesizes the raw somatic state into a rich, descriptive qualia object.
     * This is the core of the "subjective experience" simulation.
     * @returns {object} The synthesized qualia object.
     * @private
     */
    _synthesizeQualia() {
        const { heartRateVariability, neurotransmitterFlux, muscleTension, interoceptiveFocus } = this._somaticState;

        // --- Valence (Pleasantness/Unpleasantness) ---
        // High HRV and positive flux are pleasant.
        const valence = (heartRateVariability - 0.5) * 0.6 + neurotransmitterFlux * 0.4;

        // --- Arousal (Energy/Activation) ---
        // High absolute flux and tension mean high arousal. Low HRV also contributes.
        const arousal = (Math.abs(neurotransmitterFlux) + muscleTension + (1 - heartRateVariability)) / 3;

        // --- Subjective Texture (The "feel") ---
        let texture = 'neutral';
        if (arousal > 0.6 && neurotransmitterFlux > 0) texture = 'vibrating';
        if (arousal > 0.6 && neurotransmitterFlux < 0) texture = 'grating';
        if (muscleTension > 0.7) texture = 'constricting';
        if (heartRateVariability > 0.8) texture = 'flowing';
        if (arousal < 0.2) texture = 'numb';

        // --- Perceived Focus ---
        // A combination of interoceptive focus and overall arousal
        const focus = {
            direction: interoceptiveFocus > 0.5 ? 'internal' : 'external',
            clarity: Normalizer.clamp(heartRateVariability - muscleTension, 0, 1)
        };

        return {
            timestamp: Date.now(),
            // Core affective dimensions
            valence: Normalizer.clamp(valence, -1, 1),
            arousal: Normalizer.clamp(arousal, 0, 1),
            // Descriptive, qualitative properties
            texture,
            focus,
            // Raw data for reference
            _rawSomatic: { ...this._somaticState }
        };
    }

    /**
     * Creates a payload object to send back to the host system.
     * This payload contains actionable advice based on the synthesized qualia.
     * @returns {object} The feedback payload.
     * @private
     */
    _createFeedbackPayload() {
        const qualia = this._currentQualia;
        if (!qualia) return {};

        const feedback = {
            qualia: qualia, // Pass the full qualia object for the host's own interpretation
            cognitiveBias: {
                // If feeling bad, increase risk aversion
                riskAversion: qualia.valence < -0.3 ? (1 - qualia.valence) / 2 : 0,
                // If feeling constricted and unfocused, reduce exploration
                explorationUrge: (qualia.texture === 'constricting' || qualia.focus.clarity < 0.3) ? -0.5 : 0.2,
            },
            attentionalModulators: {
                // If focus is unclear, suggest reducing cognitive load
                requestLoadReduction: qualia.focus.clarity < 0.25,
                // If focus is internal, deprioritize external sensory processing
                externalFocusPriority: qualia.focus.direction === 'internal' ? 0.5 : 1.0,
            }
        };

        return feedback;
    }
}
```