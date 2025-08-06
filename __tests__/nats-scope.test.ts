import { checkSubjectAccess } from '../server/nats-auth';

describe('checkSubjectAccess', () => {
  const readToken = { scope: 'spiral.read', realm_access: { roles: [] } } as any;
  const writeToken = { scope: 'spiral.write', realm_access: { roles: [] } } as any;

  test('allows reading with spiral.read scope', () => {
    expect(checkSubjectAccess(readToken, 'spiral.read.data', 'read')).toBe(true);
    expect(checkSubjectAccess(readToken, 'spiral.write.data', 'read')).toBe(false);
  });

  test('allows writing with spiral.write scope', () => {
    expect(checkSubjectAccess(writeToken, 'spiral.write.data', 'write')).toBe(true);
    expect(checkSubjectAccess(writeToken, 'spiral.read.data', 'write')).toBe(false);
  });
});
