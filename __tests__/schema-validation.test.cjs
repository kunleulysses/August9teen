const path = require('path');
const { validate } = require(
  path.join(__dirname, '../server/consciousness/utils/validation.cjs')
);

const validConsciousness = { phi: 0.7, awareness: 0.8, coherence: 0.9, version: 1 };
const invalidConsciousness = { phi: 1.2, awareness: -0.2, coherence: 2, version: 1 };

describe('ConsciousnessState schema validation', () => {
  test('valid object passes', () => {
    expect(() =>
      validate('https://flappyjournal.dev/schema/consciousness-state.json', validConsciousness)
    ).not.toThrow();
  });

  test('invalid object throws', () => {
    expect(() =>
      validate('https://flappyjournal.dev/schema/consciousness-state.json', invalidConsciousness)
    ).toThrow(/SchemaValidationError/);
  });
});

const validRequest = { description: "Test", complexity: 0.5, dimensions: { spatial: 3, temporal: 1 }, version: 1 };
const invalidRequest = { description: "", complexity: 2, dimensions: { spatial: 0, temporal: 10 }, version: 1 };

describe('RealityRequest schema validation', () => {
  test('valid object passes', () => {
    expect(() =>
      validate('https://flappyjournal.dev/schema/reality-request.json', validRequest)
    ).not.toThrow();
  });

  test('invalid object throws', () => {
    expect(() =>
      validate('https://flappyjournal.dev/schema/reality-request.json', invalidRequest)
    ).toThrow(/SchemaValidationError/);
  });
});