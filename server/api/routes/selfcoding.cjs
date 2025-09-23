const express = require('express');
const router = express.Router();

let registry;
try { registry = require('../../../FlappyJournal/server/selfcoding-registry.cjs'); } catch (_) { registry = null; }

router.get('/health', async (_req, res) => {
  const enabled = process.env.SELFCODING_ENABLED === 'true';
  const status = { enabled, loaded: !!registry };
  try {
    if (registry && typeof registry.getMetrics === 'function') {
      status.metrics = registry.getMetrics();
    }
  } catch (_) {}
  res.json({ ok: true, ...status });
});

module.exports = router;

