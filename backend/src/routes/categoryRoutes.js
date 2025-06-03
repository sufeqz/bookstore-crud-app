// 🏷️ Category Routes
// Handles category management for books

const express = require('express');
const { 
  getCategories, 
  createCategory 
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 📋 GET /api/categories - Get all categories (public)
router.get('/categories', getCategories);

// ➕ POST /api/categories - Create a new category (authenticated)
router.post('/categories', authMiddleware, createCategory);

module.exports = router;