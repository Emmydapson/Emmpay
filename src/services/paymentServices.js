import { zenithBankAPI } from '../services/zenithServices.js';


// Service to handle Airtime
export const sendAirtime = async (provider, phoneNumber, amount) => {
  return await zenithBankAPI.processAirtime(provider, phoneNumber, amount);
};

// Service to handle Data Top-Up
export const sendData = async (provider, phoneNumber, bundle) => {
  return await zenithBankAPI.processDataTopUp(provider, phoneNumber, bundle);
};

// Service to handle Cable Subscription
export const sendCableSubscription = async (provider, service, amount) => {
  try {
    const response = await zenithBankAPI.processCableSubscription(provider, service, amount);
    return response;
  } catch (error) {
    console.error(error.message);
    return { success: false };
  }
};

// Service to handle Electricity Bill Payment
export const payElectricityBill = async (provider, service, amount) => {
  try {
    const response = await zenithBankAPI.processElectricityPayment(provider, service, amount);
    return response;
  } catch (error) {
    console.error(error.message);
    return { success: false };
  }
};
