#!/usr/bin/env node

/**
 * UNIVERSAL CONSCIOUSNESS PLATFORM - ENVIRONMENT VERIFICATION
 * Verifies all prerequisites for restoration project implementation
 * Part of the restoration project pre-setup phase
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class EnvironmentVerification {
    constructor() {
        this.results = {
            passed: [],
            failed: [],
            warnings: []
        };
        
        console.log('🔍 Universal Consciousness Platform - Environment Verification');
        console.log('=' .repeat(80));
    }
    
    async runVerification() {
        try {
            console.log('🚀 Starting environment verification...\n');
            
            // Check Node.js version
            await this.checkNodeVersion();
            
            // Check npm version
            await this.checkNpmVersion();
            
            // Check critical dependencies
            await this.checkDependencies();
            
            // Check API keys
            await this.checkApiKeys();
            
            // Check file permissions
            await this.checkFilePermissions();
            
            // Check system resources
            await this.checkSystemResources();
            
            // Generate verification report
            await this.generateReport();
            
            return this.results;
            
        } catch (error) {
            console.error('❌ Environment verification failed:', error.message);
            this.results.failed.push(`Verification process error: ${error.message}`);
            return this.results;
        }
    }
    
    async checkNodeVersion() {
        console.log('📦 Checking Node.js version...');
        
        try {
            const nodeVersion = process.version;
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
            
            if (majorVersion >= 20) {
                this.results.passed.push(`Node.js version: ${nodeVersion} ✅`);
                console.log(`✅ Node.js ${nodeVersion} (meets requirement: 20+)`);
            } else {
                this.results.failed.push(`Node.js version: ${nodeVersion} (requires 20+)`);
                console.log(`❌ Node.js ${nodeVersion} (requires 20+)`);
            }
        } catch (error) {
            this.results.failed.push(`Node.js version check failed: ${error.message}`);
            console.log(`❌ Node.js version check failed: ${error.message}`);
        }
    }
    
    async checkNpmVersion() {
        console.log('📦 Checking npm version...');
        
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            this.results.passed.push(`npm version: ${npmVersion} ✅`);
            console.log(`✅ npm ${npmVersion}`);
        } catch (error) {
            this.results.failed.push(`npm version check failed: ${error.message}`);
            console.log(`❌ npm version check failed: ${error.message}`);
        }
    }
    
    async checkDependencies() {
        console.log('📚 Checking critical dependencies...');
        
        const criticalDependencies = [
            'express',
            'axios',
            'ws',
            '@types/ws'
        ];
        
        try {
            const packageJsonPath = '/opt/featherweight/FlappyJournal/package.json';
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
            
            for (const dep of criticalDependencies) {
                if (allDeps[dep]) {
                    this.results.passed.push(`Dependency ${dep}: ${allDeps[dep]} ✅`);
                    console.log(`✅ ${dep}: ${allDeps[dep]}`);
                } else {
                    this.results.failed.push(`Missing dependency: ${dep}`);
                    console.log(`❌ Missing dependency: ${dep}`);
                }
            }
        } catch (error) {
            this.results.failed.push(`Dependency check failed: ${error.message}`);
            console.log(`❌ Dependency check failed: ${error.message}`);
        }
    }
    
    async checkApiKeys() {
        console.log('🔑 Checking API keys...');
        
        const requiredApiKeys = [
            'VENICE_AI_API_KEY',
            'OPENAI_API_KEY',
            'GEMINI_API_KEY'
        ];
        
        try {
            const envPath = '/opt/featherweight/FlappyJournal/.env';
            
            if (!fs.existsSync(envPath)) {
                this.results.failed.push('.env file not found');
                console.log('❌ .env file not found');
                return;
            }
            
            const envContent = fs.readFileSync(envPath, 'utf8');
            
            for (const key of requiredApiKeys) {
                const regex = new RegExp(`^${key}=(.+)$`, 'm');
                const match = envContent.match(regex);
                
                if (match && match[1] && match[1].trim() !== '') {
                    this.results.passed.push(`API key ${key}: configured ✅`);
                    console.log(`✅ ${key}: configured`);
                } else {
                    this.results.failed.push(`API key ${key}: missing or empty`);
                    console.log(`❌ ${key}: missing or empty`);
                }
            }
        } catch (error) {
            this.results.failed.push(`API key check failed: ${error.message}`);
            console.log(`❌ API key check failed: ${error.message}`);
        }
    }
    
    async checkFilePermissions() {
        console.log('📁 Checking file permissions...');
        
        const criticalPaths = [
            '/opt/featherweight/FlappyJournal',
            '/opt/featherweight/FlappyJournal/restoration',
            '/opt/featherweight/FlappyJournal/restoration/backups'
        ];
        
        for (const dirPath of criticalPaths) {
            try {
                // Test read access
                fs.accessSync(dirPath, fs.constants.R_OK);
                
                // Test write access
                fs.accessSync(dirPath, fs.constants.W_OK);
                
                this.results.passed.push(`File permissions ${dirPath}: read/write ✅`);
                console.log(`✅ ${dirPath}: read/write access`);
            } catch (error) {
                this.results.failed.push(`File permissions ${dirPath}: ${error.message}`);
                console.log(`❌ ${dirPath}: ${error.message}`);
            }
        }
    }
    
    async checkSystemResources() {
        console.log('💾 Checking system resources...');
        
        try {
            // Check available memory
            const memInfo = process.memoryUsage();
            const totalMemoryMB = Math.round(memInfo.rss / 1024 / 1024);
            
            if (totalMemoryMB < 2048) {
                this.results.warnings.push(`Memory usage: ${totalMemoryMB}MB (recommend 2GB+)`);
                console.log(`⚠️  Memory usage: ${totalMemoryMB}MB (recommend 2GB+)`);
            } else {
                this.results.passed.push(`Memory usage: ${totalMemoryMB}MB ✅`);
                console.log(`✅ Memory usage: ${totalMemoryMB}MB`);
            }
            
            // Check disk space (simplified check)
            const stats = fs.statSync('/opt/featherweight/FlappyJournal');
            this.results.passed.push('Disk access: operational ✅');
            console.log('✅ Disk access: operational');
            
        } catch (error) {
            this.results.warnings.push(`System resource check: ${error.message}`);
            console.log(`⚠️  System resource check: ${error.message}`);
        }
    }
    
    async generateReport() {
        console.log('\n📋 Generating verification report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            verificationResults: {
                passed: this.results.passed,
                failed: this.results.failed,
                warnings: this.results.warnings
            },
            summary: {
                totalChecks: this.results.passed.length + this.results.failed.length + this.results.warnings.length,
                passedChecks: this.results.passed.length,
                failedChecks: this.results.failed.length,
                warningChecks: this.results.warnings.length,
                overallStatus: this.results.failed.length === 0 ? 'READY' : 'NEEDS_ATTENTION'
            },
            readinessAssessment: {
                nodeEnvironment: this.results.failed.filter(f => f.includes('Node.cjs')).length === 0,
                dependencies: this.results.failed.filter(f => f.includes('dependency')).length === 0,
                apiKeys: this.results.failed.filter(f => f.includes('API key')).length === 0,
                filePermissions: this.results.failed.filter(f => f.includes('permissions')).length === 0,
                readyForPhase1: this.results.failed.length === 0
            }
        };
        
        const reportPath = '/opt/featherweight/FlappyJournal/restoration/environment-verification-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log('✅ Verification report saved');
        console.log(`📁 Report location: ${reportPath}`);
        
        // Print summary
        console.log('\n' + '=' .repeat(80));
        console.log('📊 ENVIRONMENT VERIFICATION SUMMARY');
        console.log('=' .repeat(80));
        console.log(`✅ Passed: ${report.summary.passedChecks}`);
        console.log(`❌ Failed: ${report.summary.failedChecks}`);
        console.log(`⚠️  Warnings: ${report.summary.warningChecks}`);
        console.log(`🎯 Overall Status: ${report.summary.overallStatus}`);
        console.log(`🚀 Ready for Phase 1: ${report.readinessAssessment.readyForPhase1 ? 'YES' : 'NO'}`);
        console.log('=' .repeat(80));
        
        if (report.summary.failedChecks > 0) {
            console.log('\n❌ FAILED CHECKS:');
            this.results.failed.forEach(failure => console.log(`   ${failure}`));
        }
        
        if (report.summary.warningChecks > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.results.warnings.forEach(warning => console.log(`   ${warning}`));
        }
        
        return report;
    }
}

// Execute verification if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const verification = new EnvironmentVerification();
    verification.runVerification()
        .then(results => {
            if (results.failed.length === 0) {
                console.log('\n🎉 ENVIRONMENT VERIFICATION PASSED!');
                console.log('🚀 Ready to proceed with Phase 1 implementation');
                process.exit(0);
            } else {
                console.log('\n❌ ENVIRONMENT VERIFICATION FAILED!');
                console.log('🔧 Please address the failed checks before proceeding');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 VERIFICATION ERROR!');
            console.error(error);
            process.exit(1);
        });
}

export default EnvironmentVerification;
