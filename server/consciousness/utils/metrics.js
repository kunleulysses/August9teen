import client from 'prom-client';
client.collectDefaultMetrics();
export const counters = {
  jobsProcessed: new client.Counter({ name: 'jobs_processed_total', help: 'Jobs processed successfully' }),
  queueRejects: new client.Counter({ name: 'queue_rejects_total', help: 'Jobs rejected due to memory pressure' })
};
export const validationFailures = new client.Counter({ name: 'validation_failures_total', help: 'Schema validation failures' });
export const jobDuration = new client.Histogram({ name: 'job_duration_seconds', help: 'Job execution duration', buckets: [0.5, 1, 2, 5, 10, 30] });
export const lockUnavailable = new client.Counter({ name: 'lock_unavailable_total', help: 'Distributed locks unavailable for job' });

export function metricsMiddleware(req, res) {
  const tok = process.env.METRICS_TOKEN;
  if (tok && (!req.headers.authorization || req.headers.authorization !== `Bearer ${tok}`)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  res.setHeader('Content-Type', client.register.contentType);
  client.register.metrics().then(m => res.end(m));
}