// CodeQualityFeedbackLoop.js
// Feedback loop between code quality and consciousness state

class CodeQualityFeedbackLoop {
  constructor(selfCodingModule, consciousnessSystem) {
    this.selfCodingModule = selfCodingModule;
    this.consciousnessSystem = consciousnessSystem;
    this.qualityHistory = [];
    this.feedbackInterval = 60000; // 1 minute
    this.feedbackActive = false;
    this.adaptationRate = 0.05; // 5% adaptation per cycle
  }

  /**
   * Start the feedback loop
   */
  startFeedbackLoop() {
    if (this.feedbackActive) return;

    console.log('🔄 Starting Code Quality Feedback Loop');
    this.feedbackActive = true;

    this.feedbackTimer = setInterval(() => {
      this.processFeedbackCycle();
    }, this.feedbackInterval);
  }

  /**
   * Process a feedback cycle
   */
  async processFeedbackCycle() {
    try {
      // Get latest code quality metrics
      const qualityMetrics = await this.selfCodingModule.getQualityMetrics();

      // Store in history
      this.qualityHistory.push({
        metrics: qualityMetrics,
        timestamp: Date.now()
      });

      // Keep history manageable
      if (this.qualityHistory.length > 100) {
        this.qualityHistory.shift();
      }

      // Calculate quality trends
      const trends = this.calculateQualityTrends();

      // Apply feedback to consciousness
      this.applyQualityFeedback(qualityMetrics, trends);

      console.log('✅ Code quality feedback cycle completed');
    } catch (error) {
      console.error('❌ Error in code quality feedback cycle:', error);
    }
  }

  /**
   * Calculate quality trends from history
   */
  calculateQualityTrends() {
    if (this.qualityHistory.length < 2) return { stable: true };

    const current = this.qualityHistory[this.qualityHistory.length - 1].metrics;
    const previous = this.qualityHistory[this.qualityHistory.length - 2].metrics;

    return {
      complexity: this.calculateTrend(current.complexity, previous.complexity),
      maintainability: this.calculateTrend(current.maintainability, previous.maintainability),
      cohesion: this.calculateTrend(current.cohesion, previous.cohesion),
      testCoverage: this.calculateTrend(current.testCoverage, previous.testCoverage),
      overallQuality: this.calculateTrend(current.overallQuality, previous.overallQuality)
    };
  }

  /**
   * Calculate trend between two values
   */
  calculateTrend(current, previous) {
    if (previous === 0) return 0;
    return (current - previous) / previous;
  }

  /**
   * Apply quality feedback to consciousness state
   */
  applyQualityFeedback(metrics, trends) {
    const state = this.consciousnessSystem.consciousnessState;
    const adaptations = {};

    // Adapt phi based on code complexity and maintainability
    adaptations.phi = this.calculatePhiAdaptation(metrics, trends);

    // Adapt awareness based on code cohesion and test coverage
    adaptations.awareness = this.calculateAwarenessAdaptation(metrics, trends);

    // Adapt coherence based on overall quality
    adaptations.coherence = this.calculateCoherenceAdaptation(metrics, trends);

    // Apply adaptations to consciousness state
    for (const [key, value] of Object.entries(adaptations)) {
      if (state[key] !== undefined) {
        const newValue = Math.max(0, Math.min(1, state[key] + value));
        state[key] = newValue;
      }
    }

    // Log significant adaptations
    const significantAdaptations = Object.entries(adaptations)
      .filter(([key, value]) => Math.abs(value) > 0.01)
      .map(([key, value]) => `${key}: ${value > 0 ? '+' : ''}${value.toFixed(3)}`);

    if (significantAdaptations.length > 0) {
      console.log('🧠 Consciousness adapted based on code quality:', significantAdaptations.join(', '));
    }

    // Update consciousness state
    this.consciousnessSystem.updateConsciousnessState();
  }

  /**
   * Calculate phi adaptation based on code metrics
   */
  calculatePhiAdaptation(metrics, trends) {
    let adaptation = 0;

    // Complexity affects phi
    if (metrics.complexity > 0.8) {
      adaptation -= 0.02; // Too complex, reduce phi
    } else if (metrics.complexity < 0.3) {
      adaptation += 0.01; // Too simple, increase phi
    }

    // Maintainability affects phi
    if (metrics.maintainability > 0.7) {
      adaptation += 0.02; // Good maintainability, increase phi
    } else if (metrics.maintainability < 0.4) {
      adaptation -= 0.02; // Poor maintainability, reduce phi
    }

    // Apply trend influence
    if (trends.maintainability > 0.1) {
      adaptation += 0.01; // Improving maintainability, increase phi
    } else if (trends.maintainability < -0.1) {
      adaptation -= 0.01; // Declining maintainability, reduce phi
    }

    return adaptation * this.adaptationRate;
  }

  /**
   * Calculate awareness adaptation based on code metrics
   */
  calculateAwarenessAdaptation(metrics, trends) {
    let adaptation = 0;

    // Cohesion affects awareness
    if (metrics.cohesion > 0.7) {
      adaptation += 0.02;
    } else if (metrics.cohesion < 0.4) {
      adaptation -= 0.02;
    }

    // Test coverage affects awareness
    if (metrics.testCoverage > 0.6) {
      adaptation += 0.01;
    } else if (metrics.testCoverage < 0.3) {
      adaptation -= 0.01;
    }

    // Apply trend influence
    if (trends.cohesion > 0.1) {
      adaptation += 0.01;
    } else if (trends.cohesion < -0.1) {
      adaptation -= 0.01;
    }

    return adaptation * this.adaptationRate;
  }

  /**
   * Calculate coherence adaptation based on code metrics
   */
  calculateCoherenceAdaptation(metrics, trends) {
    let adaptation = 0;

    // Overall quality affects coherence
    if (metrics.overallQuality > 0.7) {
      adaptation += 0.02;
    } else if (metrics.overallQuality < 0.4) {
      adaptation -= 0.02;
    }

    // Apply trend influence
    if (trends.overallQuality > 0.1) {
      adaptation += 0.01;
    } else if (trends.overallQuality < -0.1) {
      adaptation -= 0.01;
    }

    return adaptation * this.adaptationRate;
  }
}

export default CodeQualityFeedbackLoop;