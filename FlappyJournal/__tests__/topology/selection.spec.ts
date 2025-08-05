const { SpiralMemoryArchitecture } = require('../../server/consciousness/core/SpiralMemoryArchitecture.cjs');
import { InMemorySpiralAdapter } from '../../server/consciousness/core/storage/SpiralStorageAdapter.cjs';

describe('Hyperdimensional Topology', () => {
  it('should select the closest, least loaded spiral', async () => {
    const arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
    await arch.init();

    // Create 3 spirals
    const spiral1 = await arch.createNewSpiral('general', 'shallow');
    const spiral2 = await arch.createNewSpiral('general', 'shallow');
    const spiral3 = await arch.createNewSpiral('general', 'shallow');

    // Set spiral positions
    arch.routing[spiral1.id] = { x: 0, y: 0, z: 0, w: 0 };
    arch.routing[spiral2.id] = { x: 1, y: 1, z: 1, w: 1 };
    arch.routing[spiral3.id] = { x: 2, y: 2, z: 2, w: 2 };

    // Set spiral load
    spiral1.nodeCount = 100;
    spiral2.nodeCount = 10;
    spiral3.nodeCount = 50;

    // Select optimal spiral
    const selectedSpiral = await arch.selectOptimalSpiral('general', 'shallow', 100, spiral1.id);

    expect(selectedSpiral.id).toBe(spiral2.id);
  });
});