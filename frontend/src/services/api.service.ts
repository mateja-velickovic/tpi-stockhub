import axios from 'axios';
import type { Product, Category, StockMovement, LoginCredentials, AuthResponse, ApiResponse, User } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  profile: () => api.get<{ user: User }>('/auth/profile'),
};

export const productApi = {
  getAll: () => api.get<ApiResponse<Product[]>>('/products'),
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: number, data: Partial<Product>) => api.put<ApiResponse<Product>>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  getLowStock: () => api.get<ApiResponse<Product[]>>('/products/low-stock'),
};

export const categoryApi = {
  getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
  getById: (id: number) => api.get<ApiResponse<Category>>(`/categories/${id}`),
  create: (data: Partial<Category>) => api.post<ApiResponse<Category>>('/categories', data),
  update: (id: number, data: Partial<Category>) => api.put<ApiResponse<Category>>(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const stockMovementApi = {
  getAll: () => api.get<ApiResponse<StockMovement[]>>('/stock-movements'),
  getByProductId: (productId: number) =>
    api.get<ApiResponse<StockMovement[]>>(`/stock-movements/product/${productId}`),
  create: (data: Partial<StockMovement>) =>
    api.post<ApiResponse<StockMovement>>('/stock-movements', data),
};

export default api;
