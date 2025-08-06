/**
 * Keycloak JWT Auth middleware for Express and Socket.io (RS256, JWKS).
 * Exports:
 *   - authMiddleware: Express middleware for /api/*
 *   - socketAuth: (socket, next) => for Socket.io/WS handshake
 */

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const { promisify } = require('util');
const { URL } = require('url');

const JWKS_URI = process.env.JWKS_URI;
const ISSUER = process.env.ISSUER;
const AUDIENCE = process.env.AUDIENCE || 'reality.gen';

// Express middleware (for /api routes)
const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: JWKS_URI
  }),
  algorithms: ['RS256'],
  audience: AUDIENCE,
  issuer: ISSUER,
  credentialsRequired: true,
  requestProperty: 'auth',
});

// Socket.io/WS handshake middleware
async function socketAuth(socket, next) {
  // Supports both Socket.io handshake and raw ws connection
  try {
    const token =
      socket.handshake?.query?.token ||
      socket.handshake?.headers?.authorization?.replace(/^Bearer /, '') ||
      socket?.upgradeReq?.url && new URL(socket.upgradeReq.url, 'ws://localhost').searchParams.get('token');

    if (!token) {
      return next(new Error('Authentication token required'));
    }
    // Use same express-jwt/jwksRsa logic to verify
    const getKey = jwksRsa({
      cache: true,
      rateLimit: true,
      jwksUri: JWKS_URI
    });
    const decode = require('jsonwebtoken').decode;
    const verify = promisify(require('jsonwebtoken').verify);

    const decoded = decode(token, { complete: true });
    if (!decoded) return next(new Error('Invalid token'));

    const kid = decoded.header.kid;
    getKey.getSigningKey(kid, async (err, key) => {
      if (err) return next(new Error('Cannot fetch signing key'));
      const signingKey = key.publicKey || key.rsaPublicKey;
      try {
        const payload = await verify(token, signingKey, {
          algorithms: ['RS256'],
          audience: AUDIENCE,
          issuer: ISSUER
        });
        if (!payload.scope || !payload.scope.includes('reality.gen')) {
          return next(new Error('Missing required scope'));
        }
        socket.auth = payload;
        next();
      } catch (e) {
        next(new Error('Token verification failed: ' + e.message));
      }
    });
  } catch (e) {
    next(new Error('Auth middleware error: ' + e.message));
  }
}

module.exports = { authMiddleware, socketAuth };