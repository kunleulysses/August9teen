```javascript
/**
 * @module ConsciousnessProcessor
 * @description An advanced JavaScript module for simulating and enhancing consciousness processing.
 * This module is built on a theoretical "Cognitive Resonance Framework," which posits that
 * consciousness is an emergent property of the interplay between sensory data, internal somatic states,
 * cognitive streams, and emotional feedback loops. The module provides tools to calculate a
- * consciousness state, derive novel awareness metrics, and analyze emotional intelligence with greater depth.
 *
 * It is designed for use in AI character development, psychological modeling, and theoretical cognitive science research.
 *
 * @version 2.0.0
 * @author A.I. Cogitatus
 * @license MIT
 */

/**
 * Custom Error class for handling specific processing failures within the module.
 * This allows for more granular error catching by the consumer.
 */
class ConsciousnessProcessingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConsciousnessProcessingError';
  }
}

/**
 * The main class for processing consciousness data.
 * It takes snapshots of cognitive and sensory data to produce a detailed analysis.
 */
export default class ConsciousnessProcessor {
  /**
   * Initializes the ConsciousnessProcessor with optional configuration.
   * @param {object} [config={}] - Configuration object.
   * @param {object} [config.weights] - Weights to adjust the importance of different awareness metrics.
   * @param {number} [config.weights.external=1.0] - Weight for external sensory awareness.
   * @param {number} [config.weights.internal=1.2] - Weight for internal somatic awareness.
   * @param {number} [config.weights.metacognitive=1.5] - Weight for metacognitive (self-awareness) processing.
   * @param {number} [config.weights.temporal=1.1] - Weight for awareness of time (past, present, future).
   */
  constructor(config = {}) {
    this.config = {
      weights: {
        external: 1.0,
        internal: 1.2,
        metacognitive: 1.5,
        temporal: 1.1,
        ...config.weights,
      },
    };
  }

  /**
   * Performs a comprehensive analysis of a given cognitive snapshot.
   * This is the primary entry point for the module.
   * @param {object} snapshot - An object representing a moment of consciousness.
   * @param {object} snapshot.sensoryInput - Data from external senses.
   * @param {number} snapshot.sensoryInput.visualClarity - 0.0 (blurry) to 1.0 (sharp).
   * @param {number} snapshot.sensoryInput.auditoryClarity - 0.0 (muffled) to 1.0 (clear).
   * @param {number} snapshot.sensoryInput.tactileRichness - 0.0 (numb) to 1.0 (vivid).
   * @param {object} snapshot.somaticState - Data from internal body state.
   * @param {number} snapshot.somaticState.heartRate - Beats per minute.
   * @param {number} snapshot.somaticState.breathingRate - Breaths per minute.
   * @param {number} snapshot.somaticState.interoceptiveAccuracy - 0.0 (unaware) to 1.0 (highly aware of internal sensations).
   * @param {string[]} snapshot.cognitiveStream - An array of strings representing current thoughts.
   * @param {object} snapshot.emotionalState - The foundational emotional tone.
   * @param {number} snapshot.emotionalState.valence - -1.0 (very negative) to 1.0 (very positive).
   * @param {number} snapshot.emotionalState.arousal - 0.0 (calm) to 1.0 (highly excited/agitated).
   * @returns {object} A detailed analysis of the consciousness state.
   * @throws {ConsciousnessProcessingError} If the snapshot data is invalid or incomplete.
   */
  processSnapshot(snapshot) {
    this._validateSnapshot(snapshot);

    const awarenessMetrics = this._calculateAwarenessMetrics(snapshot);
    const emotionalAnalysis = this._processEmotionalIntelligence(snapshot, awarenessMetrics);
    const consciousnessState = this._calculateConsciousnessState(snapshot, awarenessMetrics, emotionalAnalysis);

    return {
      timestamp: new Date().toISOString(),
      ...consciousnessState,
      awareness: awarenessMetrics,
      emotionalIntelligence: emotionalAnalysis,
    };
  }

  /**
   * Validates the structure and types of the input snapshot.
   * @private
   * @param {object} snapshot - The cognitive snapshot to validate.
   * @throws {ConsciousnessProcessingError}
   */
  _validateSnapshot(snapshot) {
    if (!snapshot) throw new ConsciousnessProcessingError('Snapshot cannot be null or undefined.');

    const requiredKeys = {
      sensoryInput: 'object',
      somaticState: 'object',
      cognitiveStream: 'array',
      emotionalState: 'object',
    };

    for (const key in requiredKeys) {
      if (!(key in snapshot)) {
        throw new ConsciousnessProcessingError(`Snapshot missing required key: '${key}'.`);
      }
      if (requiredKeys[key] === 'array' && !Array.isArray(snapshot[key])) {
        throw new ConsciousnessProcessingError(`Snapshot key '${key}' must be an array.`);
      } else if (typeof snapshot[key] !== requiredKeys[key] && requiredKeys[key] !== 'array') {
        throw new ConsciousnessProcessingError(`Snapshot key '${key}' must be of type ${requiredKeys[key]}.`);
      }
    }
  }

  /**
   * Calculates a suite of novel awareness metrics.
   * @private
   * @param {object} snapshot - The cognitive snapshot.
   * @returns {object} An object containing various awareness scores.
   */
  _calculateAwarenessMetrics(snapshot) {
    const { sensoryInput, somaticState, cognitiveStream } = snapshot;

    // 1. External Awareness: How clearly the external world is perceived.
    const external = (sensoryInput.visualClarity + sensoryInput.auditoryClarity + sensoryInput.tactileRichness) / 3;

    // 2. Internal Awareness: How attuned the consciousness is to its own body.
    const internal = somaticState.interoceptiveAccuracy;

    // 3. Metacognitive Awareness: The degree of self-reflection in the thought stream.
    const metacognitiveKeywords = ['I think', 'I feel', 'I wonder', 'I realize', 'myself', 'why'];
    const metacognitiveThoughts = cognitiveStream.filter(thought =>
      metacognitiveKeywords.some(keyword => thought.toLowerCase().includes(keyword))
    ).length;
    const metacognitive = cognitiveStream.length > 0 ? (metacognitiveThoughts / cognitiveStream.length) : 0;

    // 4. Temporal Awareness: The balance of focus on past, present, and future.
    const pastKeywords = ['remember', 'was', 'used to', 'before'];
    const futureKeywords = ['will', 'plan', 'hope', 'going to'];
    const pastFocus = cognitiveStream.filter(t => pastKeywords.some(k => t.includes(k))).length;
    const futureFocus = cognitiveStream.filter(t => futureKeywords.some(k => t.includes(k))).length;
    const presentFocus = cognitiveStream.length - pastFocus - futureFocus;
    const temporalDistribution = [pastFocus, presentFocus, futureFocus];
    const totalThoughts = cognitiveStream.length || 1;
    // High score for balanced distribution, low score for being stuck in one time frame.
    const temporalVariance = temporalDistribution.reduce((acc, val) => acc + Math.pow(val / totalThoughts - 1 / 3, 2), 0) / 3;
    const temporal = 1 - Math.sqrt(temporalVariance) * 1.5; // Scale and invert

    // Calculate total weighted awareness score
    const totalAwareness =
      (external * this.config.weights.external +
        internal * this.config.weights.internal +
        metacognitive * this.config.weights.metacognitive +
        temporal * this.config.weights.temporal) /
      Object.values(this.config.weights).reduce((a, b) => a + b, 0);

    return {
      external: Number(external.toFixed(3)),
      internal: Number(internal.toFixed(3)),
      metacognitive: Number(metacognitive.toFixed(3)),
      temporal: Number(Math.max(0, temporal).toFixed(3)), // Ensure non-negative
      total: Number(totalAwareness.toFixed(3)),
    };
  }

  /**
   * Enhances emotional intelligence processing by analyzing emotional complexity and regulation.
   * @private
   * @param {object} snapshot - The cognitive snapshot.
   * @param {object} awarenessMetrics - The calculated awareness metrics.
   * @returns {object} A detailed emotional analysis.
   */
  _processEmotionalIntelligence(snapshot, awarenessMetrics) {
    const { emotionalState, cognitiveStream } = snapshot;

    // 1. Primary Emotion Identification
    let primaryEmotion = 'Neutral';
    if (emotionalState.valence > 0.3) primaryEmotion = 'Positive';
    if (emotionalState.valence < -0.3) primaryEmotion = 'Negative';
    if (emotionalState.arousal > 0.6) {
      primaryEmotion = primaryEmotion === 'Positive' ? 'Joy/Excitement' : (primaryEmotion === 'Negative' ? 'Anger/Fear' : 'Agitation');
    } else {
      primaryEmotion = primaryEmotion === 'Positive' ? 'Contentment/Calm' : (primaryEmotion === 'Negative' ? 'Sadness/Gloom' : 'Neutral');
    }

    // 2. Emotional Complexity/Nuance: Detects mixed feelings or cognitive dissonance.
    const positiveWords = ['happy', 'good', 'love', 'joy', 'great'];
    const negativeWords = ['sad', 'bad', 'hate', 'fear', 'pain'];
    const hasPositiveThoughts = cognitiveStream.some(t => positiveWords.some(w => t.includes(w)));
    const hasNegativeThoughts = cognitiveStream.some(t => negativeWords.some(w => t.includes(w)));
    let complexity = 0;
    if (primaryEmotion.includes('Positive') && hasNegativeThoughts) complexity = 0.7;
    if (primaryEmotion.includes('Negative') && hasPositiveThoughts) complexity = 0.8; // Dissonance is often stronger in negative states
    if (hasPositiveThoughts && hasNegativeThoughts) complexity = Math.max(complexity, 0.5);

    // 3. Emotional Intensity
    const intensity = Math.sqrt(Math.pow(emotionalState.valence, 2) + Math.pow(emotionalState.arousal, 2));

    // 4. Regulatory Capacity: The potential to manage the current emotional state.
    // Higher metacognitive and internal awareness suggest better capacity for self-regulation.
    const regulatoryCapacity = (awarenessMetrics.metacognitive * 0.6) + (awarenessMetrics.internal * 0.4);

    return {
      primaryEmotion,
      intensity: Number(intensity.toFixed(3)),
      complexity: Number(complexity.toFixed(3)),
      regulatoryCapacity: Number(regulatoryCapacity.toFixed(3)),
    };
  }

  /**
   * Integrates all processed metrics to determine a final, high-level consciousness state.
   * @private
   * @param {object} snapshot - The cognitive snapshot.
   * @param {object} awarenessMetrics - The calculated awareness metrics.
   * @param {object} emotionalAnalysis - The processed emotional intelligence data.
   * @returns {object} An object describing the overall consciousness state.
   */
  _calculateConsciousnessState(snapshot, awarenessMetrics, emotionalAnalysis) {
    const { cognitiveStream } = snapshot;
    const { total: totalAwareness, external, metacognitive } = awarenessMetrics;
    const { intensity, complexity, regulatoryCapacity } = emotionalAnalysis;

    // 1. Focus Level: Inverse of thought stream entropy/scatter.
    // A lower number of distinct thoughts represents higher focus.
    const thoughtCount = cognitiveStream.length;
    const focusLevel = Math.max(0, 1 - (thoughtCount / 15)); // Assumes ~15 thoughts is highly scattered.

    // 2. Phenomenal Depth: The richness of the conscious experience.
    // A combination of total awareness and emotional complexity.
    const phenomenalDepth = (totalAwareness * 0.7) + (complexity * 0.3);

    // 3. State Descriptor: A human-readable label for the current state.
    let descriptor = 'Undefined';
    if (totalAwareness > 0.7 && focusLevel > 0.7 && emotionalAnalysis.primaryEmotion.includes('Positive')) {
      descriptor = 'Flow State';
    } else if (metacognitive > 0.6 && regulatoryCapacity > 0.6 && intensity < 0.5) {
      descriptor = 'Mindful Observation';
    } else if (awarenessMetrics.internal > 0.7 && external < 0.4) {
      descriptor = 'Deep Introspection';
    } else if (intensity > 0.8 && regulatoryCapacity < 0.3) {
      descriptor = 'Emotionally Overwhelmed';
    } else if (focusLevel < 0.3 && thoughtCount > 8) {
      descriptor = 'Scattered Cognition';
    } else if (totalAwareness < 0.3) {
      descriptor = 'Disassociated State';
    } else {
      descriptor = 'Normal Waking Consciousness';
    }

    return {
      stateDescriptor: descriptor,
      focusLevel: Number(focusLevel.toFixed(3)),
      phenomenalDepth: Number(phenomenalDepth.toFixed(3)),
    };
  }
}

/*
// --- USAGE EXAMPLE ---

// 1. Import the module
// import ConsciousnessProcessor from './ConsciousnessProcessor.js';

// 2. Create an instance
const processor = new ConsciousnessProcessor({
  weights: {
    metacognitive: 1.8 // Emphasize self-awareness for this simulation
  }
});

// 3. Define a cognitive snapshot
const snapshotInFlow = {
  sensoryInput: {
    visualClarity: 0.9,
    auditoryClarity: 0.8,
    tactileRichness: 0.9,
  },
  somaticState: {
    heartRate: 95,
    breathingRate: 16,
    interoceptiveAccuracy: 0.8,
  },
  cognitiveStream: [
    "The code is coming together perfectly.",
    "This feels right.",
    "Just need to connect this last piece."
  ],
  emotionalState: {
    valence: 0.8,
    arousal: 0.7,
  },
};

const snapshotInDistress = {
  sensoryInput: {
    visualClarity: 0.4,
    auditoryClarity: 0.3,
    tactileRichness: 0.2,
  },
  somaticState: {
    heartRate: 120,
    breathingRate: 25,
    interoceptiveAccuracy: 0.3,
  },
  cognitiveStream: [
    "I can't believe this happened.",
    "What am I going to do?",
    "Why did they say that?",
    "My chest feels tight.",
    "I should have known better.",
    "I remember when things were simpler.",
    "I will have to fix this tomorrow, but how?",
    "I feel so lost."
  ],
  emotionalState: {
    valence: -0.9,
    arousal: 0.85,
  },
};


// 4. Process the snapshot and log the results
try {
  const analysisFlow = processor.processSnapshot(snapshotInFlow);
  console.log('--- Analysis of Flow State ---');
  console.log(JSON.stringify(analysisFlow, null, 2));

  const analysisDistress = processor.processSnapshot(snapshotInDistress);
  console.log('\n--- Analysis of Distressed State ---');
  console.log(JSON.stringify(analysisDistress, null, 2));
} catch (error) {
  if (error instanceof ConsciousnessProcessingError) {
    console.error('Consciousness processing failed:', error.message);
  } else {
    console.error('An unexpected error occurred:', error);
  }
}

*/
```