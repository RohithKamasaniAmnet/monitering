import { useTimezone } from '../../hooks/useTimezone';

export function getTimeZone(): string {
  const { timezone } = useTimezone();
  return timezone === 'CST' ? 'America/Chicago' : 'Asia/Kolkata';
}

export function useFormattedDate(dateString: string): string {
  const timeZone = getTimeZone();
  const date = new Date(dateString);
  
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