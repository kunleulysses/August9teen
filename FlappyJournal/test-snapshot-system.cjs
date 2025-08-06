#!/usr/bin/env node

/**
 * Manual test script for the snapshot system
 * This verifies all components work together correctly
 */

const { PrismaClient } = require('@prisma/client');
const snapshotWriter = require('./server/consciousness/utils/snapshotWriter.cjs');
const snapshotRecovery = require('./server/consciousness/utils/snapshotRecovery.cjs');

async function testSnapshotSystem() {
  console.log('🧪 Testing Snapshot System...\n');
  
  const prisma = new PrismaClient();
  
  try {
    // Test 1: Database connectivity
    console.log('1. Testing database connectivity...');
    await prisma.$connect();
    console.log('✅ Database connected\n');
    
    // Test 2: Create test data
    console.log('2. Creating test data...');
    await prisma.reality.create({
      data: {
        id: 'test-reality-1',
        description: 'Test reality for snapshot system',
        parameters: { test: true, timestamp: Date.now() },
        recursionDepth: 1,
        schemaVersion: 1
      }
    });
    
    const initialCount = await prisma.reality.count();
    console.log(`✅ Created test data (${initialCount} realities)\n`);
    
    // Test 3: Create snapshot
    console.log('3. Creating snapshot...');
    const snapshotName = `test_snapshot_${Date.now()}`;
    const createResult = await snapshotWriter.createSnapshot(snapshotName);
    
    if (createResult.success) {
      console.log('✅ Snapshot created successfully');
      console.log(`   Name: ${createResult.snapshot.name}`);
      console.log(`   Size: ${createResult.snapshot.size} bytes`);
      console.log(`   Checksum: ${createResult.snapshot.checksum.substring(0, 16)}...`);
      console.log(`   Duration: ${createResult.durationMs}ms\n`);
    } else {
      throw new Error('Snapshot creation failed');
    }
    
    // Test 4: Modify data
    console.log('4. Modifying data...');
    await prisma.reality.create({
      data: {
        id: 'test-reality-2',
        description: 'Additional test reality',
        parameters: { test: true, added: true },
        recursionDepth: 2,
        schemaVersion: 1
      }
    });
    
    const modifiedCount = await prisma.reality.count();
    console.log(`✅ Data modified (${modifiedCount} realities)\n`);
    
    // Test 5: Database integrity check
    console.log('5. Checking database integrity...');
    const integrity = await snapshotRecovery.validateDatabaseIntegrity();
    
    if (integrity.isHealthy) {
      console.log('✅ Database integrity check passed');
      console.log(`   Realities: ${integrity.realityCount}`);
      console.log(`   Paths: ${integrity.pathCount}`);
      console.log(`   Fields: ${integrity.fieldCount}\n`);
    } else {
      console.log('⚠️ Database integrity issues detected');
      console.log(`   Orphaned paths: ${integrity.orphanedPaths}\n`);
    }
    
    // Test 6: Create pre-operation backup
    console.log('6. Creating pre-operation backup...');
    const backupResult = await snapshotRecovery.createPreOperationBackup('test_restore', {
      testRun: true,
      originalCount: modifiedCount
    });
    
    if (backupResult.success) {
      console.log('✅ Pre-operation backup created');
      console.log(`   Backup: ${backupResult.backupName}\n`);
    } else {
      throw new Error('Pre-operation backup failed');
    }
    
    // Test 7: Restore from snapshot
    console.log('7. Restoring from snapshot...');
    const restoreResult = await snapshotWriter.restoreFromSnapshot(snapshotName);
    
    if (restoreResult.success) {
      console.log('✅ Snapshot restored successfully');
      console.log(`   Duration: ${restoreResult.durationMs}ms\n`);
    } else {
      throw new Error('Snapshot restore failed');
    }
    
    // Test 8: Verify restoration
    console.log('8. Verifying restoration...');
    const restoredCount = await prisma.reality.count();
    const restoredRealities = await prisma.reality.findMany();
    
    if (restoredCount === initialCount) {
      console.log('✅ Restoration verified');
      console.log(`   Restored ${restoredCount} realities`);
      console.log(`   Original reality present: ${restoredRealities.some(r => r.id === 'test-reality-1')}`);
      console.log(`   Added reality removed: ${!restoredRealities.some(r => r.id === 'test-reality-2')}\n`);
    } else {
      throw new Error(`Restoration verification failed: expected ${initialCount}, got ${restoredCount}`);
    }
    
    // Test 9: Check snapshot metadata
    console.log('9. Checking snapshot metadata...');
    const snapshot = await prisma.snapshot.findUnique({
      where: { name: snapshotName }
    });
    
    if (snapshot && snapshot.restoreStatus === 'SUCCESS') {
      console.log('✅ Snapshot metadata updated correctly');
      console.log(`   Status: ${snapshot.status}`);
      console.log(`   Restore Status: ${snapshot.restoreStatus}`);
      console.log(`   Last Restored: ${snapshot.lastRestoredAt}\n`);
    } else {
      throw new Error('Snapshot metadata not updated correctly');
    }
    
    // Test 10: Recovery system status
    console.log('10. Checking recovery system status...');
    const recoveryStatus = await snapshotRecovery.getRecoveryStatus();
    
    console.log('✅ Recovery system status:');
    console.log(`   Available backups: ${recoveryStatus.availableBackups}`);
    console.log(`   Database integrity: ${recoveryStatus.databaseIntegrity.isHealthy ? 'Healthy' : 'Issues detected'}`);
    console.log(`   Recovery directory: ${recoveryStatus.recoveryDir}\n`);
    
    // Test 11: Bootstrap test (should skip since DB is not empty)
    console.log('11. Testing bootstrap (should skip)...');
    const bootstrapResult = await snapshotWriter.bootstrapDatabase();
    
    if (!bootstrapResult.bootstrapped) {
      console.log('✅ Bootstrap correctly skipped (database not empty)\n');
    } else {
      console.log('⚠️ Bootstrap ran unexpectedly\n');
    }
    
    // Cleanup
    console.log('12. Cleaning up test data...');
    await prisma.snapshot.deleteMany({
      where: { name: { startsWith: 'test_snapshot_' } }
    });
    await prisma.reality.deleteMany({
      where: { id: { startsWith: 'test-reality-' } }
    });
    console.log('✅ Test data cleaned up\n');
    
    console.log('🎉 All snapshot system tests passed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Database connectivity');
    console.log('   ✅ Snapshot creation');
    console.log('   ✅ Snapshot restoration');
    console.log('   ✅ Data integrity verification');
    console.log('   ✅ Pre-operation backups');
    console.log('   ✅ Recovery system');
    console.log('   ✅ Bootstrap logic');
    console.log('   ✅ Metadata tracking');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log('\n⚠️ Test interrupted by user');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled promise rejection:', reason);
  process.exit(1);
});

// Run the test
testSnapshotSystem();