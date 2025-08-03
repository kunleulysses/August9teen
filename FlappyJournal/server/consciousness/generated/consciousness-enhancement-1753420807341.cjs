```javascript
/**
 * @module ConsciousnessEnhancer
 * @version 2.0.0
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This module provides a sophisticated model for calculating consciousness states, awareness metrics,
 * and emotional intelligence, designed for use in AI, simulations, or theoretical modeling.
 * It introduces concepts like Qualia Integrity and Cognitive Dissonance for a deeper simulation.
 */

/**
 * Custom Error class for specific module-related issues.
 * This allows for more precise error handling by the consumer of the module.
 */
export class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Defines the primary emotional vectors based on Plutchik's wheel.
 * These are used as the basis for all emotional intelligence calculations.
 * @readonly
 * @enum {string}
 */
export const PRIMARY_EMOTIONS = Object.freeze({
  JOY: 'joy',
  TRUST: 'trust',
  FEAR: 'fear',
  SURPRISE: 'surprise',
  SADNESS: 'sadness',
  DISGUST: 'disgust',
  ANGER: 'anger',
  ANTICIPATION: 'anticipation',
});

/**
 * Defines the possible calculated states of consciousness.
 * These states are determined by a combination of focus, sensory input, and internal processing.
 * @readonly
 * @enum {string}
 */
export const CONSCIOUSNESS_STATES = Object.freeze({
  DEEP_SLEEP: 'Deep Sleep',
  DREAMING: 'Dreaming',
  DROWSY: 'Drowsy',
  AWAKE_DEFAULT: 'Awake (Default Mode Network)',
  FOCUSED: 'Focused',
  FLOW: 'Flow State',
  TRANSCENDENT: 'Transcendent / Meditative',
});

/**
 * The core class representing a conscious entity.
 * It encapsulates state, metrics, and processing logic.
 */
export class Consciousness {
  /**
   * Private state of the consciousness instance.
   * Using a private field (#) ensures true encapsulation.
   * @private
   */
  #state;

  /**
   * Initializes a new instance of Consciousness.
   * @param {object} [initialConfig={}] - Configuration for the initial state.
   * @param {string} [initialConfig.id='anonymous'] - An identifier for this consciousness instance.
   * @param {object} [initialConfig.baselineEmotion] - The default emotional temperament. Values from 0 to 1.
   * @example
   * const agent = new Consciousness({
   *   id: 'Agent-007',
   *   baselineEmotion: { joy: 0.6, anticipation: 0.4 }
   * });
   */
  constructor(initialConfig = {}) {
    const { id = 'anonymous', baselineEmotion = {} } = initialConfig;

    this.#state = {
      id,
      // Core Processing Metrics (0 to 1)
      focus: 0.5, // Level of directed attention
      sensoryInputLevel: 0.5, // Amount of external data being processed
      internalMonologueLevel: 0.5, // Amount of internal self-talk/thought

      // Enhanced Awareness Metrics (0 to 1)
      awareness: {
        self: 0.5, // Awareness of own thoughts, feelings, existence
        situational: 0.5, // Awareness of external environment and context
        somatic: 0.5, // Awareness of bodily sensations
        temporal: { // Focus distribution across time
          past: 0.2,
          present: 0.6,
          future: 0.2,
        },
      },

      // Emotional Intelligence Engine
      emotionalIntelligence: {
        palette: this.#initializeEmotionalPalette(baselineEmotion), // Current mix of active emotions
        valence: 0, // Overall positive/negative feeling (-1 to 1)
        arousal: 0, // Overall intensity of emotion (0 to 1)
        complexity: 0, // Number of distinct active emotions
        cognitiveDissonance: 0, // Clash between conflicting emotions or beliefs
      },

      // High-Level Calculated Properties
      consciousnessState: CONSCIOUSNESS_STATES.AWAKE_DEFAULT,
      qualiaIntegrity: 0.75, // A novel metric for the coherence and richness of subjective experience (0 to 1)
      
      // History for dynamic calculations
      history: {
        focus: [],
        valence: [],
        maxSize: 20 // Store last 20 ticks for trend analysis
      }
    };
  }

  /**
   * Initializes the emotional palette, merging baseline with defaults.
   * @private
   * @param {object} baseline - The baseline emotional temperament.
   * @returns {object} The initialized emotional palette.
   */
  #initializeEmotionalPalette(baseline) {
    const palette = {};
    for (const emotion in PRIMARY_EMOTIONS) {
      palette[PRIMARY_EMOTIONS[emotion]] = 0;
    }
    return { ...palette, ...baseline };
  }

  /**
   * The main processing function. Call this on each "tick" or event with new data.
   * @param {object} input - The input data for this processing cycle.
   * @param {object} [input.sensory={}] - External sensory data.
   * @param {number} [input.sensory.visual=0] - Visual complexity.
   * @param {number} [input.sensory.auditory=0] - Auditory complexity.
   * @param {number} [input.sensory.somatic=0] - Bodily feedback.
   * @param {object} [input.cognitive={}] - Internal cognitive events.
   * @param {string} [input.cognitive.taskFocus] - Description of a task to focus on.
   * @param {number} [input.cognitive.problemComplexity=0] - Complexity of a problem being solved.
   * @param {object} [input.emotionalCues={}] - External or internal emotional triggers.
   * @param {number} [input.emotionalCues.joy=0] - Cue for joy.
   * @param {number} [input.emotionalCues.fear=0] - Cue for fear.
   * ... and so on for all PRIMARY_EMOTIONS.
   * @param {number} [input.timeDelta=1.0] - Time elapsed since last update, for decay effects.
   * @throws {ConsciousnessProcessingError} If the input is malformed.
   * @returns {object} The full, updated state of the consciousness.
   *
   * @example
   * agent.process({
   *   sensory: { visual: 0.8, auditory: 0.6 },
   *   cognitive: { taskFocus: 'analyzing data', problemComplexity: 0.9 },
   *   emotionalCues: { joy: 0.2, anticipation: 0.7 }
   * });
   */
  process(input) {
    if (!input || typeof input !== 'object') {
      throw new ConsciousnessProcessingError('Process input must be a valid object.');
    }
    
    const {
        sensory = {},
        cognitive = {},
        emotionalCues = {},
        timeDelta = 1.0
    } = input;
    
    // 1. Update core processing metrics based on input
    this.#updateCoreMetrics(sensory, cognitive, timeDelta);

    // 2. Enhance Emotional Intelligence
    this.#processEmotionalIntelligence(emotionalCues, timeDelta);

    // 3. Add new Awareness Metrics
    this.#calculateAwarenessMetrics(sensory, cognitive);

    // 4. Improve Consciousness State Calculation
    this.#calculateConsciousnessState();
    
    // 5. Calculate innovative Qualia Integrity
    this.#calculateQualiaIntegrity();
    
    // 6. Update history for trend analysis
    this.#updateHistory();

    return this.getFullState();
  }

  /**
   * @private
   * Updates focus, sensory, and internal monologue levels.
   */
  #updateCoreMetrics(sensory, cognitive, timeDelta) {
    const decayFactor = Math.pow(0.8, timeDelta); // Emotions and focus decay over time

    // Calculate sensory input level
    const sensoryValues = Object.values(sensory);
    const newSensoryLevel = sensoryValues.length > 0
        ? sensoryValues.reduce((a, b) => a + b, 0) / sensoryValues.length
        : 0;
    this.#state.sensoryInputLevel = (this.#state.sensoryInputLevel * decayFactor + newSensoryLevel) / 2;

    // Calculate focus based on task and complexity
    const taskStrength = cognitive.taskFocus ? 0.8 : 0;
    const problemStrength = cognitive.problemComplexity || 0;
    const newFocus = Math.max(taskStrength, problemStrength);
    this.#state.focus = (this.#state.focus * decayFactor + newFocus) / 2;
    
    // Internal monologue is higher with problems, lower with pure sensory input or high focus
    const internalFactor = (problemStrength * 0.8) + (0.2 * (1 - this.#state.focus));
    this.#state.internalMonologueLevel = (this.#state.internalMonologueLevel * decayFactor + internalFactor) / 2;

    // Clamp all values between 0 and 1
    this.#state.focus = Math.max(0, Math.min(1, this.#state.focus));
    this.#state.sensoryInputLevel = Math.max(0, Math.min(1, this.#state.sensoryInputLevel));
    this.#state.internalMonologueLevel = Math.max(0, Math.min(1, this.#state.internalMonologueLevel));
  }

  /**
   * @private
   * Processes emotional cues and updates the entire EQ system.
   */
  #processEmotionalIntelligence(cues, timeDelta) {
    const eq = this.#state.emotionalIntelligence;
    const decayFactor = Math.pow(0.7, timeDelta); // Emotions decay faster

    // 1. Update emotional palette from cues and apply decay
    let totalEmotionEnergy = 0;
    for (const key in PRIMARY_EMOTIONS) {
      const emotion = PRIMARY_EMOTIONS[key];
      const cueValue = cues[emotion] || 0;
      // New emotion is a mix of decayed old value and new cue
      eq.palette[emotion] = (eq.palette[emotion] * decayFactor) + cueValue;
      eq.palette[emotion] = Math.max(0, Math.min(1, eq.palette[emotion])); // Clamp
      totalEmotionEnergy += eq.palette[emotion];
    }
    
    // 2. Calculate Valence (positive/negative) and Arousal (intensity)
    const positive = eq.palette.joy + eq.palette.trust + eq.palette.anticipation;
    const negative = eq.palette.fear + eq.palette.sadness + eq.palette.disgust + eq.palette.anger;
    const totalValence = positive - negative;
    const numEmotions = Object.values(PRIMARY_EMOTIONS).length;
    eq.valence = totalValence / (numEmotions / 2); // Normalize to approx -1 to 1
    eq.arousal = totalEmotionEnergy / numEmotions; // Average intensity

    // 3. Calculate Complexity
    eq.complexity = Object.values(eq.palette).filter(v => v > 0.1).length / numEmotions;

    // 4. Calculate Cognitive Dissonance
    // Dissonance is high when opposing emotions are both active (e.g., joy & sadness)
    const joySadness = eq.palette.joy * eq.palette.sadness;
    const trustDisgust = eq.palette.trust * eq.palette.disgust;
    const fearAnger = eq.palette.fear * eq.palette.anger; // Can be a conflict (fight vs. flight)
    eq.cognitiveDissonance = Math.sqrt(joySadness + trustDisgust + fearAnger) * 2;
    eq.cognitiveDissonance = Math.min(1, eq.cognitiveDissonance);
  }

  /**
   * @private
   * Calculates the distribution of awareness.
   */
  #calculateAwarenessMetrics(sensory, cognitive) {
    const aw = this.#state.awareness;
    
    // Self-awareness driven by internal monologue and problem complexity
    aw.self = (this.#state.internalMonologueLevel * 0.7) + ( (cognitive.problemComplexity || 0) * 0.3);

    // Situational awareness driven by sensory input and task context
    aw.situational = (this.#state.sensoryInputLevel * 0.8) + (cognitive.taskFocus ? 0.2 : 0);
    
    // Somatic awareness driven by specific sensory input
    aw.somatic = sensory.somatic || this.#state.awareness.somatic * 0.9;
    
    // Normalize the three main awareness types so they compete for a total of ~1.0
    const totalAwareness = aw.self + aw.situational + aw.somatic;
    if (totalAwareness > 0) {
      aw.self /= totalAwareness;
      aw.situational /= totalAwareness;
      aw.somatic /= totalAwareness;
    }
    
    // Temporal focus shifts based on emotion
    const { anticipation, fear } = this.#state.emotionalIntelligence.palette;
    const { sadness } = this.#state.emotionalIntelligence.palette;
    
    aw.temporal.future = (anticipation + fear * 0.5) * 0.8;
    aw.temporal.past = sadness * 0.7;
    aw.temporal.present = 1.0 - aw.temporal.future - aw.temporal.past;
    
    // Normalize temporal focus
    const totalTemporal = aw.temporal.past + aw.temporal.present + aw.temporal.future;
     if (totalTemporal > 0) {
      aw.temporal.past /= totalTemporal;
      aw.temporal.present /= totalTemporal;
      aw.temporal.future /= totalTemporal;
    }
  }

  /**
   * @private
   * Determines the overall consciousness state from core metrics.
   */
  #calculateConsciousnessState() {
    const { focus, sensoryInputLevel, internalMonologueLevel, awareness } = this.#state;
    
    // Score for wakefulness
    const wakefulness = (focus + sensoryInputLevel) / 2;

    if (wakefulness < 0.15) {
      this.#state.consciousnessState = CONSCIOUSNESS_STATES.DEEP_SLEEP;
    } else if (wakefulness < 0.3) {
      // High internal monologue + low sensory = dreaming
      if (internalMonologueLevel > 0.5 && sensoryInputLevel < 0.2) {
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.DREAMING;
      } else {
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.DROWSY;
      }
    } else { // Awake states
      if (focus > 0.8 && awareness.self < 0.2) {
        // High focus but low self-awareness is the key to Flow
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.FLOW;
      } else if (focus > 0.7) {
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.FOCUSED;
      } else if (focus < 0.3 && internalMonologueLevel > 0.6) {
        // Low focus and high internal chatter is the Default Mode Network
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.AWAKE_DEFAULT;
      } else if (sensoryInputLevel < 0.1 && internalMonologueLevel < 0.2 && focus > 0.5) {
        // Low external and internal noise, but high focus = meditation
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.TRANSCENDENT;
      }
      else {
        this.#state.consciousnessState = CONSCIOUSNESS_STATES.FOCUSED; // Fallback for general wakefulness
      }
    }
  }
  
  /**
   * @private
   * Calculates the novel Qualia Integrity score.
   * This represents the clarity, stability, and coherence of the "subjective experience".
   * A high score means a clear, non-conflicted state.
   * A low score implies confusion, emotional turmoil, or sensory overload.
   */
  #calculateQualiaIntegrity() {
      const { emotionalIntelligence, focus, awareness } = this.#state;
      
      // Coherence is inversely related to dissonance
      const emotionalCoherence = 1 - emotionalIntelligence.cognitiveDissonance;
      
      // Clarity is a function of focus and present-moment awareness
      const mentalClarity = (focus * 0.6) + (awareness.temporal.present * 0.4);
      
      // Stability is measured by low emotional arousal (calmness)
      const emotionalStability = 1 - Math.pow(emotionalIntelligence.arousal, 2);
      
      // Combine factors, weighting coherence most heavily
      this.#state.qualiaIntegrity = (emotionalCoherence * 0.5) + (mentalClarity * 0.3) + (emotionalStability * 0.2);
      this.#state.qualiaIntegrity = Math.max(0, Math.min(1, this.#state.qualiaIntegrity));
  }
  
  /**
   * @private
   * Updates the history arrays for trend analysis.
   */
  #updateHistory() {
      this.#state.history.focus.push(this.#state.focus);
      if (this.#state.history.focus.length > this.#state.history.maxSize) {
          this.#state.history.focus.shift();
      }
      
      this.#state.history.valence.push(this.#state.emotionalIntelligence.valence);
      if (this.#state.history.valence.length > this.#state.history.maxSize) {
          this.#state.history.valence.shift();
      }
  }

  // --- PUBLIC GETTERS for clean API access ---

  /**
   * Returns a deep copy of the entire current state.
   * @returns {object} The full state object.
   */
  getFullState() {
    return JSON.parse(JSON.stringify(this.#state));
  }

  /**
   * Gets the current primary consciousness state.
   * @returns {string} One of the CONSCIOUSNESS_STATES.
   */
  getConsciousnessState() {
    return this.#state.consciousnessState;
  }

  /**
   * Gets the detailed awareness metrics.
   * @returns {{self: number, situational: number, somatic: number, temporal: {past: number, present: number, future: number}}}
   */
  getAwarenessMetrics() {
    return JSON.parse(JSON.stringify(this.#state.awareness));
  }

  /**
   * Gets the full emotional intelligence report.
   * @returns {{palette: object, valence: number, arousal: number, complexity: number, cognitiveDissonance: number}}
   */
  getEmotionalIntelligence() {
    return JSON.parse(JSON.stringify(this.#state.emotionalIntelligence));
  }
  
  /**
   * Gets the Qualia Integrity Score.
   * @returns {number} The coherence score from 0 to 1.
   */
  getQualiaIntegrity() {
      return this.#state.qualiaIntegrity;
  }
}
```