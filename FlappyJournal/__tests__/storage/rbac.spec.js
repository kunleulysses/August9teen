import { describe, it, beforeEach, afterEach, expect } from '@jest/globals';
import { InMemoryStorageDriver } from '../../server/consciousness/persistence/InMemoryStorageDriver.cjs';
import { LevelDBSigilAdapter } from '../../server/consciousness/persistence/LevelDBSigilAdapter.cjs';

describe('StorageDriver RBAC Tests', () => {
  const drivers = [
    { name: 'InMemory', create: () => new InMemoryStorageDriver() },
    { name: 'LevelDB', create: () => new LevelDBSigilAdapter('./test-rbac-db') }
  ];

  drivers.forEach(({ name, create }) => {
    describe(`${name} RBAC Enforcement`, () => {
      let driver;

      beforeEach(async () => {
        driver = create();
      });

      afterEach(async () => {
        await driver.close();
      });

      it('should isolate tenants completely', async () => {
        const record = { data: 'test', id: 'test-sigil' };
        
        await driver.setSigilRecord('tenant1', 'sigil1', 'hash1', record);
        await driver.setSigilRecord('tenant2', 'sigil1', 'hash1', record);
        
        const tenant1Records = await driver.allSigilRecords('tenant1');
        const tenant2Records = await driver.allSigilRecords('tenant2');
        
        expect(tenant1Records).toHaveLength(1);
        expect(tenant2Records).toHaveLength(1);
        expect(tenant1Records[0].tenantId).toBe('tenant1');
        expect(tenant2Records[0].tenantId).toBe('tenant2');
      });

      it('should prevent cross-tenant access', async () => {
        const record = { data: 'secret', id: 'secret-sigil' };
        await driver.setSigilRecord('tenant1', 'sigil1', 'hash1', record);
        
        const result = await driver.getSigilRecord('tenant2', 'sigil1', 'hash1');
        expect(result).toBeUndefined();
      });

      it('should enforce tenant boundaries in count operations', async () => {
        await driver.setSigilRecord('tenant1', 'sigil1', 'hash1', { data: 'test1' });
        await driver.setSigilRecord('tenant1', 'sigil2', 'hash2', { data: 'test2' });
        await driver.setSigilRecord('tenant2', 'sigil3', 'hash3', { data: 'test3' });
        
        const tenant1Count = await driver.countSigilRecords('tenant1');
        const tenant2Count = await driver.countSigilRecords('tenant2');
        
        expect(tenant1Count).toBe(2);
        expect(tenant2Count).toBe(1);
      });

      it('should prevent privilege escalation through batch operations', async () => {
        const operations = [
          { type: 'put', tenantId: 'tenant1', sigilId: 'sigil1', authHash: 'hash1', record: { data: 'test1' } },
          { type: 'put', tenantId: 'tenant2', sigilId: 'sigil2', authHash: 'hash2', record: { data: 'test2' } }
        ];
        
        await driver.batch(operations);
        
        const tenant1Records = await driver.allSigilRecords('tenant1');
        const tenant2Records = await driver.allSigilRecords('tenant2');
        
        expect(tenant1Records).toHaveLength(1);
        expect(tenant2Records).toHaveLength(1);
        expect(tenant1Records[0].tenantId).toBe('tenant1');
        expect(tenant2Records[0].tenantId).toBe('tenant2');
      });
    });
  });
});