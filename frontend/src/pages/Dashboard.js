import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCategories: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [booksResponse, categoriesResponse] = await Promise.all([
          bookService.getAllBooks({ limit: 6 }), // Get first 5 books for recent books
          categoryService.getAllCategories()
        ]);

        setStats({
          totalBooks: booksResponse.pagination.totalCount,
          totalCategories: categoriesResponse.pagination.totalCount
        });

        // Show only the books from the response (already limited to 6)
        setRecentBooks(booksResponse.books || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <Navigation />
        <div className="dashboard-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navigation />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to your Book Management System</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{stats.totalBooks}</h3>
              <p>Total Books</p>
            </div>
            <button 
              className="stat-action"
              onClick={() => navigate('/books')}
            >
              View All
            </button>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-info">
              <h3>{stats.totalCategories}</h3>
              <p>Categories</p>
            </div>
            <button 
              className="stat-action"
              onClick={() => navigate('/categories')}
            >
              Manage
            </button>
          </div>
        </div>

        <div className="recent-books">
          <div className="section-header">
            <h2>Recent Books</h2>
            <button 
              className="btn-primary"
              onClick={() => navigate('/books')}
            >
              View All Books
            </button>
          </div>

          {recentBooks.length > 0 ? (
            <div className="books-grid">
              {recentBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <p className="book-category">{book.category?.name || 'No Category'}</p>
                  </div>
                  <div className="book-meta">
                    <span className="book-year">{book.publishedYear || 'Unknown year'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No books found. Start by adding your first book!</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/books')}
              >
                Add First Book
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
