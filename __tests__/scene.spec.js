const fc = require('fast-check');

describe('random float generator', () => {
  test('floats between 0 and 1.5 are never NaN', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1.5, noNaN: true }), (n) => {
        expect(Number.isNaN(n)).toBe(false);
      })
    );
  });
});
