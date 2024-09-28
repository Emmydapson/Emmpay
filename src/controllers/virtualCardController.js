import { purchaseVirtualCard } from '../services/zenithServices.js';

export const purchaseCard = async (req, res) => {
  const { cardType, amount } = req.body;
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const result = await purchaseVirtualCard(cardType, amount, token);
    if (result.success) {
      res.status(200).json({ message: 'Virtual card purchased successfully', data: result.data });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
