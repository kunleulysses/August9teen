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
  help: 'Encode operation duration (seconds)',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
});

const sigilVerifyDuration = new promClient.Histogram({
  name: 'sigil_verify_duration_seconds',
  help: 'Verify operation duration (seconds)',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
});

const storageWriteDuration = new promClient.Histogram({
  name: 'sigil_storage_write_seconds',
  help: 'Storage write duration (seconds)',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
});

const storageReadDuration = new promClient.Histogram({
  name: 'sigil_storage_read_seconds',
  help: 'Storage read duration (seconds)',
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
});

const dnaStoreRequestDuration = new promClient.Histogram({
  name: 'dnastore_request_duration_seconds',
  help: 'DNAStore request duration (seconds)',
  labelNames: ['method', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]
});

const sigilGCCount = new promClient.Counter({
  name: 'sigil_gc_total',
  help: 'Number of GC cycles run'
});

const validationFailures = new promClient.Counter({
  name: 'validation_failures_total',
  help: 'Total number of validation failures'
});

const resonanceStrengthHistogram = new promClient.Histogram({
  name: 'sigil_resonance_strength',
  help: 'Histogram of resonance strengths between sigils',
  buckets: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
});

module.exports = {
  sigilEncodeCounter,
  sigilVerifyCounter,
  sigilErrorCounter,
  sigilEncodeDuration,
  sigilVerifyDuration,
  storageWriteDuration,
  storageReadDuration,
  dnaStoreRequestDuration,
  sigilGCCount,
  validationFailures,
  resonanceStrengthHistogram
};