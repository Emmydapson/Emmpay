import express from 'express';
import { purchaseCard } from '../controllers/virtualCardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/purchase', authMiddleware, purchaseCard);

export default router;
