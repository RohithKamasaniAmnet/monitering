import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../dashboard/StatusBadge';
import type { CronJob, TableType } from '../../types/cron';

interface PipelineTableProps {
  stages: TableType[];
  data: CronJob[][];
}

export function PipelineTable({ stages, data }: PipelineTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-primary-50 border-b border-gray-200">
        {stages.map((stage) => (
          <div key={stage} className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{stage}</h3>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-4 p-4">
        {stages.map((stage, index) => (
          <div key={stage} className="space-y-4">
            {data[index]?.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary-300 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 truncate" title={job.name}>
                    {job.name}
                  </h4>
                  <StatusBadge status={job.status} />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Started: {format(new Date(job.startTime), 'MMM dd, HH:mm:ss')}</p>
                  {job.endTime && (
                    <p>Ended: {format(new Date(job.endTime), 'MMM dd, HH:mm:ss')}</p>
                  )}
                  {job.error && (
                    <p className="text-red-600 mt-2">Error: {job.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-t border-gray-200">
        {stages.map((stage, index) => {
          const latestJob = data[index]?.[0];
          const totalJobs = data[index]?.length || 0;
          const runningJobs = data[index]?.filter(j => j.status === 'running').length || 0;
          const failedJobs = data[index]?.filter(j => j.status === 'failed').length || 0;

          return (
            <div key={stage} className="text-center">
              <div className="text-sm text-gray-600">
                <p>Total Jobs: {totalJobs}</p>
                <p>Running: {runningJobs}</p>
                <p>Failed: {failedJobs}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}