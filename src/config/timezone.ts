// Server timezone configuration
export const SERVER_TIMEZONE = process.env.SERVER_TIMEZONE || 'UTC';

// Application timezone utilities
export function getServerTimeZone(): string {
  return SERVER_TIMEZONE;
}

export function convertToServerTime(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: SERVER_TIMEZONE }));
}

export function convertFromServerTime(date: Date, targetTimezone: string): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: targetTimezone }));
}