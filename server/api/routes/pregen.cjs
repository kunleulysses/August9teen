const express = require('express');
const router = express.Router();

const pregen = require('../../consciousness/game/preGen.cjs');

router.get('/status', async (_req, res) => {
  try { res.json({ ok: true, ...(await pregen.getStatus()) }); }
  catch (e) { res.status(500).json({ ok: false, error: e?.message || 'failed' }); }
});

router.post('/refill', async (req, res) => {
  try {
    const target = parseInt((req.body && req.body.target) || (req.query && req.query.target) || 0, 10) || undefined;
    if (target) pregen.setTargetSize(target);
    const out = await pregen.topUp(target);
    res.json({ ok: true, ...out });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'failed' });
  }
});

module.exports = router;

