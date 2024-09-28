import mongoose from 'mongoose';

const BillPaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  billType: {
    type: String,
    enum: ['airtime', 'data', 'cable', 'electricity'],
    required: true
  },
  dataBundle: {
    type: String
  },
  cableService: {
    type: String
  },
  electricityService: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  isBeneficiary: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('BillPayment', BillPaymentSchema);
