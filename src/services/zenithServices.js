import axios from 'axios';

const ZENITH_BANK_API = 'https://sandbox.zenithbank.com/docs/directtransfer';

// Airtime Purchase
export const processAirtime = async (provider, phoneNumber, amount) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/airtime`, {
      provider,
      phoneNumber,
      amount
    });
    return response.data;
  } catch (err) {
    console.error('Airtime Purchase Error:', err.message);
    return { success: false };
  }
};

// Data Top-up
export const processDataTopUp = async (provider, phoneNumber, bundle) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/data`, {
      provider,
      phoneNumber,
      bundle
    });
    return response.data;
  } catch (err) {
    console.error('Data Top-Up Error:', err.message);
    return { success: false };
  }
};

// Cable Subscription
export const processCableSubscription = async (provider, service, amount) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/cable`, {
      provider,
      service,
      amount
    });
    return response.data;
  } catch (err) {
    console.error('Cable Subscription Error:', err.message);
    return { success: false };
  }
};

// Electricity Payment
export const processElectricityPayment = async (provider, service, amount) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/electricity`, {
      provider,
      service,
      amount
    });
    return response.data;
  } catch (err) {
    console.error('Electricity Payment Error:', err.message);
    return { success: false };
  }
};

// Purchase Virtual Card
export const purchaseVirtualCard = async (cardType, amount) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/virtualcard`, {
      cardType,
      amount
    });

    if (response.data.responseCode === '00') {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.responseDescription };
    }
  } catch (error) {
    console.error('Virtual Card Purchase Error:', error.message);
    return { success: false, message: 'Virtual card purchase failed' };
  }
};

// Bank Transfer
export const initiateBankTransfer = async (bankDetails, amount, currency, country) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/transaction/otherBankTransfer`, {
      bankDetails,
      amount,
      currency,
      country
    });

    if (response.data.responseCode === '00') {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.responseDescription };
    }
  } catch (error) {
    console.error('Bank Transfer Error:', error.message);
    return { success: false, message: 'Bank transfer failed' };
  }
};

// KYC Verification
export const verifyKYC = async (userId, document) => {
  try {
    const response = await axios.post(`${ZENITH_BANK_API}/api/kyc`, {
      userId,
      document
    });

    if (response.data.responseCode === '00') {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.responseDescription };
    }
  } catch (error) {
    console.error('KYC Verification Error:', error.response ? error.response.data : error.message);
    return { success: false, message: 'KYC verification failed due to API error' };
  }
};

export const zenithBankAPI = {
  processAirtime,
  processDataTopUp,
  processCableSubscription,
  processElectricityPayment,
  purchaseVirtualCard,
  initiateBankTransfer,
  verifyKYC
};
