import mongoose from 'mongoose';

const BeneficiarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  billType: { type: String, enum: ['airtime', 'data', 'cable', 'electricity'], required: true },
  provider: { type: String, required: true },
  phoneNumber: { type: String },
  meterNumber: { type: String },
  bundle: { type: String },
  subscriptionPackage: { type: String },
  alias: { type: String }, // name for the saved bill payment
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Beneficiary', BeneficiarySchema);
