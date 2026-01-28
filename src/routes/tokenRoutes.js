import { Router } from 'express';
import TokenController from '../controllers/TokenController';

const router = new Router();

router.post('/', TokenController.store);
router.get('/', (req, res) => res.json({ ok: 'tokens route alive. Use POST' }));

export default router;
