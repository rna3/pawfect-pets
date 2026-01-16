import axios, { AxiosResponse } from 'axios';
import {
  Product,
  Service,
  Order,
  Booking,
  ApiResponse,
  CreateProductRequest,
  UpdateProductRequest,
  CreateServiceRequest,
  UpdateServiceRequest,
  CreateBookingRequest,
  UpdateBookingRequest,
  CreateOrderRequest,
  TrainingGuideRequest,
  TrainingGuideResponse,
} from '../types';
import { STORAGE_KEYS } from '../constants';

// Vite proxy will handle /api routes, so we use relative URLs
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Product API
export const getProducts = (): Promise<AxiosResponse<Product[]>> =>
  api.get('/products');
export const getProduct = (id: number): Promise<AxiosResponse<Product>> =>
  api.get(`/products/${id}`);

// Service API
export const getServices = (): Promise<AxiosResponse<Service[]>> =>
  api.get('/services');
export const getService = (id: number): Promise<AxiosResponse<Service>> =>
  api.get(`/services/${id}`);

// Order API
export const getOrders = (): Promise<AxiosResponse<Order[]>> =>
  api.get('/orders');
export const getOrder = (id: number): Promise<AxiosResponse<Order>> =>
  api.get(`/orders/${id}`);
export const createOrder = (
  data: CreateOrderRequest
): Promise<AxiosResponse<Order>> => api.post('/orders', data);

// Booking API
export const getBookings = (): Promise<AxiosResponse<Booking[]>> =>
  api.get('/bookings');
export const getBooking = (id: number): Promise<AxiosResponse<Booking>> =>
  api.get(`/bookings/${id}`);
export const createBooking = (
  data: CreateBookingRequest
): Promise<AxiosResponse<Booking>> => api.post('/bookings', data);
export const updateBooking = (
  id: number,
  data: UpdateBookingRequest
): Promise<AxiosResponse<Booking>> => api.put(`/bookings/${id}`, data);
export const cancelBooking = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/bookings/${id}`);

// Admin API
export const createProduct = (
  data: CreateProductRequest
): Promise<AxiosResponse<Product>> => api.post('/products', data);
export const updateProduct = (
  id: number,
  data: UpdateProductRequest
): Promise<AxiosResponse<Product>> => api.put(`/products/${id}`, data);
export const deleteProduct = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/products/${id}`);

export const createService = (
  data: CreateServiceRequest
): Promise<AxiosResponse<Service>> => api.post('/services', data);
export const updateService = (
  id: number,
  data: UpdateServiceRequest
): Promise<AxiosResponse<Service>> => api.put(`/services/${id}`, data);
export const deleteService = (id: number): Promise<AxiosResponse<void>> =>
  api.delete(`/services/${id}`);

// Training Guide API
export const generateTrainingGuide = (
  data: TrainingGuideRequest
): Promise<AxiosResponse<TrainingGuideResponse>> =>
  api.post('/training-guide', data);