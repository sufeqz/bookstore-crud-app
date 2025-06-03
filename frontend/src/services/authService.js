import api from './api';

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  async signup(name, email, password) {
    try {
      const response = await api.post('/signup', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Signup failed' };
    }
  }
};
