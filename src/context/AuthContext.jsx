// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Demo users for testing
  const demoUsers = [
    { email: 'admin@spendwise.com', password: 'demo123', name: 'Admin User', role: 'admin' },
    { email: 'sarah@example.com', password: 'demo123', name: 'Sarah Johnson', role: 'user' }
  ];

  // Login function
  const login = (email, password) => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check demo accounts (any password works for demo)
        const user = demoUsers.find(u => u.email === email);
        if (user) {
          setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid email or password'));
        }
        setLoading(false);
      }, 1000);
    });
  };

  // Signup function
  const signup = (email, password, name) => {
    setLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = demoUsers.find(u => u.email === email);
        if (existingUser) {
          reject(new Error('Email already exists'));
        } else {
          const newUser = { email, name, role: 'user' };
          setCurrentUser(newUser);
          resolve(newUser);
        }
        setLoading(false);
      }, 1000);
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}