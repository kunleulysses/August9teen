const express = require('express');
const { jwtMiddleware, requireRole } = require('./auth/jwtMiddleware.cjs');
const { rateLimiter } = require('./middleware/rateLimiter.cjs');
const { SigilEngine } = require('./consciousness/SigilEngine.cjs');
const { PostgresSigilAdapter } = require('./consciousness/persistence/PostgresSigilAdapter.cjs');

function createRouter(consciousness) {
  const router = express.Router();
  
  // Initialize storage and engine
  const storage = new PostgresSigilAdapter();
  const sigilEngine = new SigilEngine({ storage });
  
  // Apply JWT authentication and rate limiting to all sigil routes
  router.use('/api/consciousness/sigils', jwtMiddleware, rateLimiter);

  // Health check for storage
  router.get('/health', async (req, res) => {
    try {
      const health = await sigilEngine.getHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: 'Health check failed' });
    }
  });

const { 
  sigilEncodeCounter, 
  sigilEncodeDuration, 
  storageReadDuration,
  sigilErrorCounter 
} = require('./metrics/sigilMetrics.cjs');

const { validateSigilCreatePayload } = require('./middleware/validateSchema.cjs');
const { trackAuthFailure } = require('./monitoring/alertManager.cjs');

// Get sigil history (requires authentication)
router.get('/api/consciousness/sigils', async (req, res) => {
  const tenantId = req.user.tenantId;
  const readTimer = storageReadDuration.startTimer();
  
  try {
    const result = await sigilEngine.list({ tenantId });
    readTimer();
    res.json(result);
  } catch (error) {
    readTimer();
    sigilErrorCounter.inc();
    req.log.error({ err: error }, 'Error fetching sigils');
    res.status(500).json({ error: 'Failed to fetch sigils' });
  }
});

// Save new sigil (requires authentication and validation)
router.post('/api/consciousness/sigils', validateSigilCreatePayload, async (req, res) => {
  const tenantId = req.user.tenantId;
  const encodeTimer = sigilEncodeDuration.startTimer();
  
  try {
    const result = await sigilEngine.encode(req.body.data, {
      tenantId,
      consciousnessState: req.body.consciousnessState
    });
    
    sigilEncodeCounter.inc();
    encodeTimer();
    res.json(result);
  } catch (error) {
    sigilErrorCounter.inc();
    encodeTimer();
    trackAuthFailure('sigil_encode_error', req);
    req.log.error({ err: error }, 'Error saving sigil');
    res.status(500).json({ error: 'Failed to save sigil' });
  }
});

  // Generate code
  router.post('/generate-code', async (req, res) => {
    const { request } = req.body;
    if (!request) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    try {
      const selfCoder = consciousness.modules.get('SelfCodingModule');
      if (!selfCoder) {
        return res.status(500).json({ error: 'SelfCodingModule not found' });
      }

      const result = await selfCoder.generateWithAutoIntegration(request);
      res.json(result);
    } catch (error) {
      req.log.error({ err: error }, 'Error generating code');
      res.status(500).json({ error: 'Failed to generate code' });
    }
  });

  return router;
}

module.exports = createRouter;
