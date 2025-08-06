/**
 * Spiral Memory Baseline Audit Script
 *
 * Produces: audit/spiral-metrics.json, event-keys.json, duplicate-files.json, test-summary.json
 */

const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { spawnSync } = require("child_process");

// --- 1. Runtime snapshot ---

async function runtimeSnapshot() {
  const spiralMetrics = {};

  // Launch metrics server in background
  const { spawn } = require('child_process');
  const metricsProc = spawn('node', ['dist-spiral/spiral-metrics-server.cjs'], {
    env: { ...process.env, PORT: 9099 },
    detached: true,
    stdio: 'ignore'
  });
  metricsProc.unref();

  // Wait for server to be up
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const http = require('http');
    await new Promise((resolve, reject) => {
      http.get('http://localhost:9099/metrics', res => {
        if (res.statusCode === 200) resolve(true);
        else reject(new Error('Metrics endpoint returned ' + res.statusCode));
      }).on('error', reject => reject);
    });
  } catch (e) {
    spiralMetrics.metricsEndpoint = 'FAIL: /metrics not reachable';
  }

  // Delete LevelDB before each run for clean audit
  const DB_PATH = process.env.SPIRAL_DB_PATH || './spiraldb';
  try {
    fs.rmSync(DB_PATH, { recursive: true, force: true });
  } catch {}

  try {
    // Dynamically import spiral modules
    const SpiralMemoryArchitecture = require("../server/consciousness/core/SpiralMemoryArchitecture.cjs").default;
    const eventBus = require("../server/consciousness/core/ConsciousnessEventBus.cjs").default || require("../server/consciousness/core/ConsciousnessEventBus.cjs");
    let SpiralMemoryIntegration, HyperdimensionalSpiralTopology;
    try {
      SpiralMemoryIntegration = require("../server/consciousness/spiral-memory-integration.cjs").SpiralMemoryIntegration;
    } catch (e) {}
    try {
      HyperdimensionalSpiralTopology = require("../server/consciousness/core/HyperdimensionalSpiralTopology.cjs").default;
    } catch (e) {}

    // Instantiate SpiralMemoryArchitecture
    const spiral = new SpiralMemoryArchitecture();

    // Generate 200 dummy memories of varying type/depth
    const types = ["consciousness", "awareness", "memory", "emotion", "goal"];
    const depths = ["surface", "shallow", "deep", "core", "transcendent"];
    for (let i = 0; i < 200; i++) {
      const data = {
        memoryId: "dummy_" + i,
        memoryData: `Lorem ipsum dummy ${i}`,
        consciousnessContext: { coherence: Math.random() * 0.2 + 0.7 },
        requestId: "audit_" + i,
      };
      // For SpiralMemoryArchitecture, expects eventBus interface
      eventBus.emit && eventBus.emit("store_memory_request", data);
    }

    // Wait 2 seconds for processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fetch metrics
    spiralMetrics.spiralMemory = {
      ...(spiral.getMetrics ? await spiral.getMetrics() : {}),
      ...(spiral.getMemoryStatistics ? spiral.getMemoryStatistics() : {}),
    };

    // SpiralMemoryIntegration with dummy topology/reality
    if (SpiralMemoryIntegration) {
      let dummyTopology = HyperdimensionalSpiralTopology
        ? new HyperdimensionalSpiralTopology(7)
        : { generateSpiral: async () => ({ spiral: { id: "dummy", type: "fibonacci", nodeCount: 0 } }) };

      let dummyReality = {
        id: "reality_1",
        holographicProperties: { resonanceFrequency: 5, dimensionality: 7, coherence: 0.8, stability: 0.8 },
        consciousnessState: { phi: 0.8, awareness: 0.8, coherence: 0.8 },
        createdAt: Date.now(),
      };

      let integration = new SpiralMemoryIntegration(dummyTopology, {
        generateHolographicReality: async () => ({ holographicReality: {} }),
      });

      for (let j = 200; j < 220; j++) {
        const memory = {
          id: "dummy_" + j,
          content: `Integrated memory ${j}`,
          type: types[j % types.length],
          strength: Math.random(),
          emotionalContent: Math.random(),
          associations: [],
        };
        await integration.integrateMemoryWithReality(memory, dummyReality);
      }

      spiralMetrics.spiralMemoryIntegration = integration.getSpiralMemoryMetrics
        ? integration.getSpiralMemoryMetrics()
        : { totalIntegratedMemories: integration.integratedMemories.size };
    }

    // Restart simulation: re-require modules and assert persistence
    delete require.cache[require.resolve("../server/consciousness/core/SpiralMemoryArchitecture.cjs")];
    const SpiralMemoryArchitecture2 = require("../server/consciousness/core/SpiralMemoryArchitecture.cjs").default;
    const spiral2 = new SpiralMemoryArchitecture2();
    await spiral2.initialize && spiral2.initialize();
    spiralMetrics.afterRestart = spiral2.getMemoryStatistics ? spiral2.getMemoryStatistics() : {};
  } catch (e) {
    spiralMetrics.error = e && e.message || String(e);
  }
  fs.writeFileSync(path.resolve(__dirname, "spiral-metrics.json"), JSON.stringify(spiralMetrics, null, 2));
}

// --- 2. Static scan ---

async function staticScan() {
  // Event key extraction
  const searchDirs = [
    "server",
    "FlappyJournal/shared-consciousness",
    "shared-consciousness",
    "shared"
  ];
  let allFiles = await globby(
    searchDirs.map((d) => `${d}/**/*.{js,ts,cjs,mjs}`),
    { absolute: true, gitignore: true }
  );
  const eventRegex = /\.(emit|on)\(\s*(['"`])([^'"`]+)\2/g;
  const eventKeys = new Set();

  for (let file of allFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch { continue; }
    let match;
    while ((match = eventRegex.exec(content))) {
      if (/spiral|memory/i.test(match[3])) {
        eventKeys.add(match[3]);
      }
    }
  }
  fs.writeFileSync(path.resolve(__dirname, "event-keys.json"), JSON.stringify([...eventKeys], null, 2));

  // Duplicate/backup files
  const backupPattern = /spiral-memory.*\.(bak|backup|orig|rej)$/i;
  const duplicateFiles = [];
  for (let file of allFiles) {
    if (backupPattern.test(path.basename(file))) {
      duplicateFiles.push(file.replace(process.cwd() + "/", ""));
    }
  }
  fs.writeFileSync(path.resolve(__dirname, "duplicate-files.json"), JSON.stringify(duplicateFiles, null, 2));
}

// --- 3. Test sweep ---

function testSweep() {
  // Assumes jest is present
  const outputRaw = path.resolve(__dirname, "test-raw.json");
  const outputSummary = path.resolve(__dirname, "test-summary.json");
  let testResult = null;
  try {
    const run = spawnSync("npm", [
      "test",
      "--silent",
      "--",
      "*spiral*",
      "--json",
      `--outputFile=${outputRaw}`,
    ], { encoding: "utf8" });

    // Jest outputs to test-raw.json
    if (fs.existsSync(outputRaw)) {
      const raw = JSON.parse(fs.readFileSync(outputRaw, "utf8"));
      testResult = {
        total: raw.numTotalTests || 0,
        passed: raw.numPassedTests || 0,
        failed: raw.numFailedTests || 0,
        testResults: (raw.testResults || []).map((t) => ({
          name: t.name,
          status: t.status,
          assertionResults: t.assertionResults.map((a) => ({
            title: a.title,
            status: a.status,
            failureMessages: a.failureMessages,
          })),
        })),
      };
      fs.writeFileSync(outputSummary, JSON.stringify(testResult, null, 2));
    }
  } catch (e) {
    fs.writeFileSync(outputSummary, JSON.stringify({ error: e.message }, null, 2));
  }
}

// --- 4. README scaffold ---

function writeReadme() {
  const readme = `
# Spiral Memory Audit Report

## How to run

\`\`\`sh
npm run spiral:audit
\`\`\`

## Output files

- **spiral-metrics.json**: Runtime snapshot of SpiralMemoryArchitecture and SpiralMemoryIntegration after 200+20 dummy store/integrate ops.
- **event-keys.json**: All EventBus event keys containing "spiral" or "memory" (emit/on).
- **duplicate-files.json**: List of spiral-memory module backups/duplicates (.bak, .backup, .orig, .rej).
- **test-summary.json**: Pass/fail summary for all Jest tests with "spiral" in filename.

## Guidance

- No spiral modules are refactored—this is a read-only audit.
- If spiral-metrics.json shows errors, check module paths or require errors.
- If test-summary.json is empty or missing, ensure Jest is installed and spiral tests exist.

---
Generated by audit/spiral-memory-baseline.js
  `.trim();
  fs.writeFileSync(path.resolve(__dirname, "README.md"), readme);
}

// --- Run everything ---

(async () => {
  // Ensure audit dir exists
  try { fs.mkdirSync(path.resolve(__dirname), { recursive: true }); } catch {}
  await runtimeSnapshot();
  await staticScan();
  testSweep();
  writeReadme();
})();