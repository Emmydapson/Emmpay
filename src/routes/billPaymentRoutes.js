import express from 'express';
import { airtimeTopUp, dataTopUp, cableSubscription, electricityBillPayment, saveBeneficiary } from '../controllers/billPaymentController.js';
import {authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/airtime', authMiddleware, airtimeTopUp);
router.post('/data', authMiddleware, dataTopUp);
router.post('/cable', authMiddleware, cableSubscription);
router.post('/electricity', authMiddleware, electricityBillPayment);
router.post('/save-beneficiary', authMiddleware, saveBeneficiary);

export default router;
