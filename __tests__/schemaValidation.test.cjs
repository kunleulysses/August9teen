const { validate } = require('../server/consciousness/utils/validation.cjs');

describe('Schema validation', () => {
  it('should pass for valid consciousness-state.json', () => {
    expect(() => validate('consciousness-state.json', {phi: 1, awareness: 1, coherence: 1})).not.toThrow();
  });
  it('should fail if phi missing', () => {
    expect(() => validate('consciousness-state.json', {awareness: 1, coherence: 1})).toThrow(/phi/);
  });
  it('should pass for valid reality-request.json', () => {
    expect(() => validate('reality-request.json', {description: "test", parameters: {}})).not.toThrow();
  });
  it('should fail for missing description', () => {
    expect(() => validate('reality-request.json', {parameters: {}})).toThrow(/description/);
  });
});