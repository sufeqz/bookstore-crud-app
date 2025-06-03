// 📚 Book Routes
// Handles all book CRUD operations

const express = require('express');
const { 
  getBooks, 
  getBook, 
  createBook, 
  updateBook, 
  deleteBook 
} = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 📋 GET /api/books - Get all books for the authenticated user
router.get('/books', authMiddleware, getBooks);

// 👁️ GET /api/books/:id - Get a specific book
router.get('/books/:id', authMiddleware, getBook);

// ➕ POST /api/books - Create a new book
router.post('/books', authMiddleware, createBook);

// ✏️ PUT /api/books/:id - Update a book
router.put('/books/:id', authMiddleware, updateBook);

// 🗑️ DELETE /api/books/:id - Delete a book
router.delete('/books/:id', authMiddleware, deleteBook);

module.exports = router;
