import { format, formatDistanceToNow } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { useTimezone } from '../hooks/useTimezone';

export function formatDate(dateString: string): string {
  const { timezone } = useTimezone();
  const date = new Date(dateString);
  
  const timeZone = timezone === 'CST' ? 'America/Chicago' : 'Asia/Kolkata';
  const zonedDate = utcToZonedTime(date, timeZone);

  return format(zonedDate, 'MMM dd, yyyy hh:mm:ss aa', { timeZone });
}

export function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  return formatDistanceToNow(start, { addSuffix: true });
}