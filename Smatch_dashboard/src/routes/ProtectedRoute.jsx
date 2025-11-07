import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');

  console.log('ProtectedRoute - Token:', token, 'Email:', email); // Debug

  if (!token || email?.toLowerCase() !== 'lina@gmail.com') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;