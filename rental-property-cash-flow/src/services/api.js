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

export default API;
