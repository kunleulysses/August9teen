import './metrics/extraMetrics.cjs';
import http from 'http';
import { metricsMiddleware } from './utils/metrics.cjs';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://tempo:4318/v1/traces'
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-worker': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true }
    })
  ]
});

sdk.start().catch(err => console.error('Error initializing OpenTelemetry', err));

const port = process.env.METRICS_PORT || 9100;
http.createServer(metricsMiddleware).listen(port);

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .catch(err => console.error('Error shutting down OpenTelemetry', err))
    .finally(() => process.exit(0));
});
