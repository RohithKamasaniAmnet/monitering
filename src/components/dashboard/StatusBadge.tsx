import React from 'react';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: 'running' | 'completed' | 'failed';
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
          'bg-blue-100 text-blue-800': status === 'running',
          'bg-green-100 text-green-800': status === 'completed',
          'bg-red-100 text-red-800': status === 'failed'
        }
      )}
    >
      {status === 'running' && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </span>
  );
}