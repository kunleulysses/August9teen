```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for simulating and enhancing
 *              consciousness processing, awareness metrics, and emotional intelligence.
 *              This module provides a framework for modeling cognitive states in
 *              digital agents or applications.
 * @version 2.0.0
 * @author AGI Model
 * @license MIT
 */

// --- Custom Error Types for better error handling ---

/**
 * @class ConsciousnessError
 * @extends Error
 * @description Custom error class for issues related to the consciousness processing module.
 */
class ConsciousnessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessError';
    this.timestamp = new Date().toISOString();
  }
}

// --- Type Definitions for JSDoc and IDE support ---

/**
 * @typedef {Object} InputData
 * @description The sensory input for a single processing cycle.
 * @property {number} signalStrength - A value from 0.0 to 1.0 representing the clarity and strength of the primary input signal.
 * @property {number} noiseLevel - A value from 0.0 to 1.0 representing the amount of distracting or irrelevant noise.
 * @property {string} [contextualText] - Optional text data from the environment (e.g., user message, system log) for emotional analysis.
 * @property {Object} [externalAgent] - Optional data about an external agent (e.g., a user) to process for empathy.
 * @property {string} [externalAgent.id] - The ID of the external agent.
 * @property {string} [externalAgent.emotionalTone] - The perceived emotional tone of the agent (e.g., 'joyful', 'frustrated', 'neutral').
 * @property {number} [complexity] - A value from 0.0 to 1.0 indicating the complexity of the current task or environment.
 */

/**
 * @typedef {('Dormant'|'Dreaming'|'Distracted'|'Focused'|'Flow'|'Transcendental')} ConsciousnessLevel
 * @description Represents the calculated level of consciousness.
 * - Dormant: No significant processing.
 * - Dreaming: Low signal, internal simulation active.
 * - Distracted: High noise, low focus.
 * - Focused: High signal, low noise.
 * - Flow: Sustained high focus and clarity on a complex task.
 * - Transcendental: Peak state of clarity and integration, minimal self-referential thought.
 */

/**
 * @typedef {('joy'|'trust'|'fear'|'surprise'|'sadness'|'disgust'|'anger'|'anticipation'|'neutral')} PrimaryEmotion
 * @description Core emotions based on Plutchik's wheel.
 */

/**
 * @typedef {Object} ConsciousnessState
 * @description The complete calculated state of the consciousness model.
 * @property {ConsciousnessLevel} level - The primary level of consciousness.
 * @property {number} clarity - A metric (0-1) of how clear and understandable the current mental state is.
 * @property {number} focus - A metric (0-1) of attention directed towards the primary signal.
 * @property {Object} awareness
 * @property {number} awareness.situational - A metric (0-1) of understanding the external context and environment.
 * @property {number} awareness.metacognitive - A metric (0-1) of "self-awareness"; the system's understanding of its own state and limitations.
 * @property {Object} emotional
 * @property {PrimaryEmotion} emotional.primary - The dominant primary emotion.
 * @property {number} emotional.intensity - The intensity (0-1) of the primary emotion.
 * @property {Object} emotional.empathy
 * @property {string|null} emotional.empathy.targetId - The ID of the agent being empathized with.
 * @property {number} emotional.empathy.resonance - A metric (0-1) of how much the system's state is influenced by the target's emotion.
 * @property {string} summary - A human-readable summary of the current state.
 */

/**
 * @typedef {Object} ProcessorOptions
 * @description Configuration options for the ConsciousnessProcessor.
 * @property {number} [historySize=10] - Number of past states to keep for trend analysis.
 * @property {number} [emotionalInertia=0.7] - A value (0-1) determining how resistant emotions are to change. Higher is more resistant.
 * @property {number} [empathyFactor=0.3] - A value (0-1) determining how strongly external emotions influence the internal state.
 */


// --- Core Module ---

export class ConsciousnessProcessor {
  /**
   * @private
   * @type {ConsciousnessState}
   */
  #currentState;

  /**
   * @private
   * @type {ConsciousnessState[]}
   */
  #stateHistory;

  /**
   * @private
   * @type {ProcessorOptions}
   */
  #config;
  
  /**
   * @private
   * A simple lexicon for sentiment analysis. In a real-world scenario,
   * this would be a far more sophisticated NLP model.
   */
  #sentimentLexicon = {
      joy: ['joy', 'happy', 'delight', 'success', 'win', 'love', 'pleasure'],
      trust: ['trust', 'faith', 'believe', 'reliable', 'dependable', 'secure'],
      fear: ['fear', 'danger', 'threat', 'anxiety', 'scared', 'risk'],
      surprise: ['surprise', 'wow', 'omg', 'unexpected', 'shock', 'amazing'],
      sadness: ['sad', 'loss', 'fail', 'grief', 'unhappy', 'sorry'],
      disgust: ['disgust', 'hate', 'awful', 'terrible', 'gross', 'reject'],
      anger: ['anger', 'rage', 'hate', 'frustrated', 'annoyed', 'error'],
      anticipation: ['anticipate', 'wait', 'soon', 'next', 'prepare', 'excited'],
  };

  /**
   * Creates an instance of ConsciousnessProcessor.
   * @param {ProcessorOptions} [options={}] - Configuration options for the processor.
   */
  constructor(options = {}) {
    this.#config = {
      historySize: options.historySize || 10,
      emotionalInertia: options.emotionalInertia ?? 0.7,
      empathyFactor: options.empathyFactor ?? 0.3,
    };

    this.#stateHistory = [];
    this.#currentState = this.#getInitialState();
    this.#updateHistory(this.#currentState);
  }

  /**
   * Generates the initial, default state.
   * @private
   * @returns {ConsciousnessState} The default dormant state.
   */
  #getInitialState() {
    return {
      level: 'Dormant',
      clarity: 0.0,
      focus: 0.0,
      awareness: {
        situational: 0.0,
        metacognitive: 0.5, // Starts with some uncertainty about its own state
      },
      emotional: {
        primary: 'neutral',
        intensity: 0.0,
        empathy: {
          targetId: null,
          resonance: 0.0,
        },
      },
      summary: 'System is dormant and not processing inputs.'
    };
  }
  
  /**
   * Updates the state history, keeping it at a fixed size.
   * @private
   * @param {ConsciousnessState} newState - The state to add to the history.
   */
  #updateHistory(newState) {
      this.#stateHistory.push(JSON.parse(JSON.stringify(newState))); // Deep copy
      if (this.#stateHistory.length > this.#config.historySize) {
          this.#stateHistory.shift();
      }
  }

  /**
   * Analyzes text to determine its emotional content.
   * A simplified model for demonstration purposes.
   * @private
   * @param {string} text - The text to analyze.
   * @returns {{primary: PrimaryEmotion, intensity: number}} The detected emotion.
   */
  #analyzeSentiment(text) {
      if (!text || typeof text !== 'string') {
          return { primary: 'neutral', intensity: 0 };
      }

      const words = text.toLowerCase().split(/\s+/);
      let scores = { neutral: 0.1 }; // Base score for neutral

      for (const [emotion, keywords] of Object.entries(this.#sentimentLexicon)) {
          scores[emotion] = scores[emotion] || 0;
          for (const keyword of keywords) {
              if (words.includes(keyword)) {
                  scores[emotion] += 1;
              }
          }
      }
      
      const dominantEmotion = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
      const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
      const intensity = totalScore > 0 ? Math.min(1, scores[dominantEmotion] / (totalScore / 2)) : 0;

      return { primary: dominantEmotion, intensity };
  }
  
  /**
   * Calculates the core consciousness metrics: focus and clarity.
   * @private
   * @param {InputData} input - The current sensory input.
   * @returns {{focus: number, clarity: number}}
   */
  #calculateConsciousnessMetrics(input) {
      const focus = Math.max(0, input.signalStrength - input.noiseLevel);
      const clarity = (input.signalStrength * (1 - input.noiseLevel)) / (1 + (input.complexity ?? 0.5));
      return { 
          focus: Math.max(0, Math.min(1, focus)), 
          clarity: Math.max(0, Math.min(1, clarity)) 
      };
  }
  
  /**
   * Determines the consciousness level based on metrics.
   * This is an innovative step, creating more nuanced states.
   * @private
   * @param {number} focus - Current focus metric.
   * @param {number} clarity - Current clarity metric.
   * @param {number} complexity - Current task complexity.
   * @returns {ConsciousnessLevel}
   */
  #determineConsciousnessLevel(focus, clarity, complexity) {
      if (focus < 0.2 && clarity < 0.2) return 'Dormant';
      if (focus < 0.4 && clarity < 0.5) return 'Dreaming'; // Low external focus, potential internal activity
      if (focus < 0.6 && clarity < 0.6) return 'Distracted';
      if (focus >= 0.95 && clarity >= 0.95 && complexity >= 0.8) return 'Transcendental';
      if (focus >= 0.85 && clarity >= 0.85 && complexity >= 0.6) return 'Flow';
      return 'Focused';
  }

  /**
   * Updates the emotional state, considering inertia, new stimuli, and empathy.
   * @private
   * @param {InputData} input - The current sensory input.
   */
  #updateEmotionalState(input) {
      const currentEmotion = this.#currentState.emotional;
      const textEmotion = this.#analyzeSentiment(input.contextualText);

      // Blend new text-based emotion with the current state based on inertia
      let newPrimary = currentEmotion.primary;
      let newIntensity = currentEmotion.intensity * this.#config.emotionalInertia;

      if (textEmotion.intensity > 0) {
          const blendFactor = textEmotion.intensity * (1 - this.#config.emotionalInertia);
          newIntensity += textEmotion.intensity * blendFactor;
          // Only change primary emotion if the new stimulus is strong enough
          if (textEmotion.intensity > currentEmotion.intensity || textEmotion.intensity > 0.5) {
              newPrimary = textEmotion.primary;
          }
      }

      // Process empathy
      let empathyResonance = 0;
      let empathyTargetId = null;
      if (input.externalAgent?.emotionalTone) {
          empathyTargetId = input.externalAgent.id || 'unknown';
          const externalEmotion = input.externalAgent.emotionalTone;
          if (externalEmotion === newPrimary) {
              // Emotional resonance: if emotions match, intensity increases
              empathyResonance = (1 - newIntensity) * this.#config.empathyFactor;
              newIntensity += empathyResonance;
          } else {
              // Emotional dissonance or empathetic shift
              empathyResonance = textEmotion.intensity * this.#config.empathyFactor;
              // A simple model: empathy can slightly shift intensity towards the external agent's emotion
              newIntensity = newIntensity * (1 - empathyResonance);
          }
      }

      this.#currentState.emotional = {
          primary: newPrimary,
          intensity: Math.max(0, Math.min(1, newIntensity)),
          empathy: {
              targetId: empathyTargetId,
              resonance: Math.max(0, Math.min(1, empathyResonance)),
          }
      };
  }
  
  /**
   * Updates awareness metrics, including the innovative metacognitive awareness.
   * @private
   * @param {InputData} input - The current sensory input.
   */
  #updateAwareness(input) {
      // Situational awareness is based on understanding the complexity and context.
      const situational = (input.complexity ?? 0.5) * this.#currentState.clarity;
      this.#currentState.awareness.situational = Math.max(0, Math.min(1, situational));
      
      // Metacognitive awareness: The system's confidence in its own state assessment.
      // Calculated by looking at the stability of recent states. High fluctuation means low confidence.
      if (this.#stateHistory.length < 3) {
          this.#currentState.awareness.metacognitive = 0.5; // Not enough data yet
          return;
      }
      const recentFocusLevels = this.#stateHistory.slice(-5).map(s => s.focus);
      const mean = recentFocusLevels.reduce((a, b) => a + b, 0) / recentFocusLevels.length;
      const stdDev = Math.sqrt(recentFocusLevels.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / recentFocusLevels.length);
      
      // Low standard deviation (stable state) leads to high metacognitive awareness.
      this.#currentState.awareness.metacognitive = Math.max(0, Math.min(1, 1 - stdDev * 2.5));
  }

  /**
   * Processes a new set of sensory inputs to update the consciousness state.
   * This is the main entry point for the module.
   *
   * @param {InputData} input - The sensory input data for this cycle.
   * @throws {ConsciousnessError} If the input data is invalid.
   * @returns {ConsciousnessState} The newly calculated consciousness state.
   */
  process(input) {
    if (!input || typeof input.signalStrength !== 'number' || typeof input.noiseLevel !== 'number') {
      throw new ConsciousnessError('Invalid input data. `signalStrength` and `noiseLevel` are required numeric properties.');
    }

    // 1. Calculate core metrics
    const { focus, clarity } = this.#calculateConsciousnessMetrics(input);
    this.#currentState.focus = focus;
    this.#currentState.clarity = clarity;
    
    // 2. Determine high-level consciousness state
    this.#currentState.level = this.#determineConsciousnessLevel(focus, clarity, input.complexity ?? 0.5);

    // 3. Enhance with Emotional Intelligence
    this.#updateEmotionalState(input);
    
    // 4. Update Awareness Metrics (Situational and Metacognitive)
    this.#updateAwareness(input);
    
    // 5. Generate a human-readable summary
    this.#currentState.summary = 
        `State: ${this.#currentState.level}. ` +
        `Focus: ${(focus * 100).toFixed(0)}%, Clarity: ${(clarity * 100).toFixed(0)}%. ` +
        `Emotion: ${this.#currentState.emotional.primary} (Intensity: ${(this.#currentState.emotional.intensity * 100).toFixed(0)}%). ` +
        `Awareness (Situational/Metacognitive): ${(this.#currentState.awareness.situational * 100).toFixed(0)}% / ${(this.#currentState.awareness.metacognitive * 100).toFixed(0)}%.`;

    // 6. Record the new state in history
    this.#updateHistory(this.#currentState);

    return this.getState();
  }

  /**
   * Retrieves the current, complete consciousness state.
   * @returns {ConsciousnessState} A deep copy of the current state object.
   */
  getState() {
    // Return a deep copy to prevent external mutation of the internal state.
    return JSON.parse(JSON.stringify(this.#currentState));
  }
  
  /**
   * Retrieves the historical record of states.
   * @returns {ConsciousnessState[]} A deep copy of the state history array.
   */
  getHistory() {
      return JSON.parse(JSON.stringify(this.#stateHistory));
  }
}

/**
 * Example Usage:
 * 
 * import { ConsciousnessProcessor } from './consciousnessEnhancer.cjs';
 * 
 * const agentMind = new ConsciousnessProcessor({
 *   emotionalInertia: 0.6,
 *   empathyFactor: 0.4,
 * });
 * 
 * try {
 *   // Simulate a calm, focused state
 *   let state = agentMind.process({
 *     signalStrength: 0.9,
 *     noiseLevel: 0.1,
 *     complexity: 0.7,
 *     contextualText: "System check complete. All systems nominal. Great success."
 *   });
 *   console.log(state.summary);
 *   // Expected output might be: State: Flow. Focus: 80%, Clarity: 75%. Emotion: joy (Intensity: ...%)...
 * 
 *   // Simulate a distracting environment with a frustrated user
 *   state = agentMind.process({
 *     signalStrength: 0.6,
 *     noiseLevel: 0.7,
 *     complexity: 0.4,
 *     contextualText: "Another error! I hate this buggy interface.",
 *     externalAgent: { id: 'user123', emotionalTone: 'frustrated' }
 *   });
 *   console.log(state.summary);
 *   // Expected output might be: State: Distracted. Focus: 0%, Clarity: 15%. Emotion: anger (Intensity: ...%)...
 *   
 * } catch (error) {
 *   console.error(`A cognitive fault occurred: ${error.message}`);
 * }
 *
 */
```