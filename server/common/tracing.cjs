// Simple OpenTelemetry tracing bootstrap (CommonJS)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

try {
  const exporter = new OTLPTraceExporter();
  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });
  sdk.start().then(() => {
    console.log('OpenTelemetry tracing initialized');
  }).catch(err => console.warn('Tracing init error', err));
} catch (e) {
  console.warn('Tracing disabled:', e.message);
}

module.exports = {}; // nothing to export