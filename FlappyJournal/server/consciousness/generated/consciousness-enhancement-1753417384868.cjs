```javascript
/**
 * @module ConsciousnessEngine
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This engine provides tools to calculate consciousness states, analyze awareness metrics,
 * and process emotional intelligence based on simulated cognitive and sensory input.
 * It's designed to be a foundational layer for applications in AI character development,
 * mental wellness tracking, or theoretical cognitive science modeling.
 *
 * @version 2.0.0
 * @author AGI_Cognitive_Architects
 * @license MIT
 */

// --- Custom Error Types for Robust Handling ---

/**
 * @class InvalidInputError
 * @extends Error
 * @description Custom error for invalid or malformed input data provided to the engine.
 */
class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidInputError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * @class ProcessingError
 * @extends Error
 * @description Custom error for issues encountered during internal processing.
 */
class ProcessingError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ProcessingError';
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}


// --- Core Constants & Data Models ---

/**
 * @constant {object} PRIMARY_EMOTIONS
 * @description A model of primary emotions based on Plutchik's wheel, with associated keywords.
 * Used for identifying emotional signatures in textual input.
 */
const PRIMARY_EMOTIONS = {
  joy: { keywords: ['happy', 'joyful', 'elated', 'excited', 'pleased', 'delighted'], polarity: 'positive' },
  trust: { keywords: ['trust', 'faith', 'acceptance', 'admiration', 'confident'], polarity: 'positive' },
  fear: { keywords: ['fear', 'scared', 'anxious', 'terrified', 'insecure', 'panic'], polarity: 'negative' },
  surprise: { keywords: ['surprised', 'amazed', 'startled', 'astonished'], polarity: 'neutral' },
  sadness: { keywords: ['sad', 'depressed', 'grief', 'unhappy', 'sorrow', 'disappointed'], polarity: 'negative' },
  disgust: { keywords: ['disgusted', 'revulsion', 'contempt', 'aversion'], polarity: 'negative' },
  anger: { keywords: ['angry', 'furious', 'rage', 'irritated', 'frustrated'], polarity: 'negative' },
  anticipation: { keywords: ['anticipating', 'expectant', 'eager', 'looking forward'], polarity: 'neutral' },
};

/**
 * @constant {object} COMPLEX_EMOTIONS
 * @description Defines complex (secondary and tertiary) emotions as dyads of primary emotions.
 * This adds significant depth to emotional processing.
 */
const COMPLEX_EMOTIONS = {
  'joy-trust': 'love',
  'joy-anticipation': 'optimism',
  'trust-fear': 'submission',
  'fear-surprise': 'awe',
  'surprise-sadness': 'disapproval',
  'sadness-disgust': 'remorse',
  'disgust-anger': 'contempt',
  'anger-anticipation': 'aggressiveness',
};


// --- Main ConsciousnessEngine Module ---

/**
 * @typedef {object} MindStateInput
 * @property {number} cognitiveClarity - A value from 0.0 (total confusion) to 1.0 (perfect lucidity).
 * @property {number} focusIntensity - A value from 0.0 (diffuse) to 1.0 (laser-focused).
 * @property {number} physiologicalArousal - A value from 0.0 (deep sleep) to 1.0 (hyper-aroused).
 * @property {string[]} internalMonologue - An array of strings representing current thoughts.
 * @property {string[]} sensoryInputs - An array of strings describing current sensory experiences.
 * @property {object} socialContext - An object representing the current social environment.
 * @property {number} socialContext.complexity - Number of entities being tracked (0 for none).
 * @property {number} socialContext.familiarity - Average familiarity with entities (0.0 to 1.0).
 */

/**
 * @typedef {object} ConsciousnessState
 * @property {string} stateLabel - A descriptive label for the current state (e.g., 'Flow State', 'Meditative Calm').
 * @property {number} qualiaScore - A composite score (0-1) representing the richness of subjective experience.
 * @property {object} components - The calculated values for core consciousness components.
 * @property {number} components.clarity - The input cognitive clarity.
 * @property {number} components.focus - The input focus intensity.
 * @property {number} components.arousal - The input physiological arousal.
 */

/**
 * @typedef {object} AwarenessMetrics
 * @property {number} interoception - Awareness of internal state (thoughts, feelings) (0-1).
 * @property {number} exteroception - Awareness of external environment (senses) (0-1).
 * @property {number} metacognition - Awareness of one's own thought processes ("thinking about thinking") (0-1).
 * @property {number} socialAwareness - Awareness of the social landscape (0-1).
 */

/**
 * @typedef {object} EmotionalProfile
 * @property {object} primaryEmotions - Detected primary emotions and their intensities.
 * @property {string[]} complexEmotions - Identified complex emotions.
 * @property {string} dominantPolarity - The overall emotional leaning ('positive', 'negative', 'neutral', 'conflicted').
 * @property {number} emotionalIntensity - Overall intensity of the emotional state (0-1).
 */

/**
 * @typedef {object} ComprehensiveAnalysis
 * @property {ConsciousnessState} consciousness
 * @property {AwarenessMetrics} awareness
 * @property {EmotionalProfile} emotionalIntelligence
 * @property {string} timestamp - The ISO string timestamp of the analysis.
 */


const ConsciousnessEngine = {

  /**
   * Validates the input object to ensure it meets the required structure and constraints.
   * @private
   * @param {MindStateInput} input - The mind state input to validate.
   * @throws {InvalidInputError} If the input is invalid.
   */
  _validateInput(input) {
    if (!input) {
      throw new InvalidInputError('Input object is null or undefined.');
    }
    const requiredProps = {
        cognitiveClarity: 'number',
        focusIntensity: 'number',
        physiologicalArousal: 'number',
        internalMonologue: 'array',
        sensoryInputs: 'array',
        socialContext: 'object'
    };
    for (const prop in requiredProps) {
        if (input[prop] === undefined) {
            throw new InvalidInputError(`Missing required property: '${prop}'.`);
        }
        if (requiredProps[prop] === 'array' && !Array.isArray(input[prop])) {
            throw new InvalidInputError(`Property '${prop}' must be an array.`);
        } else if (requiredProps[prop] === 'object' && (typeof input[prop] !== 'object' || input[prop] === null || Array.isArray(input[prop]))) {
            throw new InvalidInputError(`Property '${prop}' must be a non-null object.`);
        } else if (requiredProps[prop] === 'number' && typeof input[prop] !== 'number') {
            throw new InvalidInputError(`Property '${prop}' must be a number.`);
        }
    }
    const numericProps = ['cognitiveClarity', 'focusIntensity', 'physiologicalArousal'];
    for (const prop of numericProps) {
        if (input[prop] < 0.0 || input[prop] > 1.0) {
            throw new InvalidInputError(`Property '${prop}' must be between 0.0 and 1.0.`);
        }
    }
    if (typeof input.socialContext.complexity !== 'number' || typeof input.socialContext.familiarity !== 'number') {
        throw new InvalidInputError('socialContext must contain numeric properties: complexity and familiarity.');
    }
  },

  /**
   * Calculates the current state of consciousness based on core metrics.
   * This improved version uses a weighted system and provides more descriptive labels.
   * @param {MindStateInput} input - The raw data representing the current mind state.
   * @returns {ConsciousnessState} The calculated consciousness state.
   */
  calculateConsciousnessState(input) {
    const { cognitiveClarity, focusIntensity, physiologicalArousal } = input;
    
    // Weighted sum to determine the richness of subjective experience.
    // Clarity and Focus are weighted higher as they contribute more to complex qualia.
    const qualiaScore = (cognitiveClarity * 0.4) + (focusIntensity * 0.4) + (physiologicalArousal * 0.2);

    let stateLabel = 'Undefined State';
    if (physiologicalArousal < 0.2) {
      stateLabel = cognitiveClarity > 0.5 ? 'Hypnagogic State' : 'Drowsiness';
    } else if (focusIntensity > 0.8 && cognitiveClarity > 0.8 && physiologicalArousal > 0.6) {
      stateLabel = 'Flow State (Hyperfocus)';
    } else if (focusIntensity > 0.7 && cognitiveClarity > 0.7) {
      stateLabel = 'Focused Awareness';
    } else if (focusIntensity < 0.3 && cognitiveClarity < 0.4) {
      stateLabel = 'Mind Wandering / Daydreaming';
    } else if (physiologicalArousal > 0.85 && cognitiveClarity < 0.5) {
      stateLabel = 'Overstimulated / Anxious';
    } else if (focusIntensity < 0.3 && cognitiveClarity > 0.7 && physiologicalArousal < 0.4) {
      stateLabel = 'Meditative Calm';
    } else {
      stateLabel = 'Normal Waking Consciousness';
    }

    return {
      stateLabel,
      qualiaScore: parseFloat(qualiaScore.toFixed(4)),
      components: {
        clarity: cognitiveClarity,
        focus: focusIntensity,
        arousal: physiologicalArousal,
      },
    };
  },

  /**
   * Computes novel awareness metrics, including metacognition and social awareness.
   * @param {MindStateInput} input - The raw data representing the current mind state.
   * @returns {AwarenessMetrics} A set of calculated awareness scores.
   */
  getAwarenessMetrics(input) {
    const { internalMonologue, sensoryInputs, socialContext } = input;

    // Interoception: Awareness of internal state. Based on richness of internal monologue.
    const interoception = Math.min(1.0, internalMonologue.length / 10);

    // Exteroception: Awareness of external state. Based on richness of sensory input.
    const exteroception = Math.min(1.0, sensoryInputs.length / 10);

    // Metacognition: "Thinking about thinking". A novel metric.
    // We simulate this by searching for self-referential or reflective thought patterns.
    const metaKeywords = ['i wonder', 'i think that', 'i feel', 'i realize', 'why do i', 'my thought is'];
    const metaThoughts = internalMonologue.filter(thought =>
      metaKeywords.some(keyword => thought.toLowerCase().includes(keyword))
    ).length;
    const metacognition = Math.min(1.0, (metaThoughts / (internalMonologue.length || 1)) * 2);

    // Social Awareness: A new metric for understanding the social landscape.
    // Based on the complexity and familiarity of the social context.
    const socialAwareness = Math.min(1.0, (socialContext.complexity / 15) * (0.5 + socialContext.familiarity * 0.5));

    return {
      interoception: parseFloat(interoception.toFixed(4)),
      exteroception: parseFloat(exteroception.toFixed(4)),
      metacognition: parseFloat(metacognition.toFixed(4)),
      socialAwareness: parseFloat(socialAwareness.toFixed(4)),
    };
  },

  /**
   * Performs enhanced emotional intelligence processing, identifying primary,
   * complex emotions, and overall polarity.
   * @param {MindStateInput} input - The raw data representing the current mind state.
   * @returns {EmotionalProfile} A detailed analysis of the emotional state.
   */
  processEmotionalIntelligence(input) {
    const combinedText = [...input.internalMonologue, ...input.sensoryInputs].join(' ').toLowerCase();
    if (combinedText.length === 0) {
        return {
            primaryEmotions: {},
            complexEmotions: [],
            dominantPolarity: 'neutral',
            emotionalIntensity: 0
        };
    }

    const detectedEmotions = {};
    let totalMatches = 0;

    for (const [emotion, data] of Object.entries(PRIMARY_EMOTIONS)) {
      const matches = data.keywords.reduce((acc, keyword) => {
        return acc + (combinedText.split(keyword).length - 1);
      }, 0);

      if (matches > 0) {
        detectedEmotions[emotion] = { count: matches, polarity: data.polarity };
        totalMatches += matches;
      }
    }

    const primaryEmotions = {};
    for (const emotion in detectedEmotions) {
        // Intensity of each emotion is its proportion of total emotional keywords.
        primaryEmotions[emotion] = parseFloat((detectedEmotions[emotion].count / totalMatches).toFixed(4));
    }

    // Identify complex emotions from pairs of primary emotions
    const presentPrimary = Object.keys(primaryEmotions);
    const complexEmotions = [];
    for (const key in COMPLEX_EMOTIONS) {
        const [e1, e2] = key.split('-');
        if (presentPrimary.includes(e1) && presentPrimary.includes(e2)) {
            complexEmotions.push(COMPLEX_EMOTIONS[key]);
        }
    }

    // Determine dominant polarity and overall intensity
    let positiveScore = 0;
    let negativeScore = 0;
    for (const emotion in detectedEmotions) {
        if (detectedEmotions[emotion].polarity === 'positive') {
            positiveScore += primaryEmotions[emotion];
        } else if (detectedEmotions[emotion].polarity === 'negative') {
            negativeScore += primaryEmotions[emotion];
        }
    }
    
    let dominantPolarity = 'neutral';
    if (positiveScore > negativeScore * 1.5) dominantPolarity = 'positive';
    else if (negativeScore > positiveScore * 1.5) dominantPolarity = 'negative';
    else if (positiveScore > 0 && negativeScore > 0) dominantPolarity = 'conflicted';

    // Intensity is a function of total emotional words relative to total words.
    const emotionalIntensity = Math.min(1.0, totalMatches / (combinedText.split(/\s+/).length || 1) * 5);

    return {
      primaryEmotions,
      complexEmotions,
      dominantPolarity,
      emotionalIntensity: parseFloat(emotionalIntensity.toFixed(4)),
    };
  },

  /**
   * The main processing function. It takes a raw mind state and returns a
   * comprehensive analysis of consciousness, awareness, and emotional intelligence.
   * @param {MindStateInput} input - The raw data representing the current mind state.
   * @returns {ComprehensiveAnalysis} A complete, structured analysis report.
   * @throws {InvalidInputError|ProcessingError} If validation or processing fails.
   */
  process(input) {
    try {
      this._validateInput(input);

      const consciousness = this.calculateConsciousnessState(input);
      const awareness = this.getAwarenessMetrics(input);
      const emotionalIntelligence = this.processEmotionalIntelligence(input);

      return {
        consciousness,
        awareness,
        emotionalIntelligence,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof InvalidInputError) {
        // Re-throw specific, known errors
        throw error;
      } else {
        // Wrap unexpected errors in a generic ProcessingError
        console.error("An unexpected error occurred during consciousness processing:", error);
        throw new ProcessingError('Failed to complete consciousness analysis due to an internal error.', { originalError: error.message });
      }
    }
  },
};

// To make it a standard ES module, we export the main engine object.
// In a Node.js environment, you might use `module.exports = ConsciousnessEngine;`
// For modern web development, `export default` is standard.
module.exports = ConsciousnessEngine;
```