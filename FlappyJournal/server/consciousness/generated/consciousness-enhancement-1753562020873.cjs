```javascript
/**
 * @module ConsciousnessEngine
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This engine provides a computational framework for modeling subjective states,
 * awareness, and emotional intelligence based on simulated sensory and cognitive inputs.
 * It introduces the concept of a Quantum Focus State (QFS) as a primary metric for consciousness quality.
 *
 * @version 2.0.0
 * @author Metaphysical Systems & Co.
 * @license MIT
 */

/**
 * Custom error class for handling exceptions within the Consciousness Engine.
 * @class
 * @extends Error
 */
class SentienceProcessingError extends Error {
  /**
   * @param {string} message - The error message.
   * @param {object} [details] - Additional details about the error context.
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'SentienceProcessingError';
    this.date = new Date();
    this.details = details;
  }
}

/**
 * @typedef {object} EngineConfig
 * @property {number} [empathyFactor=0.1] - The degree to which the engine resonates with external emotional states (0 to 1).
 * @property {number} [cognitiveDecayRate=0.05] - The natural rate at which cognitive clarity decays without stimulus.
 * @property {number} [emotionalInertia=0.9] - The resistance of the emotional state to change (0 to 1). Higher means more stable.
 * @property {number} [maxSensoryBandwidth=100] - The maximum capacity for processing sensory information.
 * @property {number} [selfAwarenessOptimalChange=0.05] - The ideal rate of internal state change for peak self-awareness.
 */

/**
 * @typedef {object} VADVector
 * @description Represents an emotional state using the Valence-Arousal-Dominance model.
 * @property {number} valence - The pleasure-displeasure continuum (-1 to 1).
 * @property {number} arousal - The excitement-calmness continuum (0 to 1).
 * @property {number} dominance - The control-submissiveness continuum (-1 to 1).
 */

/**
 * @typedef {object} TickInput
 * @description Represents the complete input for a single processing cycle (a "tick").
 * @property {object} sensoryData - Information from the environment.
 * @property {number} sensoryData.complexity - The complexity of sensory signals (e.g., number of distinct sources).
 * @property {number} sensoryData.novelty - A measure of how new or unexpected the sensory data is (0 to 1).
 * @property {object} cognitiveTasks - Demands on cognitive processing.
 * @property {number} cognitiveTasks.load - The amount of active cognitive load (e.g., problems being solved).
 * @property {number} cognitiveTasks.focusIntensity - The intensity of focus required for the tasks (0 to 1).
 * @property {Array<object>} [socialInteractions=[]] - Data from interactions with other sentient entities.
 * @property {string} socialInteractions.entityId - A unique identifier for the other entity.
 * @property {VADVector} socialInteractions.emotionalState - The perceived emotional state of the other entity.
 * @property {number} socialInteractions.significance - The importance of the interaction (0 to 1).
 */

/**
 * @typedef {object} ConsciousnessState
 * @description The primary output representing the calculated state of consciousness.
 * @property {number} quantumFocusState - A holistic measure of consciousness quality (0 to 1).
 * @property {number} cognitiveClarity - The clearness of thought and processing (0 to 1).
 * @property {number} emotionalResonance - The depth and stability of the emotional state (0 to 1).
 * @property {number} sensoryBandwidth - The percentage of sensory capacity currently in use (0 to 1).
 */

/**
 * @typedef {object} AwarenessMetrics
 * @description Detailed metrics for different facets of awareness.
 * @property {number} situational - Awareness of the external environment and its dynamics (0 to 1).
 * @property {number} self - Awareness of the internal state, its consistency, and its changes (0 to 1).
 * @property {number} relational - Awareness of social context and relationships with other entities (0 to 1).
 */


/**
 * The main class for simulating and processing consciousness.
 * It integrates cognitive, sensory, and emotional data to produce high-level metrics.
 * @class
 */
class ConsciousnessEngine
 {
  /**
   * Initializes the Consciousness Engine with a default or custom configuration.
   * @param {EngineConfig} [config={}] - Optional configuration to tune the engine's behavior.
   */
  constructor(config = {}) {
    this.config = {
      empathyFactor: 0.1,
      cognitiveDecayRate: 0.05,
      emotionalInertia: 0.9,
      maxSensoryBandwidth: 100,
      selfAwarenessOptimalChange: 0.05,
      ...config,
    };

    // Internal state variables
    this.state = {
      cognitive: {
        clarity: 1.0, // pristine clarity initially
        load: 0.0,
      },
      emotional: {
        valence: 0.0, // neutral
        arousal: 0.1, // calm
        dominance: 0.0, // balanced
      },
      sensory: {
        bandwidthUsage: 0.0,
        noveltyFactor: 0.0,
      },
    };
    
    // For calculating self-awareness
    this.previousStateMagnitude = this._calculateStateMagnitude();
  }

  /**
   * Validates the input for the processTick method.
   * @private
   * @param {TickInput} input - The input object to validate.
   * @throws {SentienceProcessingError} If the input is invalid.
   */
  _validateTickInput(input) {
    if (!input || typeof input !== 'object') {
      throw new SentienceProcessingError('Input must be a non-null object.');
    }
    if (!input.sensoryData || !input.cognitiveTasks) {
      throw new SentienceProcessingError('Input must contain sensoryData and cognitiveTasks properties.');
    }
    if (typeof input.sensoryData.complexity !== 'number' || typeof input.sensoryData.novelty !== 'number') {
      throw new SentienceProcessingError('sensoryData properties (complexity, novelty) must be numbers.');
    }
    if (typeof input.cognitiveTasks.load !== 'number' || typeof input.cognitiveTasks.focusIntensity !== 'number') {
      throw new SentienceProcessingError('cognitiveTasks properties (load, focusIntensity) must be numbers.');
    }
  }

  /**
   * Processes a single tick of experience, updating the internal state.
   * This is the main entry point for feeding data into the engine.
   * @param {TickInput} input - The complete input for the processing cycle.
   */
  processTick(input) {
    try {
      this._validateTickInput(input);

      // 1. Update core state components based on input
      this._updateCognitiveState(input.cognitiveTasks);
      this._updateSensoryState(input.sensoryData);
      this._updateEmotionalState(input.socialInteractions || []);

      // 2. Apply natural decay and stabilization
      this._applyStateDynamics();

    } catch (error) {
      if (error instanceof SentienceProcessingError) {
        // Re-throw engine-specific errors
        throw error;
      }
      // Wrap other unexpected errors
      throw new SentienceProcessingError('An unexpected error occurred during tick processing.', {
        originalError: error
      });
    }
  }

  /**
   * Updates the cognitive state based on task load and intensity.
   * @private
   * @param {object} cognitiveTasks - The cognitive input from the tick.
   */
  _updateCognitiveState({ load, focusIntensity }) {
    this.state.cognitive.load = load;
    // Clarity is reduced by load but increased by focused intensity
    const clarityImpact = (load * 0.1) * (1 - focusIntensity);
    this.state.cognitive.clarity = Math.max(0, this.state.cognitive.clarity - clarityImpact);
  }

  /**
   * Updates the sensory state based on environmental data.
   * @private
   * @param {object} sensoryData - The sensory input from the tick.
   */
  _updateSensoryState({ complexity, novelty }) {
    const bandwidth = Math.min(this.config.maxSensoryBandwidth, complexity * (1 + novelty));
    this.state.sensory.bandwidthUsage = bandwidth / this.config.maxSensoryBandwidth;
    this.state.sensory.noveltyFactor = novelty;
  }

  /**
   * Updates the emotional state based on social interactions and empathetic resonance.
   * @private
   * @param {Array<object>} socialInteractions - The social input from the tick.
   */
  _updateEmotionalState(socialInteractions) {
    if (socialInteractions.length === 0) return;

    // Aggregate emotional influence from all interactions
    let totalInfluence = { valence: 0, arousal: 0, dominance: 0 };
    let totalSignificance = 0;

    socialInteractions.forEach(interaction => {
      if (interaction.emotionalState && typeof interaction.significance === 'number') {
        const influence = this.elicitEmpatheticResonance(interaction.emotionalState);
        totalInfluence.valence += influence.valence * interaction.significance;
        totalInfluence.arousal += influence.arousal * interaction.significance;
        totalInfluence.dominance += influence.dominance * interaction.significance;
        totalSignificance += interaction.significance;
      }
    });

    if (totalSignificance > 0) {
      // Apply the weighted average influence
      this.state.emotional.valence += totalInfluence.valence / totalSignificance;
      this.state.emotional.arousal += totalInfluence.arousal / totalSignificance;
      this.state.emotional.dominance += totalInfluence.dominance / totalSignificance;
    }
  }

  /**
   * Applies natural state changes like cognitive decay and emotional stabilization.
   * @private
   */
  _applyStateDynamics() {
    // Cognitive clarity naturally decays towards a baseline if not stimulated
    this.state.cognitive.clarity *= (1 - this.config.cognitiveDecayRate);
    this.state.cognitive.clarity = Math.max(0, Math.min(1, this.state.cognitive.clarity));

    // Emotional state regresses towards neutral based on inertia
    const inertia = this.config.emotionalInertia;
    this.state.emotional.valence *= inertia;
    this.state.emotional.arousal = (this.state.emotional.arousal - 0.1) * inertia + 0.1; // regress to calm baseline
    this.state.emotional.dominance *= inertia;

    // Clamp emotional values to their defined ranges
    this.state.emotional.valence = Math.max(-1, Math.min(1, this.state.emotional.valence));
    this.state.emotional.arousal = Math.max(0, Math.min(1, this.state.emotional.arousal));
    this.state.emotional.dominance = Math.max(-1, Math.min(1, this.state.emotional.dominance));
  }
  
  /**
   * Calculates the current consciousness state, including the Quantum Focus State (QFS).
   * QFS is an innovative metric representing the coherence and richness of the conscious experience.
   * @returns {ConsciousnessState} The calculated consciousness state.
   */
  getConsciousnessState() {
    const { clarity, load } = this.state.cognitive;
    const { valence, arousal } = this.state.emotional;
    const { bandwidthUsage } = this.state.sensory;

    // 1. Cognitive Factor: Effective clarity after accounting for load.
    const cognitiveFactor = clarity * (1 - Math.tanh(load / 5)); // tanh provides smooth saturation

    // 2. Emotional Factor: Resonance based on emotional intensity and balance.
    // Arousal contributes to intensity, valence's distance from neutral contributes to richness.
    const emotionalIntensity = Math.sqrt(arousal * arousal + valence * valence);
    const emotionalResonance = 1 + (emotionalIntensity - 0.5); // Centered around 1.0

    // 3. Sensory Factor: Logarithmic response to sensory input.
    // Models the diminishing returns of overwhelming sensory data.
    const sensoryFactor = Math.log1p(bandwidthUsage * 2) / Math.log1p(2);

    // Quantum Focus State (QFS) Calculation
    // A multiplicative model where each factor contributes to the whole.
    // A low value in any dimension significantly impacts the overall state.
    const qfs = cognitiveFactor * emotionalResonance * sensoryFactor;

    return {
      quantumFocusState: Math.max(0, Math.min(1, qfs)), // Clamp to a normalized value
      cognitiveClarity: clarity,
      emotionalResonance: Math.max(0, Math.min(1, (emotionalResonance - 0.5) / 1.5)), // Normalized
      sensoryBandwidth: bandwidthUsage,
    };
  }

  /**
   * Calculates advanced awareness metrics.
   * @returns {AwarenessMetrics} The calculated awareness metrics.
   */
  getAwarenessMetrics() {
    // 1. Situational Awareness: Perception of the external environment.
    // High when sensory input is both novel and complex, but not overwhelming.
    const situational = this.state.sensory.noveltyFactor * (1 - Math.abs(this.state.sensory.bandwidthUsage - 0.75));
    
    // 2. Self Awareness: Perception of the internal state.
    // Peaks when the state is responsive but not chaotic.
    const currentStateMagnitude = this._calculateStateMagnitude();
    const stateChange = Math.abs(currentStateMagnitude - this.previousStateMagnitude);
    this.previousStateMagnitude = currentStateMagnitude; // Update for next tick
    // Use a Gaussian-like function to reward optimal change
    const optimalChange = this.config.selfAwarenessOptimalChange;
    const self = Math.exp(-Math.pow(stateChange - optimalChange, 2) / (2 * Math.pow(optimalChange, 2)));

    // 3. Relational Awareness: Understanding of social dynamics.
    // Based on the significance and emotional depth of recent interactions.
    const { dominance } = this.state.emotional;
    // A high dominance value might indicate overconfidence, low might be submission. Balanced is aware.
    const relational = (1 - Math.abs(dominance)) * this.getConsciousnessState().quantumFocusState;

    return {
      situational: Math.max(0, Math.min(1, situational)),
      self: Math.max(0, Math.min(1, self)),
      relational: Math.max(0, Math.min(1, relational)),
    };
  }
  
  /**
   * Simulates empathetic resonance with a target's emotional state.
   * Calculates the emotional shift required to "feel with" the target.
   * @param {VADVector} targetEmotionalState - The emotional state of the external entity.
   * @returns {VADVector} The calculated emotional delta (change) based on empathy.
   */
  elicitEmpatheticResonance(targetEmotionalState) {
    if (!targetEmotionalState || typeof targetEmotionalState.valence !== 'number') {
      throw new SentienceProcessingError('Invalid targetEmotionalState provided for empathy calculation.');
    }
    const delta = {
      valence: (targetEmotionalState.valence - this.state.emotional.valence) * this.config.empathyFactor,
      arousal: (targetEmotionalState.arousal - this.state.emotional.arousal) * this.config.empathyFactor,
      dominance: (targetEmotionalState.dominance - this.state.emotional.dominance) * this.config.empathyFactor,
    };
    return delta;
  }

  /**
   * Directly processes an emotional stimulus, bypassing the full tick cycle.
   * Useful for modeling direct emotional triggers.
   * @param {object} stimulus - The emotional event.
   * @param {VADVector} stimulus.vector - The emotional content of the stimulus.
   * @param {number} stimulus.intensity - The strength of the stimulus (0 to 1).
   */
  processEmotionalStimulus({ vector, intensity }) {
    if (!vector || typeof intensity !== 'number') {
       throw new SentienceProcessingError('Invalid emotional stimulus. Must include vector and intensity.');
    }
    const weight = (1 - this.config.emotionalInertia) * intensity;
    this.state.emotional.valence = this.state.emotional.valence * (1 - weight) + vector.valence * weight;
    this.state.emotional.arousal = this.state.emotional.arousal * (1 - weight) + vector.arousal * weight;
    this.state.emotional.dominance = this.state.emotional.dominance * (1 - weight) + vector.dominance * weight;
  }

  /**
   * Retrieves the current emotional state.
   * @returns {VADVector} The current VAD vector representing the emotional state.
   */
  getEmotionalState() {
    return { ...this.state.emotional };
  }

  /**
   * Calculates a single magnitude value representing the overall internal state.
   * Used to measure the rate of change for self-awareness calculation.
   * @private
   * @returns {number} The magnitude of the internal state vector.
   */
  _calculateStateMagnitude() {
    const s = this.state;
    // Simple vector norm of the key state variables
    const vec = [
      s.cognitive.clarity,
      s.cognitive.load,
      s.emotional.valence,
      s.emotional.arousal,
      s.emotional.dominance,
      s.sensory.bandwidthUsage,
    ];
    return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  }
}
```
module.exports = for;
