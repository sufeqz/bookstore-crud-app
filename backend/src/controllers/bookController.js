// 📚 Book Controller
// Handles all book CRUD operations

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 📋 Get all books for the authenticated user
const getBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: { userId: req.user.id },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

// 👁️ Get a specific book
const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id // Ensure user can only access their own books
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

// ➕ Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, description, price, categoryId } = req.body;

    // ✅ Validation
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

// ✏️ Update a book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, price, categoryId } = req.body;

    // 🔍 Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      }
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // ✅ Validation for provided fields
    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price cannot be negative' });
    }

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(categoryId) }
      });
      if (!category) {
        return res.status(400).json({ error: 'Invalid category' });
      }
    }

    // 📝 Update book
    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(categoryId && { categoryId: parseInt(categoryId) })
      },
      include: {
        category: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json(updatedBook);
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
};

// 🗑️ Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check if book exists and belongs to user
    const existingBook = await prisma.book.findFirst({
      where: { 
        id: parseInt(id),
        userId: req.user.id 
      }
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
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