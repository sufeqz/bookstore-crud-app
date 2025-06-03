// 🛡️ Authentication Middleware
// Protects routes by verifying JWT tokens

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

const authMiddleware = async (req, res, next) => {
  try {
    // 🔍 Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 🎟️ Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 👤 Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true } // Don't include password
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    // 📎 Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;