import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor for token
api.interceptors.request.use(
  (config) => {
    const adminInfo = localStorage.getItem('adminInfo');
    const userInfo = localStorage.getItem('userInfo');
    
    let token = null;
    try {
      if (adminInfo) {
        token = JSON.parse(adminInfo).token;
      } else if (userInfo) {
        token = JSON.parse(userInfo).token;
      }
    } catch (e) {
      console.error('Error parsing auth info', e);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

// Product APIs
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const addProduct = (productData, config) => api.post('/products', productData, config);
export const updateProduct = (id, productData, config) => api.put(`/products/${id}`, productData, config);
export const deleteProduct = (id, config) => api.delete(`/products/${id}`, config);
export const seedProducts = () => api.get('/products/seed');

// Order APIs
export const getMyOrders = () => api.get('/orders/myorders');
export const getAllOrders = () => api.get('/orders');
export const createOrder = (orderData, config) => api.post('/orders', orderData, config);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

// User APIs
export const getUsers = () => api.get('/users');
export const getWishlist = (config) => api.get('/users/wishlist', config);
export const addToWishlist = (productId, config) => api.post(`/users/wishlist/${productId}`, {}, config);

// Content APIs
export const getContent = () => api.get('/content');
export const updateContentBulk = (items, config) => api.post('/content/bulk', { items }, config);

// Admin APIs
export const getAdminStats = () => api.get('/admin/stats');

// Upload API
export const uploadFile = (formData, config) => api.post('/upload', formData, config);

// Inquiry APIs
export const getInquiries = () => api.get('/inquiries');
export const createInquiry = (inquiryData) => api.post('/inquiries', inquiryData);
export const updateInquiryStatus = (id, status) => api.put(`/inquiries/${id}/status`, { status });

export default api;
