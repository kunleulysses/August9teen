const express = require('express');
const fetch = require('node-fetch');
const { createBreaker } = require('./utils/circuitBreaker.cjs');

const router = express.Router();

const breaker = createBreaker(
  (url, opts) => fetch(url, opts).then(r => r.json()),
  { timeout: process.env.DNASTORE_TIMEOUT_MS || 3000 }
);

const { sigilEncodeCounter, sigilEncodeDuration, sigilErrorCounter } = require('./metrics/sigilMetrics.cjs');

// Get sigil history
router.get('/api/consciousness/sigils', async (req, res) => {
  try {
    const response = await breaker.fire(`${process.env.DNASTORE_URL}/api/sigils`);
    if (response.fallback) {
      req.log.warn({ fallback: true }, 'Circuit breaker fallback');
      res.status(503).json({ error: 'DNAStore unavailable' });
      return;
    }
    res.json(response);
  } catch (error) {
    req.log.error({ err: error }, 'Error fetching sigils');
    res.status(500).json({ error: 'Failed to fetch sigils' });
  }
});

// Save new sigil
router.post('/api/consciousness/sigils', async (req, res) => {
  const end = sigilEncodeDuration.startTimer();
  try {
    const response = await breaker.fire(`${process.env.DNASTORE_URL}/api/sigils`, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.fallback) {
      req.log.warn({ fallback: true }, 'Circuit breaker fallback');
      res.status(503).json({ error: 'DNAStore unavailable' });
      return;
    }
    sigilEncodeCounter.inc();
    end();
    res.json(response);
  } catch (error) {
    sigilErrorCounter.inc();
    end();
    req.log.error({ err: error }, 'Error saving sigil');
    res.status(500).json({ error: 'Failed to save sigil' });
  }
});

module.exports = router;
