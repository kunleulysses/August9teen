const express = require('express');
const router = express.Router();

const realityService = require('../services/realityService.cjs');
const metrics = require('../metrics.cjs');
const logger = require('../../common/logger.cjs');
const { generateId } = require('../../common/id.cjs');
const eventBus = require('../../consciousness/ConsciousnessEventBus.cjs');

// POST /world/publish -> create a reality (alias of POST /realities)
router.post('/publish', async (req, res) => {
  try {
    const reality = await realityService.createReality(req.body);
    metrics.realitiesCreated.inc();
    try { await logger.realityAccess(reality.id, 'api_create', { userId: req.body.userId }); } catch (_) {}
    res.status(201).json(reality);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /world/discover -> list realities (alias of GET /realities)
router.get('/discover', async (_req, res) => {
  try {
    const realities = await realityService.getAllRealities();
    res.json(realities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /world/heartbeat -> emit memory event (alias of POST /memory)
router.post('/heartbeat', (req, res) => {
  const opId = generateId();
  try { eventBus.emit('memory.store', { opId, ...req.body }); } catch (_) {}
  res.status(202).json({ opId });
});

module.exports = router;
