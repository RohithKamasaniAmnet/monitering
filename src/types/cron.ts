export type Environment = 'Dev' | 'QA' | 'Prod';
export type TableType = 'Redis' | 'Summary Refresh' | 'User Redis Load';

export interface CronJob {
  id: string;
  name: string;
  environment: Environment;
  tableType: TableType;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  error?: string;
}

export interface CronJobsResponse {
  jobs: CronJob[];
  total: number;
}