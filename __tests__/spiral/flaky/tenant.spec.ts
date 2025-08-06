import SpiralMemoryFacade from '../../server/consciousness/core/SpiralMemoryFacade.cjs';

describe('Tenant isolation', () => {
  it('memory is only visible to correct tenant', async () => {
    // Wait for facade initialization
    while (!SpiralMemoryFacade.arch.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const originalTenant = process.env.TENANT_ID;

    try {
      process.env.TENANT_ID = 'tenantA';
      const nodeA = await SpiralMemoryFacade.storeMemory('foo', 'test', 'shallow', []);

      process.env.TENANT_ID = 'tenantB';
      const nodeB = await SpiralMemoryFacade.storeMemory('bar', 'test', 'shallow', []);

      process.env.TENANT_ID = 'tenantA';
      const gotA = await SpiralMemoryFacade.retrieveMemory(nodeA.id);

      process.env.TENANT_ID = 'tenantB';
      const gotB = await SpiralMemoryFacade.retrieveMemory(nodeA.id); // Try to access tenantA's memory

      expect(gotA).toBeDefined();
      expect(gotB).toBeNull();
    } finally {
      // Restore original tenant
      if (originalTenant) {
        process.env.TENANT_ID = originalTenant;
      } else {
        delete process.env.TENANT_ID;
      }
    }
  });
});