// 🏠 Dashboard Component - Main page after login

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      {/* 📊 Header with user info and logout */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📚 BookStore Dashboard</h1>
            <p>Welcome back, {user?.name}! 👋</p>
          </div>
          <div className="header-right">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* 🎯 Main dashboard content */}
      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* 📖 Books Section */}
          <div className="dashboard-card">
            <div className="card-icon">📖</div>
            <h2>Manage Books</h2>
            <p>Add, edit, delete and search through your book collection</p>
            <div className="card-actions">
              <Link to="/books" className="primary-button">
                📚 View Books
              </Link>
              <Link to="/books/new" className="secondary-button">
                ➕ Add Book
              </Link>
            </div>
          </div>

          {/* 📂 Categories Section */}
          <div className="dashboard-card">
            <div className="card-icon">📂</div>
            <h2>Manage Categories</h2>
            <p>Organize your books by creating and managing categories</p>
            <div className="card-actions">
              <Link to="/categories" className="primary-button">
                📂 View Categories
              </Link>
              <Link to="/categories/new" className="secondary-button">
                ➕ Add Category
              </Link>
            </div>
          </div>

          {/* 📊 Stats Section */}
          <div className="dashboard-card stats-card">
            <div className="card-icon">📊</div>
            <h2>Quick Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">📖</span>
                <span className="stat-label">Books</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">📂</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
            <p className="stats-note">* Data will load from your API</p>
          </div>

          {/* 🔍 Quick Actions */}
          <div className="dashboard-card">
            <div className="card-icon">🔍</div>
            <h2>Quick Search</h2>
            <p>Quickly find books or categories using our search feature</p>
            <div className="search-shortcuts">
              <Link to="/books?search=" className="search-link">
                🔍 Search Books
              </Link>
              <Link to="/categories?search=" className="search-link">
                🔍 Search Categories
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
