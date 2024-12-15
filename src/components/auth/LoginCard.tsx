import React from 'react';
import { LoginForm } from './LoginForm';
import type { LoginCredentials } from '../../types/auth';

interface LoginCardProps {
  onSubmit: (data: LoginCredentials) => void;
  isLoading: boolean;
}

export function LoginCard({ onSubmit, isLoading }: LoginCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="text-4xl">⏰</span>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cron Monitor
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to monitor your cron jobs
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}