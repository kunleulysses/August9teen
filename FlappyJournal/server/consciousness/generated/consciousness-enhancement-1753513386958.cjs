```javascript
/**
 * @module Consciousness
 * @description A sophisticated JavaScript module for simulating and enhancing
 *              consciousness processing. This module provides a framework for
 *              calculating consciousness states, awareness metrics, and emotional
 *              intelligence based on abstract inputs. It is designed to model
 *              the dynamic, interconnected nature of subjective experience.
 * @version 1.0.0
 * @author AGI Simulation Collective
 * @license MIT
 */

// --- Custom Error Types for Robust Handling ---

/**
 * Base class for all custom errors in the Consciousness module.
 * @extends Error
 */
class ConsciousnessError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessError';
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Thrown when input data is malformed, incomplete, or of the wrong type.
 * @extends ConsciousnessError
 */
class InvalidInputError extends ConsciousnessError {
  constructor(message, details) {
    super(message);
    this.name = 'InvalidInputError';
    this.details = details; // e.g., which field was invalid
  }
}

/**
 * Thrown when the processor encounters a logical contradiction or paradox
 * it cannot resolve, simulating a state of cognitive dissonance.
 * @extends ConsciousnessError
 */
class ProcessingParadoxError extends ConsciousnessError {
  constructor(message, conflictingData) {
    super(message);
    this.name = 'ProcessingParadoxError';
    this.conflictingData = conflictingData;
  }
}


// --- Core Enumerations and Data Structures ---

/**
 * Defines the primary states of consciousness that can be calculated.
 * @readonly
 * @enum {string}
 */
export const ConsciousnessState = {
  /** High focus, low peripheral awareness, task-oriented. */
  FOCUSED: 'FOCUSED',
  /** Low focus, high peripheral awareness, creative & associative thinking. */
  DIFFUSE: 'DIFFUSE',
  /** State of complete immersion in an activity, effortless attention. */
  FLOW: 'FLOW',
  /** Repetitive, negative, self-referential thought. */
  RUMINATIVE: 'RUMINATIVE',
  /** A state of calm, present-moment awareness. */
  MINDFUL: 'MINDFUL',
};

/**
 * Defines the direction of temporal focus.
 * @readonly
 * @enum {string}
 */
export const TemporalFocus = {
  PAST: 'PAST',
  PRESENT: 'PRESENT',
  FUTURE: 'FUTURE',
};

/**
 * A simplified model based on Plutchik's wheel of emotions, including valence,
 * arousal, and temporal association for advanced processing.
 * @readonly
 */
export const EmotionModel = {
  joy:       { valence: 0.9, arousal: 0.7, focus: TemporalFocus.PRESENT },
  trust:     { valence: 0.7, arousal: 0.3, focus: TemporalFocus.PRESENT },
  fear:      { valence: -0.8, arousal: 0.8, focus: TemporalFocus.FUTURE },
  surprise:  { valence: 0.2, arousal: 0.9, focus: TemporalFocus.PRESENT },
  sadness:   { valence: -0.7, arousal: -0.6, focus: TemporalFocus.PAST },
  disgust:   { valence: -0.6, arousal: 0.4, focus: TemporalFocus.PRESENT },
  anger:     { valence: -0.5, arousal: 0.7, focus: TemporalFocus.PAST },
  anticipation: { valence: 0.4, arousal: 0.6, focus: TemporalFocus.FUTURE },
};

/**
 * Represents emotional dyads (combinations of primary emotions).
 * @readonly
 */
export const EmotionalDyads = {
    'joy-trust': 'love',
    'joy-anticipation': 'optimism',
    'trust-fear': 'submission',
    'fear-surprise': 'awe',
    'surprise-sadness': 'disapproval',
    'sadness-disgust': 'remorse',
    'disgust-anger': 'contempt',
    'anger-anticipation': 'aggressiveness',
};


// --- The Core Consciousness Processor ---

/**
 * @class ConsciousnessProcessor
 * @description Orchestrates the simulation of consciousness. It takes inputs,
 * processes them through emotional and cognitive layers, and produces a rich,
 * holistic state profile.
 *
 * @example
 * import ConsciousnessProcessor from './consciousness.cjs';
 *
 * const consciousness = new ConsciousnessProcessor();
 * const input = {
 *   sensoryData: { visual: 0.8, auditory: 0.3, interoceptive: 0.9 },
 *   cognitiveLoad: 0.7,
 *   emotionalCues: [
 *     { cue: 'anticipation', intensity: 0.8 },
 *     { cue: 'joy', intensity: 0.6 }
 *   ],
 *   taskSuccess: 0.95,
 *   volition: 'pursue_goal',
 * };
 *
 * try {
 *   consciousness.processInput(input);
 *   const currentState = consciousness.getCurrentState();
 *   console.log(currentState);
 * } catch (error) {
 *   console.error(`Consciousness fault: ${error.name}`, error.message);
 * }
 */
export default class ConsciousnessProcessor {
  #state;
  #history;

  /**
   * Initializes the consciousness processor with a baseline neutral state.
   */
  constructor() {
    this.#state = this.#getInitialState();
    this.#history = []; // To track state changes for metacognition
  }

  /**
   * Generates the default starting state.
   * @private
   * @returns {object} The initial state object.
   */
  #getInitialState() {
    return {
      timestamp: new Date().toISOString(),
      consciousnessState: ConsciousnessState.MINDFUL,
      awarenessMetrics: {
        metacognitiveIndex: 0.1,
        sensoryBandwidth: 0.1,
        temporalFocus: TemporalFocus.PRESENT,
        interoceptiveClarity: 0.5,
      },
      emotionalProfile: {
        dominantEmotion: 'neutral',
        intensity: 0.0,
        valence: 0.0,
        arousal: 0.0,
        sentiment: {},
      },
      cognitive: {
        load: 0.0,
        dissonance: 0.0,
      },
      lastInput: null,
    };
  }

  /**
   * Validates the structure and values of the input object.
   * @private
   * @param {object} input - The input data for processing.
   * @throws {InvalidInputError} if the input is invalid.
   */
  #validateInput(input) {
    if (!input || typeof input !== 'object') {
      throw new InvalidInputError('Input must be a non-null object.');
    }
    const requiredKeys = ['sensoryData', 'cognitiveLoad', 'emotionalCues'];
    for (const key of requiredKeys) {
      if (!(key in input)) {
        throw new InvalidInputError(`Missing required key in input: '${key}'.`);
      }
    }
    if (typeof input.sensoryData !== 'object' || input.sensoryData === null) {
      throw new InvalidInputError('`sensoryData` must be an object.', { key: 'sensoryData' });
    }
     if (typeof input.cognitiveLoad !== 'number' || input.cognitiveLoad < 0 || input.cognitiveLoad > 1) {
      throw new InvalidInputError('`cognitiveLoad` must be a number between 0 and 1.', { key: 'cognitiveLoad' });
    }
    if (!Array.isArray(input.emotionalCues)) {
        throw new InvalidInputError('`emotionalCues` must be an array.', { key: 'emotionalCues' });
    }
  }

  /**
   * Processes emotional cues to determine the current emotional profile.
   * This enhanced processor can identify and name emotional dyads.
   * @private
   * @param {Array<object>} emotionalCues - Array of emotion cues with intensities.
   * @returns {object} The calculated emotional profile.
   */
  #updateEmotionalState(emotionalCues) {
    if (!emotionalCues.length) {
      return this.#state.emotionalProfile; // Maintain previous state if no new cues
    }

    let totalValence = 0;
    let totalArousal = 0;
    let totalIntensity = 0;
    let sentiment = {};
    let activeEmotions = [];

    for (const { cue, intensity } of emotionalCues) {
      const emotion = EmotionModel[cue];
      if (emotion) {
        totalValence += emotion.valence * intensity;
        totalArousal += emotion.arousal * intensity;
        totalIntensity += intensity;
        sentiment[cue] = (sentiment[cue] || 0) + intensity;
        activeEmotions.push({ cue, intensity });
      }
    }
    
    const avgIntensity = emotionalCues.length ? totalIntensity / emotionalCues.length : 0;
    const avgValence = emotionalCues.length ? totalValence / emotionalCues.length : 0;
    const avgArousal = emotionalCues.length ? totalArousal / emotionalCues.length : 0;

    // Sort by intensity to find dominant emotions for dyad calculation
    activeEmotions.sort((a, b) => b.intensity - a.intensity);
    
    let dominantEmotion = activeEmotions.length ? activeEmotions[0].cue : 'neutral';

    // Dyad detection: Check if the top two emotions form a known dyad
    if (activeEmotions.length >= 2) {
        const key1 = `${activeEmotions[0].cue}-${activeEmotions[1].cue}`;
        const key2 = `${activeEmotions[1].cue}-${activeEmotions[0].cue}`;
        if (EmotionalDyads[key1]) {
            dominantEmotion = EmotionalDyads[key1];
        } else if (EmotionalDyads[key2]) {
            dominantEmotion = EmotionalDyads[key2];
        }
    }

    return {
      dominantEmotion,
      intensity: Math.min(1, avgIntensity),
      valence: Math.max(-1, Math.min(1, avgValence)),
      arousal: Math.max(-1, Math.min(1, avgArousal)),
      sentiment,
    };
  }

  /**
   * Calculates new awareness metrics based on the current state.
   * @private
   * @param {object} input - The raw input data.
   * @param {object} emotionalProfile - The current emotional profile.
   * @returns {object} The calculated awareness metrics.
   */
  #calculateAwarenessMetrics(input, emotionalProfile) {
    // 1. Metacognitive Index: Increases with emotional complexity/dissonance and state changes.
    const emotionalConflict = Object.keys(emotionalProfile.sentiment).length > 1 ? 0.2 : 0;
    const stateChangeDelta = this.#state.consciousnessState !== this.#history[this.#history.length-1]?.consciousnessState ? 0.1 : 0;
    const metacognitiveIndex = Math.min(1, this.#state.awarenessMetrics.metacognitiveIndex * 0.8 + emotionalConflict + stateChangeDelta + (input.cognitiveLoad * 0.1));

    // 2. Sensory Bandwidth: Average of all sensory inputs.
    const sensoryValues = Object.values(input.sensoryData);
    const sensoryBandwidth = sensoryValues.length > 0
      ? sensoryValues.reduce((sum, val) => sum + val, 0) / sensoryValues.length
      : 0;

    // 3. Temporal Focus: Determined by the dominant emotion's temporal association.
    let temporalFocus = TemporalFocus.PRESENT;
    const dominantCue = Object.keys(emotionalProfile.sentiment).reduce((a, b) => emotionalProfile.sentiment[a] > emotionalProfile.sentiment[b] ? a : b, null);
    if (dominantCue && EmotionModel[dominantCue]) {
        temporalFocus = EmotionModel[dominantCue].focus;
    }

    // 4. Interoceptive Clarity: Awareness of internal state.
    const interoceptiveClarity = input.sensoryData.interoceptive !== undefined
      ? (this.#state.awarenessMetrics.interoceptiveClarity * 0.5) + (input.sensoryData.interoceptive * 0.5)
      : this.#state.awarenessMetrics.interoceptiveClarity;
      
    return { metacognitiveIndex, sensoryBandwidth, temporalFocus, interoceptiveClarity };
  }

  /**
   * Determines the primary consciousness state based on all available data.
   * This uses a weighted scoring system for a more nuanced calculation.
   * @private
   * @param {object} metrics - The current awareness metrics.
   * @param {object} emotionalProfile - The current emotional profile.
   * @param {number} cognitiveLoad - The current cognitive load.
   * @param {number} taskSuccess - Success rate of the last task (if any).
   * @returns {ConsciousnessState} The calculated state.
   */
  #calculateConsciousnessState(metrics, emotionalProfile, cognitiveLoad, taskSuccess = 0.5) {
      const scores = {
          [ConsciousnessState.FOCUSED]: 0,
          [ConsciousnessState.DIFFUSE]: 0,
          [ConsciousnessState.FLOW]: 0,
          [ConsciousnessState.RUMINATIVE]: 0,
          [ConsciousnessState.MINDFUL]: 0,
      };

      // Score FLOW state
      scores[ConsciousnessState.FLOW] += (cognitiveLoad > 0.7 && taskSuccess > 0.8) ? 1.0 : -0.5;
      scores[ConsciousnessState.FLOW] += (emotionalProfile.valence > 0.5) ? 0.5 : -0.5;
      scores[ConsciousnessState.FLOW] += (metrics.temporalFocus === TemporalFocus.PRESENT) ? 0.5 : 0;

      // Score FOCUSED state
      scores[ConsciousnessState.FOCUSED] += (cognitiveLoad > 0.6) ? 0.8 : -0.5;
      scores[ConsciousnessState.FOCUSED] += (metrics.sensoryBandwidth < 0.5) ? 0.3 : 0; // Lower peripheral awareness

      // Score DIFFUSE state
      scores[ConsciousnessState.DIFFUSE] += (cognitiveLoad < 0.4) ? 0.8 : -0.5;
      scores[ConsciousnessState.DIFFUSE] += (metrics.metacognitiveIndex > 0.5) ? 0.5 : 0; // Associative thought

      // Score RUMINATIVE state
      scores[ConsciousnessState.RUMINATIVE] += (emotionalProfile.valence < -0.5) ? 1.0 : -0.5;
      scores[ConsciousnessState.RUMINATIVE] += (metrics.temporalFocus === TemporalFocus.PAST) ? 0.6 : 0;
      scores[ConsciousnessState.RUMINATIVE] += (taskSuccess < 0.3) ? 0.4 : 0;

      // Score MINDFUL state
      scores[ConsciousnessState.MINDFUL] += (cognitiveLoad < 0.2 && emotionalProfile.intensity < 0.3) ? 1.0 : -0.5;
      scores[ConsciousnessState.MINDFUL] += (metrics.interoceptiveClarity > 0.7) ? 0.6 : 0;
      scores[ConsciousnessState.MINDFUL] += (metrics.temporalFocus === TemporalFocus.PRESENT) ? 0.4 : 0;

      // Paradox check: If FLOW and RUMINATIVE are both high, it's a conflict.
      if (scores[ConsciousnessState.FLOW] > 0.8 && scores[ConsciousnessState.RUMINATIVE] > 0.8) {
          throw new ProcessingParadoxError('Cannot be in a state of Flow and Rumination simultaneously.', { scores });
      }

      // Determine the state with the highest score
      const finalState = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
      return finalState;
  }

  /**
   * The main public method to process a new set of inputs.
   * It updates the entire consciousness profile.
   * @param {object} input - The input data object.
   * @param {object} input.sensoryData - Data from sensory channels (e.g., {visual: 0.8}).
   * @param {number} input.cognitiveLoad - A value from 0 to 1 indicating mental effort.
   * @param {Array<object>} input.emotionalCues - Cues for emotional processing (e.g., [{cue: 'joy', intensity: 0.7}]).
   * @param {number} [input.taskSuccess=0.5] - The success rate of the last action, from 0 to 1.
   * @throws {InvalidInputError|ProcessingParadoxError}
   */
  processInput(input) {
    this.#validateInput(input);

    try {
        // Archive the previous state for historical analysis (metacognition)
        if (this.#state) {
            this.#history.push(JSON.parse(JSON.stringify(this.#state)));
            if (this.#history.length > 20) this.#history.shift(); // Keep history bounded
        }

        const newState = {};

        // 1. Process Emotional Intelligence
        newState.emotionalProfile = this.#updateEmotionalState(input.emotionalCues);

        // 2. Calculate new Awareness Metrics
        newState.awarenessMetrics = this.#calculateAwarenessMetrics(input, newState.emotionalProfile);

        // 3. Calculate primary Consciousness State
        newState.consciousnessState = this.#calculateConsciousnessState(
            newState.awarenessMetrics,
            newState.emotionalProfile,
            input.cognitiveLoad,
            input.taskSuccess
        );

        // 4. Update cognitive stats and timestamp
        newState.cognitive = {
            load: input.cognitiveLoad,
            dissonance: newState.awarenessMetrics.metacognitiveIndex, // Dissonance is linked to metacognition
        };
        newState.timestamp = new Date().toISOString();
        newState.lastInput = input;

        // Atomically update the main state object
        this.#state = newState;

    } catch (error) {
        // If a paradox is caught, log it and potentially enter a "confused" state
        if (error instanceof ProcessingParadoxError) {
            console.warn('A processing paradox was handled. State may be unstable.', error.conflictingData);
            // Revert to a more stable, neutral state as a recovery mechanism
            this.#state.consciousnessState = ConsciousnessState.DIFFUSE;
            this.#state.awarenessMetrics.metacognitiveIndex = Math.min(1, this.#state.awarenessMetrics.metacognitiveIndex + 0.5);
        } else {
            // Re-throw other critical errors
            throw error;
        }
    }
  }

  /**
   * Returns a deep copy of the current consciousness state profile.
   * @returns {object} The complete, current state of the consciousness simulation.
   */
  getCurrentState() {
    // Return a deep copy to prevent external mutation of the internal state
    return JSON.parse(JSON.stringify(this.#state));
  }
}
```