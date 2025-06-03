// 📚 Book Controller
// Handles all book CRUD operations

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 📋 Get all books for the authenticated user with pagination and search
const getBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page
    const skip = (pageNum - 1) * limitNum;

    // 🔍 Build search conditions (removed userId filter - show all books to all users)
    const whereConditions = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(category && {
        category: { name: { contains: category, mode: 'insensitive' } }
      })
    };

    const [books, totalCount] = await Promise.all([
      prisma.book.findMany({
        where: whereConditions,
        include: {
          category: true,
          user: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum
      }),
      prisma.book.count({ where: whereConditions })
    ]);

    // 📊 Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.json({
      books,
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
        category,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { 
        id: parseInt(id)
        // Removed userId filter - allow any user to view any book
      },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};


const createBook = async (req, res) => {
  try {
    const { title, author, description, price, categoryId } = req.body;

    
    if (!title || !author || !price || !categoryId) {
      return res.status(400).json({ 
        error: 'Title, author, price, and category are required' 
      });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' });
    }

    // 🔍 Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId) }
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // 📚 Create book
    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        price: parseFloat(price),
        userId: req.user.id,
        categoryId: parseInt(categoryId)
      },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
};

// ✏️ Update a book (PATCH - partial update)
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 🔍 Check if book exists and belongs to user (only owner can update)
    const existingBook = await prisma.book.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      }
    });

    if (!existingBook) {
      return res.status(404).json({ 
        error: 'Book not found or you are not authorized to update this book' 
      });
    }

    // 🧹 Remove undefined/null values and prepare update object
    const fieldsToUpdate = {};
    
    // Only include fields that are provided and not empty
    if (updateData.title !== undefined && updateData.title.trim() !== '') {
      fieldsToUpdate.title = updateData.title.trim();
    }
    
    if (updateData.author !== undefined && updateData.author.trim() !== '') {
      fieldsToUpdate.author = updateData.author.trim();
    }
    
    if (updateData.description !== undefined) {
      fieldsToUpdate.description = updateData.description ? updateData.description.trim() : null;
    }
    
    if (updateData.price !== undefined) {
      const price = parseFloat(updateData.price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Price must be a valid positive number' });
      }
      fieldsToUpdate.price = price;
    }
    
    if (updateData.categoryId !== undefined) {
      const categoryId = parseInt(updateData.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: 'Category ID must be a valid number' });
      }
      
      // Verify category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      fieldsToUpdate.categoryId = categoryId;
    }

    // 🚫 Check if there are any fields to update
    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // 🔍 Check for duplicate title/author combination (if title or author is being updated)
    if (fieldsToUpdate.title || fieldsToUpdate.author) {
      const titleToCheck = fieldsToUpdate.title || existingBook.title;
      const authorToCheck = fieldsToUpdate.author || existingBook.author;
      
      const duplicateBook = await prisma.book.findFirst({
        where: {
          title: titleToCheck,
          author: authorToCheck,
          id: { not: parseInt(id) } // Exclude current book
        }
      });
      
      if (duplicateBook) {
        return res.status(400).json({ 
          error: 'A book with this title and author already exists' 
        });
      }
    }

    // 📝 Update book with only the provided fields
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: fieldsToUpdate,
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      message: 'Book updated successfully',
      book: updatedBook,
      updatedFields: Object.keys(fieldsToUpdate)
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

// 🗑️ Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check if book exists and belongs to user (only owner can delete)
    const existingBook = await prisma.book.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      }
    });

    if (!existingBook) {
      return res.status(404).json({ 
        error: 'Book not found or you are not authorized to delete this book' 
      });
    }

    // 🗑️ Delete book
    await prisma.book.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};