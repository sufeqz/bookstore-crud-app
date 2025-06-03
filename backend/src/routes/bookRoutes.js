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

router.get('/books', authMiddleware, getBooks);
router.get('/books/:id', authMiddleware, getBook);
router.post('/books', authMiddleware, createBook);
router.patch('/books/:id', authMiddleware, updateBook);
router.delete('/books/:id', authMiddleware, deleteBook);

module.exports = router;
