import React, { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import { categoryService } from '../services/categoryService';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20
  });

  const fetchCategories = useCallback(async (page = 1) => {
    try {
      setSearchLoading(true);
      setError('');
      
      const params = {
        page,
        limit: pagination.limit,
        includeBooksCount: 'true',
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await categoryService.getAllCategories(params);
      
      // Extract categories and pagination from response
      const categoriesData = response.categories || [];
      const paginationData = response.pagination || {};
      
      setCategories(categoriesData);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(`Failed to load categories: ${error.response?.data?.error || error.message}`);
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  }, [searchTerm, pagination.limit]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCategories();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchCategories]);

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      setShowForm(false);
      setError('');
      setSuccessMessage(`Category "${response.name}" created successfully!`);
      
      // Refresh the categories list to show the new category
      fetchCategories(pagination.currentPage);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
      setSuccessMessage('');
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const response = await categoryService.updateCategory(editingCategory.id, categoryData);
      setEditingCategory(null);
      setShowForm(false);
      setError('');
      setSuccessMessage(`Category "${response.name}" updated successfully!`);
      
      // Refresh the categories list to show the updated category
      fetchCategories(pagination.currentPage);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
      setSuccessMessage('');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      // Find the category being deleted to get its name for the success message
      const categoryToDelete = categories.find(category => category.id === categoryId);
      await categoryService.deleteCategory(categoryId);
      setError('');
      
      if (categoryToDelete) {
        setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully!`);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }

      // Refresh the categories list from server
      fetchCategories(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. It may be in use by some books.');
      setSuccessMessage('');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handlePageChange = (newPage) => {
    fetchCategories(newPage);
  };

  if (loading) {
    return (
      <div className="categories-page">
        <Navigation />
        <div className="categories-content">
          <div className="loading">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <Navigation />
      <div className="categories-content">
        <div className="categories-header">
          <div className="header-left">
            <h1>Categories Management</h1>
            <p>Organize your books by categories</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add New Category
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
            <button onClick={() => setSuccessMessage('')}>×</button>
          </div>
        )}

        <div className="categories-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            onCancel={handleCancelForm}
          />
        )}

        {searchLoading && (
          <div className="search-loading">
            Searching...
          </div>
        )}

        <CategoryList
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages} 
              ({pagination.totalCount} total categories)
            </span>
            
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
