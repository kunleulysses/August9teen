import { Router } from 'express';
import realityService from '../services/realityService.js';
import { z } from 'zod';

const router = Router();

const realitySchema = z.object({
  id: z.string().max(80),
  data: z.any().optional(),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map(e => ({
        path: e.path,
        message: e.message,
      }));
      const err = new Error('validation');
      err.validation = true;
      err.details = details;
      return next(err);
    }
    req.body = result.data;
    next();
  };
}

router.post('/', validate(realitySchema), async (req, res) => {
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