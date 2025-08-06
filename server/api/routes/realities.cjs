const express = require('express');
const router = express.Router();
const realityService = require('../services/realityService.cjs');
const metrics = require('../metrics.cjs');
const logger = require('../../common/logger.cjs');

router.post('/', async (req, res) => {
  try {
    const reality = await realityService.createReality(req.body);
    metrics.realitiesCreated.inc();
    await logger.realityAccess(reality.id, 'api_create', { userId: req.body.userId });
    res.status(201).json(reality);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const realities = await realityService.getAllRealities();
    for (const r of realities) {
      await logger.realityAccess(r.id, 'api_read', { userId: req.user?.id });
    }
    res.json(realities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;