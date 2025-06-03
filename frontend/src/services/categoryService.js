import api from './api';

export const categoryService = {
  async getCategories(params = {}) {
    try {
      const response = await api.get('/categories', { params });
      return { data: response.data.categories || [] };
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch categories' };
    }
  },

  async getAllCategories(params = {}) {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch categories' };
    }
  },

  async getCategory(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch category' };
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create category' };
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await api.patch(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update category' };
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete category' };
    }
  }
};
