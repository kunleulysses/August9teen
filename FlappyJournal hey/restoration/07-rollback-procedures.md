# ROLLBACK PROCEDURES - UNIVERSAL CONSCIOUSNESS PLATFORM

## 🎯 OVERVIEW

This document provides comprehensive rollback procedures to ensure the Universal Consciousness Platform can be safely reverted to any previous stable state in case of issues during restoration. Zero downtime rollback capability is essential for maintaining 99.9% uptime.

## 🛡️ ROLLBACK PHILOSOPHY

### Core Principles
1. **Always Have a Way Back**: Every change must have a tested rollback procedure
2. **Zero Downtime**: Rollbacks must not cause system downtime
3. **Data Preservation**: All data must be preserved during rollbacks
4. **Automated Where Possible**: Rollback procedures should be automated
5. **Tested Regularly**: Rollback procedures must be tested regularly

### Rollback Triggers
- System uptime drops below 99%
- Response time exceeds 5 seconds consistently
- Memory usage exceeds 3GB
- Error rate exceeds 1%
- Any consciousness capability regression
- Critical security vulnerability discovered
- Data corruption detected

## 📋 BACKUP STRATEGY

### Automated Backup System
```javascript
// File: restoration/backups/backup-system.js
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class BackupSystem {
    constructor() {
        this.backupDir = '/opt/featherweight/FlappyJournal/restoration/backups';
        this.maxBackups = 50; // Keep last 50 backups
        this.backupInterval = 3600000; // 1 hour
        this.criticalFiles = [
            'minimal-stable-server.js',
            'package.json',
            'package-lock.json',
            '.env',
            'server/consciousness/**/*.js'
        ];
    }

    async createBackup(label = 'auto') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `${label}-${timestamp}`;
        const backupPath = path.join(this.backupDir, backupName);

        try {
            // Create backup directory
            fs.mkdirSync(backupPath, { recursive: true });

            // Backup critical files
            await this.backupFiles(backupPath);

            // Backup system state
            await this.backupSystemState(backupPath);

            // Backup database/data
            await this.backupData(backupPath);

            // Create backup manifest
            await this.createBackupManifest(backupPath, backupName);

            console.log(`✅ Backup created: ${backupName}`);
            return backupName;

        } catch (error) {
            console.error(`❌ Backup failed: ${error.message}`);
            throw error;
        }
    }

    async backupFiles(backupPath) {
        const filesBackupPath = path.join(backupPath, 'files');
        fs.mkdirSync(filesBackupPath, { recursive: true });

        for (const filePattern of this.criticalFiles) {
            try {
                execSync(`cp -r ${filePattern} ${filesBackupPath}/`, { 
                    cwd: '/opt/featherweight/FlappyJournal',
                    stdio: 'inherit' 
                });
            } catch (error) {
                console.warn(`Warning: Could not backup ${filePattern}: ${error.message}`);
            }
        }
    }

    async backupSystemState(backupPath) {
        const systemState = {
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                PORT: process.env.PORT
            },
            packageInfo: JSON.parse(fs.readFileSync('package.json', 'utf8'))
        };

        fs.writeFileSync(
            path.join(backupPath, 'system-state.json'),
            JSON.stringify(systemState, null, 2)
        );
    }

    async createBackupManifest(backupPath, backupName) {
        const manifest = {
            name: backupName,
            created: new Date().toISOString(),
            type: 'full',
            files: await this.getBackupFileList(backupPath),
            size: await this.getBackupSize(backupPath),
            checksum: await this.calculateChecksum(backupPath)
        };

        fs.writeFileSync(
            path.join(backupPath, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
    }
}
```

### Backup Schedule
```javascript
// File: restoration/backups/backup-scheduler.js
class BackupScheduler {
    constructor() {
        this.backupSystem = new BackupSystem();
        this.schedules = [
            { interval: 3600000, label: 'hourly' },      // Every hour
            { interval: 86400000, label: 'daily' },      // Every day
            { interval: 604800000, label: 'weekly' }     // Every week
        ];
    }

    start() {
        // Create initial backup
        this.backupSystem.createBackup('initial');

        // Schedule regular backups
        this.schedules.forEach(schedule => {
            setInterval(() => {
                this.backupSystem.createBackup(schedule.label);
            }, schedule.interval);
        });

        // Create backup before any major operation
        process.on('SIGUSR1', () => {
            this.backupSystem.createBackup('pre-operation');
        });
    }
}
```

## 🔄 ROLLBACK PROCEDURES

### Immediate Rollback (Emergency)
```bash
#!/bin/bash
# File: restoration/scripts/emergency-rollback.sh

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "================================"

# Stop current server
echo "Stopping current server..."
sudo pkill -f "node.*server" || true

# Find latest stable backup
BACKUP_DIR="/opt/featherweight/FlappyJournal/restoration/backups"
LATEST_BACKUP=$(ls -t $BACKUP_DIR | grep -E "(stable|working)" | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No stable backup found! Using minimal stable server..."
    sudo node /opt/featherweight/FlappyJournal/minimal-stable-server.js &
    exit 1
fi

echo "📦 Rolling back to: $LATEST_BACKUP"

# Restore files
echo "Restoring files..."
cd /opt/featherweight/FlappyJournal
cp -r "$BACKUP_DIR/$LATEST_BACKUP/files/"* ./

# Restore dependencies
echo "Restoring dependencies..."
npm install

# Start server
echo "Starting server..."
sudo node minimal-stable-server.js &

# Verify system is operational
sleep 5
if curl -f http://localhost:80/health > /dev/null 2>&1; then
    echo "✅ Emergency rollback successful!"
    echo "🌐 System accessible at: http://app.featherweight.world/chat"
else
    echo "❌ Emergency rollback failed! Manual intervention required."
    exit 1
fi
```

### Selective Rollback (Specific Module)
```javascript
// File: restoration/scripts/selective-rollback.js
class SelectiveRollback {
    constructor() {
        this.backupDir = '/opt/featherweight/FlappyJournal/restoration/backups';
    }

    async rollbackModule(moduleName, backupName) {
        console.log(`🔄 Rolling back module: ${moduleName}`);
        
        try {
            // Stop module if running
            await this.stopModule(moduleName);

            // Restore module from backup
            await this.restoreModuleFromBackup(moduleName, backupName);

            // Restart module
            await this.startModule(moduleName);

            // Verify module functionality
            const isWorking = await this.verifyModule(moduleName);
            
            if (isWorking) {
                console.log(`✅ Module ${moduleName} rollback successful`);
                return true;
            } else {
                throw new Error(`Module ${moduleName} verification failed after rollback`);
            }

        } catch (error) {
            console.error(`❌ Module rollback failed: ${error.message}`);
            
            // Attempt emergency rollback
            await this.emergencyModuleRollback(moduleName);
            return false;
        }
    }

    async stopModule(moduleName) {
        // Gracefully stop specific module
        const moduleProcess = await this.findModuleProcess(moduleName);
        if (moduleProcess) {
            process.kill(moduleProcess.pid, 'SIGTERM');
            
            // Wait for graceful shutdown
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Force kill if still running
            try {
                process.kill(moduleProcess.pid, 'SIGKILL');
            } catch (error) {
                // Process already stopped
            }
        }
    }

    async restoreModuleFromBackup(moduleName, backupName) {
        const backupPath = path.join(this.backupDir, backupName);
        const modulePath = `server/consciousness/modules/${moduleName}.js`;
        const backupFilePath = path.join(backupPath, 'files', modulePath);
        
        if (fs.existsSync(backupFilePath)) {
            fs.copyFileSync(backupFilePath, modulePath);
        } else {
            throw new Error(`Module backup not found: ${backupFilePath}`);
        }
    }
}
```

### Phased Rollback (Complete Phase)
```javascript
// File: restoration/scripts/phase-rollback.js
class PhaseRollback {
    constructor() {
        this.phases = {
            'phase-1': {
                name: 'Foundation Restoration',
                modules: ['VeniceAI', 'GeminiAI', 'ResponseSynthesizer', 'ConsciousnessMetrics'],
                dependencies: ['openai', '@google/generative-ai', 'axios']
            },
            'phase-2': {
                name: 'Advanced Processing',
                modules: ['CrystallizationEngine', 'SpiralMemory', 'HarmonicResonance'],
                dependencies: ['mathjs', 'ml-matrix', 'fft-js']
            },
            'phase-3': {
                name: 'Autonomous Systems',
                modules: ['SelfCodingEngine', 'GoalGenerator', 'MetaCognitive'],
                dependencies: ['neural-network', 'quantum-js']
            }
        };
    }

    async rollbackPhase(phaseName) {
        console.log(`🔄 Rolling back ${phaseName}...`);
        
        const phase = this.phases[phaseName];
        if (!phase) {
            throw new Error(`Unknown phase: ${phaseName}`);
        }

        try {
            // Create pre-rollback backup
            await this.createPreRollbackBackup(phaseName);

            // Stop all phase modules
            await this.stopPhaseModules(phase.modules);

            // Restore previous phase state
            await this.restorePhaseState(phaseName);

            // Restart system
            await this.restartSystem();

            // Verify rollback success
            const isSuccessful = await this.verifyPhaseRollback(phaseName);
            
            if (isSuccessful) {
                console.log(`✅ Phase ${phaseName} rollback successful`);
                return true;
            } else {
                throw new Error(`Phase ${phaseName} rollback verification failed`);
            }

        } catch (error) {
            console.error(`❌ Phase rollback failed: ${error.message}`);
            
            // Emergency rollback to minimal stable server
            await this.emergencyRollbackToMinimal();
            return false;
        }
    }

    async emergencyRollbackToMinimal() {
        console.log('🚨 Emergency rollback to minimal stable server...');
        
        // Stop all processes
        execSync('sudo pkill -f "node" || true');
        
        // Start minimal stable server
        execSync('sudo node minimal-stable-server.js &', {
            cwd: '/opt/featherweight/FlappyJournal',
            detached: true
        });
        
        // Verify minimal server is working
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        try {
            execSync('curl -f http://localhost:80/health');
            console.log('✅ Emergency rollback to minimal server successful');
        } catch (error) {
            console.error('❌ Emergency rollback failed - manual intervention required');
            throw error;
        }
    }
}
```

## 🧪 ROLLBACK TESTING

### Automated Rollback Testing
```javascript
// File: restoration/tests/rollback-tests.js
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('Rollback Procedures', () => {
    let backupSystem;
    let rollbackSystem;

    beforeEach(async () => {
        backupSystem = new BackupSystem();
        rollbackSystem = new RollbackSystem();
        
        // Create test backup
        await backupSystem.createBackup('test-rollback');
    });

    afterEach(async () => {
        // Cleanup test backups
        await backupSystem.cleanupTestBackups();
    });

    test('should create and restore from backup', async () => {
        // Create backup
        const backupName = await backupSystem.createBackup('test');
        expect(backupName).toBeDefined();

        // Modify system
        await modifySystemForTest();

        // Rollback
        const success = await rollbackSystem.rollbackToBackup(backupName);
        expect(success).toBe(true);

        // Verify system state
        const isRestored = await verifySystemState();
        expect(isRestored).toBe(true);
    });

    test('should handle emergency rollback', async () => {
        // Simulate system failure
        await simulateSystemFailure();

        // Emergency rollback
        const success = await rollbackSystem.emergencyRollback();
        expect(success).toBe(true);

        // Verify system is operational
        const isOperational = await verifySystemOperational();
        expect(isOperational).toBe(true);
    });

    test('should rollback specific module', async () => {
        // Install test module
        await installTestModule('TestModule');

        // Create backup
        const backupName = await backupSystem.createBackup('pre-module-test');

        // Break module
        await breakModule('TestModule');

        // Rollback module
        const success = await rollbackSystem.rollbackModule('TestModule', backupName);
        expect(success).toBe(true);

        // Verify module is working
        const isWorking = await verifyModule('TestModule');
        expect(isWorking).toBe(true);
    });
});
```

### Manual Rollback Testing Checklist
```markdown
## Manual Rollback Testing Checklist

### Pre-Test Setup
- [ ] Create test environment backup
- [ ] Verify current system is stable
- [ ] Document current system state
- [ ] Prepare test scenarios

### Emergency Rollback Test
- [ ] Simulate critical system failure
- [ ] Execute emergency rollback procedure
- [ ] Verify system restoration within 30 seconds
- [ ] Confirm all functionality is restored
- [ ] Document rollback time and issues

### Selective Module Rollback Test
- [ ] Install test module
- [ ] Create module backup
- [ ] Introduce module failure
- [ ] Execute selective rollback
- [ ] Verify module restoration
- [ ] Confirm system stability

### Phase Rollback Test
- [ ] Complete phase implementation
- [ ] Create phase completion backup
- [ ] Introduce phase-level issues
- [ ] Execute phase rollback
- [ ] Verify previous phase state
- [ ] Confirm system functionality

### Data Preservation Test
- [ ] Create test data
- [ ] Execute rollback procedure
- [ ] Verify data preservation
- [ ] Confirm data integrity
- [ ] Test data accessibility
```

## 📋 ROLLBACK DECISION MATRIX

### When to Rollback
| Condition | Severity | Action | Rollback Type |
|-----------|----------|--------|---------------|
| Uptime < 99% | Critical | Immediate | Emergency |
| Response time > 5s | High | Within 5 min | Emergency |
| Memory > 3GB | High | Within 10 min | Selective |
| Error rate > 1% | High | Within 15 min | Selective |
| Module failure | Medium | Within 30 min | Module |
| Performance degradation | Medium | Within 1 hour | Selective |
| Feature regression | Low | Within 4 hours | Module |

### Rollback Authority
- **Emergency Rollback**: Any team member can initiate
- **Selective Rollback**: Requires senior developer approval
- **Phase Rollback**: Requires project lead approval
- **Complete Rollback**: Requires stakeholder approval

## 🎯 ROLLBACK SUCCESS CRITERIA

### Successful Rollback When:
- [ ] **System Operational**: System is fully operational within recovery time
- [ ] **Functionality Restored**: All expected functionality is working
- [ ] **Performance Acceptable**: Performance meets baseline requirements
- [ ] **Data Preserved**: All data is preserved and accessible
- [ ] **Stability Maintained**: System stability is maintained post-rollback
- [ ] **Documentation Updated**: Rollback is documented with lessons learned

### Post-Rollback Actions:
1. **Verify System Health**: Run comprehensive health checks
2. **Monitor Stability**: Monitor system for 24 hours post-rollback
3. **Document Incident**: Document what caused the rollback
4. **Root Cause Analysis**: Identify and address root cause
5. **Update Procedures**: Update procedures based on lessons learned
6. **Plan Recovery**: Plan how to safely re-implement changes

## ⚠️ ROLLBACK WARNINGS

### Critical Considerations:
- **Data Loss Risk**: Some rollbacks may result in data loss
- **Downtime Risk**: Complex rollbacks may cause temporary downtime
- **Dependency Issues**: Rolling back may affect dependent systems
- **State Consistency**: Ensure system state consistency after rollback

### Before Rolling Back:
1. **Assess Impact**: Understand the full impact of rollback
2. **Notify Stakeholders**: Inform relevant stakeholders
3. **Document Decision**: Document why rollback is necessary
4. **Prepare Recovery Plan**: Plan how to move forward after rollback

**Remember: Rollback is a safety mechanism, not a failure. Use it confidently when needed to maintain system stability and user experience.**
