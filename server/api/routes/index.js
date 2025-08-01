import { Router } from 'express';
import realities from './realities.js';

const router = Router();

router.use('/realities', realities);

export default router;