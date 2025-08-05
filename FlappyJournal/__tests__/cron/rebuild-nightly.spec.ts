import { exec } from 'child_process';
import { SpiralMemoryArchitecture } from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';
import { InMemorySpiralAdapter } from '../../server/consciousness/core/storage/SpiralStorageAdapter.cjs';

describe('Nightly Rebuild', () => {
  it('should exit with code 2 if corrections were made', async () => {
    const arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
    await arch.init();

    // Corrupt a node
    const spiral = arch.memorySpirals.values().next().value;
    spiral.nodeCount++;

    const { code } = await new Promise<{ code: number }>((resolve) => {
      exec('node FlappyJournal/bin/spiral-repair.cjs --ci', (err, stdout, stderr) => {
        resolve({ code: err ? err.code || 1 : 0 });
      });
    });

    expect(code).toBe(2);
  });
});