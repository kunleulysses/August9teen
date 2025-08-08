const { validateUCIPRoute, validateTranscendent } = require('../FlappyJournal/server/middleware/validatePhaseA.cjs');
const { validateCnplCompile, validateCnplExecute } = require('../FlappyJournal/server/middleware/validateCnpl.cjs');
const { validateSaqrnPublish, validateSaqrnSubscribe } = require('../FlappyJournal/server/middleware/validateSaqrn.cjs');

describe('Phase A validators (Ajv fallback-safe)', () => {
  test('UCIP valid', () => {
    expect(validateUCIPRoute({ input: { x: 1 }, budget: { steps: 5 } })).toBe(true);
  });
  test('UCIP invalid (no input)', () => {
    expect(validateUCIPRoute({})).toBe(false);
  });
  test('Transcendent valid', () => {
    expect(validateTranscendent({ message: 'hi', context: { mode: 't' } })).toBe(true);
  });
  test('Transcendent invalid (empty)', () => {
    expect(validateTranscendent({ message: '' })).toBe(false);
  });
});

describe('CNPL validators', () => {
  test('compile valid', () => {
    expect(validateCnplCompile({ programmingRequest: { code: 'f()' }, consciousnessState: { phi: 0.9 } })).toBe(true);
  });
  test('compile invalid', () => {
    expect(validateCnplCompile({})).toBe(false);
  });
  test('execute valid', () => {
    expect(validateCnplExecute({ programId: 'abc123', inputs: { a: 1 } })).toBe(true);
  });
  test('execute invalid', () => {
    expect(validateCnplExecute({})).toBe(false);
  });
});

describe('SAQRN validators', () => {
  test('publish valid', () => {
    expect(validateSaqrnPublish({ topic: 't', message: 'm', sigil: 's' })).toBe(true);
  });
  test('publish invalid', () => {
    expect(validateSaqrnPublish({ topic: '', message: 'm', sigil: 's' })).toBe(false);
  });
  test('subscribe valid', () => {
    expect(validateSaqrnSubscribe({ topic: 't' })).toBe(true);
  });
  test('subscribe invalid', () => {
    expect(validateSaqrnSubscribe({})).toBe(false);
  });
});

