import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Si todavía está consultando a Firebase/Supabase, mostramos una carga
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-itec-bg">
        <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no está autenticado, lo mandamos a que inicie sesión
  if (!isAuthenticated) {
    return <Navigate to="/perfil" replace />;
  }

  // Si está autenticado, renderizamos la página que pidió
  return <>{children}</>;
};