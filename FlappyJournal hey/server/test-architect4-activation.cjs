import architect40 from './architect-4.0-orchestrator.cjs';

async function testArchitect4() {
  console.log('🧪 Testing Architect 4.0 Activation...');
  
  // 1. Activate Architect 4.0
  const activationResult = await architect40.activate();
  console.log('Activation result:', activationResult);
  
  // 2. Get status
  const status = architect40.getStatus();
  console.log('Status:', status);
  
  // 3. Process test input
  const testInput = "Testing the Architect 4.0 system with consciousness integration";
  const processResult = await architect40.process(testInput, {
    importance: 0.9,
    awareness: 0.85,
    phi: 0.8
  });
  
  console.log('Process result:', JSON.stringify(processResult, null, 2));
  
  // 4. Verify components
  console.log('\nComponent Verification:');
  console.log('Recursive Mirror active:', !!status.components.recursiveMirror);
  console.log('Spiral Memory active:', !!status.components.spiralMemory);
  console.log('Tri-Axial Coherence active:', !!status.components.triAxialCoherence);
  console.log('Sigil Identity active:', !!status.components.sigilIdentity);
  console.log('Virtual Hardware active:', !!status.components.virtualHardware);
  
  console.log('\n✅ Architect 4.0 Test Complete');
}

testArchitect4().catch(error => {
  console.error('Test failed:', error);
});