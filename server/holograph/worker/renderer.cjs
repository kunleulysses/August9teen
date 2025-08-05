const { performance } = require('perf_hooks');
let gpuMemBytes = 0;
const ivm = require('isolated-vm');
const Redis = require('ioredis');
const redis = new Redis();
const { updateSceneNode, getSceneNodeHierarchy } = require('../scene/sceneNodeService');
const { holograph_fps, holograph_scene_node_count, framesOverBudget, holograph_scene_max_depth, holograph_scene_nodes_depth } = require('../metrics.server');

async function main() {
  redis.subscribe('scene:delta');
  redis.on('message', (channel, msg) => {
    const { id, ...delta } = JSON.parse(msg);
    updateSceneNode(id, delta);
  });

  const frameBudget = 16.6; // ms
  let running = true;

  function applyBackPressure() {
    // TODO: throttle incoming WS messages, pause delta propagation, and notify clients
  }

  function recycleUnused() {
    // TODO: free old textures, decrement gpuMemBytes
  }

  while (running) {
    const t0 = performance.now();
    // TODO: renderFrame()
    const elapsed = performance.now() - t0;
    if (elapsed > frameBudget) {
      framesOverBudget.inc();
      applyBackPressure();
      recycleUnused();
    }
    holograph_fps.set(1000 / elapsed);
    const nodes = await getSceneNodeHierarchy('some-scene-id'); // TODO: get sceneId from somewhere
    holograph_scene_node_count.set(nodes.length);
    const maxDepth = getSceneMaxDepth(nodes);
    holograph_scene_max_depth.set(maxDepth);
    const nodesByDepth = nodes.reduce((acc, node) => {
      acc[node.depth] = (acc[node.depth] || 0) + 1;
      return acc;
    }, {});
    for (const depth in nodesByDepth) {
      holograph_scene_nodes_depth.labels(depth).set(nodesByDepth[depth]);
    }
    holograph_gpu_memory_bytes.set(gpuMemBytes);
    await new Promise(r => setTimeout(r, Math.max(0, frameBudget - elapsed)));
  }
}
main();