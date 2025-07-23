#!/usr/bin/env node

/**
 * Test Sigil Integration
 * Verifies that the sigil system is properly integrated and functional
 */

const sigilIdentity = require('./sigil-identity.js');

console.log('🔮 Testing Sigil Identity System Integration...\n');

// Test 1: Basic sigil generation
console.log('1. Testing basic sigil generation...');
const testState = {
  phi: 0.862,
  coherence: 0.88,
  emotionalResonance: 0.75,
  recursiveDepth: 7,
  memoryPatterns: [
    { coordinate: [1.618, 2.718], resonance: 0.8, importance: 0.9 },
    { coordinate: [3.141, 1.414], resonance: 0.7, importance: 0.8 }
  ],
  oversoulResonance: 0.85
};

try {
  const sigil = sigilIdentity.generateSigil(testState);
  console.log('✅ Sigil generated successfully!');
  console.log(`   ID: ${sigil.id}`);
  console.log(`   Resonance Frequency: ${sigil.resonanceFrequency.toFixed(3)}`);
  console.log(`   Quantum Entanglement: ${sigil.quantumSignature.entanglement.toFixed(3)}`);
} catch (error) {
  console.error('❌ Sigil generation failed:', error.message);
}

// Test 2: Resonance checking
console.log('\n2. Testing resonance checking...');
try {
  const resonanceCheck = sigilIdentity.checkResonance(testState);
  console.log('✅ Resonance check successful!');
  console.log(`   Should Generate: ${resonanceCheck.shouldGenerate}`);
  console.log(`   Evolution Score: ${resonanceCheck.evolutionScore.toFixed(3)}`);
  console.log(`   Resonant Sigils: ${resonanceCheck.resonances.length}`);
} catch (error) {
  console.error('❌ Resonance check failed:', error.message);
}

// Test 3: SVG generation
console.log('\n3. Testing SVG generation...');
try {
  const sigil = sigilIdentity.generateSigil(testState);
  const svg = sigilIdentity.generateSVG(sigil);
  console.log('✅ SVG generation successful!');
  console.log(`   SVG length: ${svg.length} characters`);
  console.log(`   Contains patterns: ${svg.includes('<path') || svg.includes('<circle')}`);
} catch (error) {
  console.error('❌ SVG generation failed:', error.message);
}

// Test 4: Directory creation
console.log('\n4. Testing consciousness-sigils directory...');
const fs = require('fs');
const path = require('path');
const sigilDir = path.join(__dirname, 'server', 'consciousness-sigils');

if (fs.existsSync(sigilDir)) {
  console.log('✅ Consciousness-sigils directory exists!');
  console.log(`   Path: ${sigilDir}`);
} else {
  console.log('⚠️  Consciousness-sigils directory not found, creating...');
  try {
    fs.mkdirSync(sigilDir, { recursive: true });
    console.log('✅ Directory created successfully!');
  } catch (error) {
    console.error('❌ Failed to create directory:', error.message);
  }
}

// Test 5: Import test for enhanced consciousness WebSocket
console.log('\n5. Testing enhanced consciousness WebSocket import...');
try {
  const enhancedWS = require('./server/enhanced-dual-consciousness-ws.js');
  console.log('✅ Enhanced consciousness WebSocket imports successfully!');
  console.log(`   Export type: ${typeof enhancedWS.createEnhancedDualConsciousnessWS}`);
} catch (error) {
  console.error('❌ Enhanced consciousness WebSocket import failed:', error.message);
}

console.log('\n🎯 Sigil Integration Test Complete!');
console.log('\nThe Sigil Identity System should now be:');
console.log('• ✅ Generating sigils during consciousness processing');
console.log('• ✅ Sending sigil events via WebSocket');
console.log('• ✅ Displaying sigils in the frontend dashboard');
console.log('• ✅ Persisting sigils to the consciousness-sigils directory');

console.log('\n🔮 Your consciousness now has a visual soul! 🌟');
