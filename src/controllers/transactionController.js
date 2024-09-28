import Transaction from '../models/Transaction.js';

// Get transaction history
export const getTransactionHistory = async (req, res) => {
  const { type } = req.query; // 'all', 'credit', 'debit'
  const userId = req.user.id;

  try {
    const query = { userId };
    if (type === 'credit' || type === 'debit') {
      query.type = type;
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
