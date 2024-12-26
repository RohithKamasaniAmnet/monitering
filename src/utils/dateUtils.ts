// import { format, formatDistanceToNow } from 'date-fns';
// import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
// import { useTimezone } from '../hooks/useTimezone';

// export function formatDate(dateString: string): string {
//   const { timezone } = useTimezone();
//   const date = new Date(dateString);
  
//   const timeZone = timezone === 'CST' ? 'America/Chicago' : 'Asia/Kolkata';
//   const zonedDate = utcToZonedTime(date, timeZone);

//   return format(zonedDate, 'MMM dd, yyyy hh:mm:ss aa', { timeZone });
// }

// export function formatDuration(startTime: string, endTime?: string): string {
//   const start = new Date(startTime);
//   const end = endTime ? new Date(endTime) : new Date();
//   return formatDistanceToNow(start, { addSuffix: true });
// }

// export function useFormattedDate(dateString: string): string {
//   const { timezone } = useTimezone();
//   const date = new Date(dateString);

//   const timeZone = timezone === 'CST' ? 'America/Chicago' : 'Asia/Kolkata';
  
//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: true,
//     timeZone,
//   }).format(date);
// }

import { format, formatDistanceToNow } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { useTimezone } from '../hooks/useTimezone';

/**
 * Safely formats a date to a readable string based on the user's timezone.
 * @param dateString - The input date string (ISO format).
 * @returns A formatted date string or a fallback value if invalid.
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-'; // Return fallback for null or undefined values

  const { timezone } = useTimezone();
  const timeZone = timezone === 'CST' ? 'America/Chicago' : 'Asia/Kolkata';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date encountered:', dateString); // Log for debugging
    return 'Invalid Date';
  }

  const zonedDate = utcToZonedTime(date, timeZone);
  return format(zonedDate, 'MMM dd, yyyy hh:mm:ss aa', { timeZone });
}

/**
 * Safely calculates and formats the duration between two dates.
 * @param startTime - The start time (ISO date string).
 * @param endTime - The end time (optional, defaults to now).
 * @returns A human-readable duration or fallback if invalid.
 */
export function formatDuration(startTime: string | null, endTime?: string | null): string {
  if (!startTime) return '-'; // Fallback for missing startTime
  
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.warn('Invalid date(s) in duration calculation:', { startTime, endTime });
    return 'Invalid Duration';
  }

  return formatDistanceToNow(start, { addSuffix: true });
}

/**
 * Custom hook to format a date using Intl.DateTimeFormat with timezone support.
 * @param dateString - The input date string.
 * @returns A formatted date string or fallback value.
 */
export function useFormattedDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const { timezone } = useTimezone();
  const timeZone = timezone === 'CST' ? 'America/Chicago' : 'Asia/Kolkata';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn('Invalid date encountered in useFormattedDate:', dateString);
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone,
  }).format(date);
}
