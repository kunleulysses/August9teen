const { sign, verify } = require('../server/consciousness/core/security/eventSign.cjs');
const { trackAuthFailure } = require('../server/monitoring/alertManager.js');

// B13: HMAC Enforcement Middleware
function enforceHMAC(req, res, next) {
  const signature = req.headers['x-sigil-signature'];
  
  if (!signature) {
    trackAuthFailure('missing_hmac', req);
    return res.status(401).json({ 
      error: 'HMAC signature required',
      code: 'HMAC_MISSING'
    });
  }
  
  try {
    const isValid = verify(req.body, signature);
    
    if (!isValid) {
      trackAuthFailure('invalid_hmac', req);
      return res.status(401).json({
        error: 'Invalid HMAC signature',
        code: 'HMAC_INVALID'
      });
    }
    
    next();
  } catch (error) {
    trackAuthFailure('hmac_error', req);
    return res.status(500).json({
      error: 'HMAC verification failed',
      code: 'HMAC_ERROR'
    });
  }
}

// Add to verify endpoints
function createHMACRouter() {
  const express = require('express');
  const router = express.Router();
  
  router.post('/api/consciousness/sigils/verify', enforceHMAC, async (req, res) => {
    const { data, signature } = req.body;
    
    try {
      const isValid = verify(data, signature);
      res.json({ valid: isValid, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(500).json({ error: 'Verification failed' });
    }
  });
  
  return router;
}

module.exports = { enforceHMAC, createHMACRouter };