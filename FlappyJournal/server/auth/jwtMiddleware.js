const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const { trackAuthFailure } = require('../monitoring/alertManager');

const issuer = process.env.JWT_ISSUER;
const audience = process.env.JWT_AUDIENCE;
const jwksUri = process.env.JWT_JWKS_URI;

if (!issuer || !audience || !jwksUri) {
  throw new Error('JWT configuration missing: JWT_ISSUER, JWT_AUDIENCE, and JWT_JWKS_URI are required');
}

const jwksClient = jwksRsa({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri
});

function getKey(header, cb) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return cb(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

function jwtMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Bearer ')) {
    trackAuthFailure('missing_auth_header', req);
    req.log && req.log.warn({ ip: req.ip }, 'Missing or invalid Authorization header');
    return res.status(401).json({ 
      error: 'Missing or invalid Authorization header',
      code: 'UNAUTHORIZED'
    });
  }
  
  const token = auth.split(' ')[1];
  
  jwt.verify(token, getKey, { 
    issuer, 
    audience,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      trackAuthFailure('jwt_verification_failed', req);
      req.log && req.log.warn({ 
        err: err.message, 
        ip: req.ip,
        userAgent: req.get('User-Agent')
      }, 'JWT verification failed');
      
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    
    // Extract user and tenant information
    req.user = {
      sub: decoded.sub,
      tenantId: decoded.tenantId || decoded.tenant_id || 'default',
      roles: decoded.roles || decoded.scope?.split(' ') || [],
      email: decoded.email,
      name: decoded.name,
      iat: decoded.iat,
      exp: decoded.exp
    };
    
    req.log && req.log.info({ 
      userId: req.user.sub, 
      tenantId: req.user.tenantId,
      roles: req.user.roles
    }, 'JWT authentication successful');
    
    next();
  });
}

// Optional middleware for role-based access control
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!req.user.roles.includes(role)) {
      trackAuthFailure('insufficient_permissions', req);
      req.log && req.log.warn({ 
        userId: req.user.sub, 
        requiredRole: role,
        userRoles: req.user.roles
      }, 'Insufficient permissions');
      
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: role,
        code: 'FORBIDDEN'
      });
    }
    
    next();
  };
}

module.exports = { jwtMiddleware, requireRole };