import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { StatusBadge } from '../dashboard/StatusBadge';
import { toast, ToastContainer } from 'react-toastify';
import type { CronJob } from '../../types/cron';
import 'react-toastify/dist/ReactToastify.css';

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

export function PipelineTable({ stages, data }: { stages: string[]; data: CronJob[][] }) {
  const [groupedData, setGroupedData] = useState<CronJob[][]>([]);
  const [visibleJobs, setVisibleJobs] = useState<Record<string, CronJob[]>>({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Initialize columnRefs to store references for each column
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const allJobs = data.reduce((acc, cronJob) => acc.concat(cronJob), [] as CronJob[]);
    const sortedJobs = allJobs.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

    const filteredJobs = sortedJobs.filter((job) => {
      const matchesDateRange =
        (!startDate || new Date(job.start_time) >= new Date(startDate)) &&
        (!endDate || new Date(job.end_time) <= new Date(endDate));

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

      return matchesDateRange && matchesStatus;
    });

    setGroupedData(filteredJobs);
  }, [data, startDate, endDate, statusFilter]);

  useEffect(() => {
    const initialVisibleJobs: Record<string, CronJob[]> = {};
    stages.forEach((stage) => {
      initialVisibleJobs[stage] = groupedData.filter((job) => job.table === stage).slice(0, 10);
    });
    setVisibleJobs(initialVisibleJobs);
  }, [groupedData, stages]);

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
      return 'Redis flushed successfully';
    } catch (error) {
      console.error('Error flushing Redis:', error);
      throw new Error('Error flushing Redis');
    }
  };

  const { mutate, isLoading: isFlushing } = useMutation(flushRedis, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast.success(data);
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-300">
      <ToastContainer />

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

      <div className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="space-x-4">
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

      <div className="grid grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-100 to-blue-200 border-b border-gray-200 rounded-t-lg">
        {stages.map((stage) => (
          <div key={stage} className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">{stage}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 p-6">
        {stages.map((stage) => (
          <div
            key={stage}
            ref={(el) => (columnRefs.current[stage] = el)}
            className="space-y-4 overflow-auto max-h-96"
          >
            {visibleJobs[stage]?.map((job) => {
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
    </div>
  );
}
