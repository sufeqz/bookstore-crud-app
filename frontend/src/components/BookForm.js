import React, { useState, useEffect } from 'react';
import './BookForm.css';

const BookForm = ({ book, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        publishedYear: book.publishedYear || '',
        categoryId: book.categoryId || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.publishedYear) {
      newErrors.publishedYear = 'Published year is required';
    } else if (formData.publishedYear < 1000 || formData.publishedYear > new Date().getFullYear()) {
      newErrors.publishedYear = 'Please enter a valid year';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
        categoryId: parseInt(formData.categoryId)
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-overlay">
      <div className="book-form-container">
        <div className="book-form-header">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter book title"
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className={errors.author ? 'error' : ''}
              placeholder="Enter author name"
            />
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="publishedYear">Published Year *</label>
            <input
              type="number"
              id="publishedYear"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              className={errors.publishedYear ? 'error' : ''}
              placeholder="Enter published year"
              min="1000"
              max={new Date().getFullYear()}
            />
            {errors.publishedYear && <span className="error-text">{errors.publishedYear}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
