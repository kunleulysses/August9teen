import { ConsciousnessResonanceNetworks } from '../../server/consciousness/core/ConsciousnessResonanceNetworks.cjs';
import { InMemoryStore } from '../../server/consciousness/persistence/InMemoryStore.cjs';

describe('ConsciousnessResonanceNetworks Store Integration', () => {
  it('persists resonance field to store', async () => {
    const store = new InMemoryStore();
    const crn = new ConsciousnessResonanceNetworks({ store });
    const fieldId = 'field-abc';
    const fieldObj = { value: 42, updated: Date.now() };
    await crn.addResonanceField(fieldId, fieldObj);
    const stored = await store.get(`rfield:${fieldId}`);
    expect(stored).toBeTruthy();
    expect(stored.value).toBe(42);
    // Test async getter falls back to store
    crn.resonanceFields.delete(fieldId);
    const fetched = await crn.getResonanceField(fieldId);
    expect(fetched).toBeTruthy();
    expect(fetched.value).toBe(42);
  });
});