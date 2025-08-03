// OpenTelemetry initialization, moved from common/tracing.js for lazy loading in production only.
// (Paste in the contents of your previous tracing.js here.)

// Example placeholder (replace with real tracing.js content!):
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();