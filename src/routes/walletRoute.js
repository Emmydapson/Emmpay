// routes/walletRoutes.js
import express from 'express';
import { getWalletBalance, convertCurrency } from '../controllers/WalletController.js';
import { getTransactionHistory } from '../controllers/transactionController.js';
import { sendToEmmpayUser, sendToBank } from '../controllers/sendMoneyController.js';
import { withdrawFunds } from '../controllers/withdrawalController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Wallet Routes
router.get('/balance', authMiddleware, getWalletBalance);
router.post('/convert', authMiddleware, convertCurrency);

// Transaction History
router.get('/transactions', authMiddleware, getTransactionHistory);

// Send Money
router.post('/send/emmpay', authMiddleware, sendToEmmpayUser);
router.post('/send/bank', authMiddleware, sendToBank);

// Withdraw Funds
router.post('/withdraw', authMiddleware, withdrawFunds);

export default router;
