const { counters, validationFailures } = require('../server/consciousness/utils/metrics.js');
const client = require('prom-client');

describe('Metrics collection', () => {
  test('counter increments and appears in metrics output', async () => {
    counters.jobsProcessed.inc();
    const metrics = await client.register.metrics();
    expect(metrics).toContain('jobs_processed_total');
  });
  test('validation failures counter is counted', async () => {
    validationFailures.inc();
    const metrics = await client.register.metrics();
    expect(metrics).toContain('validation_failures_total');
  });
});