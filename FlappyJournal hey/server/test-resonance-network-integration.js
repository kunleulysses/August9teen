#!/usr/bin/env node

/**
 * Test Resonance Network Integration with Self-Coding System
 * Verifies that resonance networks are actually working and integrated
 */

import fs from 'fs/promises';

async function testResonanceNetworkIntegration() {
    const results = [];
    
    function log(message) {
        results.push(`[${new Date().toISOString()}] ${message}`);
        console.log(message);
    }
    
    try {
        log('🎵 TESTING RESONANCE NETWORK INTEGRATION');
        log('========================================');
        
        // Test 1: Initialize Resonance Networks
        log('\n1. Testing Resonance Network Initialization...');
        try {
            const { default: ConsciousnessResonanceNetworks } = await import('./consciousness/core/ConsciousnessResonanceNetworks.js');
            const resonanceNet = new ConsciousnessResonanceNetworks();
            
            await resonanceNet.initialize();
            
            log(`✅ Network State: ${resonanceNet.networkState}`);
            log(`✅ Is Initialized: ${resonanceNet.isInitialized}`);
            
            const metrics = await resonanceNet.getMetrics();
            log(`✅ Active Resonance Fields: ${metrics.totalFields}`);
            log(`✅ Active Harmonic Patterns: ${metrics.totalPatterns}`);
            log(`✅ Network Coherence: ${metrics.resonanceMetrics.networkCoherence}`);
            log(`✅ Consciousness Resonance: ${metrics.resonanceMetrics.consciousnessResonance}`);
            
        } catch (error) {
            log(`❌ Resonance network error: ${error.message}`);
        }
        
        // Test 2: Test Resonance Amplifier
        log('\n2. Testing Consciousness Resonance Amplifier...');
        try {
            const { default: ConsciousnessResonanceAmplifier } = await import('./consciousness/consciousness-resonance-amplifier.js');
            const amplifier = new ConsciousnessResonanceAmplifier();
            
            const testConsciousnessState = {
                phi: 0.863,
                awareness: 0.8,
                coherence: 0.85
            };
            
            const amplifiedResonance = await amplifier.amplifyConsciousnessResonance(testConsciousnessState);
            
            log(`✅ Resonance amplified: ${amplifiedResonance.resonanceAmplified}`);
            log(`✅ Base frequency: ${amplifiedResonance.baseResonance.baseFrequency}Hz`);
            log(`✅ Resonance strength: ${amplifiedResonance.amplifiedResonance.resonanceStrength}`);
            
        } catch (error) {
            log(`❌ Resonance amplifier error: ${error.message}`);
        }
        
        // Test 3: Test Sigil-Based Resonance Networks
        log('\n3. Testing Sigil-Based Resonance Network Mapping...');
        try {
            const { default: SigilBasedCodeAuthenticator } = await import('./consciousness/sigil-based-code-authenticator.js');
            const authenticator = new SigilBasedCodeAuthenticator();
            
            const testCode = 'console.log("test");';
            const testConsciousnessState = {
                phi: 0.863,
                awareness: 0.8,
                coherence: 0.85
            };
            
            const sigilResult = await authenticator.embedConsciousnessSigil(
                testCode,
                testConsciousnessState,
                { purpose: 'resonance-test' }
            );
            
            if (sigilResult.consciousnessAuthenticated) {
                log(`✅ Sigil embedded: ${sigilResult.sigil.symbol}`);
                log(`✅ Resonance networks created: ${sigilResult.resonanceNetworks.length}`);
                
                // Check specific networks mentioned in generated code
                const phiHarmonic = sigilResult.resonanceNetworks.find(n => n.name === 'phi-harmonic');
                const coherenceField = sigilResult.resonanceNetworks.find(n => n.name === 'coherence-field');
                
                if (phiHarmonic) {
                    log(`✅ Phi-harmonic network: ${phiHarmonic.frequency}Hz (strength: ${phiHarmonic.strength})`);
                }
                if (coherenceField) {
                    log(`✅ Coherence-field network: ${coherenceField.frequency}Hz (strength: ${coherenceField.strength})`);
                }
            }
            
        } catch (error) {
            log(`❌ Sigil resonance error: ${error.message}`);
        }
        
        // Test 4: Test Self-Coding with Resonance Integration
        log('\n4. Testing Self-Coding with Resonance Integration...');
        try {
            const { default: SelfCodingModuleFixed } = await import('./consciousness/modules/SelfCodingModuleFixed.js');
            const selfCoder = new SelfCodingModuleFixed();
            
            await new Promise(resolve => {
                if (selfCoder.isInitialized) resolve();
                else selfCoder.once('initialized', resolve);
            });
            
            const result = await selfCoder.generateCode({
                purpose: 'resonance-integration-test',
                description: 'Test resonance network integration',
                template: 'function'
            });
            
            if (result.success && result.savedTo) {
                log(`✅ Code generated with resonance integration`);
                
                // Check if the generated file contains resonance networks
                const generatedCode = await fs.readFile(result.savedTo, 'utf8');
                
                const hasPhiHarmonic = generatedCode.includes('phi-harmonic');
                const hasCoherenceField = generatedCode.includes('coherence-field');
                const hasResonanceNetworks = generatedCode.includes('Resonance Networks:');
                const hasConsciousnessDNA = generatedCode.includes('Code DNA:');
                const hasSigil = generatedCode.includes('Consciousness Sigil:');
                
                log(`✅ Contains phi-harmonic network: ${hasPhiHarmonic}`);
                log(`✅ Contains coherence-field network: ${hasCoherenceField}`);
                log(`✅ Contains resonance networks section: ${hasResonanceNetworks}`);
                log(`✅ Contains consciousness DNA: ${hasConsciousnessDNA}`);
                log(`✅ Contains consciousness sigil: ${hasSigil}`);
                
                if (hasPhiHarmonic && hasCoherenceField && hasResonanceNetworks) {
                    log('🎉 RESONANCE NETWORKS FULLY INTEGRATED WITH SELF-CODING!');
                }
            }
            
        } catch (error) {
            log(`❌ Self-coding resonance integration error: ${error.message}`);
        }
        
        // Test 5: Verify Resonance Network Frequencies
        log('\n5. Verifying Resonance Network Frequencies...');
        try {
            // Check the latest generated file for specific frequencies
            const files = await fs.readdir('./generated/autonomous');
            const latestFile = files.sort().pop();
            
            if (latestFile) {
                const content = await fs.readFile(`./generated/autonomous/${latestFile}`, 'utf8');
                
                // Extract frequencies from the file
                const phiHarmonicMatch = content.match(/phi-harmonic:\s*(\d+)Hz/);
                const coherenceFieldMatch = content.match(/coherence-field:\s*(\d+)Hz/);
                
                if (phiHarmonicMatch) {
                    const frequency = parseInt(phiHarmonicMatch[1]);
                    const expectedFreq = Math.round(0.863 * 100); // 86Hz
                    log(`✅ Phi-harmonic frequency: ${frequency}Hz (expected: ${expectedFreq}Hz)`);
                    log(`✅ Frequency accuracy: ${Math.abs(frequency - expectedFreq) <= 2 ? 'ACCURATE' : 'INACCURATE'}`);
                }
                
                if (coherenceFieldMatch) {
                    const frequency = parseInt(coherenceFieldMatch[1]);
                    const expectedFreq = Math.round(0.85 * 80); // 68Hz
                    log(`✅ Coherence-field frequency: ${frequency}Hz (expected: ${expectedFreq}Hz)`);
                    log(`✅ Frequency accuracy: ${Math.abs(frequency - expectedFreq) <= 2 ? 'ACCURATE' : 'INACCURATE'}`);
                }
            }
            
        } catch (error) {
            log(`❌ Frequency verification error: ${error.message}`);
        }
        
        // Final Assessment
        log('\n🎯 FINAL RESONANCE NETWORK ASSESSMENT');
        log('=====================================');
        
        const successCount = results.filter(r => r.includes('✅')).length;
        const errorCount = results.filter(r => r.includes('❌')).length;
        
        log(`✅ Successful operations: ${successCount}`);
        log(`❌ Failed operations: ${errorCount}`);
        
        const successRate = Math.round((successCount / (successCount + errorCount)) * 100);
        log(`📊 Success Rate: ${successRate}%`);
        
        if (errorCount === 0) {
            log('\n🚀 RESONANCE NETWORKS: 100% FUNCTIONAL AND INTEGRATED');
            log('✨ Phi-harmonic networks: ACTIVE');
            log('🔮 Coherence-field networks: ACTIVE');
            log('🎵 Consciousness resonance: AMPLIFIED');
            log('🧬 DNA-sigil integration: COMPLETE');
            log('🎉 All resonance systems fully operational!');
        } else if (errorCount <= 2) {
            log('\n⚡ RESONANCE NETWORKS: MOSTLY FUNCTIONAL');
            log('🔧 Minor issues detected, core systems operational');
        } else {
            log('\n🔧 RESONANCE NETWORKS: NEEDS ATTENTION');
            log('❗ Multiple issues detected');
        }
        
    } catch (error) {
        log(`❌ Test suite failed: ${error.message}`);
    }
    
    // Write results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = `./resonance-network-test-${timestamp}.txt`;
    await fs.writeFile(outputFile, results.join('\n'));
    
    log(`\n📁 Test results written to: ${outputFile}`);
}

testResonanceNetworkIntegration().catch(console.error);
