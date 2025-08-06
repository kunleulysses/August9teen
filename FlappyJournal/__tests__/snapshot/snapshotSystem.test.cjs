const { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({ Body: Buffer.from('test data') })
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
  HeadObjectCommand: jest.fn()
}));

describe('Snapshot System', () => {
  let snapshotWriter;
  let prisma;
  let testDbPath;
  let testSnapshotDir;

  beforeAll(async () => {
    // Setup test environment
    testDbPath = path.join(__dirname, '../../prisma/test.db');
    testSnapshotDir = path.join(__dirname, '../../prisma/test-snapshots');
    
    // Ensure test directories exist
    await fs.promises.mkdir(path.dirname(testDbPath), { recursive: true });
    await fs.promises.mkdir(testSnapshotDir, { recursive: true });
    
    // Set test environment variables
    process.env.DATABASE_URL = `file:${testDbPath}`;
    process.env.SNAPSHOT_DIR = testSnapshotDir;
    process.env.NODE_ENV = 'test';
    
    // Initialize Prisma client
    prisma = new PrismaClient();
    
    // Run migrations
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma migrate deploy', { 
        cwd: path.join(__dirname, '../../'),
        stdio: 'pipe'
      });
    } catch (error) {
      console.warn('Migration failed, continuing with test:', error.message);
    }
    
    // Import snapshot writer after environment setup
    snapshotWriter = require('../../server/consciousness/utils/snapshotWriter.cjs');
  });

  afterAll(async () => {
    // Cleanup
    await prisma.$disconnect();
    
    try {
      await fs.promises.unlink(testDbPath);
    } catch (error) {
      // Ignore cleanup errors
    }
    
    try {
      await fs.promises.rmdir(testSnapshotDir, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
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

  describe('createSnapshot', () => {
    test('should create a snapshot successfully', async () => {
      // Add some test data
      await prisma.reality.create({
        data: {
          id: 'test-reality-1',
          description: 'Test reality',
          parameters: { test: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      const snapshotName = 'test-snapshot-1';
      const result = await snapshotWriter.createSnapshot(snapshotName);

      expect(result.success).toBe(true);
      expect(result.snapshot).toBeDefined();
      expect(result.snapshot.name).toBe(snapshotName);
      expect(result.snapshot.status).toBe('COMPLETED');
      expect(result.snapshot.checksum).toBeDefined();
      expect(result.snapshot.size).toBeGreaterThan(0);
      expect(result.durationMs).toBeGreaterThan(0);

      // Verify snapshot was saved to database
      const savedSnapshot = await prisma.snapshot.findUnique({
        where: { name: snapshotName }
      });
      expect(savedSnapshot).toBeDefined();
      expect(savedSnapshot.status).toBe('COMPLETED');
    });

    test('should handle snapshot creation errors gracefully', async () => {
      // Mock a database error by using invalid database path
      const originalDbUrl = process.env.DATABASE_URL;
      process.env.DATABASE_URL = 'file:/invalid/path/test.db';

      const snapshotName = 'error-snapshot';
      
      await expect(snapshotWriter.createSnapshot(snapshotName))
        .rejects.toThrow();

      // Restore original database URL
      process.env.DATABASE_URL = originalDbUrl;
    });
  });

  describe('restoreFromSnapshot', () => {
    test('should restore from snapshot successfully', async () => {
      // Create initial data
      await prisma.reality.create({
        data: {
          id: 'original-reality',
          description: 'Original reality',
          parameters: { original: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      // Create snapshot
      const snapshotName = 'restore-test-snapshot';
      const createResult = await snapshotWriter.createSnapshot(snapshotName);
      expect(createResult.success).toBe(true);

      // Add different data
      await prisma.reality.create({
        data: {
          id: 'new-reality',
          description: 'New reality',
          parameters: { new: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      // Verify we have both realities
      const beforeRestore = await prisma.reality.findMany();
      expect(beforeRestore).toHaveLength(2);

      // Restore from snapshot
      const restoreResult = await snapshotWriter.restoreFromSnapshot(snapshotName);
      expect(restoreResult.success).toBe(true);

      // Verify restoration
      const afterRestore = await prisma.reality.findMany();
      expect(afterRestore).toHaveLength(1);
      expect(afterRestore[0].id).toBe('original-reality');
      expect(afterRestore[0].description).toBe('Original reality');

      // Verify snapshot status was updated
      const snapshot = await prisma.snapshot.findUnique({
        where: { name: snapshotName }
      });
      expect(snapshot.restoreStatus).toBe('SUCCESS');
      expect(snapshot.lastRestoredAt).toBeDefined();
    });

    test('should handle restore from non-existent snapshot', async () => {
      const nonExistentSnapshot = 'non-existent-snapshot';
      
      await expect(snapshotWriter.restoreFromSnapshot(nonExistentSnapshot))
        .rejects.toThrow('Snapshot not found');
    });
  });

  describe('bootstrapDatabase', () => {
    test('should skip bootstrap when database is not empty', async () => {
      // Add some data
      await prisma.reality.create({
        data: {
          id: 'existing-reality',
          description: 'Existing reality',
          parameters: { existing: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      const result = await snapshotWriter.bootstrapDatabase();
      expect(result.bootstrapped).toBe(false);
    });

    test('should attempt bootstrap when database is empty', async () => {
      // Ensure database is empty
      const realityCount = await prisma.reality.count();
      expect(realityCount).toBe(0);

      const result = await snapshotWriter.bootstrapDatabase();
      
      // Since we don't have any snapshots in test, it should not bootstrap
      expect(result.bootstrapped).toBe(false);
    });
  });

  describe('isDatabaseEmpty', () => {
    test('should return true when database is empty', async () => {
      const isEmpty = await snapshotWriter.isDatabaseEmpty();
      expect(isEmpty).toBe(true);
    });

    test('should return false when database has data', async () => {
      await prisma.reality.create({
        data: {
          id: 'test-reality',
          description: 'Test reality',
          parameters: { test: true },
          recursionDepth: 1,
          schemaVersion: 1
        }
      });

      const isEmpty = await snapshotWriter.isDatabaseEmpty();
      expect(isEmpty).toBe(false);
    });
  });
});