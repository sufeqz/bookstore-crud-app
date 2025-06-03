const express = require('express');
const { 
  getCategories, 
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', authMiddleware, createCategory);
router.patch('/categories/:id', authMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, deleteCategory);

module.exports = router;