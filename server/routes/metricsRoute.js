import express from 'express';
import selfCodingMetrics from '../consciousness/metrics/SelfCodingMetrics.js';
const router = express.Router();
router.get('/metrics/selfcoding', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(selfCodingMetrics.getPrometheusText());
});
export default router;