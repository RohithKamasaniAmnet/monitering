import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CronJobsList } from '../components/dashboard/CronJobsList';
import { fetchCronJobs } from '../services/api/cronJobs';
import type { Environment, TableType } from '../types/cron';

const environments: Environment[] = ['Dev', 'QA', 'Prod'];

export function TableDetailsPage() {
  const { tableType } = useParams<{ tableType: string }>();
  const [selectedEnv, setSelectedEnv] = React.useState<Environment>('Dev');

  const {data, isLoading, error, refetch} = useQuery(['cronJobs', tableType, selectedEnv], () =>fetchCronJobs(tableType as TableType,selectedEnv))
  console.log('Fetched Data:', data);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            {tableType?.replace(/-/g, ' ')} Jobs
          </h1>
          <div className="flex space-x-2">
            {environments.map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedEnv === env
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <CronJobsList
            jobs={data || []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}