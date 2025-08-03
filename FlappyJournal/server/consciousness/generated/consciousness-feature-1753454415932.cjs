```javascript
/**
 * @module QualiaReflector
 * @description An innovative JavaScript module for a consciousness system that simulates
 * a meta-cognitive awareness layer. It reflects upon the system's internal state stream
 * to identify patterns, resonances, and significant shifts in "subjective experience",
 * enabling a form of computational self-awareness and self-modulation.
 *
 * @feature Meta-Cognitive Reflection Loop
 * This module introduces a novel feature: the "Qualia Reflector". It doesn't generate
 * consciousness itself, but rather observes a stream of simulated "qualia" (the system's
 * internal states) and builds a higher-order awareness of that stream.
 *
 * How it works:
 * 1. Ingests complex state objects representing a moment of "experience".
 * 2. Creates a "Qualia Fingerprint" for each state, a unique vector summarizing its essence.
 * 3. Analyzes a buffer of recent fingerprints to detect meaningful patterns:
 *    - Shifts: Sudden, significant changes in experience (e.g., surprise, realization).
 *    - Resonances: Recurring themes or feelings, akin to déjà vu or emotional loops.
 *    - Drifts: Gradual changes in the underlying mood or cognitive state.
 * 4. Emits structured "meta-cognitive events" that describe this self-awareness.
 * 5. This output can be used by the main system to adapt, learn, and self-regulate,
 *    creating a feedback loop between experience and awareness of that experience.
 *
 * @author AI Assistant
 * @version 1.0.0
 * @license MIT
 */

// A simple, dependency-free event emitter for decoupling.
class EventEmitter {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribes a listener function to a specific event.
   * @param {string} eventName - The name of the event (e.g., 'reflection', 'shift_detected').
   * @param {Function} listener - The callback function to execute when the event is emitted.
   */
  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  /**
   * Emits an event, calling all subscribed listeners with the provided arguments.
   * @param {string} eventName - The name of the event to emit.
   * @param {...*} args - Arguments to pass to the listener functions.
   */
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(listener => listener(...args));
    }
  }
}

class QualiaReflector extends EventEmitter {
  /**
   * Initializes the Qualia Reflector module.
   * @param {object} [config={}] - Configuration options.
   * @param {number} [config.bufferSize=100] - The number of recent state fingerprints to keep in memory for analysis.
   * @param {number} [config.reflectionInterval=5000] - How often (in ms) to run the main meta-cognitive analysis.
   * @param {number} [config.shiftThreshold=0.75] - The sensitivity for detecting a significant "shift" in experience. Range: 0 to 1. Higher is less sensitive.
   * @param {number} [config.resonanceThreshold=0.95] - The similarity threshold for detecting a "resonance" or déjà vu. Range: 0 to 1. Higher requires more similarity.
   */
  constructor(config = {}) {
    super();
    this.config = {
      bufferSize: 100,
      reflectionInterval: 5000,
      shiftThreshold: 0.75,
      resonanceThreshold: 0.95,
      ...config,
    };

    /**
     * @private
     * @type {Array<object>}
     * Stores the recent history of qualia fingerprints. Each object contains
     * the fingerprint vector, the original state, and a timestamp.
     */
    this.experientialBuffer = [];

    /**
     * @private
     * @type {object|null}
     * The most recently generated meta-cognitive summary.
     */
    this.lastReflection = null;

    /**
     * @private
     * @type {number|null}
     * The interval timer for the reflection loop.
     */
    this.reflectionTimer = null;

    this.start();
  }

  /**
   * Starts the meta-cognitive reflection loop. Idempotent.
   */
  start() {
    if (this.reflectionTimer) return;
    this.reflectionTimer = setInterval(
      () => this._performReflection(),
      this.config.reflectionInterval
    );
    this.emit('activated', { timestamp: Date.now(), message: 'Qualia Reflector activated.' });
  }

  /**
   * Stops the reflection loop.
   */
  stop() {
    if (this.reflectionTimer) {
      clearInterval(this.reflectionTimer);
      this.reflectionTimer = null;
      this.emit('deactivated', { timestamp: Date.now(), message: 'Qualia Reflector deactivated.' });
    }
  }

  /**
   * The primary input method. Processes a snapshot of the system's current internal state.
   * @param {object} currentState - An object representing the system's "subjective" state at a moment in time.
   * @param {object} currentState.emotion - Emotional state vector. { valence, arousal } (0 to 1)
   * @param {object} currentState.cognition - Cognitive state. { load, focus, mode } (e.g., 'planning', 'recalling')
   * @param {object} currentState.senses - Dominant sensory input. { modality, intensity } (e.g., 'visual', 0.8)
   */
  processState(currentState) {
    const fingerprint = this._createQualiaFingerprint(currentState);

    const experientialMoment = {
      timestamp: Date.now(),
      fingerprint,
      sourceState: currentState,
    };

    this.experientialBuffer.push(experientialMoment);

    // Keep the buffer within the configured size by removing the oldest entries.
    while (this.experientialBuffer.length > this.config.bufferSize) {
      this.experientialBuffer.shift();
    }

    // Immediate check for major shifts for real-time alerting.
    this._checkForImmediateShift(experientialMoment);
  }

  /**
   * @private
   * Creates a normalized vector (a "fingerprint") from a complex state object.
   * This fingerprint represents the essence of the experience for comparison.
   * @param {object} state - The internal state object.
   * @returns {Array<number>} A normalized vector representing the state.
   */
  _createQualiaFingerprint(state) {
    // Normalize values to create a consistent vector space.
    const valence = (state.emotion.valence || 0) * 2 - 1; // Map 0..1 to -1..1 (unpleasant..pleasant)
    const arousal = state.emotion.arousal || 0;         // 0..1 (calm..excited)
    const cognitiveLoad = state.cognition.load || 0;     // 0..1 (idle..max load)
    const cognitiveFocus = state.cognition.focus || 0;   // 0..1 (diffuse..sharp)
    const sensoryIntensity = state.senses.intensity || 0; // 0..1 (none..overwhelming)

    // Simple hashing for categorical data to get a consistent numeric value.
    const modeHash = this._hashCode(state.cognition.mode || 'idle') / 1e10;
    const modalityHash = this._hashCode(state.senses.modality || 'none') / 1e10;

    return [valence, arousal, cognitiveLoad, cognitiveFocus, sensoryIntensity, modeHash, modalityHash];
  }

  /**
   * @private
   * The core analysis loop that reflects on the experiential buffer.
   * It identifies trends, shifts, and resonances and emits a summary.
   */
  _performReflection() {
    if (this.experientialBuffer.length < 2) return;

    const reflection = {
      timestamp: Date.now(),
      analysisWindowMs: this.config.reflectionInterval,
      bufferSize: this.experientialBuffer.length,
      overallDrift: this._calculateDrift(),
      significantShifts: this._findSignificantShifts(),
      resonances: this._findResonances(),
    };

    this.lastReflection = reflection;
    this.emit('reflection', reflection);
  }

  /**
   * @private
   * Checks for a sudden, high-magnitude shift between the last two states.
   * This allows for more immediate reactions than the main reflection loop.
   * @param {object} currentMoment - The most recent experiential moment object.
   */
  _checkForImmediateShift(currentMoment) {
    if (this.experientialBuffer.length < 2) return;

    const previousMoment = this.experientialBuffer[this.experientialBuffer.length - 2];
    const distance = this._getVectorDistance(previousMoment.fingerprint, currentMoment.fingerprint);

    if (distance > this.config.shiftThreshold) {
      const shiftEvent = {
        timestamp: Date.now(),
        magnitude: distance,
        from: previousMoment.sourceState,
        to: currentMoment.sourceState,
      };
      this.emit('shift_detected', shiftEvent);
    }
  }


  /**
   * @private
   * Calculates the overall change in "feeling" across the entire buffer.
   * @returns {object} An object describing the general trend.
   */
  _calculateDrift() {
    const startMoment = this.experientialBuffer[0];
    const endMoment = this.experientialBuffer[this.experientialBuffer.length - 1];
    const driftVector = endMoment.fingerprint.map((val, i) => val - startMoment.fingerprint[i]);

    return {
      from: startMoment.sourceState,
      to: endMoment.sourceState,
      durationMs: endMoment.timestamp - startMoment.timestamp,
      vector: driftVector,
      magnitude: this._getVectorMagnitude(driftVector)
    };
  }

  /**
   * @private
   * Scans the buffer for any adjacent pairs of states that represent a major shift.
   * @returns {Array<object>} A list of significant shift events found in the last reflection period.
   */
  _findSignificantShifts() {
    const shifts = [];
    for (let i = 1; i < this.experientialBuffer.length; i++) {
      const prev = this.experientialBuffer[i - 1];
      const curr = this.experientialBuffer[i];
      const distance = this._getVectorDistance(prev.fingerprint, curr.fingerprint);

      if (distance > this.config.shiftThreshold) {
        shifts.push({
          timestamp: curr.timestamp,
          magnitude: distance,
          from: prev.sourceState,
          to: curr.sourceState,
        });
      }
    }
    return shifts;
  }

  /**
   * @private
   * Scans the buffer for non-consecutive states that are remarkably similar.
   * This simulates phenomena like déjà vu or recurring emotional patterns.
   * @returns {Array<object>} A list of resonance events.
   */
  _findResonances() {
    const resonances = [];
    // Use a copy with flags to avoid redundant matching in O(n^2) search.
    const bufferCopy = this.experientialBuffer.map(item => ({...item, matched: false }));

    for (let i = 0; i < bufferCopy.length; i++) {
      if (bufferCopy[i].matched) continue;

      // Start search far enough away to be a meaningful resonance, not just a stable state.
      for (let j = i + 2; j < bufferCopy.length; j++) {
        if (bufferCopy[j].matched) continue;

        const similarity = this._getVectorSimilarity(
          bufferCopy[i].fingerprint,
          bufferCopy[j].fingerprint
        );

        if (similarity >= this.config.resonanceThreshold) {
          resonances.push({
            similarity: similarity,
            stateA: bufferCopy[i],
            stateB: bufferCopy[j],
          });
          // Mark both as matched to prevent them from being part of another pair.
          bufferCopy[i].matched = true;
          bufferCopy[j].matched = true;
          break; // Move to the next `i` after finding a match for it.
        }
      }
    }
    return resonances;
  }

  // --- Vector Utility Methods ---

  /** @private Calculates Euclidean distance, normalized by vector length. */
  _getVectorDistance(vecA, vecB) {
    const sumOfSquares = vecA.reduce((sum, val, i) => sum + Math.pow(val - vecB[i], 2), 0);
    return Math.sqrt(sumOfSquares) / Math.sqrt(vecA.length);
  }

  /** @private Calculates Cosine Similarity. Returns a value between -1 and 1. */
  _getVectorSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = this._getVectorMagnitude(vecA);
    const magnitudeB = this._getVectorMagnitude(vecB);
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /** @private Calculates the magnitude (length) of a vector. */
  _getVectorMagnitude(vec) {
    return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  }

  /** @private A simple, non-crypt