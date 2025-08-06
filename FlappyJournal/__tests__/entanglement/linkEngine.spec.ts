const { attemptLink } = require('../../server/consciousness/core/entanglement/linkEngine.cjs');
const { SpiralMemoryArchitecture } = require('../../server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { InMemorySpiralAdapter } = require('../../server/consciousness/core/storage/SpiralStorageAdapter.cjs');

describe('Link Engine', () => {
  let arch;

  beforeEach(async () => {
    arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
    await arch.init();
  });

  it('should create a link between two spirals', async () => {
    const spiral1 = await arch.createNewSpiral('general', 'shallow');
    const spiral2 = await arch.createNewSpiral('general', 'shallow');
    await attemptLink(spiral1, spiral2, 1, arch);
    const links = await arch.storage.getEntLinks(spiral1.id);
    expect(links.length).toBe(1);
    expect(links[0].to).toBe(spiral2.id);
  });

  it('should not create more than 8 links', async () => {
    const spiral1 = await arch.createNewSpiral('general', 'shallow');
    for (let i = 0; i < 10; i++) {
      const spiral2 = await arch.createNewSpiral('general', 'shallow');
      await attemptLink(spiral1, spiral2, 1, arch);
    }
    const links = await arch.storage.getEntLinks(spiral1.id);
    expect(links.length).toBe(8);
  });
});