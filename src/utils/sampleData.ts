import { CronJob } from '../types/cron';

export const generateSampleJobs = (environment: string, tableType: string): CronJob[] => {
  const now = new Date();
  const jobs: CronJob[] = [
    {
      id: '1',
      name: `${tableType} Backup Job`,
      environment: environment as any,
      tableType: tableType as any,
      startTime: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
      endTime: new Date(now.getTime() - 3540000).toISOString(), // 59 minutes ago
      status: 'completed'
    },
    {
      id: '2',
      name: `${tableType} Cleanup Job`,
      environment: environment as any,
      tableType: tableType as any,
      startTime: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
      status: 'running'
    },
    {
      id: '3',
      name: `${tableType} Sync Job`,
      environment: environment as any,
      tableType: tableType as any,
      startTime: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
      endTime: new Date(now.getTime() - 7140000).toISOString(), // 1 hour 59 minutes ago
      status: 'failed',
      error: 'Connection timeout'
    }
  ];
  return jobs;
};