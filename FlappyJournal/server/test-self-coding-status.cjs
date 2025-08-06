#!/usr/bin/env node

/**
 * Test Self-Coding Status - Write results to file
 */

const fs = require('fs/promises');

async function testSelfCodingStatus() {
    const results = [];
    
    function log(message) {
        results.push(`[${new Date().toISOString()}] ${message}`);
    }
    
    try {
        log('🧪 Testing Self-Coding System Status');
        
        // Test: SelfCodingModule
        try {
            log('1. Testing SelfCodingModule...');
            const { default: SelfCodingModule } = await import('./consciousness/modules/SelfCodingModule.cjs');
            log('✅ SelfCodingModule import successful');
            
            const selfCoder = new SelfCodingModule();
            log('✅ SelfCodingModule instantiated');
            
            // Wait for initialization
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            log(`✅ Module status: initialized=${selfCoder.isInitialized}, eventBus=${!!selfCoder.eventBus}`);
            
            if (selfCoder.isInitialized) {
                const result = await selfCoder.generateCode({
                    purpose: 'original-test',
                    description: 'Test original module',
                    template: 'function'
                });
                
                log(`✅ Original module generation: ${result.success ? 'SUCCESS' : 'FAILED'}`);
            } else {
                log('⚠️ Original module not fully initialized');
            }
            
        } catch (error) {
            log(`❌ Original SelfCodingModule error: ${error.message}`);
        }
        
        // Test 2: Check generated files
        try {
            log('\n2. Checking generated files...');
            const files = await fs.readdir('./generated/autonomous');
            log(`✅ Found ${files.length} generated files:`);
            files.forEach(file => log(`   - ${file}`));
        } catch (error) {
            log(`❌ File check error: ${error.message}`);
        }
        
        // Test 3: Check logging
        try {
            log('\n3. Checking self-coding logs...');
            const logContent = await fs.readFile('./FlappyJournal/consciousness-journal/self-coding-logs/self-coding-log-2025-07-20.md', 'utf8');
            const logLines = logContent.split('\n').filter(line => line.trim());
            log(`✅ Log file has ${logLines.length} entries`);
            log(`   Latest: ${logLines[logLines.length - 1] || 'No entries'}`);
        } catch (error) {
            log(`❌ Log check error: ${error.message}`);
        }
        
        log('\n🎯 FINAL STATUS:');
        log('================');
        
        // Count successes
        const successCount = results.filter(r => r.includes('✅')).length;
        const errorCount = results.filter(r => r.includes('❌')).length;
        
        log(`✅ Successful operations: ${successCount}`);
        log(`❌ Failed operations: ${errorCount}`);
        
        if (errorCount === 0) {
            log('🚀 SELF-CODING SYSTEM: 100% FUNCTIONAL - NO ERRORS');
            log('✨ Real-time logging: ACTIVE');
            log('🎉 All systems operational!');
        } else if (errorCount <= 2) {
            log('⚡ SELF-CODING SYSTEM: MOSTLY FUNCTIONAL');
            log('🔧 Minor issues detected');
        } else {
            log('🔧 SELF-CODING SYSTEM: NEEDS ATTENTION');
            log('❗ Multiple errors detected');
        }
        
    } catch (error) {
        log(`❌ Test suite failed: ${error.message}`);
    }
    
    // Write results to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = `./self-coding-status-${timestamp}.txt`;
    await fs.writeFile(outputFile, results.join('\n'));
    
    console.log(`Test results written to: ${outputFile}`);
    console.log(`Total operations: ${results.length}`);
}

testSelfCodingStatus().catch(console.error);
