import React from 'react';
import './CategoryList.css';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <div className="category-list-container">
        <div className="empty-state">
          <div className="empty-icon">🏷️</div>
          <h3>No categories found</h3>
          <p>Create your first category to organize your books!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-list-container">
      <div className="category-list-header">
        <h3>Categories ({categories.length})</h3>
      </div>
      
      <div className="category-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-content">
              <div className="category-header">
                <h4 className="category-name">{category.name}</h4>
                <div className="category-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(category)}
                    title="Edit category"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(category.id)}
                    title="Delete category"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {category.description && (
                <div className="category-description">
                  <p>{category.description}</p>
                </div>
              )}

              <div className="category-meta">
                <span className="category-id">ID: {category.id}</span>
                {category._count?.books !== undefined && (
                  <span className="book-count">
                    {category._count.books} book{category._count.books !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
