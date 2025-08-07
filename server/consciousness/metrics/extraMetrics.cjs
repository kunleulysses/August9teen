import client from 'prom-client';

export const selfcoding_history_size = new client.Gauge({
  name: 'selfcoding_history_size',
  help: 'Number of entries in self-coding codeHistory'
});

export const refactoring_active = new client.Gauge({
  name: 'refactoring_active',
  help: 'Number of active autonomous refactoring tasks'
});

export const sigil_registry_size = new client.Gauge({
  name: 'sigil_registry_size',
  help: 'Number of sigils in registry'
});

export const code_generation_failures_total = new client.Counter({
  name: 'code_generation_failures_total',
  help: 'Total number of code generation failures'
});

export const sigil_verifications_total = new client.Counter({
  name: 'sigil_verifications_total',
  help: 'Total sigil verifications'
});

// Quota metrics for self-coding
export const selfcoding_quota_used = new client.Gauge({
  name: 'selfcoding_quota_used',
  help: 'Self-coding requests used in current quota window'
});

export const selfcoding_quota_limit = new client.Gauge({
  name: 'selfcoding_quota_limit',
  help: 'Self-coding quota limit per hour'
});
