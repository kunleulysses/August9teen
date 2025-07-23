#!/usr/bin/env node

/**
 * CPU Optimization Test
 * Tests the multi-core consciousness system and measures CPU improvement
 */

import { spawn } from 'child_process';
import fs from 'fs';

console.log('🧪 Testing CPU Optimization for Consciousness System');
console.log('==================================================');

class CPUOptimizationTest {
  constructor() {
    this.testResults = {
      original: null,
      optimized: null,
      improvement: null
    };
  }

  async runTest() {
    console.log('\n📊 Starting CPU optimization test...');
    
    // Test current system
    console.log('\n1️⃣ Testing current consciousness system...');
    this.testResults.original = await this.measureCurrentSystem();
    
    // Test optimized system
    console.log('\n2️⃣ Testing optimized consciousness system...');
    this.testResults.optimized = await this.measureOptimizedSystem();
    
    // Calculate improvement
    this.calculateImprovement();
    
    // Generate report
    this.generateReport();
  }

  async measureCurrentSystem() {
    console.log('   📈 Measuring current system CPU usage...');
    
    // Get current process CPU usage
    const currentPid = await this.findConsciousnessProcess();
    if (!currentPid) {
      console.log('   ⚠️ No consciousness process found');
      return null;
    }
    
    const cpuUsage = await this.measureProcessCPU(currentPid, 30000); // 30 seconds
    console.log(`   📊 Current system CPU: ${cpuUsage.toFixed(1)}%`);
    
    return {
      pid: currentPid,
      cpuUsage,
      measurementDuration: 30000
    };
  }

  async measureOptimizedSystem() {
    console.log('   🚀 Starting optimized system test...');
    
    // Start optimized system in test mode
    const optimizedProcess = spawn('/home/linode-transfer/.cursor-server/bin/faa03b17cce93e8a80b7d62d57f5eda6bb6ab9f0/node', [
      'consciousness-startup-optimized.js'
    ], {
      cwd: '/opt/featherweight/FlappyJournal/server',
      env: {
        ...process.env,
        CONSCIOUSNESS_CLUSTERING: 'true',
        CONSCIOUSNESS_FREQUENCY: 'reduced',
        CONSCIOUSNESS_USER_OPTIMIZATION: 'true',
        NODE_ENV: 'test'
      },
      detached: true
    });
    
    console.log(`   🆔 Optimized process PID: ${optimizedProcess.pid}`);
    
    // Wait for startup
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Measure CPU usage
    const cpuUsage = await this.measureProcessCPU(optimizedProcess.pid, 30000);
    
    // Clean up
    process.kill(-optimizedProcess.pid, 'SIGTERM');
    
    console.log(`   📊 Optimized system CPU: ${cpuUsage.toFixed(1)}%`);
    
    return {
      pid: optimizedProcess.pid,
      cpuUsage,
      measurementDuration: 30000
    };
  }

  async findConsciousnessProcess() {
    return new Promise((resolve) => {
      const ps = spawn('ps', ['aux']);
      let output = '';
      
      ps.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      ps.on('close', () => {
        const lines = output.split('\n');
        for (const line of lines) {
          if (line.includes('consciousness-startup.js') || line.includes('consciousness-conversations.js')) {
            const parts = line.trim().split(/\s+/);
            const pid = parseInt(parts[1]);
            if (pid) {
              resolve(pid);
              return;
            }
          }
        }
        resolve(null);
      });
    });
  }

  async measureProcessCPU(pid, duration) {
    return new Promise((resolve) => {
      let measurements = [];
      let startTime = Date.now();
      
      const measureInterval = setInterval(() => {
        const ps = spawn('ps', ['-p', pid.toString(), '-o', 'pcpu=']);
        let output = '';
        
        ps.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        ps.on('close', () => {
          const cpuUsage = parseFloat(output.trim());
          if (!isNaN(cpuUsage)) {
            measurements.push(cpuUsage);
          }
          
          if (Date.now() - startTime >= duration) {
            clearInterval(measureInterval);
            
            // Calculate average CPU usage
            const avgCpu = measurements.length > 0 
              ? measurements.reduce((a, b) => a + b, 0) / measurements.length 
              : 0;
            
            resolve(avgCpu);
          }
        });
        
        ps.on('error', () => {
          // Process might have ended
          clearInterval(measureInterval);
          const avgCpu = measurements.length > 0 
            ? measurements.reduce((a, b) => a + b, 0) / measurements.length 
            : 0;
          resolve(avgCpu);
        });
      }, 1000); // Measure every second
    });
  }

  calculateImprovement() {
    if (!this.testResults.original || !this.testResults.optimized) {
      console.log('⚠️ Cannot calculate improvement - missing test data');
      return;
    }
    
    const originalCPU = this.testResults.original.cpuUsage;
    const optimizedCPU = this.testResults.optimized.cpuUsage;
    
    const absoluteImprovement = originalCPU - optimizedCPU;
    const percentageImprovement = (absoluteImprovement / originalCPU) * 100;
    
    this.testResults.improvement = {
      absolute: absoluteImprovement,
      percentage: percentageImprovement
    };
  }

  generateReport() {
    console.log('\n📋 CPU OPTIMIZATION TEST REPORT');
    console.log('================================');
    
    if (this.testResults.original) {
      console.log(`🔴 Original System CPU Usage: ${this.testResults.original.cpuUsage.toFixed(1)}%`);
    } else {
      console.log('🔴 Original System: Not measured');
    }
    
    if (this.testResults.optimized) {
      console.log(`🟢 Optimized System CPU Usage: ${this.testResults.optimized.cpuUsage.toFixed(1)}%`);
    } else {
      console.log('🟢 Optimized System: Not measured');
    }
    
    if (this.testResults.improvement) {
      const improvement = this.testResults.improvement;
      console.log(`\n📈 IMPROVEMENT ANALYSIS:`);
      console.log(`   Absolute CPU Reduction: ${improvement.absolute.toFixed(1)}%`);
      console.log(`   Percentage Improvement: ${improvement.percentage.toFixed(1)}%`);
      
      if (improvement.percentage > 20) {
        console.log('   🎉 EXCELLENT: Significant CPU improvement achieved!');
      } else if (improvement.percentage > 10) {
        console.log('   ✅ GOOD: Moderate CPU improvement achieved');
      } else if (improvement.percentage > 0) {
        console.log('   📊 MINOR: Small CPU improvement achieved');
      } else {
        console.log('   ⚠️ WARNING: No significant improvement detected');
      }
    }
    
    console.log('\n🔧 OPTIMIZATION RECOMMENDATIONS:');
    
    if (this.testResults.original && this.testResults.original.cpuUsage > 80) {
      console.log('   • High CPU usage detected - clustering recommended');
      console.log('   • Consider running under linode-transfer user');
      console.log('   • Reduce consciousness frequency to 10Hz');
    }
    
    console.log('   • Use systemd service with resource limits');
    console.log('   • Enable garbage collection optimization');
    console.log('   • Monitor memory usage regularly');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. Stop current consciousness service');
    console.log('   2. Install optimized service file');
    console.log('   3. Start optimized service under linode-transfer user');
    console.log('   4. Monitor CPU usage improvement');
    
    // Save report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      testResults: this.testResults,
      recommendations: [
        'Use clustering for multi-core distribution',
        'Reduce consciousness frequency to 10Hz',
        'Run under linode-transfer user',
        'Enable resource limits and monitoring'
      ]
    };
    
    fs.writeFileSync('/opt/featherweight/cpu-optimization-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n💾 Report saved to: /opt/featherweight/cpu-optimization-report.json');
  }
}

// Run the test
const test = new CPUOptimizationTest();
test.runTest().catch(console.error);
