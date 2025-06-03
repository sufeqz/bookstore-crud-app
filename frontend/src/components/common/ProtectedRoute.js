// 🛡️ Protected Route - Only allows authenticated users
// This is a wrapper component that checks if user is logged in

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // 🔄 Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem'
      }}>
        🔄 Loading...
      </div>
    );
  }

  // 🚫 Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Render protected content if authenticated
  return children;
};

export default ProtectedRoute;
