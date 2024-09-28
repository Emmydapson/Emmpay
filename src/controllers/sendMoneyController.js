import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { initiateBankTransfer } from '../services/zenithServices.js';

// Send money to Emmpay user
export const sendToEmmpayUser = async (req, res) => {
  const { receiverUserId, amount, currency } = req.body;
  const userId = req.user.id;

  try {
    const senderWallet = await Wallet.findOne({ userId });
    const receiverWallet = await Wallet.findOne({ userId: receiverUserId });

    if (!receiverWallet) return res.status(404).json({ message: 'Receiver not found' });
    if (senderWallet.balances[currency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    senderWallet.balances[currency] -= amount;
    receiverWallet.balances[currency] += amount;

    await senderWallet.save();
    await receiverWallet.save();

    await Transaction.create({ userId, type: 'debit', amount, currency, description: 'Send to Emmpay user' });
    await Transaction.create({ userId: receiverUserId, type: 'credit', amount, currency, description: 'Received from Emmpay user' });

    res.status(200).json({ message: 'Money sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send money via bank transfer
export const sendToBank = async (req, res) => {
  const { bankDetails, amount, currency, country } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (wallet.balances[currency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Initiate bank transfer via ZenithBankService
    const result = await initiateBankTransfer(bankDetails, amount, currency, country);
    if (!result.success) {
      return res.status(400).json({ message: 'Bank transfer failed' });
    }

    wallet.balances[currency] -= amount;
    await wallet.save();

    await Transaction.create({ userId, type: 'debit', amount, currency, description: 'Bank transfer' });

    res.status(200).json({ message: 'Bank transfer successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
