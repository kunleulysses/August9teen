const express = require('express');
const router = express.Router();
const realityService = require('../services/realityService.cjs');
const metrics = require('../metrics.cjs');

router.post('/', async (req, res) => {
  try {
    const reality = await realityService.createReality(req.body);
    metrics.realitiesCreated.inc();
    res.status(201).json(reality);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const realities = await realityService.getAllRealities();
    res.json(realities);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;