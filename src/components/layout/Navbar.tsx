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
              <span className="font-bold text-xl text-primary-600">Cron Monitor</span>
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
                {/* Prod Pipeline */}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* <button
              onClick={toggleTimezone}
              className="flex items-center px-4 py-2 rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100"
            >
              <span className="mr-2">🌐</span>
              {timezone === 'CST' ? 'CST' : 'IST'}
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}