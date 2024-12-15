import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { LoginCard } from '../components/auth/LoginCard';
import { login } from '../api/auth';
import type { LoginCredentials } from '../types/auth';

export function LoginPage() {
  const navigate = useNavigate();
  
  const mutation = useMutation(login, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Invalid username or password');
    },
  });

  const handleSubmit = (credentials: LoginCredentials) => {
    mutation.mutate(credentials);
  };

  return <LoginCard onSubmit={handleSubmit} isLoading={mutation.isLoading} />;
}