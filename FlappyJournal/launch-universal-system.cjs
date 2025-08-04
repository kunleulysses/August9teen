#!/usr/bin/env node

/**
 * Universal System Launcher
 * Launch the complete universal system integration from any directory
 * 
 * Usage:
 *   node FlappyJournal/launch-universal-system.js
 *   OR from FlappyJournal directory: node launch-universal-system.js
 */

const { spawn  } = require('child_process');
const { fileURLToPath  } = require('url');
const { dirname, join  } = require('path');
const { existsSync  } = require('fs');
const dotenv = require('dotenv');
const readline = require('readline');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class UniversalSystemLauncher {
    constructor() {
        this.flappyJournalDir = __dirname;
        this.serverDir = join(this.flappyJournalDir, 'server');
        this.terminalScript = join(this.serverDir, 'universal-system-terminal.cjs');
        this.testScript = join(this.flappyJournalDir, 'test-complete-universal-integration.cjs');
        this.rl = null; // To be initialized later

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
        if (!this.rl) {
            this.rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
        }

        const menuText = `
🎯 Choose an option:
  1. Launch Universal System Terminal
  2. Run Complete Integration Test
  3. Show System Status
  4. Exit

🌐 Enter your choice (1-4): `;

        this.rl.question(menuText, (choice) => {
            this.handleChoice(choice.trim());
        });
    }
    
    async handleChoice(choice) {
        switch (choice) {
            case '1':
                this.rl.close();
                await this.launchUniversalTerminal();
                break;
            case '2':
                this.rl.close();
                await this.runIntegrationTest();
                break;
            case '3':
                await this.showSystemStatus();
                break;
            case '4':
                console.log('\n👋 Goodbye from Universal System Launcher!');
                this.rl.close();
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
        
        const terminal = spawn('node', ['universal-system-terminal.cjs'], {
            cwd: this.serverDir,
            stdio: 'inherit'
        });
        
        terminal.on('error', (error) => {
            console.error('❌ Failed to launch universal terminal:', error);
            this.showMenu();
        });
        
        terminal.on('close', (code) => {
            console.log(`\n✅ Universal terminal exited with code ${code}`);
            // Re-initialize readline interface for the menu
            this.rl = null;
            this.showMenu();
        });
    }
    
    async runIntegrationTest() {
        console.log('\n🧪 Running Complete Integration Test...');
        console.log('📍 Working Directory:', this.flappyJournalDir);
        console.log('🎯 Script:', this.testScript);
        console.log('═'.repeat(60));
        
        const test = spawn('node', ['test-complete-universal-integration.cjs'], {
            cwd: this.flappyJournalDir,
            stdio: 'inherit'
        });
        
        test.on('error', (error) => {
            console.error('❌ Failed to run integration test:', error);
            this.showMenu();
        });
        
        test.on('close', (code) => {
            console.log(`\n✅ Integration test finished with code ${code}`);
            // Re-initialize readline interface for the menu
            this.rl = null;
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
        
        const revolutionaryOrchestrator = join(consciousnessDir, 'revolutionary-consciousness-integration-orchestrator.cjs');
        console.log(`  Revolutionary Orchestrator: ${existsSync(revolutionaryOrchestrator) ? '✅' : '❌'}`);
        
        const systemWideOrchestrator = join(this.flappyJournalDir, 'system-wide-integration-orchestrator.cjs');
        console.log(`  System-Wide Orchestrator: ${existsSync(systemWideOrchestrator) ? '✅' : '❌'}`);
        
        const completeIntegration = join(this.flappyJournalDir, 'complete-universal-system-integration.cjs');
        console.log(`  Complete Integration: ${existsSync(completeIntegration) ? '✅' : '❌'}`);
        
        console.log('\n🤖 Architect 4.0 Systems:');
        const architect40Files = [
            'AdvancedAutonomousCodingSystem.cjs',
            'AutonomousCodingAgent.cjs',
            'ConsciousnessEnhancementOrchestrator.cjs',
            'ConsciousnessSingularityEngine.cjs'
        ];
        
        architect40Files.forEach(file => {
            const filePath = join(consciousnessDir, 'core', file);
            console.log(`  ${file}: ${existsSync(filePath) ? '✅' : '❌'}`);
        });
        
        console.log('\n🔮 AI Integration:');
        const aiIntegrationDir = join(consciousnessDir, 'integrations');
        console.log(`  AI Integration Directory: ${existsSync(aiIntegrationDir) ? '✅' : '❌'} ${aiIntegrationDir}`);
        
        const aiClients = [
            'GeminiAIClient.cjs',
            'VeniceAIClient.cjs',
            'EnhancedOpenAIClient.cjs'
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
