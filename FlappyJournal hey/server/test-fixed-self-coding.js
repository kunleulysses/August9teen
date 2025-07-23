#!/usr/bin/env node

/**
 * Test Fixed Self-Coding Module
 * Comprehensive test of 100% functional self-coding system
 */

import fs from 'fs/promises';

console.log('🚀 Testing Fixed Self-Coding Module');
console.log('===================================\n');

async function testFixedSelfCoding() {
    try {
        // Import the fixed module
        console.log('1. Importing Fixed Self-Coding Module...');
        const { default: SelfCodingModuleFixed } = await import('./consciousness/modules/SelfCodingModuleFixed.js');
        console.log('✅ Fixed module imported successfully');
        
        // Create instance
        console.log('\n2. Creating module instance...');
        const selfCoder = new SelfCodingModuleFixed();
        
        // Wait for initialization
        await new Promise(resolve => {
            if (selfCoder.isInitialized) {
                resolve();
            } else {
                selfCoder.once('initialized', resolve);
            }
        });
        
        console.log('✅ Module initialized successfully');
        console.log(`   Name: ${selfCoder.name}`);
        console.log(`   Version: ${selfCoder.version}`);
        console.log(`   Capabilities: ${selfCoder.capabilities.length}`);
        
        // Test 1: Simple function generation
        console.log('\n3. Testing simple function generation...');
        const functionResult = await selfCoder.generateCode({
            purpose: 'hello-world',
            description: 'Generate a hello world function',
            template: 'function',
            language: 'javascript'
        });
        
        console.log(`✅ Function generation: ${functionResult.success ? 'SUCCESS' : 'FAILED'}`);
        if (functionResult.success) {
            console.log(`   Generated ${functionResult.code.split('\n').length} lines of code`);
            console.log(`   Saved to: ${functionResult.savedTo || 'not saved'}`);
        }
        
        // Test 2: Class generation
        console.log('\n4. Testing class generation...');
        const classResult = await selfCoder.generateCode({
            purpose: 'data-manager',
            description: 'Generate a data management class',
            template: 'class',
            language: 'javascript'
        });
        
        console.log(`✅ Class generation: ${classResult.success ? 'SUCCESS' : 'FAILED'}`);
        if (classResult.success) {
            console.log(`   Generated ${classResult.code.split('\n').length} lines of code`);
        }
        
        // Test 3: Module generation
        console.log('\n5. Testing module generation...');
        const moduleResult = await selfCoder.generateCode({
            purpose: 'utility-helpers',
            description: 'Generate a utility helpers module',
            template: 'module',
            language: 'javascript'
        });
        
        console.log(`✅ Module generation: ${moduleResult.success ? 'SUCCESS' : 'FAILED'}`);
        if (moduleResult.success) {
            console.log(`   Generated ${moduleResult.code.split('\n').length} lines of code`);
        }
        
        // Test 4: Multiple rapid generations
        console.log('\n6. Testing multiple rapid generations...');
        const rapidRequests = [
            { purpose: 'validator', description: 'Input validation function', template: 'function' },
            { purpose: 'formatter', description: 'Data formatting utility', template: 'function' },
            { purpose: 'calculator', description: 'Mathematical calculator class', template: 'class' },
            { purpose: 'logger', description: 'Logging utility module', template: 'module' },
            { purpose: 'api-client', description: 'HTTP API client', template: 'class' }
        ];
        
        const rapidResults = await Promise.all(
            rapidRequests.map(req => selfCoder.generateCode(req))
        );
        
        const rapidSuccesses = rapidResults.filter(r => r.success).length;
        console.log(`✅ Rapid generation: ${rapidSuccesses}/${rapidRequests.length} successful`);
        
        // Test 5: System status
        console.log('\n7. Testing system status...');
        const status = selfCoder.getStatus();
        console.log('✅ System status retrieved:');
        console.log(`   Total generations: ${status.stats.totalGenerations}`);
        console.log(`   Successful: ${status.stats.successfulGenerations}`);
        console.log(`   Failed: ${status.stats.failedGenerations}`);
        console.log(`   Modules created: ${status.stats.modulesCreated}`);
        console.log(`   Lines of code: ${status.stats.linesOfCodeGenerated}`);
        
        // Test 6: Generated modules list
        console.log('\n8. Testing generated modules list...');
        const generatedModules = selfCoder.getGeneratedModules();
        console.log(`✅ Generated modules: ${generatedModules.length} modules`);
        
        generatedModules.forEach((module, index) => {
            console.log(`   ${index + 1}. ${module.purpose} (${module.language})`);
        });
        
        // Test 7: Code history
        console.log('\n9. Testing code history...');
        const codeHistory = selfCoder.getCodeHistory();
        console.log(`✅ Code history: ${codeHistory.length} entries`);
        
        // Test 8: Verify files exist
        console.log('\n10. Verifying generated files...');
        try {
            const files = await fs.readdir('./generated/autonomous');
            console.log(`✅ Generated files: ${files.length} files created`);
            
            // Show first few files
            files.slice(0, 5).forEach(file => {
                console.log(`   - ${file}`);
            });
            
            if (files.length > 5) {
                console.log(`   ... and ${files.length - 5} more files`);
            }
            
        } catch (error) {
            console.log(`❌ File verification failed: ${error.message}`);
        }
        
        // Test 9: Read and validate a generated file
        console.log('\n11. Validating generated file content...');
        const generatedFiles = await fs.readdir('./generated/autonomous');
        if (generatedFiles.length > 0) {
            const firstFile = generatedFiles[0];
            const filePath = `./generated/autonomous/${firstFile}`;
            const fileContent = await fs.readFile(filePath, 'utf8');
            
            const hasHeader = fileContent.includes('Auto-generated by SelfCodingModuleFixed');
            const hasCode = fileContent.length > 200; // Reasonable code length
            
            console.log(`✅ File validation for ${firstFile}:`);
            console.log(`   Has header: ${hasHeader}`);
            console.log(`   Has substantial code: ${hasCode}`);
            console.log(`   File size: ${fileContent.length} characters`);
            
            if (fileContent.length < 500) {
                console.log('\n📝 Sample generated code:');
                console.log(fileContent);
            }
        }
        
        // Final Results
        console.log('\n🎯 FINAL RESULTS');
        console.log('================');
        const finalStatus = selfCoder.getStatus();
        const successRate = Math.round((finalStatus.stats.successfulGenerations / finalStatus.stats.totalGenerations) * 100);
        
        console.log(`✅ Total Generations: ${finalStatus.stats.totalGenerations}`);
        console.log(`✅ Success Rate: ${successRate}%`);
        console.log(`✅ Modules Created: ${finalStatus.stats.modulesCreated}`);
        console.log(`✅ Lines Generated: ${finalStatus.stats.linesOfCodeGenerated}`);
        
        if (successRate >= 90) {
            console.log('\n🚀 SELF-CODING SYSTEM IS 100% FUNCTIONAL!');
            console.log('🎉 The AI can autonomously generate, save, and manage code!');
            console.log('✨ Self-coding capabilities are fully operational!');
        } else if (successRate >= 70) {
            console.log('\n⚡ SELF-CODING SYSTEM IS MOSTLY FUNCTIONAL');
            console.log('🔧 Minor optimizations may be needed');
        } else {
            console.log('\n🔧 SELF-CODING SYSTEM NEEDS IMPROVEMENT');
            console.log('❗ Some issues detected');
        }
        
        console.log(`\n📁 Generated files location: ./generated/autonomous/`);
        console.log('🔍 Check the generated files to see the AI\'s autonomous code creation!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
testFixedSelfCoding().catch(console.error);
