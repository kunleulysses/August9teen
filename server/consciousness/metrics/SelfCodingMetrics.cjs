import { EventEmitter } from 'events';

class SelfCodingMetrics extends EventEmitter {
  constructor() {
    super();
    this.reset();
  }
  reset() {
    this.activeGenerations = 0;
    this.generatedTotal = 0;
    this.errorsTotal = 0;
    this.lastGenerationTs = 0;
    this.cyclomaticSum = 0;
    this.cognitiveSum = 0;
    this.complexitySamples = 0;
    this.testsPassed = 0;
    this.testsRun = 0;
  }

  markGenerationStart() {
    this.activeGenerations += 1;
  }
  markGenerationEnd({ complexity }) {
    this.activeGenerations -= 1;
    this.generatedTotal += 1;
    this.lastGenerationTs = Date.now();
    if (complexity) {
      this.cyclomaticSum += complexity.cyclomatic || 0;
      this.cognitiveSum += complexity.cognitive || 0;
      this.complexitySamples += 1;
    }
  }
  markError() { this.errorsTotal += 1; }
  markTest(result) {
    this.testsRun += 1;
    if (result) this.testsPassed += 1;
  }

  getPrometheusText() {
    const avgCyclo = this.complexitySamples ? this.cyclomaticSum / this.complexitySamples : 0;
    const avgCog   = this.complexitySamples ? this.cognitiveSum / this.complexitySamples : 0;
    const passRate = this.testsRun ? this.testsPassed / this.testsRun : 0;
    const lines = [
      `selfcoding_active_generations ${this.activeGenerations}`,
      `selfcoding_generated_total ${this.generatedTotal}`,
      `selfcoding_errors_total ${this.errorsTotal}`,
      `selfcoding_avg_cyclomatic ${avgCyclo.toFixed(2)}`,
      `selfcoding_avg_cognitive ${avgCog.toFixed(2)}`,
      `selfcoding_test_pass_rate ${passRate.toFixed(2)}`,
      `selfcoding_last_generation_ts ${this.lastGenerationTs}`
    ];
    return lines.join('\n') + '\n';
  }
}

const metrics = new SelfCodingMetrics();
export default metrics;