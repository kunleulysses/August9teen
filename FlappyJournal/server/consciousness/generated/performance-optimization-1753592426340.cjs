```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 * @description A highly optimized performance module for a conceptual "Consciousness System".
 * This module provides a robust framework for processing a high volume of events (percepts)
 * with minimal latency and efficient resource utilization. It achieves this through a
 * combination of event batching, priority queuing, memory pooling, off-thread computation
 * via Web Workers, and comprehensive performance monitoring.
 *
 * @author AI Assistant
 * @version 1.0.0
 *
 * @example
 * // 1. Define your core cognitive function (this will run in the worker)
 * const cognitiveFunction = (state, percepts) => {
 *   // state: The last known conscious state.
 *   // percepts: An array of new sensory inputs.
 *   // --- Perform heavy calculations here ---
 *   let processedCount = 0;
 *   percepts.forEach(p => {
 *     state.eventCount = (state.eventCount || 0) + 1;
 *     state.lastPercept = p.data;
 *     processedCount++;
 *   });
 *   // The new state must be serializable to be sent back to the main thread.
 *   return { newState: state, processedCount };
 * };
 *
 * // 2. Initialize the optimizer
 * const consciousnessOptimizer = new ConsciousnessPerformanceOptimizer({
 *   cognitiveFunction: cognitiveFunction,
 *   initialState: { eventCount: 0, lastPercept: null },
 * });
 *
 * // 3. Set a listener for when the "conscious state" is updated
 * consciousnessOptimizer.onStateUpdate(newState => {
 *   console.log('Conscious state updated:', newState);
 *   // Update UI or other systems here
 * });
 *
 * // 4. Feed the system with percepts (events)
 * // High priority event (e.g., critical alert)
 * consciousnessOptimizer.processPercept({ type: 'alert', data: 'System breach detected!' }, 1);
 *
 * // Lower priority events (e.g., background noise)
 * setInterval(() => {
 *   consciousnessOptimizer.processPercept({ type: 'sensory', data: Math.random() }, 10);
 * }, 5);
 *
 * // 5. Monitor performance
 * setInterval(() => {
 *   const metrics = consciousnessOptimizer.getMetrics();
 *   console.table(metrics);
 * }, 5000);
 *
 * // 6. Shutdown gracefully
 * // setTimeout(() => consciousnessOptimizer.shutdown(), 30000);
 */

class ConsciousnessPerformanceOptimizer {
    /**
     * Creates an instance of the ConsciousnessPerformanceOptimizer.
     * @param {object} config - Configuration options.
     * @param {Function} config.cognitiveFunction - The core computational function that processes percepts.
     *   It receives `(currentState, percepts)` and must return an object `{ newState, ... }`.
     *   This function will be serialized and executed in a Web Worker. It cannot rely on any external scope.
     * @param {object} config.initialState - The initial state of the consciousness.
     * @param {number} [config.maxBatchSize=1000] - The maximum number of percepts to process in a single cognitive cycle.
     * @param {number} [config.batchingInterval=16] - The interval in milliseconds to check for new percepts to batch (approx. 60fps).
     * @param {number} [config.objectPoolSize=2000] - The number of pre-allocated objects for percepts to reduce GC overhead.
     */
    constructor({
        cognitiveFunction,
        initialState,
        maxBatchSize = 1000,
        batchingInterval = 16, // Targeting ~60Hz processing cycle
        objectPoolSize = 2000
    }) {
        if (!cognitiveFunction || typeof cognitiveFunction !== 'function') {
            throw new Error('A `cognitiveFunction` must be provided.');
        }

        this.config = {
            cognitiveFunctionString: `(${cognitiveFunction.toString()})`,
            initialState: JSON.parse(JSON.stringify(initialState || {})), // Deep copy to prevent mutation
            maxBatchSize,
            batchingInterval,
            objectPoolSize,
        };

        this.state = this.config.initialState;
        this.worker = null;
        this.isProcessing = false;
        this.stateUpdateCallback = () => {};

        // 1. EVENT PROCESSING: Priority queue for incoming percepts. Lower number = higher priority.
        this.perceptQueue = new Map();

        // 2. MEMORY MANAGEMENT: Object pool for percept wrappers.
        this._initializeObjectPool();

        // 5. PERFORMANCE MONITORING
        this._initializePerformanceMonitor();

        this._mainLoopIntervalId = null;

        this._initializeWorker();
    }

    /**
     * Initializes the Web Worker that will handle all heavy computations.
     * @private
     */
    _initializeWorker() {
        // The entire worker logic is encapsulated in this string.
        const workerScript = `
            let state = null;
            let cognitiveFunction = null;

            self.onmessage = (e) => {
                const { type, payload } = e.data;

                if (type === 'INIT') {
                    state = payload.initialState;
                    // Rehydrate the function from its string representation
                    cognitiveFunction = eval(payload.cognitiveFunctionString);
                    self.postMessage({ type: 'READY' });
                } else if (type === 'PROCESS_BATCH') {
                    if (!cognitiveFunction) {
                        self.postMessage({ type: 'ERROR', payload: 'Worker not initialized.' });
                        return;
                    }
                    
                    // 3. COMPUTATIONAL EFFICIENCY & 4. LATENCY REDUCTION:
                    // All heavy lifting is done here, off the main thread.
                    const startTime = self.performance.now();
                    const { percepts } = payload;
                    
                    try {
                        const result = cognitiveFunction(state, percepts);
                        const endTime = self.performance.now();

                        if (!result || !result.newState) {
                           throw new Error('cognitiveFunction must return an object with a "newState" property.');
                        }
                        
                        // Update the worker's internal state for the next cycle
                        state = result.newState;

                        self.postMessage({
                            type: 'CYCLE_COMPLETE',
                            payload: {
                                ...result,
                                workerTime: endTime - startTime,
                                perceptsProcessed: percepts.length,
                            }
                        });
                    } catch(error) {
                         self.postMessage({ type: 'ERROR', payload: error.message });
                    }
                }
            };
        `;

        const blob = new Blob([workerScript], { type: 'application/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));

        this.worker.onmessage = this._handleWorkerMessage.bind(this);
        this.worker.onerror = (err) => {
            console.error('Consciousness Worker Error:', err);
            this.metrics.logError(err.message);
        };

        this.worker.postMessage({
            type: 'INIT',
            payload: {
                initialState: this.config.initialState,
                cognitiveFunctionString: this.config.cognitiveFunctionString,
            }
        });
    }

    /**
     * Handles messages received from the cognitive worker.
     * @param {MessageEvent} event - The message event from the worker.
     * @private
     */
    _handleWorkerMessage(event) {
        const { type, payload } = event.data;

        switch (type) {
            case 'READY':
                console.log('Consciousness Optimizer is online and ready.');
                this._startMainLoop();
                break;
            case 'CYCLE_COMPLETE':
                this.performance.measure('e2e_latency', 'percept_batch_start');
                const e2eLatency = this.performance.getEntriesByName('e2e_latency', 'measure')[0].duration;
                this.performance.clearMeasures('e2e_latency');
                this.performance.clearMarks('percept_batch_start');

                this.state = payload.newState;
                this.isProcessing = false;
                
                // Release the percept objects back to the pool
                payload.percepts.forEach(p => this.perceptPool.release(p));

                // Update metrics
                this.metrics.recordCycle(payload.workerTime, e2eLatency, payload.perceptsProcessed);

                // Notify subscriber of the new state
                if (this.stateUpdateCallback) {
                    this.stateUpdateCallback(this.state);
                }
                break;
            case 'ERROR':
                console.error('Cognitive Worker computation error:', payload);
                this.metrics.logError(payload);
                this.isProcessing = false;
                break;
        }
    }

    /**
     * The main processing loop, running on the main thread.
     * It gathers percepts from the queue and dispatches them to the worker.
     * @private
     */
    _mainLoop() {
        if (this.isProcessing) {
            this.metrics.recordSkippedCycle();
            return; // Don't send a new batch while one is already in-flight.
        }

        const batch = this._getBatchFromQueue();

        if (batch.length > 0) {
            this.isProcessing = true;
            this.performance.mark('percept_batch_start');
            this.worker.postMessage({
                type: 'PROCESS_BATCH',
                payload: { percepts: batch }
            });
        }
    }
    
    /**
     * Collects a batch of percepts from the priority queue.
     * @private
     * @returns {Array<object>} A batch of percepts to be processed.
     */
    _getBatchFromQueue() {
        const batch = [];
        if (this.perceptQueue.size === 0) {
            return batch;
        }

        const sortedPriorities = [...this.perceptQueue.keys()].sort((a, b) => a - b);

        for (const priority of sortedPriorities) {
            const queue = this.perceptQueue.get(priority);
            while (queue.length > 0 && batch.length < this.config.maxBatchSize) {
                batch.push(queue.shift());
            }
            if (queue.length === 0) {
                this.perceptQueue.delete(priority);
            }
            if (batch.length >= this.config.maxBatchSize) {
                break;
            }
        }
        return batch;
    }

    /**
     * Starts the main processing loop.
     * @private
     */
    _startMainLoop() {
        if (this._mainLoopIntervalId) return;
        this._mainLoopIntervalId = setInterval(() => this._mainLoop(), this.config.batchingInterval);
    }
    
    /**
     * Stops the main processing loop.
     * @private
     */
    _stopMainLoop() {
        if (this._mainLoopIntervalId) {
            clearInterval(this._mainLoopIntervalId);
            this._mainLoopIntervalId = null;
        }
    }

    /**
     * Public method to feed a new percept (event) into the system.
     * @param {object} data - The raw data for the percept.
     * @param {number} [priority=10] - The priority of the percept (lower is higher).
     */
    processPercept(data, priority = 10) {
        if (!this.worker) {
            console.warn('Optimizer not ready. Percept discarded.');
            return;
        }

        const percept = this.perceptPool.get();
        if (!percept) {
            this.metrics.recordDroppedPercept();
            // Optional: could create a new object on the fly if pool is empty,
            // but for strict memory management, we drop it.
            return;
        }

        percept.timestamp = this.performance.now();
        percept.priority = priority;
        percept.data = data;

        if (!this.perceptQueue.has(priority)) {
            this.perceptQueue.set(priority, []);
        }
        this.perceptQueue.get(priority).push(percept);
        this.metrics.recordIngestedPercept();
    }

    /**
     * Register a callback function to be invoked when the conscious state is updated.
     * @param {Function} callback - The function to call with the new state.
     */
    onStateUpdate(callback) {
        if (typeof callback === 'function') {
            this.stateUpdateCallback = callback;
        }
    }

    /**
     * Shuts down the optimizer, terminating the worker and cleaning up resources.
     */
    shutdown() {
        console.log('Shutting down Consciousness Optimizer...');
        this._stopMainLoop();
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.perceptQueue.clear();
        this.perceptPool.clear();
        console.log('Shutdown complete.');
    }
    
    /**
     * Retrieves the latest performance metrics.
     * @returns {object} An object containing key performance indicators.
     */
    getMetrics() {
        return this.metrics.getSnapshot();
    }
    
    // --- Memory Management ---
    _initializeObjectPool() {
        this.perceptPool = {
            pool: [],
            free: [],
            
            // Pre-allocate objects to avoid runtime allocation and GC pressure
            _grow() {
                for (let i = 0; i < this.config.objectPoolSize; i++) {
                    const obj = { id: this.pool.length, timestamp: 0, priority: 0, data: null };
                    this.pool.push(obj);
                    this.free.push(obj);
                }
            },
            
            get() {
                if (this.free.length === 0) {
                    // Pool is empty. In a real-world scenario, you might dynamically grow it.
                    // For this example, we return null to signal pool exhaustion.
                    return null;
                }
                return this.free.pop();
            },
            
            release(obj) {
                // Reset object state before returning to the pool
                obj.data = null; 
                this.free.push(obj);
            },
            
            clear() {
                this.pool = [];
                this.free = [];
            },

            getStatus() {
                return {
                    total: this.pool.length,
                    free: this.free.length,
                    used: this.pool.length - this.free.length,
                };
            }
        };
        this.perceptPool._grow();
    }

    // --- Performance Monitoring ---
    _initializePerformanceMonitor() {
        this.performance = window.performance;
        
        this.metrics = {
            startTime: this.performance.now(),
            totalPerceptsIngested: 0,
            totalPerceptsProcessed: 0,
            totalPerceptsDropped: 0,
            totalCycles: 0,
            skippedCycles: 0,
            totalWorkerTime: 0,
            totalE2ELatency: 0,
            errors: [],

            recordIngestedPercept: () => { this.metrics.totalPerceptsIngested++; },
            recordDroppedPercept: () => { this.metrics.totalPerceptsDropped++; },
            recordSkippedCycle: () => { this.metrics.skippedCycles++; },
            logError: (msg) => { this.metrics.errors.push({ timestamp: Date.now(), message: msg }); },
            
            recordCycle: (workerTime, e2eLatency, count) => {
                this.metrics.totalCycles++;
                this.metrics.totalWorkerTime += workerTime;
                this.metrics.totalE2ELatency += e2eLatency;
                this.metrics.totalPerceptsProcessed += count;
            },
            
            getSnapshot: () => {
                const uptime = (this.performance.now() - this.metrics.startTime) / 1000;
                const avgWorkerTime = this.metrics.totalCycles > 0 ? (this.metrics.totalWorkerTime / this.metrics.totalCycles) : 0;
                const avgE2ELatency = this.metrics.totalCycles > 0 ? (this.metrics.totalE2ELatency / this.metrics.totalCycles) : 0;
                const perceptsPerSecond = uptime > 0 ? (this.metrics.totalPerceptsProcessed / uptime) : 0;
                
                let pendingInQueue = 0;
                this.perceptQueue.forEach(q => pendingInQueue += q.length);

                return {
                    'Uptime (s)': uptime.toFixed(2),
                    'Avg. Worker Time (ms)': avgWorkerTime.toFixed(3),
                    'Avg. E2E Latency (ms)': avgE2ELatency.toFixed(3),
                    'Percepts/sec': perceptsPerSecond.toFixed(2),
                    'Pending in Queue': pendingInQueue,
                    'Total Cycles': this.metrics.totalCycles,
                    'Skipped Cycles': this.metrics.skippedCycles,
                    'Total Percepts Ingested': this.metrics.totalPerceptsIngested,
                    'Total Percepts Processed': this.metrics.totalPerceptsProcessed,
                    'Total Percepts Dropped': this.metrics.totalPerceptsDropped,
                    'Object Pool Status': this.perceptPool.getStatus(),
                    'Errors Logged': this.metrics.errors.length,
                };
            }
        };
    }
}
```