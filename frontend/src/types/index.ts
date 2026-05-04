export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager';
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  quantity: number;
  minQuantity: number;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: number;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  productId: number;
  userId: number;
  product?: Product;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}
