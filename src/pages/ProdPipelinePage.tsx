import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PipelineTable } from '../components/pipeline/PipelineTable';
import { fetchCronJobs } from '../services/api/cronJobs';
import type { TableType } from '../types/cron';

const PIPELINE_STAGES: TableType[] = ['Summary Refresh', 'Redis', 'User Redis Load'];

export function ProdPipelinePage() {
  // Fetch data for all stages in parallel
  const queries = PIPELINE_STAGES.map(stage => 
    useQuery(
      ['cronJobs', stage, 'Prod'],
      () => fetchCronJobs(stage, 'Prod'),
      { 
        refetchInterval: 30000, // Refresh every 30 seconds
        select: (data) => data.jobs, // Extract just the jobs array
      }
    )
  );

  const isLoading = queries.some(query => query.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Production Pipeline Status</h1>
          <p className="mt-2 text-gray-600">Real-time overview of all production refresh processes</p>
        </div>

        <PipelineTable 
          stages={PIPELINE_STAGES} 
          data={queries.map(q => q.data || [])} 
        />
      </div>
    </div>
  );
}