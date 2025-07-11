import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },
};

// Grievances API
export const grievancesAPI = {
  // Get all grievances
  getAll: async (params = {}) => {
    const response = await api.get('/grievances', { params });
    return response.data;
  },

  // Get grievance by ID
  getById: async (id) => {
    const response = await api.get(`/grievances/${id}`);
    return response.data;
  },

  // Create new grievance
  create: async (grievanceData) => {
    const response = await api.post('/grievances', grievanceData);
    return response.data;
  },

  // Update grievance
  update: async (id, grievanceData) => {
    const response = await api.put(`/grievances/${id}`, grievanceData);
    return response.data;
  },

  // Delete grievance
  delete: async (id) => {
    const response = await api.delete(`/grievances/${id}`);
    return response.data;
  },

  // Update grievance status
  updateStatus: async (id, status, reason) => {
    const response = await api.patch(`/grievances/${id}/status`, { status, reason });
    return response.data;
  },

  // Add comment to grievance
  addComment: async (id, comment) => {
    const response = await api.post(`/grievances/${id}/comments`, { comment });
    return response.data;
  },

  // Get grievance comments
  getComments: async (id) => {
    const response = await api.get(`/grievances/${id}/comments`);
    return response.data;
  },

  // Upload attachment
  uploadAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/grievances/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get grievance statistics
  getStats: async () => {
    const response = await api.get('/grievances/stats');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get chart data
  getChartData: async (type, period = '30d') => {
    const response = await api.get(`/dashboard/charts/${type}`, {
      params: { period },
    });
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await api.get('/dashboard/activities', {
      params: { limit },
    });
    return response.data;
  },

  // Get trends
  getTrends: async (period = '7d') => {
    const response = await api.get('/dashboard/trends', {
      params: { period },
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Get all users
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Get user notifications
  getNotifications: async () => {
    const response = await api.get('/users/notifications');
    return response.data;
  },

  // Mark notification as read
  markNotificationRead: async (id) => {
    const response = await api.patch(`/users/notifications/${id}/read`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create category
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Format date for API
  formatDate: (date) => {
    return new Date(date).toISOString();
  },

  // Create query string from params
  createQueryString: (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  },
};

export default api;
