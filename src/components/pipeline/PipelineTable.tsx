import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { StatusBadge } from '../dashboard/StatusBadge';
import { toast, ToastContainer } from 'react-toastify';
import type { CronJob, TableType } from '../../types/cron';
import 'react-toastify/dist/ReactToastify.css';

// Helper function to format date in IST
function formatDateInIST(utcDate: string): string {
  const date = new Date(utcDate);
  const timezoneOffset = 330; // IST is UTC +5:30, so 330 minutes
  date.setMinutes(date.getMinutes() - timezoneOffset);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  };
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}

export function PipelineTable({ stages, data }: PipelineTableProps) {
  const [groupedData, setGroupedData] = useState<CronJob[][]>([]);
  const [visibleJobs, setVisibleJobs] = useState<CronJob[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, running, failed, etc.

  useEffect(() => {
    // Flatten the data and sort by start time
    const allJobs = data.reduce((acc, cronJob) => acc.concat(cronJob), [] as CronJob[]);
    const sortedJobs = allJobs.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

    // Apply the filters
    const filteredJobs = sortedJobs.filter((job) => {
      const matchesDateRange =
        (!startDate || new Date(job.start_time) >= new Date(startDate)) &&
        (!endDate || new Date(job.end_time) <= new Date(endDate));

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

      return matchesDateRange && matchesStatus;
    });

    setGroupedData(filteredJobs);
  }, [data, startDate, endDate, statusFilter]);

  const loadJobsForPage = (currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const jobsForPage = groupedData.slice(startIndex, endIndex);
    setVisibleJobs(jobsForPage);
  };

  // Update visible jobs whenever the page changes
  useEffect(() => {
    loadJobsForPage(page);
  }, [page, groupedData]);

  const handleNextPage = () => {
    if ((page * itemsPerPage) < groupedData.length) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // API call function for flushing Redis
  const flushRedis = async () => {
    try {
      const response = await fetch('http://ec2-3-229-220-107.compute-1.amazonaws.com:5000/flush_redis', {
        method: 'POST',
        headers: {
          'X-API-Key': 'BBC5D941BE29674B8B56ED9C6A747',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to flush Redis');
      }

      const responseData = await response.json();
      console.log('Redis flushed successfully:', responseData);
      return 'Redis flushed successfully';  // Success message
    } catch (error) {
      console.error('Error flushing Redis:', error);
      throw new Error('Error flushing Redis');  // Error message
    }
  };

  // Mutation to flush Redis
  const { mutate, isLoading: isFlushing } = useMutation(flushRedis, {
    onMutate: () => {
      // Optional: Disable the button and show a loading state
    },
    onSuccess: (data) => {
      toast.success(data); // Show success toast
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`); // Show error toast
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
      {/* Toast Container */}
      <ToastContainer />

      {/* Flush Redis Button */}
      <div className="p-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg">
        <div className="flex justify-center">
          <button
            onClick={() => mutate()}
            disabled={isFlushing}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full disabled:bg-gray-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800"
          >
            {isFlushing ? 'Flushing Redis...' : 'Flush Redis'}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            {/* Date Range Filter */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Header Section */}
      <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-100 to-blue-200 border-b border-gray-200 rounded-t-lg">
        {stages.map((stage) => (
          <div key={stage} className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">{stage}</h3>
          </div>
        ))}
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-3 gap-6 p-6">
        {stages.map((stage) => (
          <div key={stage} className="space-y-4">
            {visibleJobs
              .filter((job) => job.table === stage)
              .map((job) => {
                const startTime = job.start_time;
                const endTime = job.end_time;
                const isError = job.error_message ? true : false;
                return (
                  <div
                    key={job.id}
                    className={`bg-white rounded-lg p-6 border border-gray-200 hover:border-primary-300 transition-all duration-300 transform hover:scale-105 ${
                      isError ? 'border-red-500 bg-red-100' : ''
                    }`}
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
                      {job.error_message && <p className="text-red-600">Error: {job.error_message}</p>}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 transition-all duration-300 hover:bg-blue-700"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {Math.ceil(groupedData.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page * itemsPerPage >= groupedData.length}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 transition-all duration-300 hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}
