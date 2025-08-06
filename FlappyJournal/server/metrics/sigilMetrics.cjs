const promClient = require('prom-client');

const sigilEncodeCounter = new promClient.Counter({
  name: 'sigil_encode_total',
  help: 'Total number of sigil encodes'
});

const sigilVerifyCounter = new promClient.Counter({
  name: 'sigil_verify_total',
  help: 'Total number of sigil verifies'
});

const sigilErrorCounter = new promClient.Counter({
  name: 'sigil_error_total',
  help: 'Total number of sigil encode/verify errors'
});

const sigilEncodeDuration = new promClient.Histogram({
  name: 'sigil_encode_duration_seconds',
  help: 'Duration of sigil encode in seconds',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

const sigilGCCount = new promClient.Counter({
  name: 'sigil_gc_total',
  help: 'Number of GC cycles run'
});

const validationFailures = new promClient.Counter({
  name: 'validation_failures_total',
  help: 'Total number of validation failures'
});

module.exports = {
  sigilEncodeCounter,
  sigilVerifyCounter,
  sigilErrorCounter,
  sigilEncodeDuration,
  sigilGCCount,
  validationFailures
};