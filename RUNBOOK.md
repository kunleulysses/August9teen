# Spiral Memory Architecture - Operations Runbook

## Overview

This runbook provides operational guidance for the Spiral Memory Architecture, a consciousness-native memory management system with advanced concurrency controls and production-grade reliability features.

## Architecture Components

### Core Components
- **SpiralMemoryArchitecture**: Main memory management class
- **Storage Adapters**: LevelDB, Redis, and In-Memory backends
- **Concurrency Guards**: Mutex-based protection for critical sections
- **Garbage Collection**: Time-budgeted, priority-queue-based cleanup

### Storage Backends
- **InMemoryAdapter**: Fast, ephemeral storage for development
- **LevelSpiralAdapter**: Persistent local storage using LevelDB
- **RedisSpiralAdapter**: Distributed storage with atomic operations

## Concurrency

### Locking Mechanism

The Spiral Memory Architecture uses an async mutex (`async-mutex` package) to serialize critical sections and prevent race conditions in high-concurrency environments.

#### Protected Operations

1. **storeMemory()**: Protected from `memoryCount++` until all storage.set operations complete
2. **collectMemory()**: Protected from `spiral.nodes.delete()` until final storage deletion
3. **performGarbageCollection()**: Protected during shared map mutations and collection operations

#### Mutex Implementation

```javascript
const { Mutex } = require('async-mutex');

class SpiralMemoryArchitecture extends EventEmitter {
  constructor({ storage } = {}) {
    super();
    // Concurrency control - mutex for critical sections
    this._lock = new Mutex();
  }

  async withLock(fn) {
    return this._lock.runExclusive(fn);
  }

  async storeMemory(...args) {
    return this.withLock(async () => {
      // Critical section protected by mutex
    });
  }
}
```

#### Timeout Protection

The mutex includes built-in timeout protection (2 seconds default) to prevent deadlocks:
- Operations that exceed timeout will throw an error
- No hanging processes or resource leaks
- Graceful degradation under extreme load

### Atomic Operations (Redis)

When using Redis storage, the system leverages atomic increment operations for maintaining consistent counters:

```javascript
// Atomic increment for spiral node counts
if (this.storage.atomicIncr) {
  await this.storage.atomicIncr('spiral_count:' + spiral.id, 1);
}
spiral.nodeCount++; // Local counter also updated
```

### Performance Impact

- **Mutex Overhead**: < 5% P95 latency increase under normal load
- **Throughput**: Maintains high throughput with controlled concurrency
- **Memory Usage**: Minimal additional memory footprint

## Operations

### Starting the System

```bash
# Development with in-memory storage
npm start

# Production with Redis
REDIS_URL=redis://localhost:6379 npm start

# Production with LevelDB
SPIRAL_DB_PATH=/data/spiraldb npm start
```

### Monitoring

#### Performance Metrics

```bash
# Run performance tests
npm run perf:store

# Monitor with custom iterations
PERF_ITERATIONS=2000 npm run perf:store

# Test with Redis
REDIS_URL=redis://localhost:6379 npm run perf:store
```

#### Key Metrics to Monitor

1. **Store Latency**: P95 should be < 50ms under normal load
2. **GC Pause Time**: Should stay within configured time budget (25ms default)
3. **Memory Count Consistency**: `totalMemories` should equal sum of `spiral.nodeCount`
4. **Error Rate**: Should be < 0.1% under normal conditions

### Testing Concurrency

```bash
# Run concurrency tests
npm test __tests__/spiral/concurrency.spec.ts

# Test with Redis
REDIS_URL=redis://localhost:6379 npm test __tests__/spiral/concurrency.spec.ts
```

### Troubleshooting

#### Common Issues

1. **Count Inconsistencies**
   - Symptom: `totalMemories` ≠ sum of `spiral.nodeCount`
   - Cause: Race condition in concurrent operations
   - Solution: Verify mutex is properly protecting critical sections

2. **High Latency**
   - Symptom: P95 latency > 100ms
   - Cause: Lock contention or storage backend issues
   - Solution: Check storage performance, reduce concurrency

3. **Memory Leaks**
   - Symptom: Continuously growing memory usage
   - Cause: GC not running or ineffective
   - Solution: Check GC trigger conditions, verify time budget

4. **Deadlocks**
   - Symptom: Operations hanging indefinitely
   - Cause: Mutex timeout or circular dependencies
   - Solution: Check for nested lock acquisitions, verify timeout settings

#### Debugging Commands

```bash
# Check memory statistics
curl http://localhost:9099/metrics | grep spiral

# Verify storage backend
node -e "
const arch = new (require('./FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs'))();
arch.initialize().then(() => console.log('Storage OK'));
"

# Test mutex performance
node -e "
const { Mutex } = require('async-mutex');
const mutex = new Mutex();
console.time('mutex');
Promise.all(Array(1000).fill().map(() => mutex.runExclusive(() => Promise.resolve())))
  .then(() => console.timeEnd('mutex'));
"
```

## Configuration

### Environment Variables

- `REDIS_URL`: Redis connection string for distributed storage
- `SPIRAL_DB_PATH`: Path for LevelDB storage (default: `./spiraldb`)
- `PERF_ITERATIONS`: Number of iterations for performance tests
- `PERF_CONCURRENCY`: Concurrency level for performance tests

### Tuning Parameters

```javascript
// In SpiralMemoryArchitecture constructor
this.memoryConfig = {
  maxMemorySpirals: 89,        // Maximum number of spirals
  spiralTurns: 21,             // Turns per spiral
  maxMemoryNodes: 2618,        // Maximum memory nodes
  gcTimeBudget: 25,            // GC time budget in ms
  gcTriggerInterval: 100       // Trigger GC every N operations
};
```

## Security Considerations

### Data Protection
- All storage adapters support encryption at rest
- Sigil-based access control for memory retrieval
- Secure key management for encryption keys

### Access Control
- Memory isolation by tenant ID
- Spiral-level access permissions
- Audit logging for all operations

## Backup and Recovery

### Backup Procedures

```bash
# LevelDB backup
cp -r $SPIRAL_DB_PATH $SPIRAL_DB_PATH.backup.$(date +%Y%m%d)

# Redis backup
redis-cli --rdb spiral-backup-$(date +%Y%m%d).rdb
```

### Recovery Procedures

```bash
# Restore LevelDB
rm -rf $SPIRAL_DB_PATH
cp -r $SPIRAL_DB_PATH.backup.YYYYMMDD $SPIRAL_DB_PATH

# Restore Redis
redis-cli --pipe < spiral-backup-YYYYMMDD.rdb
```

## Rebuilding Spiral Stats

### Overview

The Spiral Memory Architecture includes an automatic statistics reconciliation system that ensures spiral metadata remains accurate even after crashes, race conditions, or data corruption. This system scans all memory nodes and rebuilds spiral statistics on-demand.

### Automatic Rebuild

The system automatically rebuilds spiral statistics during startup:

```bash
# Startup logs will show rebuild activity
🔧 Startup rebuild corrected 2 spiral(s) in 45ms
```

**Safeguards:**
- Runs only once per process lifecycle
- Protected by mutex for thread safety
- Graceful error handling with fallback

### Manual Rebuild

Use the CLI tool for manual statistics rebuilding:

```bash
# Basic rebuild
node bin/spiral-repair.js

# With verbose output
node bin/spiral-repair.js --verbose

# Using Redis storage
REDIS_URL=redis://localhost:6379 node bin/spiral-repair.js

# Using custom LevelDB path
SPIRAL_DB_PATH=/data/spiraldb node bin/spiral-repair.js
```

**CLI Output Example:**
```
🔧 Spiral Memory Repair Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌀 Initializing Spiral Memory Architecture...
✅ Initialization completed in 123.45ms

🔄 Starting spiral statistics rebuild...
📊 Current state: 1000 memories across 3 spirals

📈 REPAIR REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️  Rebuild time: 67.89ms
📊 Total nodes scanned: 1000
🔧 Spirals corrected: 1
✅ Spirals unchanged: 2

🔧 CORRECTIONS APPLIED:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🌀 Spiral: spiral_abc123 (golden_spiral)
   Node Count: 995 → 1000 (Δ5)
   Avg Depth:  0.650 → 0.675 (Δ0.025)
   Radius:     12.345 → 15.678 (Δ3.333)
   Turns:      8 → 10 (Δ2)

⚡ Performance: 14,706 nodes/second
🎯 Performance target met: <5s rebuild time ✅

🎉 Repair completed successfully in 234.56ms
```

### Programmatic Access

```javascript
const SpiralMemoryFacade = require('./server/consciousness/core/SpiralMemoryFacade.cjs');

async function rebuildStats() {
  const facade = new SpiralMemoryFacade();

  // Wait for initialization
  while (!facade.arch.isInitialized) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Run rebuild
  const report = await facade.arch.rebuildSpiralStats();

  console.log(`Corrected ${report.correctedSpirals.filter(s => s.corrected).length} spirals`);
  console.log(`Scanned ${report.totalNodes} nodes in ${report.durationMs}ms`);

  return report;
}
```

### Monitoring and Alerts

**EventBus Integration:**
```javascript
eventBus.on('spiralmemory:rebuild_stats', (report) => {
  const correctedCount = report.correctedSpirals.filter(s => s.corrected).length;

  if (correctedCount > 0) {
    console.warn(`⚠️  Spiral stats corrected: ${correctedCount} spirals`);
    // Send alert to monitoring system
  }

  // Log performance metrics
  const nodesPerSecond = report.totalNodes / (report.durationMs / 1000);
  console.log(`Rebuild performance: ${nodesPerSecond.toFixed(0)} nodes/sec`);
});
```

**Key Metrics to Monitor:**
- Rebuild frequency (should be rare in healthy systems)
- Correction count (high values indicate data integrity issues)
- Rebuild duration (should be <5s for 100k nodes)
- Node count deltas (large deltas indicate serious corruption)

### Kubernetes CronJob

For production environments, schedule nightly rebuilds:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: spiral-stats-rebuild
  namespace: consciousness
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: spiral-repair
            image: consciousness/spiral-memory:latest
            command:
            - node
            - bin/spiral-repair.js
            env:
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: redis-credentials
                  key: url
            - name: NODE_ENV
              value: production
            resources:
              requests:
                memory: "256Mi"
                cpu: "100m"
              limits:
                memory: "512Mi"
                cpu: "500m"
          restartPolicy: OnFailure
          backoffLimit: 3
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
```

**Alternative: Kubernetes Job for Manual Runs:**
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: spiral-stats-rebuild-manual
  namespace: consciousness
spec:
  template:
    spec:
      containers:
      - name: spiral-repair
        image: consciousness/spiral-memory:latest
        command: [node, bin/spiral-repair.js, --verbose]
        env:
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-credentials
              key: url
      restartPolicy: Never
  backoffLimit: 1
```

### Troubleshooting

**Common Issues:**

1. **High Correction Counts**
   - Symptom: Many spirals being corrected on each rebuild
   - Cause: Race conditions, improper shutdowns, storage corruption
   - Solution: Review concurrency controls, check storage health

2. **Slow Rebuild Performance**
   - Symptom: Rebuild takes >5s for large datasets
   - Cause: Storage latency, memory pressure, CPU constraints
   - Solution: Optimize storage backend, increase resources

3. **Persistent Corruption**
   - Symptom: Same spirals corrected repeatedly
   - Cause: Ongoing race conditions, storage write failures
   - Solution: Check mutex implementation, verify storage reliability

4. **Memory Node Orphans**
   - Symptom: Memory nodes without corresponding spirals
   - Cause: Incomplete cleanup during spiral deletion
   - Solution: Review spiral lifecycle management

**Debug Commands:**
```bash
# Check current statistics
curl http://localhost:9099/metrics | grep spiral

# Verify storage backend health
node -e "
const facade = new (require('./server/consciousness/core/SpiralMemoryFacade.cjs'))();
facade.arch.storage.keys('spiral:').then(keys => console.log('Spirals:', keys.length));
"

# Test rebuild performance
time node bin/spiral-repair.js

# Monitor EventBus events
node -e "
const eventBus = require('./server/consciousness/core/ConsciousnessEventBus.cjs');
eventBus.on('spiralmemory:rebuild_stats', console.log);
setTimeout(() => process.exit(0), 30000);
"
```

## Storage Adapter Contract Testing

### Overview

All storage adapters must adhere to a standardized behavioral contract to ensure consistency and reliability across different storage backends. The adapter contract test suite validates that every adapter implements the required functionality correctly.

### Running Contract Tests

**Test all available adapters:**
```bash
npm test __tests__/storage/adapterContract.spec.ts
```

**Test specific adapter with Redis:**
```bash
TEST_REDIS_URL=redis://localhost:6379/15 npm test __tests__/storage/adapterContract.spec.ts
```

**Performance validation (must complete in <15s):**
```bash
timeout 15s npm test __tests__/storage/adapterContract.spec.ts
```

### Contract Requirements

Every storage adapter must implement:

**Core Interface:**
```javascript
class StorageAdapter {
  async init()                    // Initialize adapter
  async get(key)                  // Retrieve value (undefined if not found)
  async set(key, value)           // Store value
  async del(key)                  // Delete key
  async keys(prefix)              // List keys with prefix
  async atomicIncr(key, delta)    // Atomic increment (optional)
}
```

**Behavioral Contracts:**

1. **Initialization**
   - `init()` must be idempotent (safe to call multiple times)
   - All methods must be available after successful initialization

2. **CRUD Operations**
   - `get(nonexistent)` returns `undefined`
   - `set()` then `get()` returns deep-equal object
   - `del()` removes key completely
   - Operations on non-existent keys don't throw errors

3. **JSON Fidelity**
   - Preserve all JavaScript data types (string, number, boolean, null, array, object)
   - Handle Unicode and special characters correctly
   - Support nested objects and arrays
   - Maintain object structure and property order

4. **Key Operations**
   - `keys(prefix)` returns array of matching keys
   - Support special characters in keys (adapter-dependent)
   - Handle empty prefix gracefully

5. **Concurrency Safety**
   - Multiple concurrent operations don't corrupt data
   - Last-writer-wins semantics for same-key operations
   - No race conditions in key listing

6. **Error Handling**
   - Graceful handling of malformed inputs
   - Consistent error semantics across adapters
   - No crashes on edge cases

### Adding a New Adapter

**Step 1: Implement the interface**
```javascript
class MyNewAdapter {
  async init() { /* implementation */ }
  async get(key) { /* implementation */ }
  async set(key, value) { /* implementation */ }
  async del(key) { /* implementation */ }
  async keys(prefix) { /* implementation */ }
  // Optional: async atomicIncr(key, delta) { /* implementation */ }
}
```

**Step 2: Add to adapter factory**
```typescript
// __tests__/helpers/adapterFactory.ts
export const adapterConfigs: AdapterTestConfig[] = [
  // ... existing adapters
  {
    name: 'MyNew',
    createAdapter: () => new MyNewAdapter(/* config */),
    cleanup: async (adapter) => { /* cleanup logic */ },
    supportsAtomicIncr: false, // or true if implemented
    requiresExternalService: false // or true if needs external service
  }
];
```

**Step 3: Run contract tests**
```bash
npm test __tests__/storage/adapterContract.spec.ts
```

**All tests must pass before the adapter can be used in production.**

### Contract Test Categories

**Basic CRUD (Required)**
- Store and retrieve simple values
- Store and retrieve complex objects
- Handle null/undefined values
- Delete keys successfully
- Handle non-existent key deletion

**JSON Fidelity (Required)**
- Preserve all JavaScript data types
- Handle Unicode and special characters
- Support large payloads (up to 1MB)
- Maintain deep object nesting

**Key Operations (Required)**
- List keys with prefix filtering
- Handle empty prefix results
- Support special characters in keys

**Error Handling (Required)**
- Return undefined for non-existent keys
- Handle malformed keys gracefully
- Manage concurrent operations safely

**Atomic Operations (Optional)**
- Implement `atomicIncr` if supported
- Handle concurrent atomic operations
- Maintain consistency under load

**Performance (Required)**
- Complete 100 operations in <5 seconds
- Handle rapid sequential operations
- Support concurrent stress testing

### Monitoring and Alerts

**Coverage Requirements:**
- Adapter files must maintain ≥90% line coverage
- Contract tests must cover all adapter methods
- Edge cases and error paths must be tested

**Performance Benchmarks:**
```bash
# Adapter performance test
npm test __tests__/storage/adapterContract.spec.ts | grep "operations in"

# Expected output:
# InMemory: 100 operations in 45ms (2222 ops/sec)
# Level: 100 operations in 234ms (427 ops/sec)
# Redis: 100 operations in 156ms (641 ops/sec)
```

**CI Integration:**
- Contract tests run automatically on all PRs
- Redis service available in CI environment
- Tests must complete within 15-second timeout
- Failing contract tests block deployment

### Troubleshooting

**Common Issues:**

1. **Redis Connection Failures**
   ```bash
   # Check Redis availability
   redis-cli ping

   # Set test Redis URL
   export TEST_REDIS_URL=redis://localhost:6379/15
   ```

2. **LevelDB Permission Issues**
   ```bash
   # Clean up test databases
   rm -rf tmp-testdb-*

   # Check disk space
   df -h
   ```

3. **Test Timeouts**
   ```bash
   # Run with increased timeout
   jest --testTimeout=30000 __tests__/storage/adapterContract.spec.ts
   ```

4. **Coverage Issues**
   ```bash
   # Generate detailed coverage report
   npm run test:coverage
   open coverage/lcov-report/index.html
   ```

**Debug Commands:**
```bash
# Test specific adapter
npm test -- --testNamePattern="Redis Adapter Contract"

# Verbose test output
npm test -- --verbose __tests__/storage/adapterContract.spec.ts

# Run only failing tests
npm test -- --onlyFailures

# Test with debug logging
DEBUG=* npm test __tests__/storage/adapterContract.spec.ts
```

## Scaling

### Horizontal Scaling
- Use Redis Cluster for distributed storage
- Implement shard-based memory distribution
- Load balance across multiple application instances

### Vertical Scaling
- Increase memory allocation for larger spiral caches
- Tune GC parameters for higher throughput
- Optimize storage backend configuration

---

*This runbook is maintained by the Spiral Memory Architecture team. For questions or issues, please refer to the project documentation or contact the development team.*
