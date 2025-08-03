const path = require('path');
const { initializeRandomness, random, secureUUID } = require(
  path.join(__dirname, '../server/consciousness/utils/random.cjs')
);

describe('Deterministic and secure randomness', () => {
  test('Math.random is deterministic after seeding', () => {
    initializeRandomness('abc');
    const values1 = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    initializeRandomness('abc');
    const values2 = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
    expect(values1).toEqual(values2);
  });

  test('secureUUID produces unique crypto IDs', () => {
    initializeRandomness('abc');
    const id1 = secureUUID();
    const id2 = secureUUID();
    expect(id1).not.toEqual(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });
});