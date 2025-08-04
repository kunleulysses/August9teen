const client = require('prom-client');

const selfcoding_history_size = new client.Gauge({
  name: 'selfcoding_history_size',
  help: 'Number of entries in self-coding codeHistory'
});

const refactoring_active = new client.Gauge({
  name: 'refactoring_active',
  help: 'Number of active autonomous refactoring tasks'
});

const sigil_registry_size = new client.Gauge({
  name: 'sigil_registry_size',
  help: 'Number of sigils in registry'
});

const code_generation_failures_total = new client.Counter({
  name: 'code_generation_failures_total',
  help: 'Total number of code generation failures'
});

const sigil_verifications_total = new client.Counter({
  name: 'sigil_verifications_total',
  help: 'Total sigil verifications'
});

module.exports = {
  selfcoding_history_size,
  refactoring_active,
  sigil_registry_size,
  code_generation_failures_total,
  sigil_verifications_total
};
