// 📂 Categories Service - All category-related API calls

import api from './api';

export const categoryService = {
  // 📂 Get all categories with search and pagination
  getAllCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch categories' };
    }
  },

  // 📂 Get single category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch category' };
    }
  },

  // ➕ Create new category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create category' };
    }
  },

  // ✏️ Update category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.patch(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update category' };
    }
  },

  // 🗑️ Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete category' };
    }
  },
};
