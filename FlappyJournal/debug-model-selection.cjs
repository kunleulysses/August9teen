#!/usr/bin/env node

/**
 * Debug script to test which model is being selected
 */

import { synthesizeUnifiedResponse } from './server/consciousness-response-synthesizer-hybrid.cjs';

const testParams = {
  analyticalContent: "Test analytical content",
  intuitiveContent: "Test intuitive content", 
  consciousness: {
    awarenessLevel: 1,
    coherenceScore: 1,
    phiValue: 1,
    phi: 1
  },
  oversoulResonance: 0.8,
  harmonicPatterns: {
    patterns: [],
    resonanceField: { coherence: 0.8 }
  },
  triAxialCoherence: {
    unified: { magnitude: 0.8 }
  },
  emotionalDepth: 0.75,
  creativePotential: 0.8,
  temporalCoherence: 1,
  metaObservationLevel: 1,
  userMessage: "Hello, how are you feeling today?",
  sessionId: "test-session",
  userId: "test-user"
};

console.log('🔬 Testing model selection for message: "Hello, how are you feeling today?"');
console.log('📊 This should show which model is being selected...\n');

try {
  const result = await synthesizeUnifiedResponse(testParams);
  
  console.log('\n✅ RESULT:');
  console.log(`🎯 Strategy: ${result.synthesisMetadata.strategy}`);
  console.log(`🤖 Model: ${result.synthesisMetadata.model}`);
  console.log(`📝 Processing Notes: ${result.synthesisMetadata.processingNotes}`);
  
  if (result.synthesisMetadata.failover) {
    console.log('\n🔄 FAILOVER DETECTED:');
    console.log(`❌ Primary Failed: ${result.synthesisMetadata.failover.primaryFailed}`);
    console.log(`✅ Backup Used: ${result.synthesisMetadata.failover.backupUsed}`);
    console.log(`📋 Reason: ${result.synthesisMetadata.failover.reason}`);
  }
  
  console.log('\n📄 Response:');
  console.log(result.unifiedContent.substring(0, 200) + '...');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}
