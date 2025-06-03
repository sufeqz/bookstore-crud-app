import React from 'react';
import './BookList.css';

const BookList = ({ books, categories, onEdit, onDelete }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'No Category';
  };

  if (books.length === 0) {
    return (
      <div className="book-list-container">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No books found</h3>
          <p>Start building your library by adding your first book!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h3>Books ({books.length})</h3>
      </div>
      
      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-content">
              <div className="book-header">
                <h4 className="book-title">{book.title}</h4>
                <div className="book-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => onEdit(book)}
                    title="Edit book"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => onDelete(book.id)}
                    title="Delete book"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="book-details">
                <p className="book-author">
                  <span className="label">Author:</span> {book.author}
                </p>
                {book.description && (
                  <p className="book-description">
                    <span className="label">Description:</span> {book.description}
                  </p>
                )}
                <p className="book-price">
                  <span className="label">Price:</span> ${book.price}
                </p>
                {book.publishedYear && (
                  <p className="book-year">
                    <span className="label">Published:</span> {book.publishedYear}
                  </p>
                )}
                <p className="book-category">
                  <span className="label">Category:</span>
                  <span className="category-tag">
                    {getCategoryName(book.categoryId)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
