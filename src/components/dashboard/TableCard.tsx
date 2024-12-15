import React from 'react';
import { Link } from 'react-router-dom';
import { TableType } from '../../types/cron';

interface TableCardProps {
  type: TableType;
  description: string;
  icon: string;
}

export function TableCard({ type, description, icon }: TableCardProps) {
  return (
    <Link
      to={`/table/${type.toLowerCase()}`}
      className="block p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-primary-300 group"
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {type}
        </h3>
      </div>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 flex items-center text-primary-600 font-medium">
        View Details
        <svg
          className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}