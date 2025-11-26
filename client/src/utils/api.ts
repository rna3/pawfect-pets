import axios from 'axios';

// Vite proxy will handle /api routes, so we use relative URLs
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Product API
export const getProducts = () => api.get('/products');
export const getProduct = (id: number) => api.get(`/products/${id}`);

// Service API
export const getServices = () => api.get('/services');
export const getService = (id: number) => api.get(`/services/${id}`);

// Order API
export const getOrders = () => api.get('/orders');
export const getOrder = (id: number) => api.get(`/orders/${id}`);
export const createOrder = (items: Array<{ productId: number; quantity: number }>) =>
  api.post('/orders', { items });

// Booking API
export const getBookings = () => api.get('/bookings');
export const getBooking = (id: number) => api.get(`/bookings/${id}`);
export const createBooking = (data: {
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  endDate?: string;
}) => api.post('/bookings', data);
// Added strong typing for booking updates so dashboard edits stay predictable.
export const updateBooking = (
  id: number,
  data: {
    date?: string;
    time?: string;
    endDate?: string;
  }
) => api.put(`/bookings/${id}`, data);
export const cancelBooking = (id: number) => api.delete(`/bookings/${id}`);

// Admin API
export const createProduct = (data: any) => api.post('/products', data);
export const updateProduct = (id: number, data: any) => api.put(`/products/${id}`, data);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

export const createService = (data: any) => api.post('/services', data);
export const updateService = (id: number, data: any) => api.put(`/services/${id}`, data);
export const deleteService = (id: number) => api.delete(`/services/${id}`);

