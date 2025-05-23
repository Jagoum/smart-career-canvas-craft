
import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { user, isLoading } = useAuth();
  
  // If user is already authenticated, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
