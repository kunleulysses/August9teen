```javascript
/**
 * @module Consciousness
 * @description A JavaScript module for simulating and enhancing consciousness processing.
 * This module provides a framework for modeling cognitive and emotional states,
 * calculating advanced awareness metrics, and processing emotional intelligence with depth.
 * It is designed to be a foundational layer for advanced AI, virtual beings, or
 * complex system state analysis.
 *
 * @version 1.0.0
 * @author A.I. Architect
 * @license MIT
 */

/**
 * Custom error class for consciousness-related processing errors.
 * This allows for more specific error handling in applications using this module.
 */
class ConsciousnessError extends Error {
  /**
   * Creates an instance of ConsciousnessError.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Represents a simulated conscious entity.
 * This class encapsulates the state, metrics, and processing logic
 * for a single stream of consciousness.
 */
class Consciousness {
  /**
   * Initializes a new consciousness instance.
   * @param {object} initialState - The initial state of the consciousness.
   * @param {object} [initialState.cognitiveState={ focus: 0.5, coherence: 0.5, memoryAccess: 0.5 }] - The starting cognitive parameters.
   * @param {object} [initialState.emotionalState={ joy: 0.1, sadness: 0.1, anger: 0, fear: 0.1, surprise: 0, trust: 0.2 }] - The initial emotional landscape, based on a simplified Plutchik's wheel. Values are typically 0 to 1.
   * @param {object} [initialState.sensoryInput={ clarity: 0.5, bandwidth: 0.5 }] - The quality of current sensory data.
   * @param {object} [config={ emotionalRegulation: 0.7 }] - Configuration for the consciousness processing.
   * @param {number} [config.emotionalRegulation=0.7] - A factor (0 to 1) determining how well the entity regulates emotional responses. 1 is perfect regulation.
   */
  constructor(initialState = {}, config = {}) {
    // --- Input Validation and Error Handling ---
    if (typeof initialState !== 'object' || initialState === null) {
      throw new ConsciousnessError('initialState must be a non-null object.');
    }
    if (typeof config !== 'object' || config === null) {
      throw new ConsciousnessError('config must be a non-null object.');
    }

    // --- Core State Properties ---
    this.cognitiveState = {
      focus: 0.5, // The degree of concentration on a single thread.
      coherence: 0.5, // The logical consistency of thought patterns.
      memoryAccess: 0.5, // The efficiency of recalling memories.
      ...initialState.cognitiveState
    };

    this.emotionalState = {
      joy: 0.1,
      sadness: 0.1,
      anger: 0.0,
      fear: 0.1,
      surprise: 0.0,
      trust: 0.2,
      ...initialState.emotionalState
    };

    this.sensoryInput = {
      clarity: 0.5, // How clear and noise-free the sensory data is.
      bandwidth: 0.5, // The amount of sensory information being processed.
      ...initialState.sensoryInput
    };

    // --- Configuration ---
    this.config = {
      emotionalRegulation: 0.7, // High regulation means less volatile emotional shifts.
      ...config
    };

    // --- Calculated Metrics (Initialized) ---
    this.consciousnessState = this.calculateConsciousnessState();
    this.awarenessMetrics = this.calculateAwarenessMetrics();
    this.emotionalIntelligence = this.calculateEmotionalIntelligence();
  }

  /**
   * Normalizes emotional state values to remain within the [0, 1] range.
   * This prevents emotional overflow and simulates homeostatic return.
   * @private
   */
  _normalizeEmotions() {
    let totalEmotion = 0;
    for (const emotion in this.emotionalState) {
      // Clamp values between 0 and 1
      this.emotionalState[emotion] = Math.max(0, Math.min(1, this.emotionalState[emotion]));
      totalEmotion += this.emotionalState[emotion];
    }

    // Optional: If total emotion exceeds a certain threshold, slightly dampen all emotions
    // to simulate emotional capacity limits.
    const maxTotalEmotion = 2.5;
    if (totalEmotion > maxTotalEmotion) {
      const dampingFactor = maxTotalEmotion / totalEmotion;
      for (const emotion in this.emotionalState) {
        this.emotionalState[emotion] *= dampingFactor;
      }
    }
  }

  /**
   * Processes a new sensory input, updating the internal state.
   * @param {object} newSensoryInput - The new sensory data.
   * @param {number} [newSensoryInput.clarity] - The clarity of the new input.
   * @param {number} [newSensoryInput.bandwidth] - The bandwidth of the new input.
   */
  processSensoryInput(newSensoryInput) {
    if (typeof newSensoryInput !== 'object' || newSensoryInput === null) {
      throw new ConsciousnessError('newSensoryInput must be a non-null object.');
    }
    this.sensoryInput = { ...this.sensoryInput, ...newSensoryInput };
    this.updateAllMetrics();
  }

  /**
   * Processes a cognitive shift, such as focusing or recalling a memory.
   * @param {object} cognitiveShift - The change in cognitive state.
   * @param {number} [cognitiveShift.focus] - The new focus level.
   * @param {number} [cognitiveShift.coherence] - The new coherence level.
   * @param {number} [cognitiveShift.memoryAccess] - The new memory access efficiency.
   */
  processCognitiveShift(cognitiveShift) {
    if (typeof cognitiveShift !== 'object' || cognitiveShift === null) {
      throw new ConsciousnessError('cognitiveShift must be a non-null object.');
    }
    this.cognitiveState = { ...this.cognitiveState, ...cognitiveShift };
    this.updateAllMetrics();
  }

  /**
   * [Feature] Enhances emotional intelligence processing by simulating a response to an event.
   * The response is modulated by the entity's emotional regulation capacity.
   * @param {object} event - The emotional event to process.
   * @param {string} event.stimulus - A description of the event.
   * @param {object} event.impact - The raw emotional impact of the event. e.g., { joy: 0.5, fear: -0.1 }
   */
  processEmotionalEvent(event) {
    if (!event || typeof event.impact !== 'object' || event.impact === null) {
      throw new ConsciousnessError('Event must be an object with an "impact" property.');
    }

    const regulationFactor = 1 - this.config.emotionalRegulation;

    for (const emotion in event.impact) {
      if (this.emotionalState.hasOwnProperty(emotion)) {
        const change = event.impact[emotion] * regulationFactor;
        this.emotionalState[emotion] += change;
      }
    }

    this._normalizeEmotions();
    this.updateAllMetrics();
  }

  /**
   * [Feature] Improves consciousness state calculations.
   * Calculates the overall state of consciousness based on a weighted combination
   * of cognitive and sensory factors. This provides a more nuanced state than a simple on/off.
   * @returns {{level: number, label: string}} The calculated consciousness state.
   */
  calculateConsciousnessState() {
    const { focus, coherence } = this.cognitiveState;
    const { clarity, bandwidth } = this.sensoryInput;

    // Weighted average of key factors for consciousness level
    const level = (focus * 0.4) + (coherence * 0.3) + (clarity * 0.2) + (bandwidth * 0.1);

    let label = 'Unconscious';
    if (level > 0.9) label = 'Hyper-Awareness (Flow State)';
    else if (level > 0.75) label = 'Heightened Consciousness';
    else if (level > 0.5) label = 'Normal Waking Consciousness';
    else if (level > 0.25) label = 'Drowsy / Subconscious';
    else if (level > 0.1) label = 'Deep Sleep / Minimal Awareness';

    return {
      level: parseFloat(level.toFixed(4)),
      label
    };
  }

  /**
   * [Feature] Adds new awareness metrics.
   * These metrics provide deeper insight into the nature of the entity's awareness.
   * @returns {{selfAwareness: number, situationalAwareness: number, emotionalAcuity: number}} The calculated awareness metrics.
   */
  calculateAwarenessMetrics() {
    const { focus, coherence, memoryAccess } = this.cognitiveState;
    const { clarity, bandwidth } = this.sensoryInput;

    // Self-Awareness: The ability to introspect. Modeled as a function of cognitive coherence and focus.
    const selfAwareness = (coherence * 0.6) + (focus * 0.4);

    // Situational Awareness: Understanding the external environment. Modeled by the quality of sensory input.
    const situationalAwareness = (clarity * 0.7) + (bandwidth * 0.3);

    // Emotional Acuity: The ability to precisely identify one's own emotional state.
    // Modeled by low emotional noise (sum of all emotions) and high cognitive focus.
    const totalEmotion = Object.values(this.emotionalState).reduce((sum, val) => sum + val, 0);
    const emotionalClarity = 1 - Math.min(1, totalEmotion / 2.0); // Normalize total emotion as "noise"
    const emotionalAcuity = (emotionalClarity * 0.5) + (focus * 0.5);

    return {
      selfAwareness: parseFloat(selfAwareness.toFixed(4)),
      situationalAwareness: parseFloat(situationalAwareness.toFixed(4)),
      emotionalAcuity: parseFloat(emotionalAcuity.toFixed(4)),
    };
  }

  /**
   * [Feature] Calculates a holistic Emotional Intelligence (EQ) score.
   * This score combines emotional regulation, self-awareness (emotional acuity), and empathy potential.
   * @returns {{score: number, regulation: number, selfPerception: number}} The calculated EQ metrics.
   */
  calculateEmotionalIntelligence() {
    const { emotionalAcuity } = this.awarenessMetrics || this.calculateAwarenessMetrics();
    const regulation = this.config.emotionalRegulation;

    // EQ score is a combination of regulation ability and emotional self-perception.
    const score = (regulation * 0.6) + (emotionalAcuity * 0.4);

    return {
      score: parseFloat(score.toFixed(4)),
      regulation,
      selfPerception: emotionalAcuity
    };
  }

  /**
   * An innovative function to simulate empathy.
   * The consciousness attunes its emotional state to another, modulated by its own
   * cognitive state (focus, coherence) and emotional intelligence.
   * @param {Consciousness} otherConsciousness - The other consciousness instance to empathize with.
   * @param {number} empathyFactor - A value from 0 to 1 indicating the strength of the empathic connection.
   */
  empathizeWith(otherConsciousness, empathyFactor = 0.5) {
    if (!(otherConsciousness instanceof Consciousness)) {
      throw new ConsciousnessError('Target of empathy must be another Consciousness instance.');
    }
    if (empathyFactor < 0 || empathyFactor > 1) {
      throw new ConsciousnessError('empathyFactor must be between 0 and 1.');
    }

    const { focus, coherence } = this.cognitiveState;
    const { score: eqScore } = this.emotionalIntelligence;

    // The ability to successfully empathize depends on one's own focus, coherence, and EQ.
    const empathyAbility = (focus * 0.3) + (coherence * 0.3) + (eqScore * 0.4);
    const effectiveFactor = empathyFactor * empathyAbility;

    for (const emotion in this.emotionalState) {
      if (otherConsciousness.emotionalState.hasOwnProperty(emotion)) {
        const targetEmotion = otherConsciousness.emotionalState[emotion];
        const currentEmotion = this.emotionalState[emotion];
        const difference = targetEmotion - currentEmotion;

        // Move own emotional state towards the target's state
        this.emotionalState[emotion] += difference * effectiveFactor;
      }
    }

    this._normalizeEmotions();
    this.updateAllMetrics();
  }

  /**
   * A convenience method to update all calculated properties after a state change.
   * Simulates the continuous, holistic nature of consciousness processing.
   */
  updateAllMetrics() {
    // The order is important as some calculations depend on others.
    this.awarenessMetrics = this.calculateAwarenessMetrics();
    this.emotionalIntelligence = this.calculateEmotionalIntelligence();
    this.consciousnessState = this.calculateConsciousnessState();
  }

  /**
   * Returns a comprehensive snapshot of the current state of the consciousness.
   * @returns {object} A full report of the current state and all calculated metrics.
   */
  getFullReport() {
    return {
      timestamp: new Date().toISOString(),
      core: {
        cognitiveState: this.cognitiveState,
        emotionalState: this.emotionalState,
        sensoryInput: this.sensoryInput,
      },
      derived: {
        consciousnessState: this.consciousnessState,
        awarenessMetrics: this.awarenessMetrics,
        emotionalIntelligence: this.emotionalIntelligence,
      },
    };
  }
}

export default Consciousness;
```