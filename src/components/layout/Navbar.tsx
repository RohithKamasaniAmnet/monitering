import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTimezone } from '../../hooks/useTimezone';

export function Navbar() {
  const location = useLocation();
  const { timezone, toggleTimezone } = useTimezone();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl mr-2">⏰</span>
              <span className="font-bold text-xl text-primary-600">Scheduling Monitor</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/prod-pipeline"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/prod-pipeline'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Prod Pipeline
              </Link>
            </div>
          </div>

          {/* Company Name moved to the right */}
          <div className="flex items-center ml-auto">
            <div className="relative group">
              <span className="font-semibold text-lg text-gray-800 cursor-pointer transition duration-300 ease-in-out group-hover:text-primary-600">
                Amnet Digital
              </span>
              {/* Show quote on hover of Amnet Digital only */}
              <div className="absolute top-8 right-0 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out bg-gray-50 text-gray-800 p-4 rounded-lg shadow-lg z-10 pointer-events-none">
                <p className="text-sm font-medium">
                  "Efficiency is doing things right; development is doing the right things."
                </p>
                <p className="mt-1 text-xs text-gray-500">- Amnet Digital</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
