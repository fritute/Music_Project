import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;