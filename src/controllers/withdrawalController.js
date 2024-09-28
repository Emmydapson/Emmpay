// controllers/WithdrawalController.js
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { initiateBankTransfer } from '../services/zenithServices.js';

// Withdraw funds
export const withdrawFunds = async (req, res) => {
  const { bankDetails, amount, currency } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balances[currency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transferResult = await initiateBankTransfer(bankDetails, amount, currency, 'Nigeria'); // Mock country here

    if (!transferResult.success) {
      return res.status(400).json({ message: transferResult.message });
    }

    wallet.balances[currency] -= amount;
    await wallet.save();

    await Transaction.create({
      userId,
      type: 'debit',
      amount,
      currency,
      description: 'Withdrawal'
    });

    res.status(200).json({ message: 'Withdrawal successful', balance: wallet.balances[currency] });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
