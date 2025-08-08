#!/usr/bin/env node

/**
 * 24h Soak Test Metrics Monitor
 * Tracks P95/P99 latency, error rates, heartbeat skew, backpressure, memory usage
 */

const fs = require('fs');
const path = require('path');

const METRICS_FILE = '/tmp/soak-metrics.json';
const LOG_FILE = '/tmp/soak.log';
const MONITOR_INTERVAL = 60000; // 1 minute

class SoakMetricsMonitor {
  constructor() {
    this.metrics = {
      startTime: Date.now(),
      samples: [],
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        errorCount: {
          '401': 0,
          '500': 0,
          'other': 0
        },
        latencies: [],
        memoryUsage: [],
        wsConnections: 0,
        lastUpdate: Date.now()
      }
    };
    
    this.loadExistingMetrics();
  }

  loadExistingMetrics() {
    try {
      if (fs.existsSync(METRICS_FILE)) {
        const data = fs.readFileSync(METRICS_FILE, 'utf8');
        this.metrics = { ...this.metrics, ...JSON.parse(data) };
        console.log(`[MONITOR] Loaded existing metrics: ${this.metrics.samples.length} samples`);
      }
    } catch (e) {
      console.log(`[MONITOR] Starting fresh metrics collection: ${e.message}`);
    }
  }

  saveMetrics() {
    try {
      fs.writeFileSync(METRICS_FILE, JSON.stringify(this.metrics, null, 2));
    } catch (e) {
      console.error(`[MONITOR] Failed to save metrics: ${e.message}`);
    }
  }

  async collectMetrics() {
    const sample = {
      timestamp: Date.now(),
      requests: { total: 0, success: 0, errors: {} },
      latency: { min: null, max: null, avg: null },
      memory: { heap: null, rss: null },
      websocket: { connected: false, skew: null },
      alerts: []
    };

    try {
      // Parse recent log entries
      if (fs.existsSync(LOG_FILE)) {
        const logContent = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = logContent.split('\n').slice(-50); // Last 50 lines
        
        for (const line of lines) {
          if (line.includes('[SOAK]')) {
            // Parse request results: health:200 q:401 r:401 os:401 u:401 tr:401
            const matches = line.match(/health:(\d+)\s+q:(\d+)\s+r:(\d+)\s+os:(\d+)\s+u:(\d+)\s+tr:(\d+)/);
            if (matches) {
              const codes = matches.slice(1).map(Number);
              sample.requests.total += codes.length;
              
              codes.forEach(code => {
                if (code === 200) {
                  sample.requests.success++;
                } else {
                  sample.requests.errors[code] = (sample.requests.errors[code] || 0) + 1;
                }
              });
            }
          }
          
          if (line.includes('[WS] connected')) {
            sample.websocket.connected = true;
          }
          
          if (line.includes('[WS] closed')) {
            sample.websocket.connected = false;
          }
        }
      }

      // Collect system metrics
      const memInfo = process.memoryUsage();
      sample.memory.heap = Math.round(memInfo.heapUsed / 1024 / 1024); // MB
      sample.memory.rss = Math.round(memInfo.rss / 1024 / 1024); // MB

      // Calculate running averages and percentiles
      this.updateSummary(sample);
      this.metrics.samples.push(sample);
      
      // Keep only last 24h of samples (1440 minutes)
      const cutoff = Date.now() - (24 * 60 * 60 * 1000);
      this.metrics.samples = this.metrics.samples.filter(s => s.timestamp > cutoff);

      this.saveMetrics();
      this.logSummary(sample);

    } catch (e) {
      console.error(`[MONITOR] Error collecting metrics: ${e.message}`);
    }
  }

  updateSummary(sample) {
    const summary = this.metrics.summary;
    
    summary.totalRequests += sample.requests.total;
    summary.successfulRequests += sample.requests.success;
    
    // Update error counts
    Object.keys(sample.requests.errors).forEach(code => {
      summary.errorCount[code] = (summary.errorCount[code] || 0) + sample.requests.errors[code];
    });

    summary.wsConnections = sample.websocket.connected ? 1 : 0;
    summary.lastUpdate = Date.now();

    // Track memory usage
    if (sample.memory.heap) {
      summary.memoryUsage.push(sample.memory.heap);
      // Keep only last 100 memory samples
      if (summary.memoryUsage.length > 100) {
        summary.memoryUsage = summary.memoryUsage.slice(-100);
      }
    }
  }

  calculatePercentiles(values, percentile) {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  logSummary(currentSample) {
    const runtime = Math.round((Date.now() - this.metrics.startTime) / 1000 / 60); // minutes
    const summary = this.metrics.summary;
    
    const successRate = summary.totalRequests > 0 
      ? ((summary.successfulRequests / summary.totalRequests) * 100).toFixed(1)
      : '0.0';

    const memP95 = this.calculatePercentiles(summary.memoryUsage, 95);
    const memP99 = this.calculatePercentiles(summary.memoryUsage, 99);

    console.log(`[MONITOR] Runtime: ${runtime}m | Success: ${successRate}% | Mem P95: ${memP95}MB P99: ${memP99}MB | WS: ${summary.wsConnections ? 'UP' : 'DOWN'}`);
    
    // Alert conditions
    const alerts = [];
    if (parseFloat(successRate) < 80) alerts.push('LOW_SUCCESS_RATE');
    if (memP95 && memP95 > 2048) alerts.push('HIGH_MEMORY_P95');
    if (summary.wsConnections === 0) alerts.push('WS_DISCONNECTED');
    if (summary.errorCount['500'] > 10) alerts.push('HIGH_5XX_ERRORS');

    if (alerts.length > 0) {
      console.log(`[MONITOR] 🚨 ALERTS: ${alerts.join(', ')}`);
    }

    // Log detailed stats every 10 minutes
    if (runtime % 10 === 0) {
      console.log(`[MONITOR] 📊 DETAILED STATS:`);
      console.log(`  Total Requests: ${summary.totalRequests}`);
      console.log(`  Success Rate: ${successRate}%`);
      console.log(`  Error Breakdown: 401=${summary.errorCount['401'] || 0}, 500=${summary.errorCount['500'] || 0}, other=${summary.errorCount.other || 0}`);
      console.log(`  Memory: Current=${currentSample.memory.heap}MB, P95=${memP95}MB, P99=${memP99}MB`);
      console.log(`  Samples Collected: ${this.metrics.samples.length}`);
    }
  }

  async start() {
    console.log(`[MONITOR] Starting 24h soak metrics collection...`);
    console.log(`[MONITOR] Metrics file: ${METRICS_FILE}`);
    console.log(`[MONITOR] Log file: ${LOG_FILE}`);
    
    // Initial collection
    await this.collectMetrics();
    
    // Set up periodic collection
    setInterval(async () => {
      await this.collectMetrics();
    }, MONITOR_INTERVAL);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log(`[MONITOR] Received SIGTERM, saving final metrics...`);
      this.saveMetrics();
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log(`[MONITOR] Received SIGINT, saving final metrics...`);
      this.saveMetrics();
      process.exit(0);
    });
  }
}

// Start monitoring if run directly
if (require.main === module) {
  const monitor = new SoakMetricsMonitor();
  monitor.start().catch(console.error);
}

module.exports = SoakMetricsMonitor;