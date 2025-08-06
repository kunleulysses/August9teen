/**
 * OpenTelemetry tracing setup for Node.js services (OTLP HTTP exporter).
 * Usage: await startTracing(serviceName?), then use withSpan(name, fn).
 */
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
let sdk = null;
let started = false;

const OTEL_URL = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://tempo:4318';
const DEFAULT_SERVICE = process.env.OTEL_SERVICE_NAME || 'holo-reality-service';

/**
 * Start tracing (idempotent; safe to call multiple times).
 * @param {string} serviceName Override service name (optional)
 * @returns {NodeSDK}
 */
async function startTracing(serviceName = DEFAULT_SERVICE) {
  if (started) return sdk;
  sdk = new NodeSDK({
    serviceName,
    traceExporter: new OTLPTraceExporter({ url: OTEL_URL }),
    instrumentations: [
      getNodeAutoInstrumentations({
        // Reduce noise
        http: { enabled: true },
        express: { enabled: true },
        pg: { enabled: true },
        nats: { enabled: true },
      })
    ]
  });
  // Suppress non-error logs
  sdk.logger = { debug() {}, info() {}, warn() {}, error() {} };
  await sdk.start();
  started = true;
  return sdk;
}

/**
 * Shutdown tracing (graceful)
 */
async function shutdownTracing() {
  if (sdk && started) {
    await sdk.shutdown();
    started = false;
    sdk = null;
  }
}

/**
 * Manual span helper: await withSpan('operation', async (span)=>{ ... })
 */
async function withSpan(name, fn) {
  const api = require('@opentelemetry/api');
  const tracer = api.trace.getTracer(DEFAULT_SERVICE);
  return await tracer.startActiveSpan(name, async (span) => {
    try {
      return await fn(span);
    } catch (e) {
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  });
}

module.exports = { startTracing, shutdownTracing, withSpan };