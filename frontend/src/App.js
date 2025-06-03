// 🚀 Main App Component - The heart of our React application!
// This sets up routing and provides authentication context to all components

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// 📝 Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// 📊 Pages
import Dashboard from './pages/Dashboard';

// 🎨 Global styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 🏠 Public routes - anyone can access */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* 🛡️ Protected routes - only logged in users */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* 🔄 Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 🚫 Catch all route - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
