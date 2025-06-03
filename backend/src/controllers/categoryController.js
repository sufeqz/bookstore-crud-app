// 🏷️ Category Controller
// Handles category management for books

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 📋 Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { books: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// ➕ Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // ✅ Validation
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // 🔍 Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    // 🏷️ Create category
    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

module.exports = {
  getCategories,
  createCategory
};