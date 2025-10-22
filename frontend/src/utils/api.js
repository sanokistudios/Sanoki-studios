import axios from 'axios';

// En développement, utiliser l'URL relative pour bénéficier du proxy Vite
// En production, utiliser l'URL complète depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://happy-hope-production.up.railway.app/api' : '/api');

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

export default api;

