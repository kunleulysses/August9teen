const jwt = require('jsonwebtoken');

const createAuthMetrics = ({ jwk, secret }) => {
  return (req, res, next) => {
    // Allow anonymous access if feature flag is set
    if (process.env.ALLOW_ANONYMOUS_METRICS === 'true') {
      return next();
    }

    try {
      const authHeader = req.headers.authorization || '';
      let token = '';

      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }

      if (!token) {
        // Fallback to query parameter for easier browser testing
        token = req.query.token || '';
      }

      if (!token) {
        throw new Error('No authentication token provided');
      }

      // Verify JWT
      const payload = jwk
        ? jwt.verify(token, jwk, { algorithms: ['RS256'] })
        : jwt.verify(token, secret, { algorithms: ['HS256'] });

      req.auth = payload; // Attach user info for potential logging
      next();
    } catch (error) {
      console.warn(`Metrics endpoint authentication failed: ${error.message}`);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

module.exports = { createAuthMetrics };