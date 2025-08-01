import { DNASigilRealityEncoding } from '../../server/consciousness/dna-sigil-reality-encoding.js';
import { InMemoryStore } from '../../server/consciousness/persistence/InMemoryStore.js';

describe('DNA-Sigil Reality Encoding - history persistence', () => {
  let encoder;
  let store;
  beforeEach(() => {
    store = new InMemoryStore();
    encoder = new DNASigilRealityEncoding({ store });
  });

  it('should persist evolutionary, healing, interaction histories', async () => {
    // Encode a reality
    const reality = { id: 'real1', data: { foo: 'bar' } };
    const encoded = await encoder.encodeRealityWithDNASigil(reality);
    // Evolve
    await encoder.evolveEncodedReality(encoded.id, { foo: 1 });
    // Heal
    await encoder.healEncodedReality(encoded.id, { bar: 2 });
    // Interact (with self for test)
    await encoder.interactEncodedRealities(encoded.id, encoded.id, { baz: 3 });

    // Histories should be non-empty arrays
    const evo = await encoder.getEvolutionaryHistory(encoded.id);
    const heal = await encoder.getHealingHistory(encoded.id);
    const int = await encoder.getInteractionHistory(encoded.id);

    expect(Array.isArray(evo)).toBe(true);
    expect(Array.isArray(heal)).toBe(true);
    expect(Array.isArray(int)).toBe(true);

    expect(evo.length).toBeGreaterThan(0);
    expect(heal.length).toBeGreaterThan(0);
    expect(int.length).toBeGreaterThan(0);
  });
});