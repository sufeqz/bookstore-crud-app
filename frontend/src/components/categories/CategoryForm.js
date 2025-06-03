// CategoryForm Component - Add and edit categories
// This component handles both creating new categories and editing existing ones

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import './Categories.css';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get category ID from URL (for editing)
  const isEditing = !!id; // True if we're editing, false if creating

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load data when component mounts
  useEffect(() => {
    if (isEditing) {
      loadCategory();
    }
  }, [id, isEditing]);

  // Load category data for editing
  const loadCategory = async () => {
    try {
      setLoading(true);
      const category = await categoryService.getCategoryById(parseInt(id));
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } catch (err) {
      setError(err.error || 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      if (isEditing) {
        // Update existing category
        await categoryService.updateCategory(parseInt(id), categoryData);
        setSuccess('Category updated successfully!');
      } else {
        // Create new category
        await categoryService.createCategory(categoryData);
        setSuccess('Category created successfully!');
      }

      // Redirect after success
      setTimeout(() => {
        navigate('/categories');
      }, 1500);

    } catch (err) {
      setError(err.error || `Failed to ${isEditing ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading category data...</p>
      </div>
    );
  }

  return (
    <div className="category-form-container">
      <div className="container">
        {/* Header */}
        <div className="form-header">
          <h1>{isEditing ? 'Edit Category' : 'Add New Category'}</h1>
          <p>{isEditing ? 'Update category information' : 'Create a new category for your books'}</p>
          <Link to="/categories" className="btn btn-secondary">
            &larr; Back to Categories
          </Link>
        </div>

        {/* Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="category-form">
            {/* Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                className="form-control"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description (optional)"
                className="form-control"
                rows="4"
              />
            </div>

            {/* Submit Button */}
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
                  isEditing ? 'Update Category' : 'Create Category'
                )}
              </button>
              
              <Link to="/categories" className="btn btn-secondary btn-lg">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
