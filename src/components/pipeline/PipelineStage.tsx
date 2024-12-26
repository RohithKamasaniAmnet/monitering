import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../dashboard/StatusBadge';
import type { CronJob, TableType } from '../../types/cron';

interface PipelineStageProps {
  stage: TableType;
  jobs: CronJob[];
  isFirst: boolean;
  isLast: boolean;
}

export function PipelineStage({ stage, jobs, isFirst, isLast }: PipelineStageProps) {
  const latestJob = jobs && jobs.length > 0 ? jobs[0] : null;

  return (
    <div className="relative">
      {!isFirst && <div className="absolute top-0 left-8 -mt-8 h-8 w-0.5 bg-gray-200" />}
      {!isLast && <div className="absolute bottom-0 left-8 -mb-8 h-8 w-0.5 bg-gray-200" />}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">
              {stage === 'Summary Refresh' ? '📊' : stage === 'Redis' ? '🔄' : '👥'}
            </span>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{stage}</h2>

            <div className="mt-4 space-y-4">
              {jobs && jobs.length > 0 ? (
                jobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{job.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Started: {job.startTime ? format(new Date(job.startTime), 'PPp') : 'N/A'}
                        </p>
                        {job.endTime && (
                          <p className="text-sm text-gray-500">
                            Ended: {format(new Date(job.endTime), 'PPp')}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={job.status || 'unknown'} />
                    </div>
                    {job.error && (
                      <div className="mt-2 text-sm text-red-600">Error: {job.error}</div>
                    )}
                  </div>
                ))
              ) : (
                <p>No jobs found for this stage</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
