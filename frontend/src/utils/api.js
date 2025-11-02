import axios from 'axios';

// En développement, utiliser l'URL relative pour bénéficier du proxy Vite
// En production, utiliser l'URL complète depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://happy-hope-production.up.railway.app/api' : '/api');

// Debug logs (à retirer en production finale)
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
  API_URL: API_URL
});

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Services API

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Products
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`)
};

// Orders
export const ordersAPI = {
  create: (order) => api.post('/orders', order),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  delete: (id) => api.delete(`/orders/${id}`)
};

// Messages et Conversations
export const messagesAPI = {
  // Conversations (admin)
  getConversations: () => api.get('/messages/conversations/all'),
  getMessagesByConversation: (conversationId) => api.get(`/messages/${conversationId}`),
  
  // Messages
  create: (message) => api.post('/messages', message),
  createConversation: (data) => api.post('/messages/conversation', data),
  
  // Admin
  markConversationAsRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
  deleteConversation: (conversationId) => api.delete(`/messages/conversations/${conversationId}`)
};

// Contact
export const contactAPI = {
  send: (contact) => api.post('/contact', contact),
  getAll: (params) => api.get('/contact', { params }),
  updateStatus: (id, status) => api.put(`/contact/${id}`, { status })
};

// Collections
export const collectionsAPI = {
  getAll: () => api.get('/collections'),
  getById: (id) => api.get(`/collections/${id}`),
  create: (payload) => api.post('/collections', payload),
  update: (id, payload) => api.put(`/collections/${id}`, payload),
  delete: (id) => api.delete(`/collections/${id}`)
};

// Hero Images
export const heroImagesAPI = {
  getAll: () => api.get('/hero-images'),
  create: (payload) => api.post('/hero-images', payload),
  update: (id, payload) => api.put(`/hero-images/${id}`, payload),
  updateOrder: (images) => api.put('/hero-images/order', { images }),
  delete: (id) => api.delete(`/hero-images/${id}`)
};

// Paintings
export const paintingsAPI = {
  getAll: (params) => api.get('/paintings', { params }),
  getById: (id) => api.get(`/paintings/${id}`),
  create: (payload) => api.post('/paintings', payload),
  update: (id, payload) => api.put(`/paintings/${id}`, payload),
  delete: (id) => api.delete(`/paintings/${id}`)
};

export default api;

