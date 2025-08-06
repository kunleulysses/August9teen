import SpiralMemoryArchitecture from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';

describe('Sigil generation', () => {
  it('produces signature and bounded complexity', async () => {
    const spiral = new SpiralMemoryArchitecture();
    await spiral.initialize();
    const sigil = await spiral.generateSigil('hello world', 'memory', 'shallow');
    expect(sigil.signature).toMatch(/./);
    expect(sigil.complexity).toBeLessThanOrEqual(1);
    expect(typeof sigil.signature).toBe('string');
  });
});