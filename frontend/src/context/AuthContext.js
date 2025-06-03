// 🔄 Authentication Context - Manages login state across the entire app
// Think of this as a "global storage" for user info that any component can access

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

// 📦 Create the context
const AuthContext = createContext();

// 🎣 Custom hook to use auth context - makes it easy to access from any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 🛡️ AuthProvider component - wraps our entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Check if user is logged in when app starts
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // 🔑 Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 📝 Signup function
  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 🚪 Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // 📋 Values available to all components
  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  // 🎁 Provide the auth context to all children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
