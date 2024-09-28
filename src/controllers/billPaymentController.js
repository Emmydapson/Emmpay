import BillPayment from '../models/BillPayment.js';
import { sendAirtime, sendData, sendCableSubscription, payElectricityBill } from '../services/paymentServices.js';

// Airtime Top-Up
export const airtimeTopUp = async (req, res) => {
  const { provider, phoneNumber, amount } = req.body;
  const userId = req.user.id;

  try {
    // Perform Airtime Payment via service
    const result = await sendAirtime(provider, phoneNumber, amount);
    if (!result.success) {
      return res.status(400).json({ message: 'Airtime top-up failed' });
    }

    // Save transaction in the database
    const billPayment = new BillPayment({
      userId,
      provider,
      phoneNumber,
      billType: 'airtime',
      amount,
    });
    await billPayment.save();

    res.status(200).json({ message: 'Airtime top-up successful', transactionId: result.transactionId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Data Top-Up
export const dataTopUp = async (req, res) => {
  const { provider, phoneNumber, dataBundle } = req.body;
  const userId = req.user.id;

  try {
    // Perform Data Payment via service
    const result = await sendData(provider, phoneNumber, dataBundle);
    if (!result.success) {
      return res.status(400).json({ message: 'Data top-up failed' });
    }

    // Save transaction in the database
    const billPayment = new BillPayment({
      userId,
      provider,
      phoneNumber,
      billType: 'data',
      dataBundle,
      amount: result.amount,
    });
    await billPayment.save();

    res.status(200).json({ message: 'Data top-up successful', transactionId: result.transactionId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Cable Subscription
export const cableSubscription = async (req, res) => {
  const { provider, service, amount } = req.body;
  const userId = req.user.id;

  try {
    // Perform Cable Subscription via service
    const result = await sendCableSubscription(provider, service, amount);
    if (!result.success) {
      return res.status(400).json({ message: 'Cable subscription failed' });
    }

    // Save transaction in the database
    const billPayment = new BillPayment({
      userId,
      provider,
      billType: 'cable',
      cableService: service,
      amount,
    });
    await billPayment.save();

    res.status(200).json({ message: 'Cable subscription successful', transactionId: result.transactionId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Electricity Bill Payment
export const electricityBillPayment = async (req, res) => {
  const { provider, service, amount } = req.body;
  const userId = req.user.id;

  try {
    // Perform Electricity Bill Payment via service
    const result = await payElectricityBill(provider, service, amount);
    if (!result.success) {
      return res.status(400).json({ message: 'Electricity bill payment failed' });
    }

    // Save transaction in the database
    const billPayment = new BillPayment({
      userId,
      provider,
      billType: 'electricity',
      electricityService: service,
      amount,
    });
    await billPayment.save();

    res.status(200).json({ message: 'Electricity bill payment successful', transactionId: result.transactionId });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Save Beneficiary
export const saveBeneficiary = async (req, res) => {
  const { provider, phoneNumber, billType, dataBundle, cableService, electricityService, amount } = req.body;
  const userId = req.user.id;

  try {
    const billPayment = new BillPayment({
      userId,
      provider,
      phoneNumber,
      billType,
      dataBundle,
      cableService,
      electricityService,
      amount,
      isBeneficiary: true,
    });
    await billPayment.save();

    res.status(200).json({ message: 'Beneficiary saved successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
