// 🌐 API Configuration - This handles all communication with your backend
// Think of this as the "messenger" between frontend and backend

import axios from 'axios';

// 📍 Base URL - where your backend server is running
const API_BASE_URL = 'http://localhost:8000/api';

// 🛠️ Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request interceptor - automatically adds JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where we'll store it after login)
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

// 📤 Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
