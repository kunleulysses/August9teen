/**
 * Scene worker: Consumes reality.gen.request, runs scene gen, publishes result.
 */
const { connectNats, sc } = require('../common/natsClient.cjs');
const { v4: uuidv4 } = require('uuid');
const { HolographicConsciousnessRealityGenerator } = require('../consciousness/holographic-consciousness-reality-generator.cjs');
const {
  sceneGenTotal,
  sceneGenLatency,
  register: promRegister
} = require('../common/metrics.cjs');
const { startTracing, shutdownTracing, withSpan } = require('../common/tracing.cjs');
startTracing('scene-worker');

const EXPORT_PROM = process.env.EXPORT_PROM === "true";
if (EXPORT_PROM) {
  require('http').createServer(async (req, res) => {
    if (req.url === '/metrics') {
      res.setHeader('Content-Type', promRegister.contentType);
      res.end(await promRegister.metrics());
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  }).listen(process.env.PROM_PORT || 9617);
}

async function main() {
  const { nats } = await connectNats();
  const generator = new HolographicConsciousnessRealityGenerator();

  const sub = nats.subscribe('reality.gen.request', { queue: 'scene-worker' });
  for await (const m of sub) {
    let req = null, jobId = null;
    const start = Date.now();
    try {
      req = JSON.parse(sc.decode(m.data));
      jobId = req.jobId || uuidv4();
      let result, sceneId = null;
      let success = false;
      try {
        result = await generator.generateHolographicConsciousnessReality(
          req.request, req.consciousnessState
        );
        sceneId = result?.holographicConsciousnessReality?.id || uuidv4();
        success = !!result?.success;
        await nats.publish('reality.gen.result', sc.encode(JSON.stringify({
          jobId,
          success,
          sceneId,
          result,
          ts: Date.now()
        })));
      } catch (err) {
        await nats.publish('reality.gen.result', sc.encode(JSON.stringify({
          jobId,
          success: false,
          error: err.message,
          ts: Date.now()
        })));
      }
      // Metrics
      sceneGenTotal.inc({ success: success ? 'true' : 'false' });
      sceneGenLatency.observe(Date.now() - start);
    } catch (e) {
      if (jobId) {
        await nats.publish('reality.gen.result', sc.encode(JSON.stringify({
          jobId,
          success: false,
          error: e.message,
          ts: Date.now()
        })));
      }
      sceneGenTotal.inc({ success: 'false' });
    }
  }
}

main();