import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../dashboard/StatusBadge';
import type { CronJob, TableType } from '../../types/cron';

interface PipelineTableProps {
  stages: TableType[]; // Array of stage names
  data: CronJob[]; // Array of all CronJob objects from the API
}

export function PipelineTable({ stages, data }: PipelineTableProps) {
  console.log("thge stages are",stages)
  console.log("data",data[0])
  const test =data[0]
  // Group jobs by their "table" field
  const groupedData = stages.map((stage) => {
    return test.filter((job) => job.table === stage);
  });


  // Debugging: Log the grouped data
  console.log('Grouped Data:', groupedData);

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
            {/* Loop through jobs for each stage */}
            {groupedData[index]?.slice(0, 3).map((job) => {
              const startTime = job.start_time ? new Date(job.start_time) : null;
              const endTime = job.end_time ? new Date(job.end_time) : null;
              console.log(job.start_time)

              return (
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
                    {startTime && <p>Started: {format(startTime, 'MMM dd, HH:mm:ss')}</p>}
                    {endTime && <p>Ended: {format(endTime, 'MMM dd, HH:mm:ss')}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-t border-gray-200">
        {stages.map((stage, index) => {
          const totalJobs = groupedData[index]?.length || 0;
          const runningJobs = groupedData[index]?.filter((j) => j.status === 'running').length || 0;
          const failedJobs = groupedData[index]?.filter((j) => j.status === 'failed').length || 0;

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
