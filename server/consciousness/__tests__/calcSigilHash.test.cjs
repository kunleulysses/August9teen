import crypto from 'node:crypto';
import { calcSigilHash } from '../utils/sigilHash.cjs';

test('calcSigilHash uses sha256 and returns first 12 hex chars', () => {
  const content = 'hello world';
  const expected = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
  expect(calcSigilHash(content)).toBe(expected);
});

