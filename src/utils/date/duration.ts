import { formatDistanceToNow } from 'date-fns';

export function formatDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  return formatDistanceToNow(start, { addSuffix: true });
}