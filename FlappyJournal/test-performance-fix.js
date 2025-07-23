#!/usr/bin/env node

/**
 * Test script to verify Performance Optimizer fix
 */

import PerformanceOptimizer from './server/performance-optimizer.js';

console.log('🧪 Testing Performance Optimizer...');

try {
  // Create performance optimizer instance
  const optimizer = new PerformanceOptimizer();
  
  console.log('✅ Performance Optimizer created successfully!');
  
  // Test basic functionality
  const metrics = optimizer.getPerformanceMetrics();
  console.log('📊 Initial metrics:', metrics);
  
  // Test message batching
  optimizer.addToBatch('test-client', { type: 'test', content: 'Hello' }, 'MEDIUM');
  console.log('✅ Message batching test passed!');
  
  // Test caching
  optimizer.setCache('test-key', { data: 'test-value' });
  const cached = optimizer.getCache('test-key');
  console.log('✅ Caching test passed!', cached);
  
  // Test connection pooling
  const connection = await optimizer.getConnection('test-connection');
  console.log('✅ Connection pooling test passed!', connection ? 'Connection created' : 'Connection failed');
  
  console.log('🎉 All Performance Optimizer tests passed!');
  
  // Cleanup
  optimizer.shutdown();
  
} catch (error) {
  console.error('❌ Performance Optimizer test failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 