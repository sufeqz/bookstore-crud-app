import api from './api';

export const bookService = {
  async getBooks(params = {}) {
    try {
      const response = await api.get('/books', { params });
      return { data: response.data.books || [] };
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch books' };
    }
  },

  async getAllBooks(params = {}) {
    try {
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch books' };
    }
  },

  async getBook(id) {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch book' };
    }
  },

  async createBook(bookData) {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create book' };
    }
  },

  async updateBook(id, bookData) {
    try {
      const response = await api.patch(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update book' };
    }
  },

  async deleteBook(id) {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete book' };
    }
  }
};
