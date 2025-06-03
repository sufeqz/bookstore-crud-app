// CategoryList Component - Display and manage categories
// This component shows all categories with search, pagination, and CRUD operations

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import './Categories.css';

const CategoryList = () => {
  // State for categories data and UI
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(8);

  // Load categories when component mounts
  useEffect(() => {
    loadCategories();
  }, [searchTerm, currentPage]);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: categoriesPerPage,
      };
      const data = await categoryService.getAllCategories(params);
      setCategories(data);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await categoryService.deleteCategory(id);
        await loadCategories(); // Reload the list
        alert('Category deleted successfully!');
      } catch (err) {
        alert(err.error || 'Failed to delete category');
      }
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadCategories();
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="categories-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>Categories</h1>
              <p>Manage your book categories</p>
            </div>
            <div className="header-right">
              <Link to="/categories/new" className="btn btn-primary">
                Add New Category
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search categories by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control search-input"
              />
              <button type="submit" className="btn btn-primary search-btn">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            {categories.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h3>No categories found</h3>
                <p>
                  {searchTerm 
                    ? `No categories match "${searchTerm}". Try a different search term.`
                    : 'No categories created yet. Add your first category!'
                  }
                </p>
                <Link to="/categories/new" className="btn btn-primary">
                  Add Your First Category
                </Link>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div key={category.id} className="category-card">
                    <div className="category-card-header">
                      <h3 className="category-name">{category.name}</h3>
                    </div>
                    
                    <div className="category-card-body">
                      {category.description && (
                        <p className="category-description">
                          {category.description.length > 100 
                            ? `${category.description.substring(0, 100)}...`
                            : category.description
                          }
                        </p>
                      )}
                      <p className="category-meta">
                        <small>Created: {new Date(category.createdAt).toLocaleDateString()}</small>
                      </p>
                    </div>

                    <div className="category-card-footer">
                      <Link 
                        to={`/categories/edit/${category.id}`} 
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {categories.length > 0 && (
              <div className="pagination-container">
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                  >
                    ← Previous
                  </button>
                  
                  <span className="page-info">
                    Page {currentPage}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={categories.length < categoriesPerPage}
                    className="btn btn-secondary"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
