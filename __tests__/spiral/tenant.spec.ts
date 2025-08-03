import SpiralMemoryFacade from '../../FlappyJournal/server/consciousness/core/SpiralMemoryFacade.cjs';

describe('Tenant isolation', () => {
  it('memory is only visible to correct tenant', async () => {
    process.env.TENANT_ID = 'tenantA';
    const nodeA = await SpiralMemoryFacade.storeMemory('id1', 'foo', {});
    process.env.TENANT_ID = 'tenantB';
    const nodeB = await SpiralMemoryFacade.storeMemory('id2', 'bar', {});
    process.env.TENANT_ID = 'tenantA';
    const gotA = await SpiralMemoryFacade.retrieveMemory('id1', {});
    process.env.TENANT_ID = 'tenantB';
    const gotB = await SpiralMemoryFacade.retrieveMemory('id1', {});
    expect(gotA).toBeDefined();
    expect(gotB).toBeNull();
  });
});