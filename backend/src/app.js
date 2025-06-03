// 🚀 Main Express Application Setup
// This is the heart of our backend - sets up all routes and middleware

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Create Express app
const app = express();
const prisma = new PrismaClient();

// Make prisma available globally
app.locals.prisma = prisma;

// 🛡️ Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend to connect
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Express 5.x specific settings
app.set('trust proxy', false);
app.set('x-powered-by', false);

// 📊 Routes
app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', categoryRoutes);

// 🏠 Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ BookStore API is running!' });
});

// 🚫 404 handler
app.all('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// 🚨 Error handler
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  
  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;