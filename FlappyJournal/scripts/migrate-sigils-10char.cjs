const { SpiralMemoryArchitecture } = require('../server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { InMemorySpiralAdapter } = require('../server/consciousness/core/storage/SpiralStorageAdapter.cjs');

async function run() {
  const arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
  await arch.init();

  for (const [key, value] of arch.sigilRegistry.entries()) {
    if (key.length === 8) {
      const memory = await arch.retrieveMemory(value);
      const newSigil = await arch.generateSigil(memory.content, memory.type, memory.depth);
      arch.sigilRegistry.set(newSigil.signature, value);
      arch.sigilRegistry.delete(key);
      console.log(`Migrated ${key} to ${newSigil.signature}`);
    }
  }
}

run();