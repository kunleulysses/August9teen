import client from 'prom-client';

// Gauges and counters for self-coding process
const activeGenerations = new client.Gauge({
  name: 'selfcoding_active_generations',
  help: 'Number of active self-coding generations'
});

const generatedTotal = new client.Counter({
  name: 'selfcoding_generated_total',
  help: 'Total number of completed self-coding generations'
});

const errorsTotal = new client.Counter({
  name: 'selfcoding_errors_total',
  help: 'Total number of self-coding errors'
});

const avgCyclomatic = new client.Gauge({
  name: 'selfcoding_avg_cyclomatic',
  help: 'Average cyclomatic complexity of generated code'
});

const avgCognitive = new client.Gauge({
  name: 'selfcoding_avg_cognitive',
  help: 'Average cognitive complexity of generated code'
});

const testPassRate = new client.Gauge({
  name: 'selfcoding_test_pass_rate',
  help: 'Ratio of passed tests to total tests for self-coding'
});

const lastGenerationTs = new client.Gauge({
  name: 'selfcoding_last_generation_ts',
  help: 'Timestamp of the last self-coding generation'
});

let cyclomaticSum = 0;
let cognitiveSum = 0;
let complexitySamples = 0;
let testsRun = 0;
let testsPassed = 0;

function markGenerationStart() {
  activeGenerations.inc();
}

function markGenerationEnd({ complexity } = {}) {
  activeGenerations.dec();
  generatedTotal.inc();
  lastGenerationTs.set(Date.now());
  if (complexity) {
    cyclomaticSum += complexity.cyclomatic || 0;
    cognitiveSum += complexity.cognitive || 0;
    complexitySamples += 1;
    avgCyclomatic.set(cyclomaticSum / complexitySamples);
    avgCognitive.set(cognitiveSum / complexitySamples);
  }
}

function markError() {
  errorsTotal.inc();
}

function markTest(result) {
  testsRun += 1;
  if (result) testsPassed += 1;
  const rate = testsRun ? testsPassed / testsRun : 0;
  testPassRate.set(rate);
}

export default {
  markGenerationStart,
  markGenerationEnd,
  markError,
  markTest,
};

