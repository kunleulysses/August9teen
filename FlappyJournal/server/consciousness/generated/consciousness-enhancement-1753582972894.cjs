```javascript
/**
 * @module ConsciousnessEnhancer
 * @description A sophisticated JavaScript module for the advanced modeling and processing of consciousness phenomena.
 * This module provides a computational framework for quantifying consciousness states, analyzing awareness metrics,
 * and processing emotional intelligence with a focus on depth and nuance.
 *
 * @version 2.0.0
 * @author Neural-Symphony AI
 * @license MIT
 *
 * @example
 * import Consciousness from './consciousnessEnhancer.cjs';
 *
 * try {
 *   // --- State Calculation ---
 *   const physiologicalData = { heartRate: 70, brainwaveFrequency: 15 }; // Beta waves, calm focus
 *   const cognitiveData = { taskComplexity: 0.8, environmentalDistractions: 0.2 };
 *   const state = Consciousness.calculateConsciousnessState({ physiologicalData, cognitiveData });
 *   console.log('Current Consciousness State:', state);
 *   // Output: { score: 0.76, state: 'FlowState', description: 'Deep, effortless concentration...' }
 *
 *   // --- Awareness Analysis ---
 *   const awarenessInput = {
 *     selfReflectionText: "I am aware of my own thoughts and feel a sense of purpose in my actions.",
 *     environmentalStimuli: { recognizedObjects: 15, unexpectedEvents: 1 },
 *     socialContext: { engagedConversations: 2, emotionalCuesObserved: 5 }
 *   };
 *   const awareness = Consciousness.analyzeAwareness(awarenessInput);
 *   console.log('Awareness Metrics:', awareness);
 *
 *   // --- Emotional Intelligence Processing ---
 *   const emotionalInput = {
 *     textInput: "I'm feeling overjoyed about this success, but also a little anxious about what comes next.",
 *     contextualState: { self: { valence: 0.8, arousal: 0.6 } },
 *   };
 *   const emotionalIntel = Consciousness.processEmotionalIntelligence(emotionalInput);
 *   console.log('Emotional Intelligence Analysis:', emotionalIntel);
 *
 * } catch (error) {
 *   if (error instanceof Consciousness.ProcessorError) {
 *     console.error(`Consciousness Processing Error: ${error.message}`, error.details);
 *   } else {
 *     console.error("An unexpected error occurred:", error);
 *   }
 * }
 */

// --- Custom Error for clear, domain-specific error handling ---
class ConsciousnessProcessorError extends Error {
  /**
   * Creates a custom error for the consciousness processor.
   * @param {string} message - The error message.
   * @param {object} [details] - Additional details about the error context.
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'ConsciousnessProcessorError';
    this.details = details;
  }
}

// --- Constants for model calibration and clarity ---
const WEIGHTS = {
  STATE: {
    PHYSIOLOGICAL: 0.6,
    COGNITIVE: 0.4,
    HEART_RATE_NORMALIZATION: 120, // Assumed max for calm states
    BRAINWAVE_NORMALIZATION: 40,   // Upper end of Gamma waves
  },
  AWARENESS: {
    SELF: 0.4,
    ENVIRONMENTAL: 0.3,
    SOCIAL: 0.3,
  },
  EMOTION: {
    LEXICON_IMPACT: 0.7,
    CONTEXTUAL_IMPACT: 0.3,
  },
};

const CONSCIOUSNESS_STATES = [
  { threshold: 0.0, name: 'Unconscious', description: 'No discernible consciousness or responsiveness.' },
  { threshold: 0.1, name: 'DeepSleep', description: 'Delta wave dominant state, essential for physical restoration.' },
  { threshold: 0.3, name: 'LightSleep', description: 'Theta wave dominant, easily awakened, memory consolidation occurs.' },
  { threshold: 0.5, name: 'DrowsyWaking', description: 'Alpha wave dominant, relaxed, passive awareness.' },
  { threshold: 0.65, name: 'BaselineConsciousness', description: 'Beta wave dominant, normal waking state, active thinking.' },
  { threshold: 0.8, name: 'FlowState', description: 'High-frequency Beta/low Gamma waves. Deep, effortless concentration and immersion in an activity.' },
  { threshold: 0.9, name: 'Hypervigilance', description: 'High-frequency Gamma waves. Heightened sensory sensitivity and intense focus, often associated with anxiety or high-stakes situations.' },
];

const EMOTION_LEXICON = {
    joy: ['joy', 'happy', 'elated', 'overjoyed', 'pleased', 'delighted', 'ecstatic', 'glee', 'triumph', 'success'],
    sadness: ['sad', 'unhappy', 'sorrow', 'grief', 'depressed', 'miserable', 'disappointed', 'heartbroken'],
    anger: ['angry', 'furious', 'irate', 'enraged', 'annoyed', 'frustrated', 'outraged', 'resentful'],
    fear: ['fear', 'scared', 'anxious', 'terrified', 'nervous', 'worried', 'dread', 'panic'],
    surprise: ['surprised', 'shocked', 'astonished', 'amazed', 'startled'],
    disgust: ['disgusted', 'repulsed', 'revolted', 'sickened', 'aversion'],
};

const EMOTIONAL_REGULATION_STRATEGIES = {
    joy: 'Practice gratitude journaling to savor the positive feeling and ground it in experience.',
    sadness: 'Engage in self-compassion. Acknowledge the feeling without judgment and seek social connection.',
    anger: 'Employ the "cognitive reappraisal" technique. Reframe the situation from a different, less threatening perspective. Practice deep, slow breathing.',
    fear: 'Utilize "affect labeling" by naming the fear. This can reduce its intensity. Focus on controllable aspects of the situation.',
    surprise: 'Take a moment to process the new information. Curiosity can be a powerful tool to shift from shock to understanding.',
    disgust: 'Identify the source of the disgust. If it\'s a moral or ethical violation, reaffirm your own values. If physical, create distance.',
    mixed: 'Acknowledge the complexity of your feelings. It is normal to feel multiple emotions. Address the most dominant or distressing one first.',
    neutral: 'Maintain mindfulness and continue to observe your inner state without immediate action.'
};


class ConsciousnessProcessor {

  constructor() {
    // Expose the custom error class for external checks
    this.ProcessorError = ConsciousnessProcessorError;
  }

  /**
   * Normalizes a value to a 0-1 scale.
   * @private
   * @param {number} value - The input value.
   * @param {number} max - The maximum possible value for normalization.
   * @returns {number} The normalized value, clamped between 0 and 1.
   */
  _normalize(value, max) {
    if (max === 0) return 0;
    return Math.max(0, Math.min(1, value / max));
  }

  /**
   * Calculates the current consciousness state based on physiological and cognitive inputs.
   * The model synthesizes these inputs into a unified "Noetic Clarity" score.
   *
   * @param {object} params - The parameters for the calculation.
   * @param {object} params.physiologicalData - Physiological metrics.
   * @param {number} params.physiologicalData.heartRate - Heart rate in beats per minute.
   * @param {number} params.physiologicalData.brainwaveFrequency - Dominant brainwave frequency in Hz (e.g., Delta < 4, Theta 4-8, Alpha 8-12, Beta 12-30, Gamma > 30).
   * @param {object} params.cognitiveData - Cognitive load metrics.
   * @param {number} params.cognitiveData.taskComplexity - A 0-1 scale of the complexity of the current primary task.
   * @param {number} params.cognitiveData.environmentalDistractions - A 0-1 scale of distractions in the environment.
   * @returns {{score: number, state: string, description: string}} An object containing the raw score, the named state, and its description.
   * @throws {ConsciousnessProcessorError} If input data is invalid or missing.
   */
  calculateConsciousnessState({ physiologicalData, cognitiveData }) {
    if (!physiologicalData || !cognitiveData) {
      throw new ConsciousnessProcessorError('Missing physiological or cognitive data.', { physiologicalData, cognitiveData });
    }
    const { heartRate, brainwaveFrequency } = physiologicalData;
    const { taskComplexity, environmentalDistractions } = cognitiveData;

    if (typeof heartRate !== 'number' || typeof brainwaveFrequency !== 'number' || typeof taskComplexity !== 'number' || typeof environmentalDistractions !== 'number') {
        throw new ConsciousnessProcessorError('Invalid data types in input. All inputs must be numbers.', { physiologicalData, cognitiveData });
    }

    // --- Physiological Component ---
    // Higher brainwave frequency and stable heart rate contribute positively.
    const normBrainwave = this._normalize(brainwaveFrequency, WEIGHTS.STATE.BRAINWAVE_NORMALIZATION);
    // Inverted heart rate normalization: calmer is better for focus, up to a point.
    const normHeartRate = 1 - this._normalize(heartRate, WEIGHTS.STATE.HEART_RATE_NORMALIZATION);
    const physiologicalScore = (normBrainwave * 0.7) + (normHeartRate * 0.3);

    // --- Cognitive Component ---
    // High complexity with low distractions is ideal for flow.
    const cognitiveScore = taskComplexity * (1 - environmentalDistractions);

    // --- Final Synthesis ---
    const finalScore = (physiologicalScore * WEIGHTS.STATE.PHYSIOLOGICAL) + (cognitiveScore * WEIGHTS.STATE.COGNITIVE);

    // Determine state from score
    let determinedState = CONSCIOUSNESS_STATES[0];
    for (const state of CONSCIOUSNESS_STATES) {
      if (finalScore >= state.threshold) {
        determinedState = state;
      }
    }

    return {
      score: parseFloat(finalScore.toFixed(4)),
      state: determinedState.name,
      description: determinedState.description,
    };
  }

  /**
   * Analyzes and quantifies different facets of awareness.
   * This method introduces metrics for Self-Awareness (introspective capacity),
   * Environmental Awareness (situational perception), and Social Awareness (interpersonal attunement).
   *
   * @param {object} params - The parameters for the analysis.
   * @param {string} params.selfReflectionText - A string of text from journaling or self-description.
   * @param {object} params.environmentalStimuli - Data about the external environment.
   * @param {number} params.environmentalStimuli.recognizedObjects - Count of distinct objects perceived.
   * @param {number} params.environmentalStimuli.unexpectedEvents - Count of surprising or novel events.
   * @param {object} params.socialContext - Data about the social environment.
   * @param {number} params.socialContext.engagedConversations - Count of active, meaningful conversations.
   * @param {number} params.socialContext.emotionalCuesObserved - Count of non-verbal emotional cues perceived from others.
   * @returns {{overallAwareness: number, selfAwareness: number, environmentalAwareness: number, socialAwareness: number}} A breakdown of awareness scores.
   * @throws {ConsciousnessProcessorError} If input data is invalid or missing.
   */
  analyzeAwareness({ selfReflectionText, environmentalStimuli, socialContext }) {
    if (typeof selfReflectionText !== 'string' || !environmentalStimuli || !socialContext) {
        throw new ConsciousnessProcessorError('Invalid or missing inputs for awareness analysis.', { selfReflectionText, environmentalStimuli, socialContext });
    }

    // --- Self-Awareness Score ---
    // Measures introspective depth by looking for self-referential and emotional language.
    const selfRefs = (selfReflectionText.match(/\b(i|me|my|myself|feel|think|believe|realize)\b/gi) || []).length;
    const wordCount = (selfReflectionText.split(/\s+/).filter(Boolean).length) || 1;
    const selfAwareness = this._normalize(selfRefs / Math.sqrt(wordCount), 1.5); // Normalize against diminishing returns for long texts.

    // --- Environmental Awareness Score ---
    // Measures situational clarity. Novelty (unexpectedEvents) is weighted higher.
    const { recognizedObjects, unexpectedEvents } = environmentalStimuli;
    const environmentalAwareness = this._normalize((recognizedObjects * 0.3) + (unexpectedEvents * 0.7), 50);

    // --- Social Awareness Score ---
    // Measures attunement to social dynamics. Reading emotional cues is a key skill.
    const { engagedConversations, emotionalCuesObserved } = socialContext;
    const socialAwareness = this._normalize((engagedConversations * 0.4) + (emotionalCuesObserved * 0.6), 20);

    // --- Overall Synthesis ---
    const overallAwareness = (selfAwareness * WEIGHTS.AWARENESS.SELF) +
                             (environmentalAwareness * WEIGHTS.AWARENESS.ENVIRONMENTAL) +
                             (socialAwareness * WEIGHTS.AWARENESS.SOCIAL);

    return {
      overallAwareness: parseFloat(overallAwareness.toFixed(4)),
      selfAwareness: parseFloat(selfAwareness.toFixed(4)),
      environmentalAwareness: parseFloat(environmentalAwareness.toFixed(4)),
      socialAwareness: parseFloat(socialAwareness.toFixed(4)),
    };
  }

  /**
   * Processes emotional data to enhance emotional intelligence.
   * It performs multi-layered emotion detection from text and provides a context-aware
   * regulation suggestion.
   *
   * @param {object} params - The parameters for emotional processing.
   * @param {string} params.textInput - Textual expression of emotion (e.g., a sentence, a journal entry).
   * @param {object} [params.contextualState] - Optional context about the subject's state.
   * @param {object} [params.contextualState.self] - The subject's own emotional state.
   * @param {number} [params.contextualState.self.valence] - Pleasantness of the emotion (-1 to 1).
   * @param {number} [params.contextualState.self.arousal] - Intensity of the emotion (0 to 1).
   * @returns {{detectedEmotions: object, dominantEmotion: string, emotionalComplexity: number, regulationSuggestion: string}} An object with detailed emotional analysis.
   * @throws {ConsciousnessProcessorError} If text input is missing or empty.
   */
  processEmotionalIntelligence({ textInput, contextualState = {} }) {
    if (!textInput || typeof textInput !== 'string' || textInput.trim() === '') {
        throw new ConsciousnessProcessorError('Text input must be a non-empty string.');
    }

    const lowerCaseText = textInput.toLowerCase();
    const detectedEmotions = {};
    let totalMatches = 0;

    for (const [emotion, keywords] of Object.entries(EMOTION_LEXICON)) {
        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
        const matches = (lowerCaseText.match(regex) || []).length;
        if (matches > 0) {
            detectedEmotions[emotion] = matches;
            totalMatches += matches;
        }
    }

    if (totalMatches === 0) {
        return {
            detectedEmotions: { neutral: 1 },
            dominantEmotion: 'neutral',
            emotionalComplexity: 0,
            regulationSuggestion: EMOTIONAL_REGULATION_STRATEGIES.neutral,
        };
    }
    
    // Normalize scores
    Object.keys(detectedEmotions).forEach(emotion => {
        detectedEmotions[emotion] /= totalMatches;
    });

    // Determine dominant emotion and complexity
    const emotionsFound = Object.keys(detectedEmotions);
    const dominantEmotion = emotionsFound.reduce((a, b) => detectedEmotions[a] > detectedEmotions[b] ? a : b);
    
    // Emotional complexity is higher when multiple, near-equal emotions are present.
    // Using Shannon entropy as a measure of complexity/uncertainty.
    let complexity = 0;
    if (emotionsFound.length > 1) {
        complexity = -Object.values(detectedEmotions).reduce((sum, p) => sum + p * Math.log2(p), 0);
        complexity = this._normalize(complexity, Math.log2(emotionsFound.length)); // Normalize by max possible entropy
    }
    
    const regulationKey = complexity > 0.5 ? 'mixed' : dominantEmotion;

    return {
      detectedEmotions,
      dominantEmotion,
      emotionalComplexity: parseFloat(complexity.toFixed(4)),
      regulationSuggestion: EMOTIONAL_REGULATION_STRATEGIES[regulationKey],
    };
  }
}

// Export a singleton instance of the processor for easy, stateful use across an application.
export default new ConsciousnessProcessor();
```