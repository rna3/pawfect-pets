// Centralized type definitions for the entire application

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

export interface Booking {
  id: number;
  date: string;
  time: string;
  endDate?: string | null;
  status: string;
  service: {
    id: number;
    name: string;
    price: number;
    category: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// API Request/Response Types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  category: string;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

export interface CreateBookingRequest {
  serviceId: number;
  date: string;
  time: string;
  notes?: string;
  endDate?: string;
}

export interface UpdateBookingRequest {
  date?: string;
  time?: string;
  endDate?: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}


