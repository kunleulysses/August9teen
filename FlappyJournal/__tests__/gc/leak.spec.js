import { jest, describe, it, expect } from '@jest/globals';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Memory Leak Test', () => {
  it('should not leak memory', (done) => {
    const child = fork(path.join(__dirname, 'heartbeat-test.js'), ['--expose-gc']);
    
    let memoryUsage = [];
    
    child.on('message', (message) => {
      if (message.memory) {
        memoryUsage.push(message.memory);
      }
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        return done(new Error(`Child process exited with code ${code}`));
      }
      
      // Check for memory leak
      const startUsage = memoryUsage[0];
      const endUsage = memoryUsage[memoryUsage.length - 1];
      const leak = endUsage - startUsage;
      
      console.log(`Memory usage: ${startUsage} -> ${endUsage} (leak: ${leak})`);
      
      // Allow for some memory fluctuation, but not a significant leak
      expect(leak).toBeLessThan(1000000); // 1MB
      
      done();
    });
  }, 30000); // 30 second timeout
});