import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { categoryService } from '../services/categoryService';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      setCategories([...categories, response.data]);
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const response = await categoryService.updateCategory(editingCategory.id, categoryData);
      setCategories(categories.map(category => 
        category.id === editingCategory.id ? response.data : category
      ));
      setEditingCategory(null);
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(category => category.id !== categoryId));
      setError('');
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category. It may be in use by some books.');
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

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

        <CategoryList
          categories={filteredCategories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </div>
    </div>
  );
};

export default Categories;
