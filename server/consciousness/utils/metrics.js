import client from 'prom-client';
client.collectDefaultMetrics();
export const counters = {
  jobsProcessed: new client.Counter({ name: 'jobs_processed_total', help: 'Jobs processed successfully' }),
  queueRejects: new client.Counter({ name: 'queue_rejects_total', help: 'Jobs rejected due to memory pressure' })
};
export function metricsMiddleware(req, res) {
  res.setHeader('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
}