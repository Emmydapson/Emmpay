import express from 'express';
import { updateProfile } from '../controllers/profileController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';  // Authentication middleware

const router = express.Router();

router.put('/update', authMiddleware, updateProfile);

export default router;
