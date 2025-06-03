// 🔐 Authentication Routes
// Handles user signup and login endpoints

const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// 📝 POST /api/signup - Create new user account
router.post('/signup', signup);

// 🔑 POST /api/login - User login
router.post('/login', login);

module.exports = router;
