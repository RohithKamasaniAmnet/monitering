import React from 'react';
import { StatusBadge } from '../dashboard/StatusBadge';
import type { CronJob, TableType } from '../../types/cron';

interface PipelineTableProps {
  stages: TableType[]; // Array of stage names
  data: CronJob[]; // Array of all CronJob objects from the API
}

// Function to format date as per IST
function formatDateInIST(utcDate: string): string {
  const date = new Date(utcDate); // Parse the UTC date string

  // Get the timezone offset in minutes (for IST, it's +330 minutes)
  const timezoneOffset = 330; // IST is UTC +5:30, so 330 minutes

  // Adjust the date by subtracting the offset to get the original time in UTC
  date.setMinutes(date.getMinutes() - timezoneOffset); // Revert the time back to UTC

  // Options for the formatted output (day of week, date, time, and IST)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', // Day of the week (e.g., Thu)
    year: 'numeric',
    month: 'short', // Abbreviated month (e.g., Dec)
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // 12-hour format (AM/PM)
    timeZoneName: 'short', // Time zone (IST)
  };

  // Using the 'en-IN' locale for Indian date format (DD MMM YYYY, HH:MM:SS AM/PM)
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

export function PipelineTable({ stages, data }: PipelineTableProps) {
  console.log("The stages are", stages);
  console.log("Data", data[0]);
  // const test = data[0];
  const test = data[0].concat(data[1], data[2]);

  // Group jobs by their "table" field
  const groupedData = stages.map((stage) => {
    return test.filter((job) => job.table === stage);
  });

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
              const startTime = job.start_time;
              const endTime = job.end_time;
              console.log(job.start_time);

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
                    {startTime && <p>Started: {formatDateInIST(startTime)}</p>}
                    {endTime && <p>Ended: {formatDateInIST(endTime)}</p>}
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
