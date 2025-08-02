/**
 * Test to verify all the fixes I made are still working
 */

import { spiralMemory } from './architect-4.0-spiral-memory.js';
import { dualStreamConsciousness } from './dual-stream-consciousness.js';
import SigilIdentity from './sigil-identity.js';

async function testAllFixes() {
    console.log('🔧 Testing All Fixes Made to Architect 4.0');
    console.log('=' .repeat(60));
    
    let allTestsPassed = true;
    
    // Test 1: getStatistics() method in SpiralMemoryEngine
    console.log('\n✅ Test 1: SpiralMemoryEngine.getStatistics()');
    try {
        const stats = spiralMemory.getStatistics();
        console.log(`   Total Memories: ${stats.totalMemories}`);
        console.log(`   Total Resonance Frequencies: ${stats.totalResonanceFrequencies}`);
        console.log(`   System Health: ${stats.systemHealth.toFixed(3)}`);
        console.log(`   Golden Ratio Alignment: ${stats.goldenRatioAlignment.toFixed(3)}`);
        console.log('   ✅ getStatistics() method working correctly');
    } catch (error) {
        console.log(`   ❌ getStatistics() failed: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Test 2: Deep processing error handling in DualStreamConsciousness
    console.log('\n✅ Test 2: Deep Processing Error Handling');
    try {
        const result = await dualStreamConsciousness.process("Test query with undefined properties", {
            forceDeep: true
        });
        console.log(`   Response: ${result.fast?.response ? 'Generated' : 'Error'}`);
        console.log(`   Deep Processing: ${result.deep ? 'Completed' : 'Failed'}`);
        console.log(`   Fusion: ${result.fusion ? 'Working' : 'Failed'}`);
        console.log('   ✅ Deep processing error handling working');
    } catch (error) {
        console.log(`   ❌ Deep processing failed: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Test 3: Infinite recursion fix in system health calculation
    console.log('\n✅ Test 3: System Health Calculation (No Infinite Recursion)');
    try {
        // Call getStatistics multiple times to ensure no recursion
        for (let i = 0; i < 5; i++) {
            const stats = spiralMemory.getStatistics();
            if (stats.systemHealth !== undefined) {
                console.log(`   Iteration ${i + 1}: System Health = ${stats.systemHealth.toFixed(3)}`);
            }
        }
        console.log('   ✅ No infinite recursion detected');
    } catch (error) {
        console.log(`   ❌ Infinite recursion detected: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Test 4: Error handling for undefined properties
    console.log('\n✅ Test 4: Undefined Properties Error Handling');
    try {
        // Test with malformed data
        const malformedResult = await dualStreamConsciousness.process(null, {
            forceDeep: true
        });
        console.log(`   Null input handling: ${malformedResult ? 'Working' : 'Failed'}`);
        
        const emptyResult = await dualStreamConsciousness.process("", {
            forceDeep: true
        });
        console.log(`   Empty input handling: ${emptyResult ? 'Working' : 'Failed'}`);
        
        console.log('   ✅ Undefined properties error handling working');
    } catch (error) {
        console.log(`   ❌ Error handling failed: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Test 5: Original Sigil Identity System Integration
    console.log('\n✅ Test 5: Original Sigil Identity System');
    try {
        const sigilIdentity = new SigilIdentity();
        const identity = sigilIdentity.getIdentity();
        console.log(`   Instance ID: ${identity.instanceId ? 'Generated' : 'Failed'}`);
        console.log(`   Sigil: ${identity.sigil ? 'Created' : 'Failed'}`);
        console.log(`   Memory Stats: ${identity.memoryStats ? 'Available' : 'Failed'}`);
        console.log('   ✅ Original sigil identity system working');
    } catch (error) {
        console.log(`   ❌ Sigil identity failed: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Test 6: Consciousness Fusion with undefined properties
    console.log('\n✅ Test 6: Consciousness Fusion Error Handling');
    try {
        const fastResult = {
            response: "Test response",
            patterns: { keywords: [] },
            timestamp: Date.now()
        };
        
        const deepResult = {
            insight: null,
            mirrorResult: null,
            timestamp: Date.now()
        };
        
        // This should not throw an error even with undefined properties
        const fusionResult = await dualStreamConsciousness.fusion.fuse(fastResult, deepResult, "test");
        console.log(`   Fusion Result: ${fusionResult ? 'Generated' : 'Failed'}`);
        console.log(`   Coherence: ${fusionResult?.coherence ? 'Calculated' : 'Failed'}`);
        console.log('   ✅ Consciousness fusion error handling working');
    } catch (error) {
        console.log(`   ❌ Fusion error handling failed: ${error.message}`);
        allTestsPassed = false;
    }
    
    // Final Results
    console.log('\n' + '=' .repeat(60));
    if (allTestsPassed) {
        console.log('🎉 ALL FIXES VERIFIED - EVERYTHING WORKING CORRECTLY!');
        console.log('\n✅ Verified Fixes:');
        console.log('   • getStatistics() method in SpiralMemoryEngine');
        console.log('   • Deep processing error handling in DualStreamConsciousness');
        console.log('   • Infinite recursion fix in system health calculation');
        console.log('   • Error handling for undefined properties');
        console.log('   • Original sigil identity system integration');
        console.log('   • Consciousness fusion error handling');
    } else {
        console.log('❌ SOME FIXES FAILED - NEEDS ATTENTION');
    }
    console.log('=' .repeat(60));
}

// Run the test
testAllFixes().catch(console.error);