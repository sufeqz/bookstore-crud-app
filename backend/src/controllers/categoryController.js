// 🏷️ Category Controller
// Handles category management for books

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const getCategories = async (req, res) => {
  try {
 
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
      includeBooksCount = 'true'
    } = req.query;


    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    const whereConditions = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        where: whereConditions,
        include: includeBooksCount === 'true' ? {
          _count: {
            select: { books: true }
          }
        } : undefined,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum
      }),
      prisma.category.count({ where: whereConditions })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      categories,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        search,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const trimmedName = name.trim();

    const existingCategory = await prisma.category.findUnique({
      where: { name: trimmedName }
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        description: description ? description.trim() : null
      }
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { books: true }
        },
        books: {
          select: {
            id: true,
            title: true,
            author: true,
            price: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10 // Limit to 10 recent books
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // 🧹 Prepare update object
    const fieldsToUpdate = {};
    
    if (updateData.name !== undefined && updateData.name.trim() !== '') {
      const trimmedName = updateData.name.trim();
      
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: trimmedName,
          id: { not: parseInt(id) }
        }
      });
      
      if (duplicateCategory) {
        return res.status(400).json({ 
          error: 'A category with this name already exists' 
        });
      }
      
      fieldsToUpdate.name = trimmedName;
    }
    
    if (updateData.description !== undefined) {
      fieldsToUpdate.description = updateData.description ? updateData.description.trim() : null;
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: fieldsToUpdate,
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    res.json({
      message: 'Category updated successfully',
      category: updatedCategory,
      updatedFields: Object.keys(fieldsToUpdate)
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { books: true }
        }
      }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (existingCategory._count.books > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. It has ${existingCategory._count.books} book(s) associated with it.`,
        booksCount: existingCategory._count.books
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json({ 
      message: 'Category deleted successfully',
      deletedCategory: {
        id: existingCategory.id,
        name: existingCategory.name
      }
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};