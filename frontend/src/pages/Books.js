import React, { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For controlled input
  const [filterCategory, setFilterCategory] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10
  });

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await categoryService.getCategories({ limit: 100 });
      const categoriesData = categoriesResponse.data?.categories || categoriesResponse.data || [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchBooks = useCallback(async (page = 1) => {
    try {
      setSearchLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const params = {
        page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory && { categoryId: filterCategory })
      };
      
      console.log('Fetching books with params:', params);
      
      const booksResponse = await bookService.getAllBooks(params);
      
      console.log('Books response:', booksResponse);
      
      // Extract books and pagination from response
      const booksData = booksResponse.books || [];
      const paginationData = booksResponse.pagination || {};
      
      // Filter out any invalid book entries
      const validBooks = booksData.filter(book => book && book.id && book.title && book.author);
      
      setBooks(validBooks);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching books:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(`Failed to load books: ${error.response?.data?.error || error.message}`);
    } finally {
      setSearchLoading(false);
      setLoading(false);
    }
  }, [searchTerm, filterCategory, pagination.limit]);

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, [fetchBooks]);

  // Remove the auto-search effect - now only search on button click or enter
  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const handleCreateBook = async (bookData) => {
    try {
      const response = await bookService.createBook(bookData);
      // Ensure the response is a valid book object
      if (response && response.id && response.title && response.author) {
        setShowForm(false);
        setError('');
        setSuccessMessage(`Book "${response.title}" added successfully!`);
        
        // Refresh the books list to show the new book
        fetchBooks(pagination.currentPage);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        console.error('Invalid book response:', response);
        setError('Book was created but response format is invalid');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      setError('Failed to create book');
      setSuccessMessage('');
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      const response = await bookService.updateBook(editingBook.id, bookData);
      // Ensure the response is a valid book object
      if (response && response.id && response.title && response.author) {
        setEditingBook(null);
        setShowForm(false);
        setError('');
        setSuccessMessage(`Book "${response.title}" updated successfully!`);
        
        // Refresh the books list to show the updated book
        fetchBooks(pagination.currentPage);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        console.error('Invalid book update response:', response);
        setError('Book was updated but response format is invalid');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Failed to update book');
      setSuccessMessage('');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      // Find the book being deleted to get its title for the success message
      const bookToDelete = books.find(book => book.id === bookId);
      await bookService.deleteBook(bookId);
      setError('');
      
      if (bookToDelete) {
        setSuccessMessage(`Book "${bookToDelete.title}" deleted successfully!`);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }

      // Refresh the books list from server
      fetchBooks(pagination.currentPage);
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book');
      setSuccessMessage('');
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  const handlePageChange = (newPage) => {
    fetchBooks(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      currentPage: 1 // Reset to first page when changing limit
    }));
    // The useEffect will trigger fetchBooks automatically due to pagination.limit change
  };

  if (loading) {
    return (
      <div className="books-page">
        <Navigation />
        <div className="books-content">
          <div className="loading">Loading books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page">
      <Navigation />
      <div className="books-content">
        <div className="books-header">
          <div className="header-left">
            <h1>Books Management</h1>
            <p>Manage your book collection</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add New Book
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

        <div className="books-filters">
          <div className="search-box">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="search-input"
              />
              <div className="search-buttons">
                <button 
                  type="button"
                  onClick={handleSearch}
                  className="search-btn"
                  title="Search"
                >
                  🔍
                </button>
                {(searchInput || searchTerm) && (
                  <button 
                    type="button"
                    onClick={handleClearSearch}
                    className="clear-btn"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="filter-box">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showForm && (
          <BookForm
            book={editingBook}
            categories={categories}
            onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
            onCancel={handleCancelForm}
          />
        )}

        {searchLoading && (
          <div className="search-loading">
            Searching...
          </div>
        )}

        <BookList
          books={books}
          categories={categories}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />

        {/* Page Size and Pagination Controls */}
        {pagination.totalCount > 0 && (
          <div className="pagination-container">
            <div className="page-size-selector">
              <label htmlFor="page-size">Items per page:</label>
              <select
                id="page-size"
                value={pagination.limit}
                onChange={(e) => handleLimitChange(e.target.value)}
                className="page-size-select"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

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
                  ({pagination.totalCount} total books)
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
        )}
      </div>
    </div>
  );
};

export default Books;
