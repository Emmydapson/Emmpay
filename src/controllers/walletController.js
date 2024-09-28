import Wallet from '../models/Wallet.js';
import { getConversionRate } from '../utils/currencyConversion.js';

// Get wallet balance
export const getWalletBalance = async (req, res) => {
  const userId = req.user.id;
  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    res.status(200).json(wallet.balances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Convert currency
export const convertCurrency = async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    const conversionRate = await getConversionRate(fromCurrency, toCurrency);
    const convertedAmount = amount * conversionRate;

    if (wallet.balances[fromCurrency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balances[fromCurrency] -= amount;
    wallet.balances[toCurrency] += convertedAmount;

    await wallet.save();

    res.status(200).json({ message: 'Conversion successful', balances: wallet.balances });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
