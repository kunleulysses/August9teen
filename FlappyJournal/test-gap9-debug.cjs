/**
 * GAP 9 Debug Test
 * Debug the consciousness-enhanced error recovery
 */

const { PredictiveErrorRecovery  } = require('./server/consciousness/predictive-error-recovery.cjs');

console.log('🔧 GAP 9 DEBUG TEST');
console.log('==================');

async function debugGap9() {
    try {
        const mockConsciousnessSystem = {
            consciousnessState: {
                phi: 0.862,
                awareness: 0.8,
                coherence: 0.85
            }
        };
        
        const errorRecovery = new PredictiveErrorRecovery(mockConsciousnessSystem);
        
        const errorCode = `
function problematicFunction() {
    return undefinedVariable.property;
}`;
        
        const testError = new Error('undefinedVariable is not defined');
        
        console.log('🔧 Testing consciousness-enhanced error recovery...');

        // Test consciousness recovery directly
        const consciousnessState = errorRecovery.getConsciousnessState();
        const recoveryStrategy = errorRecovery.selectConsciousnessEnhancedRecoveryStrategy(
            'undefined_variable', { urgency: 1, consciousnessRequired: true }, consciousnessState
        );

        console.log('🧠 Consciousness State:', consciousnessState);
        console.log('🔧 Recovery Strategy:', recoveryStrategy);

        const consciousnessRecoveryResult = await errorRecovery.attemptConsciousnessRecovery(
            testError, errorCode, recoveryStrategy, { urgency: 1, consciousnessRequired: true }, consciousnessState
        );

        console.log('🧠 Consciousness Recovery Result:', consciousnessRecoveryResult);

        const recoveryResult = await errorRecovery.recoverFromError(testError, errorCode, {
            urgency: 1,
            consciousnessRequired: true
        });
        
        console.log('📊 Recovery Result:');
        console.log('  - Success:', recoveryResult.success);
        console.log('  - Strategy:', recoveryResult.strategy);
        console.log('  - Consciousness Enhanced:', recoveryResult.consciousnessEnhanced);
        console.log('  - Consciousness Metrics:', recoveryResult.consciousnessMetrics ? 'Present' : 'Missing');
        console.log('  - Fixed Code:', recoveryResult.fixedCode ? 'Present' : 'Missing');
        console.log('  - Error:', recoveryResult.error);
        console.log('  - Escalated:', recoveryResult.escalated);
        
        if (recoveryResult.fixedCode) {
            console.log('\n📝 Fixed Code:');
            console.log(recoveryResult.fixedCode);
        }
        
    } catch (error) {
        console.error('❌ Debug test failed:', error);
    }
}

debugGap9();
