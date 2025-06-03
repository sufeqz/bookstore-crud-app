import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard">
            📚 BookManager
          </Link>
        </div>

        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </Link>
          <Link 
            to="/books" 
            className={`nav-link ${isActive('/books') ? 'active' : ''}`}
          >
            <span className="nav-icon">📖</span>
            Books
          </Link>
          <Link 
            to="/categories" 
            className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏷️</span>
            Categories
          </Link>
        </div>

        <div className="nav-user">
          <span className="user-greeting">
            Hello, {user?.name || user?.email || 'User'}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
