import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const [booksResponse, categoriesResponse] = await Promise.all([
        bookService.getBooks(),
        categoryService.getCategories()
      ]);
      
      console.log('Books response:', booksResponse);
      console.log('Categories response:', categoriesResponse);
      
      setBooks(booksResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(`Failed to load books and categories: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (bookData) => {
    try {
      const response = await bookService.createBook(bookData);
      setBooks([...books, response.data]);
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error creating book:', error);
      setError('Failed to create book');
    }
  };

  const handleUpdateBook = async (bookData) => {
    try {
      const response = await bookService.updateBook(editingBook.id, bookData);
      setBooks(books.map(book => 
        book.id === editingBook.id ? response.data : book
      ));
      setEditingBook(null);
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Failed to update book');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookService.deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
      setError('');
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book');
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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || book.categoryId === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

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

        <div className="books-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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

        <BookList
          books={filteredBooks}
          categories={categories}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
        />
      </div>
    </div>
  );
};

export default Books;
