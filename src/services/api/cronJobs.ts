import axios from 'axios';
import { FEATURES } from '../../config/features';
import { generateSampleJobs } from '../../utils/sampleData';
import type { Environment, TableType, CronJobsResponse } from '../../types/cron';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCronJobs(
  tableType: TableType,
  environment: Environment
): Promise<CronJobsResponse> {
  if (FEATURES.useMockData) {
    // Return mock data
    return Promise.resolve({
      jobs: generateSampleJobs(environment, tableType),
      total: 3,
    });
  }

  // Fetch real data from the database
  const response = await axios.get(
    `${API_URL}/api/cron-jobs?table=${tableType}&environment=${environment}`
  );
  return response.data;
}