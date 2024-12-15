import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { getTimeZone } from './timezone';

export function formatDate(dateString: string): string {
  const timeZone = getTimeZone();
  const date = new Date(dateString);
  const zonedDate = utcToZonedTime(date, timeZone);

  return format(zonedDate, 'MMM dd, yyyy hh:mm:ss aa', { timeZone });
}