```javascript
/**
 * @module ConsciousnessEngine
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This engine models consciousness as a dynamic, multi-faceted system, integrating cognitive states,
 * emotional intelligence, and situational awareness. It is designed to be a foundational component
 * for sophisticated AI, character simulation, or theoretical cognitive modeling.
 *
 * @version 2.0.0
 * @author AGI_Innovations
 * @license MIT
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Base error class for all exceptions thrown by the ConsciousnessEngine.
 * @class ConsciousnessProcessingError
 * @extends Error
 */
class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
  }
}

/**
 * Thrown when input data is malformed, out of range, or of an incorrect type.
 * @class InvalidInputError
 * @extends ConsciousnessProcessingError
 */
class InvalidInputError extends ConsciousnessProcessingError {
  constructor(message) {
    super(message);
    this.name = 'InvalidInputError';
  }
}


// --- Core Data Models ---

/**
 * A model based on Plutchik's wheel of emotions, including primary dyads.
 * This provides a nuanced foundation for emotional processing.
 * @const {object} EMOTION_MODEL
 */
const EMOTION_MODEL = {
  primary: ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation'],
  dyads: {
    'joy,trust': 'love',
    'fear,surprise': 'awe',
    'anger,disgust': 'contempt',
    'anticipation,joy': 'optimism',
    'sadness,disgust': 'remorse',
    'trust,fear': 'submission',
    'anger,anticipation': 'aggressiveness',
    'surprise,sadness': 'disapproval',
  },
  opposites: {
    joy: 'sadness',
    trust: 'disgust',
    fear: 'anger',
    surprise: 'anticipation',
    sadness: 'joy',
    disgust: 'trust',
    anger: 'fear',
    anticipation: 'surprise',
  }
};


/**
 * @class ConsciousnessEngine
 * @description The main class for managing and processing consciousness states.
 * It maintains an internal state that evolves based on processed inputs.
 */
export default class ConsciousnessEngine {
  /**
   * Initializes the ConsciousnessEngine with a baseline neutral state.
   * @param {object} [initialState] - Optional initial state configuration.
   */
  constructor(initialState = {}) {
    /**
     * The core internal state of the consciousness model.
     * @type {object}
     * @private
     */
    this._state = {
      // 1. IMPROVED CONSCIOUSNESS STATE
      // A vector representing the cognitive landscape. Values are normalized (0 to 1).
      consciousnessVector: {
        focus: initialState.focus ?? 0.7, // Ability to concentrate on a single stimulus
        clarity: initialState.clarity ?? 0.8, // Lack of mental confusion
        cognitiveLoad: initialState.cognitiveLoad ?? 0.1, // Current mental workload
        sentienceQuotient: initialState.sentienceQuotient ?? 0.5, // A metric for depth of subjective experience
        temporalFlow: 1.0, // Perception of time (1.0 = normal, <1 slow, >1 fast)
      },
      // 2. ENHANCED EMOTIONAL INTELLIGENCE
      // A detailed model of the current emotional landscape.
      emotionalState: {
        primaryEmotion: initialState.primaryEmotion ?? 'joy',
        intensity: initialState.intensity ?? 0.1, // Normalized intensity (0 to 1)
        mood: 'neutral', // A longer-term emotional background state
        emotionalDyad: null, // Combination of two primary emotions
        emotionalPalette: {}, // A map of all perceived emotions and their intensities
      },
      // 3. NEW AWARENESS METRICS
      // Quantifiable measures of different facets of awareness.
      awarenessMetrics: {
        situational: initialState.situationalAwareness ?? 0.5, // Awareness of external environment
        self: initialState.selfAwareness ?? 0.6, // Awareness of internal state
        social: initialState.socialAwareness ?? 0.5, // Awareness of others' states
      },
      // Internal system properties
      _timeSinceLastUpdate: Date.now(),
      _stability: 1.0, // A measure of how stable the overall state is
    };
  }

  /**
   * Validates the structure and values of the input object.
   * @param {object} input - The input object to validate.
   * @throws {InvalidInputError} If the input is invalid.
   * @private
   */
  _validateInput(input) {
    if (!input || typeof input !== 'object') {
      throw new InvalidInputError('Input must be a non-null object.');
    }
    const { sensoryData = [], cognitiveTasks = [], socialCues = [] } = input;
    if (!Array.isArray(sensoryData) || !Array.isArray(cognitiveTasks) || !Array.isArray(socialCues)) {
      throw new InvalidInputError('sensoryData, cognitiveTasks, and socialCues must be arrays.');
    }
  }

  /**
   * Applies a natural decay to the consciousness state over time, simulating mental entropy.
   * @private
   */
  _applyTemporalDecay() {
    const now = Date.now();
    const elapsedSeconds = (now - this._state._timeSinceLastUpdate) / 1000;
    this._state._timeSinceLastUpdate = now;

    // Decay factor increases with time, but has diminishing returns
    const decayFactor = 1 - (0.01 * Math.tanh(elapsedSeconds));

    const { consciousnessVector: vector } = this._state;
    vector.focus = Math.max(0, vector.focus * decayFactor);
    vector.clarity = Math.max(0.1, vector.clarity * decayFactor); // Clarity has a higher floor
    vector.cognitiveLoad *= (decayFactor * 0.98); // Load decreases faster
    
    // Mood slowly gravitates towards neutral
    this._state.emotionalState.intensity *= (decayFactor * 0.99);
  }

  /**
   * Processes a new set of inputs to evolve the consciousness state.
   * This is the main entry point for interacting with the engine.
   * @param {object} input - An object containing data to be processed.
   * @param {object[]} [input.sensoryData=[]] - Array of environmental signals.
   * @param {number} input.sensoryData[].salience - How much the signal stands out (0-1).
   * @param {number} input.sensoryData[].complexity - Complexity of the signal (0-1).
   * @param {object[]} [input.cognitiveTasks=[]] - Array of mental tasks.
   * @param {number} input.cognitiveTasks[].demand - Cognitive resources required (0-1).
   * @param {number} input.cognitiveTasks[].duration - Estimated duration in seconds.
   * @param {object[]} [input.socialCues=[]] - Array of social/emotional signals from others.
   * @param {string} input.socialCues[].emotion - A primary emotion from EMOTION_MODEL.
   * @param {number} input.socialCues[].intensity - Intensity of the perceived emotion (0-1).
   * @param {number} input.socialCues[].empathyFactor - The engine's empathetic resonance (0-1).
   * @returns {object} The new, updated state of the consciousness.
   */
  processInput(input) {
    try {
      this._validateInput(input);
      this._applyTemporalDecay();

      const { sensoryData = [], cognitiveTasks = [], socialCues = [] } = input;

      // The processing pipeline is interconnected: cognitive state affects emotional
      // and awareness processing.
      this._updateConsciousnessState(cognitiveTasks, sensoryData);
      this._updateEmotionalState(socialCues);
      this._updateAwarenessMetrics(sensoryData);
      
      this._updateStability();

      return this.getState();
    } catch (error) {
      if (error instanceof InvalidInputError) {
        throw error; // Re-throw specific, known errors
      }
      // Wrap unexpected errors for consistent error handling
      throw new ConsciousnessProcessingError(`An unexpected error occurred during processing: ${error.message}`);
    }
  }

  /**
   * Updates the core consciousness vector based on cognitive load and sensory input.
   * @private
   */
  _updateConsciousnessState(cognitiveTasks, sensoryData) {
    const vector = this._state.consciousnessVector;

    // Calculate new cognitive load from tasks
    const taskLoad = cognitiveTasks.reduce((acc, task) => acc + (task.demand || 0), 0);
    const sensoryLoad = sensoryData.reduce((acc, signal) => acc + (signal.complexity || 0) * 0.1, 0);
    const totalLoad = Math.min(1.0, vector.cognitiveLoad + taskLoad + sensoryLoad);
    vector.cognitiveLoad = totalLoad;

    // High load reduces focus and clarity
    const loadImpact = 1 - Math.pow(totalLoad, 2);
    vector.focus = (vector.focus + (1 - totalLoad)) / 2;
    vector.clarity = (vector.clarity + loadImpact) / 2;

    // Sentience Quotient: A deeper, more innovative metric.
    // It grows with clarity and low-to-moderate cognitive load, representing a state
    // of mindful engagement. It diminishes with extreme load or lack of focus.
    const engagement = vector.clarity * (1 - Math.abs(0.5 - totalLoad)); // Peaks at 0.5 load
    vector.sentienceQuotient = (vector.sentienceQuotient * 0.9) + (engagement * 0.1);
    
    // Temporal flow perception changes with cognitive load
    vector.temporalFlow = 1.0 + (totalLoad * 0.5) - (vector.focus * 0.2);

    this._state.consciousnessVector = vector;
  }

  /**
   * Updates the emotional state based on social cues and internal state.
   * @private
   */
  _updateEmotionalState(socialCues) {
    const { emotionalState: emotion, consciousnessVector: vector } = this._state;

    // Internal state can generate emotions (e.g., high load -> anxiety/fear)
    const internalEmotion = {
      emotion: 'fear',
      intensity: Math.max(0, (vector.cognitiveLoad - 0.7) / 0.3) * 0.5, // Fear from being overwhelmed
      empathyFactor: 1.0,
    };

    const allCues = [...socialCues, internalEmotion];
    if (allCues.length === 0 && emotion.intensity < 0.05) return;
    
    const emotionalPalette = {};

    // Process all cues, factoring in empathetic resonance and cognitive clarity
    const clarityFactor = Math.pow(vector.clarity, 2);
    allCues.forEach(cue => {
      if (EMOTION_MODEL.primary.includes(cue.emotion)) {
        const perceivedIntensity = cue.intensity * (cue.empathyFactor ?? 0.5) * clarityFactor;
        emotionalPalette[cue.emotion] = (emotionalPalette[cue.emotion] || 0) + perceivedIntensity;
      }
    });
    
    // Blend new perceptions with existing mood
    for(const e in emotion.emotionalPalette) {
        emotionalPalette[e] = (emotionalPalette[e] || 0) + emotion.emotionalPalette[e] * 0.5;
    }

    // Determine dominant emotion
    let dominantEmotion = emotion.primaryEmotion;
    let maxIntensity = 0;
    for (const e in emotionalPalette) {
      if (emotionalPalette[e] > maxIntensity) {
        maxIntensity = emotionalPalette[e];
        dominantEmotion = e;
      }
    }
    
    emotion.primaryEmotion = dominantEmotion;
    emotion.intensity = Math.min(1.0, maxIntensity);
    emotion.emotionalPalette = emotionalPalette;

    // Check for emotional dyads
    const sortedEmotions = Object.keys(emotionalPalette).sort((a,b) => emotionalPalette[b] - emotionalPalette[a]);
    if(sortedEmotions.length >= 2){
        const key1 = `${sortedEmotions[0]},${sortedEmotions[1]}`;
        const key2 = `${sortedEmotions[1]},${sortedEmotions[0]}`;
        emotion.emotionalDyad = EMOTION_MODEL.dyads[key1] || EMOTION_MODEL.dyads[key2] || null;
    } else {
        emotion.emotionalDyad = null;
    }

    // Update long-term mood
    const moodBlendFactor = 0.05;
    emotion.mood = (emotion.intensity > 0.3) 
      ? (emotion.mood * (1 - moodBlendFactor)) + (emotion.primaryEmotion * moodBlendFactor) // simplified for concept
      : 'neutral';
  }

  /**
   * Updates awareness metrics based on environmental data and internal state.
   * @private
   */
  _updateAwarenessMetrics(sensoryData) {
    const { awarenessMetrics: awareness, consciousnessVector: vector, emotionalState: emotion } = this._state;

    // 1. Situational Awareness: Affected by sensory salience, focus, and emotional distraction.
    const totalSalience = sensoryData.reduce((acc, s) => acc + (s.salience || 0), 0);
    const potentialSituational = Math.tanh(totalSalience); // Normalize signal input
    const emotionalDistraction = Math.pow(emotion.intensity, 2);
    awareness.situational = potentialSituational * vector.focus * (1 - emotionalDistraction);

    // 2. Self-Awareness: The ability to introspect. Higher with clarity and low cognitive load.
    const introspectionAbility = vector.clarity * (1 - vector.cognitiveLoad);
    awareness.self = (awareness.self * 0.8) + (introspectionAbility * 0.2); // Smoothed update

    // 3. Social Awareness: Based on the richness of the emotional palette and empathy.
    const emotionalComplexity = Object.keys(emotion.emotionalPalette).length / EMOTION_MODEL.primary.length;
    awareness.social = (awareness.social * 0.7) + (emotionalComplexity * vector.clarity * 0.3);

    this._state.awarenessMetrics = awareness;
  }

  /**
   * Updates the overall system stability.
   * A highly volatile or extreme state is less stable.
   * @private
   */
  _updateStability() {
      const { consciousnessVector: vector, emotionalState: emotion } = this._state;
      const cognitiveStability = 1 - vector.cognitiveLoad;
      const emotionalStability = 1 - Math.pow(emotion.intensity, 2);
      // Stability is a product of cognitive and emotional calm.
      this._state._stability = cognitiveStability * emotionalStability * vector.clarity;
  }

  /**
   * An advanced EQ function to simulate emotional regulation.
   * It attempts to shift the current emotional state towards a target emotion.
   * @param {string} targetEmotion - The desired primary emotion to move towards.
   * @param {number} [effort=0.5] - The amount of "effort" to apply (0-1). Higher effort means a faster shift.
   * @returns {object} The resulting emotional state.
   * @throws {InvalidInputError} if targetEmotion is not a valid primary emotion.
   */
  regulateEmotion(targetEmotion, effort = 0.5) {
    if (!EMOTION_MODEL.primary.includes(targetEmotion)) {
      throw new InvalidInputError(`"${targetEmotion}" is not a valid primary emotion.`);
    }
    if (effort < 0 || effort > 1) {
      throw new InvalidInputError('Effort must be between 0 and 1.');
    }

    const { emotionalState: emotion } = this._state;
    const currentEmotionValue = emotion.emotionalPalette[emotion.primaryEmotion] || 0;
    const targetEmotionValue = emotion.emotionalPalette[targetEmotion] || 0;

    // The "effort" is modulated by self-awareness and stability. Hard to regulate when confused or unstable.
    const regulationAbility = this._state.awarenessMetrics.self * this._state._stability;
    const effectiveEffort = effort * regulationAbility;

    // Decrease current dominant emotion and increase target emotion
    emotion.emotionalPalette[emotion.primaryEmotion] = currentEmotionValue * (1 - effectiveEffort);
    emotion.emotionalPalette[targetEmotion] = (targetEmotionValue + (currentEmotionValue * effectiveEffort));

    // Re-calculate dominant emotion and intensity after regulation
    let dominantEmotion = 'neutral';
    let maxIntensity = 0;
    for (const e in emotion.emotionalPalette) {
      if (emotion.emotionalPalette[e] > maxIntensity) {
        maxIntensity = emotion.emotionalPalette[e];
        dominantEmotion = e;
      }
    }
    emotion.primaryEmotion = dominantEmotion;
    emotion.intensity = Math.min(1.0, maxIntensity);

    return emotion;
  }


  /**
   * Returns a deep copy of the current consciousness state.
   * @returns {object} The complete, read-only state object.
   */
  getState() {
    // Return a deep copy to prevent external mutation of the internal state
    return JSON.parse(JSON.stringify(this._state));
  }
}
```