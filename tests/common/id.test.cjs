import { generateId } from '../../server/common/id.cjs';

describe('generateId', () => {
  it('should generate unique IDs of sufficient length', () => {
    const ids = new Set();
    for (let i = 0; i < 1000; ++i) {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(20);
      ids.add(id);
    }
    expect(ids.size).toBe(1000);
  });
});