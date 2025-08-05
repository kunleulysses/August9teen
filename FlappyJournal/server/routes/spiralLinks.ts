import { SpiralMemoryArchitecture } from '../consciousness/core/SpiralMemoryArchitecture.cjs';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const arch = new SpiralMemoryArchitecture();
  await arch.init();
  const links = await arch.storage.getEntLinks();
  res.json(links);
});

export default router;