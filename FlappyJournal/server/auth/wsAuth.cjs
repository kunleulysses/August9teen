const jwt = require('jsonwebtoken');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { createHash } = require('crypto');

// Prometheus metrics
const client = require('prom-client');

// Create metrics
const rateLimitExceeded = new client.Counter({
  name: 'spiral_ws_rate_limit_exceeded_total',
  help: 'Total number of rate limit exceeded events',
  labelNames: ['endpoint']
});

const scopeRejectTotal = new client.Counter({
    name: 'ws_scope_reject_total',
    help: 'Total number of WebSocket connections rejected due to missing scope',
    labelNames: ['endpoint']
});

const activeConnections = new client.Gauge({
  name: 'spiral_ws_active_connections',
  help: 'Number of active WebSocket connections',
  labelNames: ['endpoint']
});

const activeUsers = new client.Gauge({
  name: 'spiral_ws_active_users',
  help: 'Number of active users with WebSocket connections',
  labelNames: ['endpoint']
});

// Track active users and their connections
const userConnections = new Map();

/**
 * Create WebSocket authentication middleware
 * @param {Object} options - Configuration options
 * @param {string} [options.jwk] - JWK for RS256 verification
 * @param {string} [options.secret] - Secret for HS256 verification
 * @param {number} [options.max=100] - Maximum requests per window
 * @param {number} [options.window=10] - Window size in seconds
 * @param {string} [options.endpoint='unknown'] - Endpoint name for metrics
 * @returns {Function} Express/WebSocket authentication middleware
 */
function createWsAuth({
  jwk,
  secret,
  max = 100,
  window = 10,
  endpoint = 'unknown'
} = {}) {
  if (!jwk && !secret) {
    throw new Error('Either jwk or secret must be provided');
  }

  // Create rate limiter
  const rateLimiter = new RateLimiterMemory({
    points: max,
    duration: window,
    blockDuration: window * 2, // Block for 2x window on limit
    keyPrefix: `ws_auth_${endpoint}`
  });

  // Track active connections per user
  function trackConnection(userId, ws) {
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
      activeUsers.inc({ endpoint });
    }
    userConnections.get(userId).add(ws);
    activeConnections.inc({ endpoint });

    // Clean up on close
    const cleanup = () => {
      if (userConnections.has(userId)) {
        const connections = userConnections.get(userId);
        connections.delete(ws);
        activeConnections.dec({ endpoint });
        
        if (connections.size === 0) {
          userConnections.delete(userId);
          activeUsers.dec({ endpoint });
        }
      }
    };

    ws.on('close', cleanup);
    ws.on('error', cleanup);
  }

  // Middleware function
  return async (req, socket, head, next) => {
    // Skip auth if anonymous access is allowed
    if (process.env.ALLOW_ANONYMOUS_WS === 'true') {
      req.auth = { sub: 'anonymous', roles: ['anonymous'] };
      return next();
    }

    try {
      // Extract token from WebSocket protocol or query string
      let token = '';
      
      // Check WebSocket protocol header
      if (req.headers['sec-websocket-protocol']) {
        const protocols = req.headers['sec-websocket-protocol'].split(',').map(p => p.trim());
        token = protocols[0] || '';
      }
      
      // Fallback to query parameter
      if (!token) {
        const url = new URL(req.url, 'http://x');
        token = url.searchParams.get('token') || '';
      }

      if (!token) {
        throw new Error('No authentication token provided');
      }

      // Verify JWT
      const payload = jwk 
        ? jwt.verify(token, jwk, { algorithms: ['RS256'] })
        : jwt.verify(token, secret, { algorithms: ['HS256'] });

      // Check for required scope
      if (!payload.scope || !payload.scope.includes('metacog.stream')) {
          scopeRejectTotal.inc({ endpoint });
          throw new Error('Missing required scope: metacog.stream');
      }

      // Rate limit by user ID
      try {
        const userKey = payload.sub || 'anonymous';
        await rateLimiter.consume(userKey);
        
        // Attach user and tracking function to request
        req.auth = payload;
        req.trackConnection = (ws) => trackConnection(userKey, ws);
        next();
      } catch (rateLimitError) {
        rateLimitExceeded.inc({ endpoint });
        console.warn(`Rate limit exceeded for user ${payload.sub} on ${endpoint}`);
        
        if (socket.writable) {
          socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
        }
        socket.destroy();
      }
    } catch (error) {
      console.warn('WebSocket authentication failed:', error.message);
      
      if (socket.writable) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      }
      socket.destroy();
    }
  };
}

module.exports = {
  createWsAuth,
  metrics: {
    rateLimitExceeded,
    activeConnections,
    activeUsers,
    scopeRejectTotal
  }
};
