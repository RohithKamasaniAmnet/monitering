import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { CronJob } from '../../types/cron';
import { StatusBadge } from './StatusBadge';
import 'react-datepicker/dist/react-datepicker.css';
import { IoCloseCircleOutline } from 'react-icons/io5'; // Icon for clearing filters

interface CronJobsListProps {
  jobs: any[]; // Backend raw response
  isLoading: boolean;
}

// Transform backend response to camelCase
function transformJobs(jobs: any[]): CronJob[] {
  console.log('Raw backend jobs:', jobs); // Log the raw backend response

  const transformed = jobs.map((job) => ({
    id: job.id,
    name: job.name,
    startTime: job.start_time, // Map snake_case to camelCase
    endTime: job.end_time,
    status: job.status,
    error: job.error_message,
  }));

  console.log('Transformed jobs:', transformed); // Log the transformed data
  return transformed;
}

// Helper function to format duration (in milliseconds) into a string (hours, minutes, seconds)
function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const durationMs = end.getTime() - start.getTime(); // Difference in milliseconds
  if (durationMs < 0) return '-'; // Handle edge case where endTime is earlier than startTime

  const hours = Math.floor(durationMs / 3600000); // 3600000 ms in an hour
  const minutes = Math.floor((durationMs % 3600000) / 60000); // 60000 ms in a minute
  const seconds = Math.floor((durationMs % 60000) / 1000); // 1000 ms in a second

  // Format the duration in "HH:mm:ss" format
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


// Function to format the date into the desired format: "Thu Dec 26 13:43:48 IST 2024"
function formatDateInIST(utcDate: string): string {
  const date = new Date(utcDate); // Parse the UTC date string

  // Get the timezone offset in minutes (in this case, for IST, it's +330 minutes)
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
  // Note: Make sure to treat the date as IST by converting to India Time Zone.
  return new Intl.DateTimeFormat('en-IN', options).format(date);
}


export function CronJobsList({ jobs, isLoading }: CronJobsListProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // State for date filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [exactDate, setExactDate] = useState<Date | null>(null); // New state for exact date

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

    // Filter by exact date if selected
    if (exactDate) {
      result = result.filter(
        (job) => new Date(job.startTime).toDateString() === exactDate.toDateString()
      );
    }

    // Filter by date range if selected
    if (startDate) {
      result = result.filter((job) => new Date(job.startTime) >= startDate);
    }
    if (endDate) {
      result = result.filter((job) => new Date(job.startTime) <= endDate);
    }

    // Filter by status
    if (statusFilter && statusFilter !== 'ALL') {
      result = result.filter((job) => job.status === statusFilter);
    }

    return result;
  }, [sortedJobs, startDate, endDate, exactDate, statusFilter]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle clearing all filters
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
        {/* Filter Section - Inline Date and Status */}
        <div className="flex gap-6 items-center mb-4 bg-blue-50 p-4 rounded-md">
          {/* Date Range Filters */}
          <div className="flex flex-col">
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md"
              placeholderText="Start Date"
            />
          </div>

          <div className="flex flex-col">
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md"
              placeholderText="End Date"
            />
          </div>

          {/* Exact Date Filter */}
          <div className="flex flex-col">
            <label>Exact Date</label>
            <DatePicker
              selected={exactDate}
              onChange={(date: Date | null) => setExactDate(date)}
              dateFormat="yyyy-MM-dd"
              className="px-4 py-2 border border-gray-300 rounded-md"
              placeholderText="Exact Date"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="ALL">All Statuses</option>
              <option value="failed">Failed</option>
              <option value="completed">Completed</option>
              <option value="running">Running</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-500 text-white rounded-full flex items-center"
          >
            <IoCloseCircleOutline className="mr-2" /> Clear Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-primary-50 to-white">
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
              <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.name}</div>
                  {job.error && <div className="text-sm text-red-600 mt-1 whitespace-pre-line">{job.error}</div>}
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
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
