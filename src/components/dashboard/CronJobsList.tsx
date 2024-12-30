import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { CronJob } from '../../types/cron';
import { StatusBadge } from './StatusBadge';
import 'react-datepicker/dist/react-datepicker.css';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { MdOutlineSearch } from 'react-icons/md'; // Search icon for added functionality

interface CronJobsListProps {
  jobs: any[]; // Backend raw response
  isLoading: boolean;
}

// Transform backend response to camelCase
function transformJobs(jobs: any[]): CronJob[] {
  console.log('Raw backend jobs:', jobs);

  const transformed = jobs.map((job) => ({
    id: job.id,
    name: job.name,
    startTime: job.start_time,
    endTime: job.end_time,
    status: job.status,
    error: job.error_message,
  }));

  console.log('Transformed jobs:', transformed);
  return transformed;
}

// Helper function to format duration (in milliseconds) into a string (hours, minutes, seconds)
function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const durationMs = end.getTime() - start.getTime();
  if (durationMs < 0) return '-';

  const hours = Math.floor(durationMs / 3600000);
  const minutes = Math.floor((durationMs % 3600000) / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to format the date into the desired format: "Thu Dec 26 13:43:48 IST 2024"
function formatDateInIST(utcDate: string): string {
  const date = new Date(utcDate);
  const timezoneOffset = 330;

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

export function CronJobsList({ jobs, isLoading }: CronJobsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // State for date filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [exactDate, setExactDate] = useState<Date | null>(null);

  // State for status filter
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Transform the jobs here
  const transformedJobs = useMemo(() => transformJobs(jobs), [jobs]);

  // Sort jobs by date (descending order)
  const sortedJobs = useMemo(() => {
    return transformedJobs.sort((a, b) => {
      const aDate = new Date(a.startTime).getTime();
      const bDate = new Date(b.startTime).getTime();
      return bDate - aDate;
    });
  }, [transformedJobs]);

  // Filter jobs based on the selected date range, exact date, and status
  const filteredJobs = useMemo(() => {
    let result = sortedJobs;

    if (exactDate) {
      result = result.filter(
        (job) => new Date(job.startTime).toDateString() === exactDate.toDateString()
      );
    }

    if (startDate) {
      result = result.filter((job) => new Date(job.startTime) >= startDate);
    }
    if (endDate) {
      result = result.filter((job) => new Date(job.startTime) <= endDate);
    }

    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((job) => job.status === statusFilter);
    }

    return result;
  }, [sortedJobs, startDate, endDate, exactDate, statusFilter]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setExactDate(null);
    setStatusFilter('ALL');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4">
        {/* Filter Section */}
        <div className="flex gap-6 items-center mb-6 bg-blue-50 p-4 rounded-md shadow-md">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholderText="Select Start Date"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholderText="Select End Date"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Exact Date</label>
            <DatePicker
              selected={exactDate}
              onChange={(date: Date | null) => setExactDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholderText="Select Exact Date"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="failed">Failed</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
            </select>
          </div>

          <button
            onClick={handleClearFilters}
            className="px-6 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition-all"
          >
            <IoCloseCircleOutline className="mr-2" /> Clear Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-100 to-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration (HH:mm:ss)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render jobs */}
            {currentJobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition-all">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.name}</div>
                  {job.error && <div className="text-sm text-red-600 mt-1">{job.error}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.startTime ? formatDateInIST(job.startTime) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.endTime ? formatDateInIST(job.endTime) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.startTime && job.endTime
                    ? formatDuration(job.startTime, job.endTime)
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between px-4 py-2">
        <div>
          Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of{' '}
          {filteredJobs.length} jobs
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        <span>In-house developed product by <strong>Amnet Digital</strong></span>
      </footer>
    </div>
  );
}
