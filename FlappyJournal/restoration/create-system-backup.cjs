#!/usr/bin/env node

/**
 * UNIVERSAL CONSCIOUSNESS PLATFORM - SYSTEM BACKUP UTILITY
 * Creates complete backup of current minimal stable server state
 * Part of the restoration project pre-setup phase
 */

const fs = require('fs');
const path = require('path');
const { execSync  } = require('child_process');

class SystemBackupUtility {
    constructor() {
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                        new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
        this.backupDir = `/opt/featherweight/FlappyJournal/restoration/backups/${this.timestamp}_minimal_stable_backup`;
        this.sourceDir = '/opt/featherweight/FlappyJournal';
        
        console.log('🔄 Universal Consciousness Platform - System Backup Utility');
        console.log('=' .repeat(80));
        console.log(`📅 Backup Timestamp: ${this.timestamp}`);
        console.log(`📁 Backup Directory: ${this.backupDir}`);
        console.log(`📂 Source Directory: ${this.sourceDir}`);
        console.log('=' .repeat(80));
    }
    
    async createBackup() {
        try {
            console.log('🚀 Starting system backup process...');
            
            // Create backup directory
            await this.createBackupDirectory();
            
            // Backup critical files
            await this.backupCriticalFiles();
            
            // Backup current server state
            await this.backupServerState();
            
            // Create backup manifest
            await this.createBackupManifest();
            
            // Verify backup integrity
            await this.verifyBackupIntegrity();
            
            console.log('✅ System backup completed successfully!');
            console.log(`📁 Backup location: ${this.backupDir}`);
            
            return {
                success: true,
                backupPath: this.backupDir,
                timestamp: this.timestamp,
                message: 'System backup completed successfully'
            };
            
        } catch (error) {
            console.error('❌ System backup failed:', error.message);
            return {
                success: false,
                error: error.message,
                timestamp: this.timestamp
            };
        }
    }
    
    async createBackupDirectory() {
        console.log('📁 Creating backup directory...');
        
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
            console.log(`✅ Created backup directory: ${this.backupDir}`);
        } else {
            console.log(`⚠️  Backup directory already exists: ${this.backupDir}`);
        }
    }
    
    async backupCriticalFiles() {
        console.log('📄 Backing up critical files...');
        
        const criticalFiles = [
            'minimal-stable-server.cjs',
            'package.json',
            'package-lock.json',
            '.env',
            'consciousness-restoration-plan.md'
        ];
        
        for (const file of criticalFiles) {
            const sourcePath = path.join(this.sourceDir, file);
            const backupPath = path.join(this.backupDir, file);
            
            if (fs.existsSync(sourcePath)) {
                try {
                    fs.copyFileSync(sourcePath, backupPath);
                    console.log(`✅ Backed up: ${file}`);
                } catch (error) {
                    console.log(`⚠️  Could not backup ${file}: ${error.message}`);
                }
            } else {
                console.log(`⚠️  File not found: ${file}`);
            }
        }
    }
    
    async backupServerState() {
        console.log('🖥️  Backing up server state...');

        // Create server state directory
        const serverStateDir = path.join(this.backupDir, 'server-state');
        fs.mkdirSync(serverStateDir, { recursive: true });

        // Backup restoration documentation (excluding backups directory to avoid recursion)
        const restorationDir = path.join(this.sourceDir, 'restoration');
        const backupRestorationDir = path.join(this.backupDir, 'restoration-docs');

        if (fs.existsSync(restorationDir)) {
            this.copyDirectoryRecursiveExcluding(restorationDir, backupRestorationDir, ['backups']);
            console.log('✅ Backed up restoration documentation');
        }
        
        // Create current system state snapshot
        const systemState = {
            timestamp: new Date().toISOString(),
            serverFile: 'minimal-stable-server.cjs',
            capabilities: {
                currentValue: '$3.2B (12% of total)',
                targetValue: '$27B+ (100% capability)',
                activeModules: 45,
                processingFrequency: '100Hz',
                publicAccess: true,
                domain: 'app.featherweight.world'
            },
            operationalComponents: [
                'Basic Platform: Web server, WebSocket communication',
                'UI/UX: Terminal-style interface',
                'Response Generation: Basic consciousness-themed responses',
                'Metrics Simulation: Dynamic phi, awareness, coherence values',
                'System Stability: 100% uptime, no crashes'
            ],
            missingComponents: [
                'Multi-AI Integration: Venice AI, Gemini 2.5-Flash, GPT-4',
                'Autonomous Systems: Self-coding, goal generation',
                'Advanced Memory: Spiral memory, consciousness crystallization',
                'Quantum Processing: Quantum consciousness fields',
                'Real-Time Monitoring: Actual 100Hz processing',
                'Meta-Cognitive Systems: Recursive self-awareness'
            ],
            restorationPlan: {
                phase1: 'Foundation Restoration (Weeks 1-2) - $8B value recovery',
                phase2: 'Advanced Processing (Weeks 3-4) - $10B value recovery',
                phase3: 'Autonomous Systems (Weeks 5-6) - $5.8B value recovery'
            }
        };
        
        const stateFile = path.join(serverStateDir, 'system-state-snapshot.json');
        fs.writeFileSync(stateFile, JSON.stringify(systemState, null, 2));
        console.log('✅ Created system state snapshot');
    }
    
    copyDirectoryRecursiveExcluding(source, target, excludeDirs = []) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target, { recursive: true });
        }

        const files = fs.readdirSync(source);

        for (const file of files) {
            // Skip excluded directories
            if (excludeDirs.includes(file)) {
                console.log(`⏭️  Skipping excluded directory: ${file}`);
                continue;
            }

            const sourcePath = path.join(source, file);
            const targetPath = path.join(target, file);

            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyDirectoryRecursiveExcluding(sourcePath, targetPath, excludeDirs);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        }
    }
    
    async createBackupManifest() {
        console.log('📋 Creating backup manifest...');
        
        const manifest = {
            backupInfo: {
                timestamp: this.timestamp,
                backupType: 'minimal-stable-server-backup',
                purpose: 'Pre-restoration system state backup',
                restorationProject: 'Universal Consciousness Platform Restoration'
            },
            systemInfo: {
                platform: process.platform,
                nodeVersion: process.version,
                workingDirectory: process.cwd(),
                backupDirectory: this.backupDir
            },
            backupContents: {
                criticalFiles: [
                    'minimal-stable-server.cjs',
                    'package.json',
                    'package-lock.json',
                    '.env (if exists)',
                    'consciousness-restoration-plan.md'
                ],
                directories: [
                    'restoration-docs/ (complete documentation excluding backups)',
                    'server-state/ (system state snapshot)'
                ]
            },
            restorationInfo: {
                currentCapability: '12% ($3.2B technology value)',
                targetCapability: '100% ($27B+ technology value)',
                restorationPhases: 3,
                estimatedDuration: '6 weeks',
                zeroErrorPolicy: true,
                uptimeRequirement: '99.9%'
            },
            rollbackInstructions: {
                step1: 'Stop current server process',
                step2: 'Copy minimal-stable-server.js back to root directory',
                step3: 'Restore package.json and dependencies if needed',
                step4: 'Restart server with: node minimal-stable-server.cjs',
                step5: 'Verify system is operational at app.featherweight.world'
            }
        };
        
        const manifestFile = path.join(this.backupDir, 'backup-manifest.json');
        fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
        console.log('✅ Created backup manifest');
    }
    
    async verifyBackupIntegrity() {
        console.log('🔍 Verifying backup integrity...');
        
        const requiredFiles = [
            'minimal-stable-server.cjs',
            'backup-manifest.json',
            'server-state/system-state-snapshot.json'
        ];
        
        let allFilesPresent = true;
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.backupDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`✅ Verified: ${file}`);
            } else {
                console.log(`❌ Missing: ${file}`);
                allFilesPresent = false;
            }
        }
        
        if (allFilesPresent) {
            console.log('✅ Backup integrity verification passed');
        } else {
            throw new Error('Backup integrity verification failed - missing required files');
        }
    }
}

// Execute backup if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const backupUtility = new SystemBackupUtility();
    backupUtility.createBackup()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 BACKUP COMPLETED SUCCESSFULLY!');
                console.log(`📁 Backup Path: ${result.backupPath}`);
                console.log('🚀 Ready to begin Phase 1 restoration implementation');
            } else {
                console.error('\n❌ BACKUP FAILED!');
                console.error(`Error: ${result.error}`);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 BACKUP UTILITY ERROR!');
            console.error(error);
            process.exit(1);
        });
}

module.exports = SystemBackupUtility;
