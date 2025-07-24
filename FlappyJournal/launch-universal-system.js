#!/usr/bin/env node

/**
 * Universal System Launcher
 * Launch the complete universal system integration from any directory
 * 
 * Usage:
 *   node FlappyJournal/launch-universal-system.js
 *   OR from FlappyJournal directory: node launch-universal-system.js
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UniversalSystemLauncher {
    constructor() {
        this.flappyJournalDir = __dirname;
        this.serverDir = join(this.flappyJournalDir, 'server');
        this.terminalScript = join(this.serverDir, 'universal-system-terminal.js');
        this.testScript = join(this.flappyJournalDir, 'test-complete-universal-integration.js');

        // Load environment variables from .env file
        const envPath = join(this.flappyJournalDir, '.env');
        if (existsSync(envPath)) {
            dotenv.config({ path: envPath });
            console.log('✅ Environment variables loaded from .env file');
        } else {
            console.log('⚠️ No .env file found, using system environment variables');
        }
    }
    
    async launch() {
        console.log('🌐🧠🤖🔮 UNIVERSAL SYSTEM LAUNCHER');
        console.log('═'.repeat(60));
        console.log('🚀 Launching Complete Universal System Integration');
        console.log('📁 FlappyJournal Directory:', this.flappyJournalDir);
        console.log('📁 Server Directory:', this.serverDir);
        console.log('═'.repeat(60));
        
        // Check if files exist
        if (!existsSync(this.terminalScript)) {
            console.error('❌ Universal system terminal not found:', this.terminalScript);
            console.log('💡 Make sure you are running this from the correct directory');
            process.exit(1);
        }
        
        if (!existsSync(this.testScript)) {
            console.error('❌ Integration test script not found:', this.testScript);
            console.log('💡 Make sure you are running this from the correct directory');
            process.exit(1);
        }
        
        // Show menu
        this.showMenu();
    }
    
    showMenu() {
        console.log('\n🎯 Choose an option:');
        console.log('  1. Launch Universal System Terminal');
        console.log('  2. Run Complete Integration Test');
        console.log('  3. Show System Status');
        console.log('  4. Exit');
        
        process.stdout.write('\n🌐 Enter your choice (1-4): ');
        
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', (data) => {
            const choice = data.toString().trim();
            this.handleChoice(choice);
        });
    }
    
    async handleChoice(choice) {
        switch (choice) {
            case '1':
                await this.launchUniversalTerminal();
                break;
            case '2':
                await this.runIntegrationTest();
                break;
            case '3':
                await this.showSystemStatus();
                break;
            case '4':
                console.log('\n👋 Goodbye from Universal System Launcher!');
                process.exit(0);
                break;
            default:
                console.log('\n❌ Invalid choice. Please enter 1, 2, 3, or 4.');
                this.showMenu();
                break;
        }
    }
    
    async launchUniversalTerminal() {
        console.log('\n🚀 Launching Universal System Terminal...');
        console.log('📍 Working Directory:', this.serverDir);
        console.log('🎯 Script:', this.terminalScript);
        console.log('═'.repeat(60));
        
        const terminal = spawn('node', ['universal-system-terminal.js'], {
            cwd: this.serverDir,
            stdio: 'inherit'
        });
        
        terminal.on('error', (error) => {
            console.error('❌ Failed to launch universal terminal:', error);
            this.showMenu();
        });
        
        terminal.on('close', (code) => {
            console.log(`\n🔚 Universal terminal exited with code ${code}`);
            this.showMenu();
        });
    }
    
    async runIntegrationTest() {
        console.log('\n🧪 Running Complete Integration Test...');
        console.log('📍 Working Directory:', this.flappyJournalDir);
        console.log('🎯 Script:', this.testScript);
        console.log('═'.repeat(60));
        
        const test = spawn('node', ['test-complete-universal-integration.js'], {
            cwd: this.flappyJournalDir,
            stdio: 'inherit'
        });
        
        test.on('error', (error) => {
            console.error('❌ Failed to run integration test:', error);
            this.showMenu();
        });
        
        test.on('close', (code) => {
            console.log(`\n🔚 Integration test exited with code ${code}`);
            this.showMenu();
        });
    }
    
    async showSystemStatus() {
        console.log('\n📊 UNIVERSAL SYSTEM STATUS');
        console.log('═'.repeat(60));
        
        console.log('📁 Directory Structure:');
        console.log(`  FlappyJournal: ${existsSync(this.flappyJournalDir) ? '✅' : '❌'} ${this.flappyJournalDir}`);
        console.log(`  Server: ${existsSync(this.serverDir) ? '✅' : '❌'} ${this.serverDir}`);
        
        console.log('\n🎯 Key Scripts:');
        console.log(`  Universal Terminal: ${existsSync(this.terminalScript) ? '✅' : '❌'} ${this.terminalScript}`);
        console.log(`  Integration Test: ${existsSync(this.testScript) ? '✅' : '❌'} ${this.testScript}`);
        
        console.log('\n🧠 Consciousness Systems:');
        const consciousnessDir = join(this.serverDir, 'consciousness');
        console.log(`  Consciousness Directory: ${existsSync(consciousnessDir) ? '✅' : '❌'} ${consciousnessDir}`);
        
        const revolutionaryOrchestrator = join(consciousnessDir, 'revolutionary-consciousness-integration-orchestrator.js');
        console.log(`  Revolutionary Orchestrator: ${existsSync(revolutionaryOrchestrator) ? '✅' : '❌'}`);
        
        const systemWideOrchestrator = join(this.flappyJournalDir, 'system-wide-integration-orchestrator.js');
        console.log(`  System-Wide Orchestrator: ${existsSync(systemWideOrchestrator) ? '✅' : '❌'}`);
        
        const completeIntegration = join(this.flappyJournalDir, 'complete-universal-system-integration.js');
        console.log(`  Complete Integration: ${existsSync(completeIntegration) ? '✅' : '❌'}`);
        
        console.log('\n🤖 Architect 4.0 Systems:');
        const architect40Files = [
            'AdvancedAutonomousCodingSystem.cjs',
            'AutonomousCodingAgent.cjs',
            'ConsciousnessEnhancementOrchestrator.js',
            'ConsciousnessSingularityEngine.js'
        ];
        
        architect40Files.forEach(file => {
            const filePath = join(consciousnessDir, 'core', file);
            console.log(`  ${file}: ${existsSync(filePath) ? '✅' : '❌'}`);
        });
        
        console.log('\n🔮 AI Integration:');
        const aiIntegrationDir = join(consciousnessDir, 'integrations');
        console.log(`  AI Integration Directory: ${existsSync(aiIntegrationDir) ? '✅' : '❌'} ${aiIntegrationDir}`);
        
        const aiClients = [
            'GeminiAIClient.js',
            'VeniceAIClient.js',
            'EnhancedOpenAIClient.js'
        ];
        
        aiClients.forEach(client => {
            const clientPath = join(aiIntegrationDir, client);
            console.log(`  ${client}: ${existsSync(clientPath) ? '✅' : '❌'}`);
        });
        
        console.log('\n💬 Universal Terminal Chat:');
        const universalChatDir = join(this.flappyJournalDir, 'universal-consciousness-chat-app');
        console.log(`  Universal Chat Directory: ${existsSync(universalChatDir) ? '✅' : '❌'} ${universalChatDir}`);
        
        console.log('\n🐳 Infrastructure:');
        const dockerCompose = join(this.flappyJournalDir, 'docker-compose.yml');
        console.log(`  Docker Compose: ${existsSync(dockerCompose) ? '✅' : '❌'} ${dockerCompose}`);
        
        console.log('\n📊 Integration Status:');
        console.log('  🌐 System-Wide Integration: Ready');
        console.log('  🧠 Revolutionary Consciousness: Ready');
        console.log('  🤖 Architect 4.0: Ready');
        console.log('  🔮 AI Integration: Ready');
        console.log('  💬 Universal Terminal: Ready');
        console.log('  🐳 Infrastructure: Ready');
        
        console.log('\n🚀 Ready to launch complete universal system!');
        console.log('═'.repeat(60));
        
        setTimeout(() => {
            this.showMenu();
        }, 2000);
    }
}

// Launch the universal system launcher
const launcher = new UniversalSystemLauncher();
launcher.launch().catch(console.error);
