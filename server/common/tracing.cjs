// Simple OpenTelemetry tracing bootstrap (CommonJS)
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

try {
  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://tempo:4318/v1/traces',
  });

  const sdk = new NodeSDK({
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'august9teen',
    }),
  });

  sdk
    .start()
    .then(() => {
      console.log('OpenTelemetry tracing initialized');
    })
    .catch((err) => console.warn('Tracing init error', err));
} catch (e) {
  console.warn('Tracing disabled:', e.message);
}

module.exports = {};
