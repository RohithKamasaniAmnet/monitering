import axios from 'axios';
import { Environment, TableType, CronJobsResponse } from '../types/cron';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchCronJobs = async (
  tableType: TableType,
  environment: Environment
): Promise<CronJobsResponse> => {
  const response = await axios.get(
    `${API_URL}/cron-jobs?table=${tableType}&environment=${environment}`
  );
  return response.data;
};