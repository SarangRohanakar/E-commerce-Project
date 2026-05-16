import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ───────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// ─── Product APIs ─────────────────────────────────────────────
export const productAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  getByCategory: (cat) => api.get(`/api/products/category/${cat}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

// ─── Order APIs ───────────────────────────────────────────────
export const orderAPI = {
  place: (data) => api.post('/api/orders', data),
  getByUser: (userId) => api.get(`/api/orders/user/${userId}`),
  getById: (id) => api.get(`/api/orders/${id}`),
};

// ─── Payment APIs ─────────────────────────────────────────────
export const paymentAPI = {
  process: (data) => api.post('/api/payments', data),
  getByUser: (userId) => api.get(`/api/payments/user/${userId}`),
};

export default api;
