import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Request interceptor — attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 (expired/invalid token) globally
let logoutHandler = null;

export const registerLogoutHandler = (handler) => {
  logoutHandler = handler;
};

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't intercept login/register failures — those are credential errors
      const url = error.config?.url || '';
      if (!url.includes('/users/login') && !url.includes('/users/register')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        if (logoutHandler) {
          logoutHandler();
        }
      }
    }
    return Promise.reject(error);
  }
);

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
export const refreshToken = () => API.post('/api/users/refresh');

export default API;
