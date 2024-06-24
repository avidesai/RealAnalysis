// RentCastAPI.js

import axios from 'axios';

const API_KEY = process.env.REACT_APP_RENTCAST_API_KEY;

export const getRentCastData = async (address) => {
  try {
    const response = await axios.get(`https://api.rentcast.io/v1/property`, {
      params: {
        address: address,
        key: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from RentCast:', error);
    throw error;
  }
};
