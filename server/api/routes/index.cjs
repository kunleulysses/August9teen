import { Router } from 'express';
import realities from './realities.cjs';

const router = Router();

router.use('/realities', realities);

export default router;