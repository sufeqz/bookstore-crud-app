// 📝 BookForm Component - Add and edit books
// This component handles both creating new books and editing existing ones

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import './Books.css';

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get book ID from URL (for editing)
  const isEditing = !!id; // True if we're editing, false if creating

  // 📋 Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🔄 Load data when component mounts
  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadBook();
    }
  }, [id, isEditing]);

  // 📂 Load categories for dropdown
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // 📖 Load book data for editing
  const loadBook = async () => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(parseInt(id));
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        price: book.price.toString(),
        stock: book.stock.toString(),
        categoryId: book.categoryId?.toString() || '',
      });
    } catch (err) {
      setError(err.error || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  // 📝 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.author.trim()) {
      setError('Author is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      setError('Please enter a valid stock quantity');
      return false;
    }
    return true;
  };

  // 🚀 Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // 🔧 Prepare data for API
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
      };

      if (isEditing) {
        // ✏️ Update existing book
        await bookService.updateBook(parseInt(id), bookData);
        setSuccess('Book updated successfully!');
      } else {
        // ➕ Create new book
        await bookService.createBook(bookData);
        setSuccess('Book created successfully!');
      }

      // 🎉 Redirect after success
      setTimeout(() => {
        navigate('/books');
      }, 1500);

    } catch (err) {
      setError(err.error || `Failed to ${isEditing ? 'update' : 'create'} book`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading book data...</p>
      </div>
    );
  }

  return (
    <div className="book-form-container">
      <div className="container">
        {/* 📊 Header */}
        <div className="form-header">
          <h1>{isEditing ? '✏️ Edit Book' : '➕ Add New Book'}</h1>
          <p>{isEditing ? 'Update book information' : 'Add a new book to your library'}</p>
          <Link to="/books" className="btn btn-secondary">
            ← Back to Books
          </Link>
        </div>

        {/* 📝 Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="book-form">
            {/* ⚠️ Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="form-row">
              {/* 📖 Title */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  📖 Book Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  className="form-control"
                  required
                />
              </div>

              {/* 👤 Author */}
              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  👤 Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              {/* 💰 Price */}
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  💰 Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="form-control"
                  required
                />
              </div>

              {/* 📦 Stock */}
              <div className="form-group">
                <label htmlFor="stock" className="form-label">
                  📦 Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="form-control"
                  required
                />
              </div>

              {/* 📂 Category */}
              <div className="form-group">
                <label htmlFor="categoryId" className="form-label">
                  📂 Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 📄 Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                📄 Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description (optional)"
                className="form-control"
                rows="4"
              />
            </div>

            {/* 🔘 Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? '✅ Update Book' : '➕ Create Book'
                )}
              </button>
              
              <Link to="/books" className="btn btn-secondary btn-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
