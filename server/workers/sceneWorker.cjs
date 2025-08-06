/**
 * Scene worker: Consumes reality.gen.request, runs scene gen, publishes result.
 */
const { connectNats, sc } = require('../common/natsClient.cjs');
const { v4: uuidv4 } = require('uuid');
const { HolographicConsciousnessRealityGenerator } = require('../consciousness/holographic-consciousness-reality-generator.cjs');

async function main() {
  const { nats } = await connectNats();
  const generator = new HolographicConsciousnessRealityGenerator();

  const sub = nats.subscribe('reality.gen.request', { queue: 'scene-worker' });
  for await (const m of sub) {
    let req = null, jobId = null;
    try {
      req = JSON.parse(sc.decode(m.data));
      jobId = req.jobId || uuidv4();
      let result, sceneId = null;
      try {
        result = await generator.generateHolographicConsciousnessReality(
          req.request, req.consciousnessState
        );
        sceneId = result?.holographicConsciousnessReality?.id || uuidv4();
        await nats.publish('reality.gen.result', sc.encode(JSON.stringify({
          jobId,
          success: result?.success ?? false,
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
    } catch (e) {
      // Parsing error or NATS error
      if (jobId) {
        await nats.publish('reality.gen.result', sc.encode(JSON.stringify({
          jobId,
          success: false,
          error: e.message,
          ts: Date.now()
        })));
      }
    }
  }
}

main();