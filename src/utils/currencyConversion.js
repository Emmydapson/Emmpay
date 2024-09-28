// utils/currencyConversionService.js
import axios from 'axios';

// Mock API for currency conversion - replace with actual conversion API later
const CURRENCY_API = 'https://api.exchangeratesapi.io/latest';

// Fetch conversion rate between two currencies
export const getConversionRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(CURRENCY_API, {
      params: {
        base: fromCurrency,
        symbols: toCurrency
      }
    });

    return response.data.rates[toCurrency];
  } catch (error) {
    console.error('Currency conversion error:', error);
    throw new Error('Failed to fetch conversion rate');
  }
};
