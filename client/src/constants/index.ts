// Application-wide constants

export const SERVICE_CATEGORIES = {
  WALKING: 'walking',
  BOARDING: 'boarding',
  TRAINING: 'training',
  GROOMING: 'grooming',
  OTHER: 'other',
} as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  SERVICES: '/services',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  CART: 'cart',
} as const;


