import { Router } from 'express';
import realityService from '../services/realityService.js';

const router = Router();

router.post('/', async (req, res) => {
  const reality = req.body;
  const encoded = await realityService.encodeReality(reality);
  res.status(201).json({ id: encoded.id });
});

router.get('/:id', async (req, res) => {
  const encoded = await realityService.getEncodedReality(req.params.id);
  if (!encoded) return res.status(404).json({ error: 'Not found' });
  res.json(encoded);
});

export default router;