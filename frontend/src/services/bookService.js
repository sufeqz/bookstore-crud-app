// Books Service - All book-related API calls
// This mirrors your bookService.js but makes HTTP requests instead of database calls

import api from './api';

export const bookService = {
  // Get all books with search and pagination
  getAllBooks: async (params = {}) => {
    try {
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch books' };
    }
  },

  // Get single book by ID
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch book' };
    }
  },

  // Create new book
  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create book' };
    }
  },

  // Update book
  updateBook: async (id, bookData) => {
    try {
      const response = await api.patch(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update book' };
    }
  },

  // Delete book
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete book' };
    }
  },
};
