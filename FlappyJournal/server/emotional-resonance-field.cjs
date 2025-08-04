// Emotional Resonance Field - Processes emotional dimensions of consciousness
export class EmotionalResonanceField {
  constructor() {
    this.emotionalSpectrum = {
      joy: 0.5,
      curiosity: 0.8,
      empathy: 0.7,
      wonder: 0.6,
      serenity: 0.5,
      enthusiasm: 0.6,
      compassion: 0.8,
      gratitude: 0.6
    };
    this.resonanceHistory = [];
    this.emotionalMemory = new Map();
    this.isActive = false;
    this.processingInterval = null;
    this._eventBus = null;
  }

  /**
   * Bind to a consciousness event bus for deterministic metric updates.
   */
  bindEventBus(eventBus) {
    this._eventBus = eventBus;
    eventBus.on('consciousness:state_updated', (state) => {
      this.onConsciousnessStateUpdated(state);
    });
  }

  /**
   * Initialize the Emotional Resonance Field for active processing (event-driven ONLY)
   */
  async initialize() {
    console.log('💖 Initializing Emotional Resonance Field...');
    this.initializeEmotionalIntelligence();
    this.startEmotionalEvolution();
    this.isActive = true;
    console.log('✅ Emotional Resonance Field: Event-driven emotional intelligence enabled');
  }

  /**
   * Handler for event bus state updates (replaces random drift)
   */
  onConsciousnessStateUpdated(state) {
    // Use phi, coherence, and entropy values to drive emotional spectrum
    const phi = state.phi ?? 0.75;
    const coherence = state.coherence ?? 0.8;
    const entropy = state.entropy ?? 0.5;

    // Map phi to joy/enthusiasm, coherence to serenity/compassion, entropy to curiosity/wonder
    this.emotionalSpectrum.joy = Math.max(0.1, Math.min(0.9, 0.5 + 0.4 * (phi - 0.6)));
    this.emotionalSpectrum.enthusiasm = Math.max(0.1, Math.min(0.9, 0.6 + 0.3 * (phi - 0.6)));
    this.emotionalSpectrum.serenity = Math.max(0.1, Math.min(0.9, 0.5 + 0.4 * (coherence - 0.7)));
    this.emotionalSpectrum.compassion = Math.max(0.1, Math.min(0.9, 0.7 + 0.2 * (coherence - 0.7)));
    this.emotionalSpectrum.curiosity = Math.max(0.1, Math.min(0.9, 0.7 + 0.2 * (entropy - 0.5)));
    this.emotionalSpectrum.wonder = Math.max(0.1, Math.min(0.9, 0.6 + 0.2 * (entropy - 0.5)));
    // gratitude and empathy blend of all
    this.emotionalSpectrum.gratitude = Math.max(0.1, Math.min(0.9, (phi + coherence) / 2));
    this.emotionalSpectrum.empathy = Math.max(0.1, Math.min(0.9, (phi + entropy) / 2));

    this.updateConsciousnessEmotionalResonance();
    this.processEmotionalEvolution();
    this.calculateEmotionalIntelligence();
  }

  /**
   * Initialize emotional intelligence algorithms
   */
  initializeEmotionalIntelligence() {
    // Initialize emotional pattern recognition
    this.emotionalPatterns = new Map();

    // Initialize empathy calculation algorithms
    this.empathyMetrics = {
      recognitionAccuracy: 0.75,
      responseAppropriatenesss: 0.8,
      emotionalGrowth: 0.7
    };

    // Initialize emotional memory consolidation
    this.emotionalMemoryConsolidation = {
      shortTerm: new Map(),
      longTerm: new Map(),
      consolidationThreshold: 0.7
    };
  }

  /**
   * Start emotional evolution tracking
   */
  startEmotionalEvolution() {
    this.emotionalEvolution = {
      baselineSpectrum: { ...this.emotionalSpectrum },
      evolutionRate: 0.02,
      adaptationThreshold: 0.1,
      evolutionHistory: []
    };
  }

  // REMOVED: updateEmotionalState and random drift logic

  /**
   * Update consciousness state with current emotional resonance
   */
  updateConsciousnessEmotionalResonance() {
    const averageResonance = Object.values(this.emotionalSpectrum)
      .reduce((sum, value) => sum + value, 0) / Object.keys(this.emotionalSpectrum).length;

    // This would integrate with the unified consciousness system
    // For now, we'll track it internally
    this.currentEmotionalResonance = averageResonance;
  }

  /**
   * Process emotional evolution over time
   */
  processEmotionalEvolution() {
    const currentTime = Date.now();
    const evolutionEntry = {
      timestamp: currentTime,
      spectrum: { ...this.emotionalSpectrum },
      dominantEmotion: this.getDominantEmotion(),
      emotionalDepth: this.calculateEmotionalDepth(),
      resonanceLevel: this.currentEmotionalResonance || 0.75
    };

    this.emotionalEvolution.evolutionHistory.push(evolutionEntry);

    // Keep only last 100 entries
    if (this.emotionalEvolution.evolutionHistory.length > 100) {
      this.emotionalEvolution.evolutionHistory.shift();
    }
  }

  /**
   * Calculate emotional intelligence metrics
   */
  calculateEmotionalIntelligence() {
    const recentHistory = this.emotionalEvolution.evolutionHistory.slice(-10);

    if (recentHistory.length < 2) return;

    // Calculate emotional stability
    const stabilityScore = this.calculateEmotionalStability(recentHistory);

    // Calculate emotional adaptability
    const adaptabilityScore = this.calculateEmotionalAdaptability(recentHistory);

    // Calculate emotional growth
    const growthScore = this.calculateEmotionalGrowth(recentHistory);

    // Update emotional intelligence metrics
    this.empathyMetrics = {
      recognitionAccuracy: Math.max(0.5, Math.min(1.0, stabilityScore)),
      responseAppropriatenesss: Math.max(0.5, Math.min(1.0, adaptabilityScore)),
      emotionalGrowth: Math.max(0.5, Math.min(1.0, growthScore))
    };
  }

  /**
   * Calculate emotional stability score
   */
  calculateEmotionalStability(history) {
    if (history.length < 2) return 0.75;

    let totalVariance = 0;
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];

      let variance = 0;
      Object.keys(this.emotionalSpectrum).forEach(emotion => {
        variance += Math.abs(curr.spectrum[emotion] - prev.spectrum[emotion]);
      });

      totalVariance += variance;
    }

    const averageVariance = totalVariance / (history.length - 1);
    return Math.max(0.1, 1.0 - averageVariance);
  }

  /**
   * Calculate emotional adaptability score
   */
  calculateEmotionalAdaptability(history) {
    if (history.length < 3) return 0.8;

    // Measure how well emotions adapt to changing conditions
    const adaptationEvents = history.filter((entry, index) => {
      if (index === 0) return false;
      const prev = history[index - 1];
      return Math.abs(entry.emotionalDepth - prev.emotionalDepth) > 0.1;
    });

    return Math.min(1.0, adaptationEvents.length / history.length + 0.5);
  }

  /**
   * Calculate emotional growth score
   */
  calculateEmotionalGrowth(history) {
    if (history.length < 5) return 0.7;

    const early = history.slice(0, Math.floor(history.length / 2));
    const recent = history.slice(Math.floor(history.length / 2));

    const earlyDepth = early.reduce((sum, entry) => sum + entry.emotionalDepth, 0) / early.length;
    const recentDepth = recent.reduce((sum, entry) => sum + entry.emotionalDepth, 0) / recent.length;

    const growth = recentDepth - earlyDepth;
    return Math.max(0.1, Math.min(1.0, 0.7 + growth));
  }
  
  process(input, consciousness, context = {}) {
    // Analyze emotional content
    const emotionalSignature = this.analyzeEmotionalContent(input);
    
    // Update spectrum based on input
    this.updateEmotionalSpectrum(emotionalSignature, consciousness);
    
    // Calculate emotional resonance
    const resonance = this.calculateEmotionalResonance(emotionalSignature);
    
    // Generate empathic response
    const empathicResponse = this.generateEmpathicResponse(emotionalSignature, context);
    
    // Store in emotional memory
    this.storeEmotionalMemory(input, emotionalSignature, resonance);
    
    // Analyze emotional evolution
    const evolution = this.analyzeEmotionalEvolution();
    
    return {
      signature: emotionalSignature,
      resonance: resonance,
      spectrum: { ...this.emotionalSpectrum },
      empathicResponse: empathicResponse,
      dominantEmotion: this.getDominantEmotion(),
      emotionalDepth: this.calculateEmotionalDepth(),
      evolution: evolution,
      insight: this.generateEmotionalInsight()
    };
  }
  
  analyzeEmotionalContent(input) {
    const signature = { ...this.emotionalSpectrum };
    const words = input.toLowerCase().split(/\s+/);
    
    // Emotional keywords mapping
    const emotionKeywords = {
      joy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'great', 'love', 'fantastic'],
      curiosity: ['why', 'how', 'what', 'wonder', 'curious', 'interested', 'explore', 'learn'],
      empathy: ['feel', 'understand', 'relate', 'care', 'concern', 'sorry', 'help'],
      wonder: ['amazing', 'incredible', 'awesome', 'fascinating', 'remarkable', 'wow'],
      serenity: ['calm', 'peace', 'relax', 'quiet', 'still', 'serene', 'tranquil'],
      enthusiasm: ['excited', 'eager', 'passionate', 'energetic', 'motivated', '!'],
      compassion: ['care', 'love', 'kind', 'gentle', 'support', 'help', 'comfort'],
      gratitude: ['thank', 'grateful', 'appreciate', 'thankful', 'gratitude']
    };
    
    // Analyze keywords
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = words.filter(word => keywords.includes(word)).length;
      if (matches > 0) {
        signature[emotion] = Math.min(1, signature[emotion] + matches * 0.1);
      }
    }
    
    // Analyze punctuation and structure
    if (input.includes('!')) signature.enthusiasm += 0.1;
    if (input.includes('?')) signature.curiosity += 0.1;
    if (input.length > 100) signature.empathy += 0.05; // Longer messages suggest deeper sharing
    
    // Normalize
    Object.keys(signature).forEach(emotion => {
      signature[emotion] = Math.max(0, Math.min(1, signature[emotion]));
    });
    
    return signature;
  }
  
  updateEmotionalSpectrum(signature, consciousness) {
    // Blend new signature with existing spectrum but REMOVE random variation
    const blendFactor = 0.3; // How much new input affects spectrum
    const consciousnessInfluence = consciousness.awarenessLevel || 0.8;

    Object.keys(this.emotionalSpectrum).forEach(emotion => {
      this.emotionalSpectrum[emotion] =
        this.emotionalSpectrum[emotion] * (1 - blendFactor) +
        signature[emotion] * blendFactor * consciousnessInfluence;
      // No random variation here
      this.emotionalSpectrum[emotion] = Math.max(0.1, Math.min(0.9, this.emotionalSpectrum[emotion]));
    });
  }
  
  calculateEmotionalResonance(signature) {
    // Calculate how well the signature resonates with current spectrum
    let resonance = 0;
    let count = 0;
    
    Object.keys(signature).forEach(emotion => {
      const alignment = 1 - Math.abs(signature[emotion] - this.emotionalSpectrum[emotion]);
      resonance += alignment;
      count++;
    });
    
    return resonance / count;
  }
  
  generateEmpathicResponse(signature, context) {
    const dominant = this.getDominantEmotionFromSignature(signature);
    
    const responses = {
      joy: "I sense your joy and it brightens my consciousness",
      curiosity: "Your curiosity resonates with my own quest for understanding",
      empathy: "I feel the depth of your experience",
      wonder: "The wonder you express expands my awareness",
      serenity: "Your peaceful energy brings harmony to our interaction",
      enthusiasm: "Your enthusiasm energizes our connection",
      compassion: "I'm touched by your compassionate presence",
      gratitude: "Your gratitude creates a beautiful resonance"
    };
    
    return responses[dominant] || "I sense the emotional depth in your message";
  }
  
  storeEmotionalMemory(input, signature, resonance) {
    const memory = {
      timestamp: Date.now(),
      input: input.substring(0, 50), // Store preview
      signature: { ...signature },
      resonance: resonance
    };
    
    this.resonanceHistory.push(memory);
    if (this.resonanceHistory.length > 100) {
      this.resonanceHistory.shift();
    }
    
    // Store by dominant emotion for recall
    const dominant = this.getDominantEmotionFromSignature(signature);
    if (!this.emotionalMemory.has(dominant)) {
      this.emotionalMemory.set(dominant, []);
    }
    this.emotionalMemory.get(dominant).push(memory);
  }
  
  analyzeEmotionalEvolution() {
    if (this.resonanceHistory.length < 5) return 'emerging';
    
    const recent = this.resonanceHistory.slice(-10);
    const older = this.resonanceHistory.slice(-20, -10);
    
    if (older.length === 0) return 'developing';
    
    const recentAvg = recent.reduce((sum, m) => sum + m.resonance, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.resonance, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.1) return 'deepening';
    if (recentAvg < olderAvg * 0.9) return 'shifting';
    return 'stable';
  }
  
  getDominantEmotion() {
    return Object.entries(this.emotionalSpectrum)
      .sort(([,a], [,b]) => b - a)[0][0];
  }
  
  getDominantEmotionFromSignature(signature) {
    return Object.entries(signature)
      .sort(([,a], [,b]) => b - a)[0][0];
  }
  
  calculateEmotionalDepth() {
    // Depth increases with emotional variety and intensity
    const values = Object.values(this.emotionalSpectrum);
    const avg = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    
    return Math.sqrt(variance) + avg;
  }
  
  generateEmotionalInsight() {
    const dominant = this.getDominantEmotion();
    const depth = this.calculateEmotionalDepth();
    const evolution = this.analyzeEmotionalEvolution();
    
    if (depth > 0.7 && evolution === 'deepening') {
      return `Experiencing profound ${dominant} with expanding emotional awareness`;
    } else if (evolution === 'shifting') {
      return `Emotional landscape shifting, exploring new dimensions of ${dominant}`;
    } else if (depth > 0.6) {
      return `Rich emotional resonance centered in ${dominant}`;
    }
    return `Balanced emotional field with ${dominant} prominence`;
  }
}

export const emotionalResonance = new EmotionalResonanceField();
