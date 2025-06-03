// Main App Component - The heart of our React application!
// This sets up routing and provides authentication context to all components

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Pages
import Dashboard from './pages/Dashboard';

// Book Components
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';

// Category Components
import CategoryList from './components/categories/CategoryList';
import CategoryForm from './components/categories/CategoryForm';

// Global styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes - anyone can access */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes - only logged in users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Book routes */}
            <Route 
              path="/books" 
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/books/new" 
              element={
                <ProtectedRoute>
                  <BookForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/books/edit/:id" 
              element={
                <ProtectedRoute>
                  <BookForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Category routes */}
            <Route 
              path="/categories" 
              element={
                <ProtectedRoute>
                  <CategoryList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories/new" 
              element={
                <ProtectedRoute>
                  <CategoryForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/categories/edit/:id" 
              element={
                <ProtectedRoute>
                  <CategoryForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
