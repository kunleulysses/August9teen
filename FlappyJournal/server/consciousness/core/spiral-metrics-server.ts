import express from 'express';
import client from 'prom-client';
import SpiralMemoryFacade from './SpiralMemoryFacade';

// Singleton instance (imported, not re-initialized)
const spiral = SpiralMemoryFacade;

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const memoryGauge = new client.Gauge({
  name: 'spiral_memory_total',
  help: 'Total spiral memories by tier',
  labelNames: ['tier'],
  registers: [register]
});
const gcTotal = new client.Counter({
  name: 'spiral_gc_total',
  help: 'Total GC runs',
  registers: [register]
});
const gcLastMs = new client.Gauge({
  name: 'spiral_gc_last_ms',
  help: 'Last GC pause ms',
  registers: [register]
});
const spiralActiveSpirals = new client.Gauge({
  name: 'spiral_active_spirals',
  help: 'Active spiral count',
  registers: [register]
});
const memoryCoherence = new client.Gauge({
  name: 'spiral_memory_coherence',
  help: 'Spiral memory coherence',
  registers: [register]
});
const spiralStability = new client.Gauge({
  name: 'spiral_spiral_stability',
  help: 'Spiral spiralStability',
  registers: [register]
});
const storeLatency = new client.Histogram({
  name: 'spiral_store_latency_ms',
  help: 'Store memory latency ms',
  buckets: [5,10,25,50,100,250,500,1000],
  registers: [register]
});
const gcPause = new client.Histogram({
  name: 'spiral_gc_pause_ms',
  help: 'GC pause ms',
  buckets: [1,5,10,20,50,100,200,500],
  registers: [register]
});

// Patch SpiralMemoryArchitecture to record metrics
const origStore = spiral.arch.storeMemory.bind(spiral.arch);
spiral.arch.storeMemory = async (...args: any[]) => {
  const t0 = Date.now();
  const res = await origStore(...args);
  storeLatency.observe(Date.now() - t0);
  return res;
};
const origGC = spiral.arch.performGarbageCollection.bind(spiral.arch);
spiral.arch.performGarbageCollection = async (timeBudget = 25) => {
  const t0 = Date.now();
  const res = await origGC(timeBudget);
  const ms = Date.now() - t0;
  gcPause.observe(ms);
  gcLastMs.set(ms);
  gcTotal.inc();
  return res;
};

// Update metrics before each scrape
register.setDefaultLabels({ app: 'spiral-memory' });
register.metrics = register.metrics.bind(register);

async function updateGauges() {
  const stats = spiral.arch.getMemoryStatistics();
  memoryGauge.set({ tier: 'active' }, stats.active);
  memoryGauge.set({ tier: 'warm' }, stats.warm);
  memoryGauge.set({ tier: 'cold' }, stats.cold);
  memoryGauge.set({ tier: 'archived' }, stats.archived);
  spiralActiveSpirals.set(stats.totalSpirals);
  memoryCoherence.set((spiral.arch.consciousnessMetrics?.memoryCoherence || 0));
  spiralStability.set((spiral.arch.consciousnessMetrics?.spiralStability || 0));
}

const app = express();
const PORT = process.env.PORT || 9099;

app.get('/metrics', async (_req, res) => {
  await updateGauges();
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SpiralMemory metrics server listening on http://localhost:${PORT}/metrics`);
});