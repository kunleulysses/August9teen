const { createGLContext } = require('headless-gl');
const THREE = require('three');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// --- Argument Parsing ---
const argv = yargs(hideBin(process.argv))
  .option('duration', {
    alias: 'd',
    type: 'number',
    description: 'Benchmark duration in milliseconds',
    default: 5000,
  })
  .option('json', {
    alias: 'j',
    type: 'string',
    description: 'Path to output JSON file',
    default: 'bench-result.json',
  })
  .help()
  .argv;

console.log(`[bench] holograph-perf: Starting benchmark for ${argv.duration}ms...`);

// --- Benchmark State ---
const gl = createGLContext(800, 600);
const renderer = new THREE.WebGLRenderer({ context: gl });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

const start = process.hrtime.bigint();
let frames = 0;
const frameTimes = [];
const durationNs = BigInt(argv.duration) * 1000000n;

// --- Main Loop ---
function simulateFrame() {
  const frameStart = process.hrtime.bigint();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
  
  frames++;
  const frameEnd = process.hrtime.bigint();
  const frameDurationMs = Number(frameEnd - frameStart) / 1e6;
  frameTimes.push(frameDurationMs);

  if (process.hrtime.bigint() - start < durationNs) {
    setImmediate(simulateFrame);
  } else {
    const end = process.hrtime.bigint();
    const elapsedSeconds = Number(end - start) / 1e9;
    generateReport(elapsedSeconds);
    process.exit(0);
  }
}

// --- Report Generation ---
function generateReport(elapsedSeconds) {
  console.log('[bench] holograph-perf: Benchmark finished. Generating report...');

  // Sort frame times to calculate percentiles
  frameTimes.sort((a, b) => a - b);

  const fps = (frames / elapsedSeconds).toFixed(2);
  const avgFrameTime = (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length).toFixed(2);
  const minFrameTime = (Math.min(...frameTimes)).toFixed(2);
  const maxFrameTime = (Math.max(...frameTimes)).toFixed(2);
  const p95FrameTime = (frameTimes[Math.floor(frameTimes.length * 0.95)]).toFixed(2);
  const memoryUsage = process.memoryUsage();

  const results = {
    timestamp: new Date().toISOString(),
    duration: elapsedSeconds.toFixed(2),
    frames,
    fps: parseFloat(fps),
    frameTime: {
      unit: 'ms',
      avg: parseFloat(avgFrameTime),
      min: parseFloat(minFrameTime),
      max: parseFloat(maxFrameTime),
      p95: parseFloat(p95FrameTime),
    },
    memory: {
      unit: 'MB',
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      external: (memoryUsage.external / 1024 / 1024).toFixed(2),
    },
  };

  // Write to JSON file
  try {
    const outputPath = path.resolve(process.cwd(), argv.json);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`[bench] holograph-perf: Results saved to ${outputPath}`);
  } catch (error) {
    console.error(`[bench] holograph-perf: Error writing results to file: ${error.message}`);
    process.exit(1);
  }

  // Log to console
  console.log(`
    --- Holograph Perf Report ---
    Duration: ${results.duration}s
    Frames:   ${results.frames}
    FPS:      ${results.fps}
    
    Frame Times (ms):
      Avg: ${results.frameTime.avg}
      Min: ${results.frameTime.min}
      Max: ${results.frameTime.max}
      p95: ${results.frameTime.p95}

    Memory Usage (MB):
      RSS:       ${results.memory.rss}
      HeapTotal: ${results.memory.heapTotal}
      HeapUsed:  ${results.memory.heapUsed}
    -----------------------------
  `);
}

// --- Start the benchmark ---
simulateFrame();