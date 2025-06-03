// 📚 BookList Component - Display and manage books
// This component shows all books with search, pagination, and CRUD operations

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { categoryService } from '../../services/categoryService';
import './Books.css';

const BookList = () => {
  // 📋 State for books data and UI
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(6);

  // 🔄 Load books and categories when component mounts
  useEffect(() => {
    loadBooks();
    loadCategories();
  }, [searchTerm, currentPage]);

  // 📖 Load books from API
  const loadBooks = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: booksPerPage,
      };
      const data = await bookService.getAllBooks(params);
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  // 📂 Load categories for filtering
  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  // 🗑️ Delete book
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await bookService.deleteBook(id);
        await loadBooks(); // Reload the list
        // 🎉 Show success message (you could use a toast library here)
        alert('Book deleted successfully!');
      } catch (err) {
        alert(err.error || 'Failed to delete book');
      }
    }
  };

  // 🔍 Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadBooks();
  };

  // 📄 Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 🎨 Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <div className="books-container">
      {/* 📊 Header */}
      <div className="books-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1>📚 Books Library</h1>
              <p>Manage your book collection</p>
            </div>
            <div className="header-right">
              <Link to="/books/new" className="btn btn-primary">
                ➕ Add New Book
              </Link>
              <Link to="/dashboard" className="btn btn-secondary">
                🏠 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* 🔍 Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="🔍 Search books by title or author..."
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

        {/* ⚠️ Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* 🔄 Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <>
            {/* 📚 Books Grid */}
            {books.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No books found</h3>
                <p>
                  {searchTerm 
                    ? `No books match "${searchTerm}". Try a different search term.`
                    : 'No books in your library yet. Add your first book!'
                  }
                </p>
                <Link to="/books/new" className="btn btn-primary">
                  ➕ Add Your First Book
                </Link>
              </div>
            ) : (
              <div className="books-grid">
                {books.map((book) => (
                  <div key={book.id} className="book-card">
                    <div className="book-card-header">
                      <h3 className="book-title">{book.title}</h3>
                      <span className="book-category">
                        📂 {getCategoryName(book.categoryId)}
                      </span>
                    </div>
                    
                    <div className="book-card-body">
                      <p className="book-author">
                        <strong>👤 Author:</strong> {book.author}
                      </p>
                      <p className="book-price">
                        <strong>💰 Price:</strong> ${book.price}
                      </p>
                      <p className="book-stock">
                        <strong>📦 Stock:</strong> {book.stock} units
                      </p>
                      {book.description && (
                        <p className="book-description">
                          {book.description.length > 100 
                            ? `${book.description.substring(0, 100)}...`
                            : book.description
                          }
                        </p>
                      )}
                    </div>

                    <div className="book-card-footer">
                      <Link 
                        to={`/books/edit/${book.id}`} 
                        className="btn btn-secondary btn-sm"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 📄 Pagination */}
            {books.length > 0 && (
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
                    disabled={books.length < booksPerPage}
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

export default BookList;
