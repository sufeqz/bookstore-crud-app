// 🔐 Authentication Service - All login/signup logic
// This is like your authService.js in the backend but for frontend

import api from './api';

export const authService = {
  // 📝 User signup
  signup: async (userData) => {
    try {
      const response = await api.post('/signup', userData);
      
      // If successful, save token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Signup failed' };
    }
  },

  // 🔑 User login
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      
      // Save token and user data to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // 🚪 User logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // 👤 Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 🔍 Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
