import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Properties
export const fetchProperties = () => API.get('/api/properties');
export const fetchProperty = (id) => API.get(`/api/properties/${id}`);
export const createProperty = (data) => API.post('/api/properties', data);
export const updateProperty = (id, data) => API.put(`/api/properties/${id}`, data);
export const deleteProperty = (id) => API.delete(`/api/properties/${id}`);

// Sharing
export const shareProperty = (id) => API.post(`/api/properties/${id}/share`);
export const fetchSharedProperty = (token) => API.get(`/api/properties/shared/${token}`);

// External API proxies
export const autocompleteAddress = (text) => API.get('/api/external/autocomplete', { params: { text } });
export const lookupPropertyTax = (zip) => API.get('/api/external/property-tax', { params: { zip } });
export const estimateRent = (zip) => API.get('/api/external/rent-estimate', { params: { zip } });
export const lookupPropertyDetails = (address) => API.get('/api/external/property-details', { params: { address } });

// Auth
export const forgotPassword = (email) => API.post('/api/users/forgot-password', { email });
export const resetPassword = (token, password) => API.put(`/api/users/reset-password/${token}`, { password });

export default API;
