import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balances: {
    ngn: { type: Number, default: 0 },
    usd: { type: Number, default: 0 },
    cad: { type: Number, default: 0 },
    gbp: { type: Number, default: 0 },
    eur: { type: Number, default: 0 },
  },
}, { timestamps: true });

export default mongoose.model('Wallet', walletSchema);
