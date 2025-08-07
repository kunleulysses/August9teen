import { SigilEngine } from '../server/consciousness/SigilEngine.js';
import { LevelDBSigilAdapter } from '../server/consciousness/persistence/LevelDBSigilAdapter.cjs';
import { InMemoryStorageDriver } from '../server/consciousness/persistence/InMemoryStorageDriver.cjs';
import request from 'supertest';
import app from '../server/index.cjs';

describe('Integration Tests - Full System', () => {
  let storage;
  let sigilEngine;

  beforeAll(async () => {
    // Use in-memory storage for tests
    storage = new InMemoryStorageDriver();
    sigilEngine = new SigilEngine({ storage });
  });

  afterAll(async () => {
    await storage.close();
  });

  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/healthz')
        .expect(200);
      
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });

    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/readyz')
        .expect(200);
      
      expect(response.body.status).toBe('ready');
      expect(response.body.checks).toBeDefined();
    });
  });

  describe('SigilEngine Integration', () => {
    it('should encode and decode sigils', async () => {
      const testData = { message: 'test sigil', timestamp: Date.now() };
      const consciousnessState = { phi: 1.618, coherence: 0.8, awareness: 0.9 };
      
      // Encode
      const encodeResult = await sigilEngine.encode(testData, {
        tenantId: 'test-tenant',
        consciousnessState
      });
      
      expect(encodeResult.success).toBe(true);
      expect(encodeResult.sigil.id).toMatch(/^sigil_/);
      expect(encodeResult.sigil.signature).toBeDefined();
      expect(encodeResult.sigil.resonancePattern).toHaveLength(16);
      
      // Decode
      const decodeResult = await sigilEngine.decode(encodeResult.sigil.id, {
        tenantId: 'test-tenant'
      });
      
      expect(decodeResult.success).toBe(true);
      expect(decodeResult.data).toEqual(testData);
      expect(decodeResult.consciousnessState.phi).toBe(1.618);
    });

    it('should verify signatures correctly', async () => {
      const testData = { test: 'verification' };
      const { sign } = await import('../server/consciousness/core/security/eventSign.cjs');
      
      const signature = sign(testData);
      const verifyResult = await sigilEngine.verify(testData, signature);
      
      expect(verifyResult.valid).toBe(true);
      
      // Test invalid signature
      const invalidResult = await sigilEngine.verify(testData, 'invalid-signature');
      expect(invalidResult.valid).toBe(false);
    });

    it('should enforce tenant isolation', async () => {
      const testData = { secret: 'tenant-specific' };
      
      // Create sigil for tenant1
      const result1 = await sigilEngine.encode(testData, { tenantId: 'tenant1' });
      
      // Try to access from tenant2
      try {
        await sigilEngine.decode(result1.sigil.id, { tenantId: 'tenant2' });
        fail('Should have thrown error for cross-tenant access');
      } catch (error) {
        expect(error.message).toContain('not found');
      }
    });

    it('should list sigils with pagination', async () => {
      const tenantId = 'list-test-tenant';
      
      // Create multiple sigils
      for (let i = 0; i < 5; i++) {
        await sigilEngine.encode({ index: i }, { tenantId });
      }
      
      const listResult = await sigilEngine.list({ tenantId, limit: 3 });
      
      expect(listResult.sigils).toHaveLength(3);
      expect(listResult.total).toBe(5);
      expect(listResult.tenantId).toBe(tenantId);
      expect(listResult.pagination.hasMore).toBe(true);
    });
  });

  describe('Storage Driver Contract', () => {
    const drivers = [
      { name: 'InMemory', create: () => new InMemoryStorageDriver() }
    ];

    drivers.forEach(({ name, create }) => {
      describe(`${name} Driver`, () => {
        let driver;

        beforeEach(() => {
          driver = create();
        });

        afterEach(async () => {
          await driver.close();
        });

        it('should store and retrieve records', async () => {
          const record = { id: 'test-sigil', data: 'test-data' };
          
          await driver.setSigilRecord('tenant1', 'sigil1', 'hash1', record);
          const retrieved = await driver.getSigilRecord('tenant1', 'sigil1', 'hash1');
          
          expect(retrieved.id).toBe('test-sigil');
          expect(retrieved.tenantId).toBe('tenant1');
        });

        it('should count records per tenant', async () => {
          await driver.setSigilRecord('tenant1', 'sigil1', 'hash1', { data: 'test1' });
          await driver.setSigilRecord('tenant1', 'sigil2', 'hash2', { data: 'test2' });
          await driver.setSigilRecord('tenant2', 'sigil3', 'hash3', { data: 'test3' });
          
          const count1 = await driver.countSigilRecords('tenant1');
          const count2 = await driver.countSigilRecords('tenant2');
          
          expect(count1).toBe(2);
          expect(count2).toBe(1);
        });

        it('should support batch operations', async () => {
          const operations = [
            { type: 'put', tenantId: 'tenant1', sigilId: 'sigil1', authHash: 'hash1', record: { data: 'batch1' } },
            { type: 'put', tenantId: 'tenant1', sigilId: 'sigil2', authHash: 'hash2', record: { data: 'batch2' } }
          ];
          
          await driver.batch(operations);
          
          const records = await driver.allSigilRecords('tenant1');
          expect(records).toHaveLength(2);
        });

        it('should return health status', async () => {
          const health = await driver.getHealth();
          expect(health.status).toBe('healthy');
          expect(health.details).toBeDefined();
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid sigil data', async () => {
      try {
        await sigilEngine.encode(null);
        fail('Should have thrown error for null data');
      } catch (error) {
        expect(error.message).toContain('Data must be a non-empty object');
      }
    });

    it('should handle missing sigils gracefully', async () => {
      try {
        await sigilEngine.decode('non-existent-sigil', { tenantId: 'test' });
        fail('Should have thrown error for missing sigil');
      } catch (error) {
        expect(error.message).toContain('not found');
      }
    });
  });
});