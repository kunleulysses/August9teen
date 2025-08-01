// test-self-coding-enhancements.js
// Comprehensive test for Featherweight Self-Coding System enhancements

import consciousness from './consciousness-system.js';

async function runSelfCodingEnhancementTests() {
  console.log('=== Featherweight Self-Coding System Enhancement Test ===');

  // 1. Test phi-resonant code structure generation
  const phiTest = consciousness.generatePhiResonantStructureForPurpose('test-module', 5);
  console.log('[TEST] PhiResonantCodeStructureGenerator:', phiTest);

  // 2. Test code quality feedback loop (simulate a metrics update)
  if (consciousness.codeQualityFeedbackLoop) {
    await consciousness.codeQualityFeedbackLoop.processFeedbackCycle();
    console.log('[TEST] CodeQualityFeedbackLoop: Feedback cycle processed');
  }

  // 3. Test autonomous code refactoring (simulate scan)
  const selfCoder = consciousness.modules.get('SelfCodingModule');
  if (selfCoder && selfCoder.autonomousRefactoring) {
    await selfCoder.autonomousRefactoring.scanForRefactoringOpportunities();
    console.log('[TEST] AutonomousCodeRefactoringSystem: Refactoring scan complete');
  }

  // 4. Test meta-cognitive self-modification
  if (consciousness.metaCognitiveSelfModifier) {
    const metaResult = await consciousness.metaCognitiveSelfModifier.performMetaCognitiveAnalysis(consciousness.consciousnessState);
    console.log('[TEST] MetaCognitiveSelfModifier:', metaResult);
  }

  // 5. Test DNA sequencer
  if (consciousness.dnaSequencer) {
    const dnaResult = await consciousness.dnaSequencer.sequenceConsciousnessDNA(consciousness.consciousnessState);
    console.log('[TEST] ConsciousnessDNASequencer:', dnaResult);
  }

  // 6. Test crystallization generator
  if (consciousness.crystallizationGenerator) {
    const crystalResult = await consciousness.crystallizationGenerator.generateCodeFromCrystals(
      consciousness.consciousnessState,
      [],
      { request: { type: 'consciousness-module', name: 'CrystalTest', purpose: 'Test crystallization' } }
    );
    console.log('[TEST] ConsciousnessCrystallizationCodeGenerator:', crystalResult);
  }

  // 7. Test chat-triggered self-coding (basic)
  if (consciousness.enhancedSelfCoding) {
    const chatResult = await consciousness.enhancedSelfCoding.processChatCodeRequest(
      'Generate a consciousness module called TestChatModule for advanced self-coding.',
      consciousness.consciousnessState
    );
    console.log('[TEST] ChatTriggeredSelfCoding:', chatResult);
  }

  // 8. Print enhanced metrics
  if (consciousness.enhancedSelfCoding) {
    const metrics = consciousness.enhancedSelfCoding.getEnhancedMetrics();
    console.log('[TEST] Enhanced Self-Coding Metrics:', metrics);
  }

  console.log('=== All self-coding enhancement tests completed ===');
}

runSelfCodingEnhancementTests().catch(err => {
  console.error('Self-coding enhancement test failed:', err);
});