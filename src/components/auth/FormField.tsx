import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { LoginCredentials } from '../../types/auth';

interface FormFieldProps {
  label: string;
  name: keyof LoginCredentials;
  type: string;
  register: UseFormRegister<LoginCredentials>;
  error?: string;
}

export function FormField({ label, name, type, register, error }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          type={type}
          {...register(name)}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}