const { describe, test, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

describe('Snapshot System Integration', () => {
  let prisma;
  let snapshotWriter;

  beforeAll(async () => {
    // Setup test database
    process.env.DATABASE_URL = 'file:./prisma/integration-test.db';
    process.env.NODE_ENV = 'test';
    
    prisma = new PrismaClient();
    
    // Run migrations
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma migrate deploy', { 
        cwd: '/opt/featherweight/FlappyJournal',
        stdio: 'pipe'
      });
    } catch (error) {
      console.warn('Migration failed, continuing with test:', error.message);
    }
    
    // Import snapshot writer
    snapshotWriter = require('../../server/consciousness/utils/snapshotWriter.cjs');
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clear database before each test
    try {
      await prisma.snapshot.deleteMany();
      await prisma.reality.deleteMany();
      await prisma.recursionPath.deleteMany();
      await prisma.consciousnessField.deleteMany();
      await prisma.metric.deleteMany();
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('End-to-End Workflow', () => {
    test('should complete full backup and restore workflow', async () => {
      // Step 1: Create initial data
      const initialRealities = [
        {
          id: 'workflow-reality-1',
          description: 'Workflow reality 1',
          parameters: { workflow: true, step: 1 },
          recursionDepth: 1,
          schemaVersion: 1
        },
        {
          id: 'workflow-reality-2',
          description: 'Workflow reality 2',
          parameters: { workflow: true, step: 2 },
          recursionDepth: 2,
          schemaVersion: 1
        }
      ];

      for (const reality of initialRealities) {
        await prisma.reality.create({ data: reality });
      }

      // Step 2: Create snapshot
      const snapshotName = 'workflow-test-snapshot';
      const createResult = await snapshotWriter.createSnapshot(snapshotName);
      
      expect(createResult.success).toBe(true);
      expect(createResult.snapshot.name).toBe(snapshotName);

      // Step 3: Modify data
      await prisma.reality.deleteMany();
      await prisma.reality.create({
        data: {
          id: 'modified-reality',
          description: 'Modified reality',
          parameters: { modified: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      // Verify modification
      const modifiedData = await prisma.reality.findMany();
      expect(modifiedData).toHaveLength(1);
      expect(modifiedData[0].id).toBe('modified-reality');

      // Step 4: Restore from snapshot
      const restoreResult = await snapshotWriter.restoreFromSnapshot(snapshotName);
      
      expect(restoreResult.success).toBe(true);

      // Step 5: Verify restoration
      const restoredData = await prisma.reality.findMany();
      expect(restoredData).toHaveLength(2);
      
      const restoredIds = restoredData.map(r => r.id).sort();
      expect(restoredIds).toEqual(['workflow-reality-1', 'workflow-reality-2']);

      // Step 6: Verify snapshot metadata
      const snapshot = await prisma.snapshot.findUnique({
        where: { name: snapshotName }
      });
      
      expect(snapshot.restoreStatus).toBe('SUCCESS');
      expect(snapshot.lastRestoredAt).toBeDefined();
    });

    test('should handle bootstrap workflow', async () => {
      // Ensure database is empty
      const initialCount = await prisma.reality.count();
      expect(initialCount).toBe(0);

      // Create some data and snapshot
      await prisma.reality.create({
        data: {
          id: 'bootstrap-reality',
          description: 'Bootstrap reality',
          parameters: { bootstrap: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      const snapshotResult = await snapshotWriter.createSnapshot('bootstrap-snapshot');
      expect(snapshotResult.success).toBe(true);

      // Clear database
      await prisma.reality.deleteMany();
      
      // Test bootstrap (should not bootstrap since we don't have S3 setup in test)
      const bootstrapResult = await snapshotWriter.bootstrapDatabase();
      expect(bootstrapResult.bootstrapped).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      // Test with invalid snapshot name
      await expect(snapshotWriter.restoreFromSnapshot('non-existent-snapshot'))
        .rejects.toThrow('Snapshot not found');
    });

    test('should validate database integrity', async () => {
      const isEmpty = await snapshotWriter.isDatabaseEmpty();
      expect(isEmpty).toBe(true);

      // Add data
      await prisma.reality.create({
        data: {
          id: 'integrity-reality',
          description: 'Integrity test',
          parameters: { test: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      const isEmptyAfter = await snapshotWriter.isDatabaseEmpty();
      expect(isEmptyAfter).toBe(false);
    });
  });
});