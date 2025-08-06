import { connect, NatsConnection, nkeyAuthenticator } from 'nats';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const scopePrefixMap: Record<string, string[]> = {
  'spiral.read': ['spiral.read'],
  'spiral.write': ['spiral.write']
};

const keycloakUrl = process.env.KEYCLOAK_SERVER_URL || 'http://localhost:8080';
const realm = process.env.KEYCLOAK_REALM || 'featherweight';

const jwks = jwksClient({
  jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  jwks.getSigningKey(header.kid as string, (err, key) => {
    if (err) {
      callback(err, undefined);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export async function verifyToken(token: string): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as jwt.JwtPayload);
    });
  });
}

export function checkSubjectAccess(
  token: jwt.JwtPayload,
  subject: string,
  action: 'read' | 'write'
): boolean {
  const requiredScope = action === 'write' ? 'spiral.write' : 'spiral.read';
  const scopes = (token.scope as string | undefined)?.split(' ') || [];
  const roles = (token.realm_access?.roles as string[] | undefined) || [];
  const hasScope = scopes.includes(requiredScope) || roles.includes(requiredScope);
  if (!hasScope) return false;
  const prefixes = scopePrefixMap[requiredScope] || [];
  return prefixes.some((p) => subject.startsWith(p));
}

export async function connectNats(): Promise<NatsConnection> {
  const seed = process.env.NATS_NKEY_SEED;
  if (!seed) {
    throw new Error('NATS_NKEY_SEED env variable is required');
  }
  return connect({
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    authenticator: nkeyAuthenticator(Buffer.from(seed))
  });
}
