const express = require('express');
const router = express.Router();

router.get('/health', async (_req, res) => {
  try {
    const map = global.__API_SPIRAL_MAP;
    const svc = global.__API_SNAPSHOT_SERVICE;
    const shards = map && typeof map.size === 'number' ? map.size : 0;
    const lastSnapshotTs = global.__API_LAST_SPIRAL_SNAPSHOT || 0;
    const intervalMs = svc && svc.intervalMs ? svc.intervalMs : null;
    const bucket = svc && svc.bucket ? svc.bucket : null;
    const tickMs = Number(process.env.SYSTEM_TICK_MS || '10');
    const heartbeatHz = Math.round(1000 / (tickMs || 10));
    res.json({ ok: true, shards, lastSnapshotTs, intervalMs, bucket, heartbeatHz });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || 'failed' });
  }
});

module.exports = router;

