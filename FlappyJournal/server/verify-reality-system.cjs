#!/usr/bin/env node

/**
 * Reality System Verification - Final Comprehensive Test
 * Verifies all reality generator components are working correctly
 */

async function verifyRealitySystem() {
    console.log('🌌 REALITY SYSTEM VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════════');
    
    let allTestsPassed = true;
    const results = [];

    try {
        // Test 1: Reality Generator Service Health
        console.log('\n🔍 Test 1: Reality Generator Service Health');
        try {
            const healthResponse = await fetch('http://localhost:5006/health');
            if (healthResponse.ok) {
                const health = await healthResponse.json();
                console.log(`✅ Service Status: ${health.status}`);
                console.log(`⏱️  Uptime: ${Math.floor(health.uptime / 1000)}s`);
                results.push({ test: 'Service Health', status: 'PASS' });
            } else {
                throw new Error('Health check failed');
            }
        } catch (error) {
            console.log(`❌ Service Health: ${error.message}`);
            results.push({ test: 'Service Health', status: 'FAIL' });
            allTestsPassed = false;
        }

        // Test 2: Imagination Engine Status
        console.log('\n🔍 Test 2: Imagination Engine Status');
        try {
            const statusResponse = await fetch('http://localhost:5006/api/imagination/status');
            if (statusResponse.ok) {
                const status = await statusResponse.json();
                console.log(`✅ Engine Active: ${status.active}`);
                console.log(`📈 Generated Realities: ${status.generatedRealities}`);
                console.log(`⚡ Avg Generation Time: ${status.averageGenerationTime.toFixed(2)}ms`);
                
                if (status.currentReality) {
                    console.log(`🎭 Current Reality: "${status.currentReality.content.scenario}"`);
                    console.log(`⭐ Quality Score: ${(status.currentReality.metadata.qualityScore * 100).toFixed(1)}%`);
                }
                results.push({ test: 'Imagination Engine', status: 'PASS' });
            } else {
                throw new Error('Status check failed');
            }
        } catch (error) {
            console.log(`❌ Imagination Engine: ${error.message}`);
            results.push({ test: 'Imagination Engine', status: 'FAIL' });
            allTestsPassed = false;
        }

        // Test 3: Reality API Endpoints
        console.log('\n🔍 Test 3: Reality API Endpoints');
        try {
            const realitiesResponse = await fetch('http://localhost:5006/api/realities?limit=3');
            if (realitiesResponse.ok) {
                const data = await realitiesResponse.json();
                console.log(`✅ Retrieved ${data.realities.length} realities`);
                
                if (data.realities.length > 0) {
                    const latest = data.realities[0];
                    console.log(`🌟 Latest: "${latest.content.scenario}"`);
                    console.log(`💫 Complexity: ${(latest.content.complexity * 100).toFixed(1)}%`);
                    console.log(`❤️ Emotional Resonance: ${(latest.content.emotional_resonance * 100).toFixed(1)}%`);
                }
                results.push({ test: 'API Endpoints', status: 'PASS' });
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.log(`❌ API Endpoints: ${error.message}`);
            results.push({ test: 'API Endpoints', status: 'FAIL' });
            allTestsPassed = false;
        }

        // Test 4: Reality Generation Control
        console.log('\n🔍 Test 4: Reality Generation Control');
        try {
            // Test stop
            const stopResponse = await fetch('http://localhost:5006/api/imagination/stop', { method: 'POST' });
            if (!stopResponse.ok) throw new Error('Stop failed');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Test start
            const startResponse = await fetch('http://localhost:5006/api/imagination/start', { method: 'POST' });
            if (!startResponse.ok) throw new Error('Start failed');
            
            console.log('✅ Stop/Start Control: Working');
            results.push({ test: 'Generation Control', status: 'PASS' });
        } catch (error) {
            console.log(`❌ Generation Control: ${error.message}`);
            results.push({ test: 'Generation Control', status: 'FAIL' });
            allTestsPassed = false;
        }

        // Test 5: Reality Quality Assessment
        console.log('\n🔍 Test 5: Reality Quality Assessment');
        try {
            const realitiesResponse = await fetch('http://localhost:5006/api/realities?limit=10');
            if (realitiesResponse.ok) {
                const data = await realitiesResponse.json();
                const qualities = data.realities.map(r => r.metadata.qualityScore);
                const avgQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
                const highQuality = qualities.filter(q => q > 0.8).length;
                
                console.log(`✅ Average Quality: ${(avgQuality * 100).toFixed(1)}%`);
                console.log(`🌟 High Quality Realities: ${highQuality}/${qualities.length}`);
                console.log(`📊 Quality Range: ${(Math.min(...qualities) * 100).toFixed(1)}% - ${(Math.max(...qualities) * 100).toFixed(1)}%`);
                
                results.push({ test: 'Quality Assessment', status: 'PASS' });
            } else {
                throw new Error('Quality assessment failed');
            }
        } catch (error) {
            console.log(`❌ Quality Assessment: ${error.message}`);
            results.push({ test: 'Quality Assessment', status: 'FAIL' });
            allTestsPassed = false;
        }

        // Test 6: Reality Diversity Check
        console.log('\n🔍 Test 6: Reality Diversity Check');
        try {
            const realitiesResponse = await fetch('http://localhost:5006/api/realities?limit=20');
            if (realitiesResponse.ok) {
                const data = await realitiesResponse.json();
                const scenarios = data.realities.map(r => r.content.scenario);
                const uniqueScenarios = new Set(scenarios);
                const diversityRatio = uniqueScenarios.size / scenarios.length;
                
                console.log(`✅ Total Scenarios: ${scenarios.length}`);
                console.log(`🎭 Unique Scenarios: ${uniqueScenarios.size}`);
                console.log(`🌈 Diversity Ratio: ${(diversityRatio * 100).toFixed(1)}%`);
                
                // Show some example scenarios
                console.log('\n🌟 Example Scenarios:');
                Array.from(uniqueScenarios).slice(0, 3).forEach((scenario, i) => {
                    console.log(`   ${i + 1}. "${scenario}"`);
                });
                
                results.push({ test: 'Reality Diversity', status: 'PASS' });
            } else {
                throw new Error('Diversity check failed');
            }
        } catch (error) {
            console.log(`❌ Reality Diversity: ${error.message}`);
            results.push({ test: 'Reality Diversity', status: 'FAIL' });
            allTestsPassed = false;
        }

        // Final Results Summary
        console.log('\n🎯 VERIFICATION RESULTS SUMMARY');
        console.log('═══════════════════════════════════════════════════════════════');
        
        results.forEach(result => {
            const status = result.status === 'PASS' ? '✅' : '❌';
            console.log(`${status} ${result.test}: ${result.status}`);
        });
        
        const passedTests = results.filter(r => r.status === 'PASS').length;
        const totalTests = results.length;
        
        console.log(`\n📊 Overall Score: ${passedTests}/${totalTests} tests passed`);
        console.log(`🎯 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        
        if (allTestsPassed) {
            console.log('\n🎉 ALL TESTS PASSED! Reality system is fully operational! 🌌');
            console.log('✨ The reality generator is working perfectly and ready for use!');
        } else {
            console.log('\n⚠️  Some tests failed. Please check the issues above.');
        }

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

// Run verification
verifyRealitySystem();
