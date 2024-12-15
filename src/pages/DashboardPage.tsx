import React from 'react';
import { TableCard } from '../components/dashboard/TableCard';
import type { TableType } from '../types/cron';

const tables: { type: TableType; description: string; icon: string }[] = [
  {
    type: 'Redis',
    description: 'Monitor Redis-related cron jobs and their execution status',
    icon: '🔄'
  },
  {
    type: 'Summary Refresh',
    description: 'Track summary refresh jobs across different environments',
    icon: '📊'
  },
  {
    type: 'User Redis Load',
    description: 'Monitor user data loading processes in Redis',
    icon: '👥'
  },
];

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">Monitor and manage your cron jobs across different environments</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <TableCard
              key={table.type}
              type={table.type}
              description={table.description}
              icon={table.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}